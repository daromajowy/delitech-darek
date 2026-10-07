<?php
if(!defined('WP_CLI'))exit;
$changed=0;
foreach(get_posts(['post_type'=>['page','is_fragment'],'post_status'=>'any','numberposts'=>100]) as $post){
  if(!get_post_meta($post->ID,'_is_route',true)&&!get_post_meta($post->ID,'_is_component',true))continue;
  $blocks=parse_blocks($post->post_content);
  foreach($blocks as &$block) if($block['blockName']==='intelispaces/section') foreach($block['attrs']['fields'] as &$field){
    $field['value']=str_replace(['u0026','u0022','u003c','u003e','u002d'],['&','"','<','>','-'],$field['value']);
    $field['label']=str_replace(['u0026','u0022','u003c','u003e','u002d'],['&','"','<','>','-'],$field['label']);
  }unset($block,$field);
  $content=serialize_blocks($blocks);
  if($content!==$post->post_content){wp_update_post(wp_slash(['ID'=>$post->ID,'post_content'=>$content]));$changed++;}
  if(!$post->post_author)wp_update_post(['ID'=>$post->ID,'post_author'=>get_user_by('login','intelispaces_admin')->ID]);
}
// Default installer examples are recoverable in the Trash.
foreach([1=>'Hello world!',2=>'Sample Page'] as $id=>$title)if(get_the_title($id)===$title)wp_trash_post($id);
if(get_comment(1)&&get_comment(1)->comment_author==='A WordPress Commenter')wp_trash_comment(1);
WP_CLI::success('Fixed block import escaping: '.$changed.' documents.');
