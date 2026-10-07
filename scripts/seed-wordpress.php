<?php
// Run with wp eval-file after activating the theme. Idempotent: never overwrites edited content.
if(!defined('WP_CLI'))exit;
$seed=is_seed();
$media=[];foreach($seed['Images'] as &$field){
  $file=get_template_directory().'/media/'.$field['value'];
  $existing=get_posts(['post_type'=>'attachment','post_status'=>'inherit','meta_key'=>'_is_source','meta_value'=>$field['key'],'numberposts'=>1,'fields'=>'ids']);
  if($existing){$id=$existing[0];}else{
    $tmp=wp_tempnam(basename($file));copy($file,$tmp);
    $id=media_handle_sideload(['name'=>basename($file),'tmp_name'=>$tmp],0,$field['label']);
    if(is_wp_error($id))WP_CLI::error($id->get_error_message());update_post_meta($id,'_is_source',$field['key']);
  }
  $field['value']=wp_get_attachment_url($id);
}unset($field);
function is_seed_content($fields,$name){
  $blocks=[];foreach(array_chunk($fields,8) as $i=>$chunk){$blocks[]=['blockName'=>'intelispaces/section','attrs'=>['title'=>$name.' · '.($i+1),'fields'=>$chunk],'innerBlocks'=>[],'innerHTML'=>'','innerContent'=>[]];}
  return serialize_blocks($blocks);
}
$map=['home'=>'HomePage','offices'=>'OfficesPage','homes'=>'HomesPage','solutions'=>'SolutionsPage','architects'=>'ArchitectsPage','knx'=>'KNXPage','projects'=>'ProjectsPage','knowledge'=>'KnowledgePage','about'=>'AboutPage','team'=>'TeamPage','contact'=>'ContactPage'];
foreach(is_routes() as $route=>$title){
  $existing=get_posts(['post_type'=>'page','post_status'=>'any','meta_key'=>'_is_route','meta_value'=>$route,'numberposts'=>1,'fields'=>'ids']);
  if($existing){$id=$existing[0];}else{
    $fields=$seed[$map[$route]];$long=array_values(array_filter($fields,fn($f)=>mb_strlen($f['value'])>100));
    $id=wp_insert_post(wp_slash(['post_type'=>'page','post_status'=>'publish','post_title'=>$title,'post_name'=>$route,'post_excerpt'=>$long[0]['value']??$title,'post_content'=>is_seed_content($fields,$title),'comment_status'=>'closed','ping_status'=>'closed']),true);
    if(is_wp_error($id))WP_CLI::error($id->get_error_message());update_post_meta($id,'_is_route',$route);
  }
  if($route==='home'){update_option('page_on_front',$id);update_option('show_on_front','page');}
  WP_CLI::log($route.' => '.$id);
}
$names=['Navbar'=>'Menu i nagłówek','Footer'=>'Stopka','PrivacyModal'=>'Prywatność i informacje prawne','ConsultationModal'=>'Konsultacje','ContactForm'=>'Formularz projektu','CookieBanner'=>'Komunikat cookies','Images'=>'Zdjęcia strony'];
foreach($names as $key=>$name){
  if(get_posts(['post_type'=>'is_fragment','post_status'=>'any','meta_key'=>'_is_component','meta_value'=>$key,'numberposts'=>1]))continue;
  $id=wp_insert_post(wp_slash(['post_type'=>'is_fragment','post_status'=>'publish','post_title'=>$name,'post_content'=>is_seed_content($seed[$key],$name)]),true);
  if(is_wp_error($id))WP_CLI::error($id->get_error_message());update_post_meta($id,'_is_component',$key);
}
update_option('blogname','InteliSpaces');update_option('blogdescription','Automatyka budynkowa KNX');update_option('permalink_structure','/%postname%/');
update_option('default_comment_status','closed');update_option('default_ping_status','closed');flush_rewrite_rules();
WP_CLI::success('Imported Darka pages, shared blocks and media.');
