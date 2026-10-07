<?php
if(!defined('WP_CLI'))exit;
$changes=json_decode(file_get_contents(__DIR__.'/content-corrections.json'),true);
foreach(get_posts(['post_type'=>['page','is_fragment'],'post_status'=>'any','numberposts'=>100]) as $post){
  if(!get_post_meta($post->ID,'_is_route',true)&&!get_post_meta($post->ID,'_is_component',true))continue;
  $blocks=parse_blocks($post->post_content);foreach($blocks as &$block)if($block['blockName']==='intelispaces/section')foreach($block['attrs']['fields'] as &$field){foreach(['value','label'] as $part)$field[$part]=strtr($field[$part],$changes);}unset($field,$block);
  $content=serialize_blocks($blocks);if($content!==$post->post_content)wp_update_post(wp_slash(['ID'=>$post->ID,'post_content'=>$content]));
}
WP_CLI::success('Company and confirmation text updated.');
