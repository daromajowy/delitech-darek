<?php
/** Plugin Name: InteliSpaces — zapytania i ochrona wersji testowej
 * Version: 1.0.0
 */
defined('ABSPATH') || exit;
add_filter('xmlrpc_enabled','__return_false');
remove_action('wp_head','wp_generator');
add_action('send_headers',function(){header('X-Content-Type-Options: nosniff');header('Referrer-Policy: strict-origin-when-cross-origin');header('X-Frame-Options: SAMEORIGIN');if(wp_get_environment_type()==='staging')header('X-Robots-Tag: noindex, nofollow, noarchive');});
add_action('template_redirect',function(){
  if(wp_get_environment_type()==='staging'&&!is_user_logged_in()){nocache_headers();auth_redirect();}
});
add_filter('rest_authentication_errors',function($error){
  if($error)return $error;
  if(wp_get_environment_type()==='staging'&&!is_user_logged_in())return new WP_Error('staging_private','Wersja testowa wymaga zalogowania.',['status'=>401]);
  return $error;
},90);
add_action('init',function(){
  register_post_type('is_inquiry',['labels'=>['name'=>'Zapytania','singular_name'=>'Zapytanie'],'public'=>false,'show_ui'=>true,'show_in_rest'=>false,'supports'=>['title'],'menu_icon'=>'dashicons-email-alt','capabilities'=>['edit_post'=>'manage_options','read_post'=>'manage_options','delete_post'=>'manage_options','edit_posts'=>'manage_options','edit_others_posts'=>'manage_options','publish_posts'=>'manage_options','read_private_posts'=>'manage_options','create_posts'=>'do_not_allow']]);
});
function is_private_dir(){
  if(!defined('IS_PRIVATE_DIR'))throw new RuntimeException('Brak konfiguracji prywatnego katalogu załączników.');
  return IS_PRIVATE_DIR;
}
add_action('rest_api_init',function(){register_rest_route('intelispaces/v1','/inquiries',['methods'=>'POST','permission_callback'=>function(WP_REST_Request $request){
  if(!wp_verify_nonce($request->get_param('nonce'),'is_inquiry'))return new WP_Error('invalid_nonce','Odśwież stronę i spróbuj ponownie.',['status'=>403]);
  $origin=$request->get_header('origin');
  if($origin && wp_parse_url($origin,PHP_URL_HOST)!==wp_parse_url(home_url(),PHP_URL_HOST))return new WP_Error('origin','Nieprawidłowe źródło formularza.',['status'=>403]);
  return true;
},'callback'=>'is_save_inquiry']);});
function is_save_inquiry(WP_REST_Request $request){
  $raw=$request->get_param('payload');if(!is_string($raw)||strlen($raw)>40000)return new WP_Error('payload','Za długa treść.',['status'=>400]);
  $data=json_decode($raw,true);if(!is_array($data))return new WP_Error('payload','Nieprawidłowy formularz.',['status'=>400]);
  $email=sanitize_email($data['email']??'');$name=sanitize_text_field($data['name']??'');$phone=sanitize_text_field($data['phone']??'');
  if(!$name||!is_email($email)||strlen($phone)<7||empty($data['consentDataProcessing'])&&empty($data['consent']))return new WP_Error('validation','Uzupełnij dane kontaktowe i zgodę.',['status'=>400]);
  $iphash=hash_hmac('sha256',$_SERVER['REMOTE_ADDR']??'',wp_salt());$key='is_inquiry_'.substr($iphash,0,32);
  $count=(int)get_transient($key);if($count>=10)return new WP_Error('rate_limit','Limit zgłoszeń osiągnięty. Spróbuj później.',['status'=>429]);
  set_transient($key,$count+1,HOUR_IN_SECONDS);
  $clean=[];foreach(['kind','name','email','phone','company','investmentType','location','stage','areaSquareMeters','description','notes','mode','preferredTime','topic','sourceContext'] as $key)if(isset($data[$key])&&is_scalar($data[$key]))$clean[$key]=mb_substr(sanitize_textarea_field((string)$data[$key]),0,10000);
  $clean['scopeItems']=array_map('sanitize_text_field',array_slice(is_array($data['scopeItems']??null)?$data['scopeItems']:[],0,20));
  $clean['consentDataProcessing']=true;$clean['consentMarketing']=!empty($data['consentMarketing']);
  $files=$request->get_file_params()['files']??null;$checked=[];$total=0;
  if($files){
    if(!is_array($files['name'])||count($files['name'])>10)return new WP_Error('files','Maksymalnie 10 plików.',['status'=>400]);
    foreach($files['name'] as $i=>$original){
      $tmp=$files['tmp_name'][$i];$size=(int)$files['size'][$i];$ext=strtolower(pathinfo($original,PATHINFO_EXTENSION));$total+=$size;
      if($files['error'][$i]!==UPLOAD_ERR_OK||!is_uploaded_file($tmp)||$size<1||$size>10*MB_IN_BYTES||$total>20*MB_IN_BYTES||!in_array($ext,['pdf','png','jpg','jpeg','dwg','dxf','zip'],true))return new WP_Error('files','Niedozwolony plik lub przekroczony limit rozmiaru.',['status'=>400]);
      $mime=(new finfo(FILEINFO_MIME_TYPE))->file($tmp);
      $allowed=['pdf'=>['application/pdf'],'png'=>['image/png'],'jpg'=>['image/jpeg'],'jpeg'=>['image/jpeg'],'zip'=>['application/zip','application/x-zip-compressed'],'dwg'=>['image/vnd.dwg','application/acad','application/x-acad','application/octet-stream'],'dxf'=>['image/vnd.dxf','application/dxf','text/plain','application/octet-stream']];
      if(!in_array($mime,$allowed[$ext],true))return new WP_Error('file_type','Typ pliku nie zgadza się z rozszerzeniem.',['status'=>400]);
      if(in_array($ext,['png','jpg','jpeg'],true)&&!@getimagesize($tmp))return new WP_Error('image','Nieprawidłowy obraz.',['status'=>400]);
      $checked[]=['tmp'=>$tmp,'name'=>sanitize_file_name($original),'size'=>$size];
    }
  }
  $id=wp_insert_post(['post_type'=>'is_inquiry','post_status'=>'private','post_title'=>'Zapytanie — '.$name],true);
  if(is_wp_error($id))return new WP_Error('save','Nie udało się zapisać zgłoszenia.',['status'=>500]);
  $stored=[];
  try {
    $directory=is_private_dir();if(!is_dir($directory)&&!wp_mkdir_p($directory))throw new RuntimeException('storage');chmod($directory,0755);
    // CF restricts PHP to the domain's public_html. Apache/LiteSpeed must deny this directory.
    $deny="Require all denied\n";
    if(@file_put_contents($directory.'/.htaccess',$deny,LOCK_EX)!==strlen($deny))throw new RuntimeException('storage protection');
    if(@file_put_contents($directory.'/index.php',"<?php http_response_code(403); exit;",LOCK_EX)===false)throw new RuntimeException('storage protection');
    foreach($checked as $file){$token=bin2hex(random_bytes(24));$path=$directory.'/'.$token;
      if(!move_uploaded_file($file['tmp'],$path))throw new RuntimeException('upload');chmod($path,0600);
      $stored[]=['token'=>$token,'name'=>$file['name'],'size'=>$file['size']];
    }
    $reference='KNX-'.wp_date('Y').'-'.$id;
    update_post_meta($id,'_is_data',$clean);update_post_meta($id,'_is_files',$stored);update_post_meta($id,'_is_reference',$reference);
    wp_update_post(['ID'=>$id,'post_title'=>$reference.' — '.$name]);
    return new WP_REST_Response(['reference'=>$reference],201);
  } catch(Throwable $e){foreach($stored as $file)@unlink(is_private_dir().'/'.$file['token']);wp_trash_post($id);return new WP_Error('storage','Nie udało się bezpiecznie zapisać załączników.',['status'=>500]);}
}
add_action('add_meta_boxes',function(){add_meta_box('is_inquiry_data','Dane zgłoszenia',function($post){
  $labels=['kind'=>'Rodzaj','name'=>'Imię i nazwisko','email'=>'E-mail','phone'=>'Telefon','company'=>'Firma','investmentType'=>'Inwestycja','location'=>'Lokalizacja','stage'=>'Etap','areaSquareMeters'=>'Powierzchnia','description'=>'Opis','notes'=>'Uwagi','mode'=>'Tryb spotkania','preferredTime'=>'Preferowana pora','topic'=>'Temat','sourceContext'=>'Źródło','scopeItems'=>'Zakres','consentDataProcessing'=>'Zgoda na kontakt','consentMarketing'=>'Zgoda marketingowa'];
  echo '<table class="widefat striped">';foreach(get_post_meta($post->ID,'_is_data',true)?:[] as $key=>$value){echo '<tr><th>'.esc_html($labels[$key]??$key).'</th><td>'.nl2br(esc_html(is_array($value)?implode(', ',$value):(is_bool($value)?($value?'Tak':'Nie'):$value))).'</td></tr>';}echo '</table><h3>Prywatne załączniki</h3>';
  foreach(get_post_meta($post->ID,'_is_files',true)?:[] as $index=>$file){$url=wp_nonce_url(admin_url('admin-post.php?action=is_download&inquiry='.$post->ID.'&file='.$index),'is_download_'.$post->ID);echo '<p><a href="'.esc_url($url).'">'.esc_html($file['name']).'</a> ('.esc_html(size_format($file['size'])).')</p>';}
},'is_inquiry','normal','high');});
add_action('admin_post_is_download',function(){
  if(!current_user_can('manage_options'))wp_die('Brak dostępu.',403);
  $id=absint($_GET['inquiry']??0);check_admin_referer('is_download_'.$id);
  if(get_post_type($id)!=='is_inquiry')wp_die('Nie znaleziono.',404);
  $files=get_post_meta($id,'_is_files',true);$file=$files[absint($_GET['file']??-1)]??null;
  if(!$file||!preg_match('/^[a-f0-9]{48}$/',$file['token']))wp_die('Nie znaleziono.',404);
  $path=is_private_dir().'/'.$file['token'];if(!is_file($path))wp_die('Nie znaleziono.',404);
  nocache_headers();header('Content-Type: application/octet-stream');header('X-Content-Type-Options: nosniff');header('Content-Disposition: attachment; filename="'.sanitize_file_name($file['name']).'"');header('Content-Length: '.filesize($path));readfile($path);exit;
});
add_action('before_delete_post',function($id){if(get_post_type($id)==='is_inquiry')foreach(get_post_meta($id,'_is_files',true)?:[] as $file)if(preg_match('/^[a-f0-9]{48}$/',$file['token']))@unlink(is_private_dir().'/'.$file['token']);});
