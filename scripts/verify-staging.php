<?php
// Explicit staging-only integration test. Creates a disposable private inquiry, then trashes it.
if (!defined('WP_CLI') || wp_get_environment_type() !== 'staging') exit(1);
$user=get_user_by('login','intelispaces_admin');
$manager=WP_Session_Tokens::get_instance($user->ID);
$token=$manager->create(time()+600);
$cookie=wp_generate_auth_cookie($user->ID,time()+600,'logged_in',$token);
$_COOKIE[LOGGED_IN_COOKIE]=$cookie;wp_set_current_user($user->ID);
$auth=LOGGED_IN_COOKIE.'='.$cookie;
$nonce=wp_create_nonce('is_inquiry');$restNonce=wp_create_nonce('wp_rest');
global $report;$report=[];$inquiry=0;
function probe($url,$auth='',$data=null,$headers=[]){
 $curl=curl_init($url);curl_setopt_array($curl,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_FOLLOWLOCATION=>false,CURLOPT_TIMEOUT=>25,CURLOPT_COOKIE=>$auth,CURLOPT_HTTPHEADER=>$headers]);
 if($data!==null){curl_setopt($curl,CURLOPT_POST,true);curl_setopt($curl,CURLOPT_POSTFIELDS,$data);}
 $body=curl_exec($curl);$code=curl_getinfo($curl,CURLINFO_HTTP_CODE);$error=curl_error($curl);curl_close($curl);
 if($body===false)throw new Exception($error);return [$code,$body];
}
function must($ok,$name){global $report;$report[$name]=$ok;if(!$ok)throw new Exception($name);}
try{
 foreach(is_routes() as $route=>$title){
  $ids=get_posts(['post_type'=>'page','meta_key'=>'_is_route','meta_value'=>$route,'numberposts'=>1,'fields'=>'ids']);
  [$code,$html]=probe(get_permalink($ids[0]),$auth);
  must($code===200 && str_contains($html,'<h1') && !str_contains($html,'[TEST CMS]'),'page_'.$route);
 }
 must(probe(home_url('/'))[0]===302,'anonymous_frontend_redirect');
 must(probe(rest_url('wp/v2/pages'))[0]===401,'anonymous_rest_denied');
 $endpoint=rest_url('intelispaces/v1/inquiries');$headers=['X-WP-Nonce: '.$restNonce];
 $payload=['name'=>'TEST CMS — integration','email'=>'test@example.invalid','phone'=>'000000000','consentDataProcessing'=>true,'description'=>'Disposable staging test; no contact required.'];
 must(probe($endpoint,$auth,['nonce'=>'invalid','payload'=>json_encode($payload)],$headers)[0]===403,'invalid_nonce_denied');
 $bad=$payload;$bad['email']='invalid';
 must(probe($endpoint,$auth,['nonce'=>$nonce,'payload'=>json_encode($bad)],$headers)[0]===400,'invalid_email_denied');
 [$code,$body]=probe($endpoint,$auth,['nonce'=>$nonce,'payload'=>json_encode($payload),'files[0]'=>new CURLFile(__DIR__.'/cms-test.png','image/png','cms-test.png')],$headers);
 $response=json_decode($body,true);$report['inquiry_http']=$code;$report['inquiry_response']=$response;must($code===201 && !empty($response['reference']),'inquiry_saved');
 $inquiry=(int)substr($response['reference'],strrpos($response['reference'],'-')+1);
 must(get_post_status($inquiry)==='private' && get_post_meta($inquiry,'_is_data',true)['email']==='test@example.invalid','private_database_record');
 $files=get_post_meta($inquiry,'_is_files',true);$path=is_private_dir().'/'.$files[0]['token'];
 must(count($files)===1 && is_file($path) && hash_file('sha256',$path)===hash_file('sha256',__DIR__.'/cms-test.png'),'private_attachment_intact');
 [$directCode,$directBody]=probe(set_url_scheme(content_url('/intelispaces-private/'.$files[0]['token']),'https'));
 $report['direct_attachment_http']=$directCode;
 must($directCode===403 && hash('sha256',$directBody)!==hash_file('sha256',$path),'direct_attachment_url_denied');
 // admin-post uses the secure-auth cookie rather than the frontend logged-in cookie.
 $adminCookie=SECURE_AUTH_COOKIE.'='.wp_generate_auth_cookie($user->ID,time()+600,'secure_auth',$token).'; '.$auth;
 $url=admin_url('admin-post.php?action=is_download&inquiry='.$inquiry.'&file=0&_wpnonce='.wp_create_nonce('is_download_'.$inquiry));
 [$code,$download]=probe($url,$adminCookie);
 must($code===200 && hash('sha256',$download)===hash_file('sha256',$path),'authenticated_download');
 must(probe($url)[0]!==200,'anonymous_download_denied');
} catch(Throwable $e){$report['failure']=$e->getMessage();}
finally{if($inquiry)wp_trash_post($inquiry);$manager->destroy($token);}
echo wp_json_encode($report,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE)."\n";
if(isset($report['failure']))WP_CLI::error('Staging integration test failed.');
