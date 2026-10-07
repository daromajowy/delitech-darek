<?php
// Export published, public site content only. Never export users, inquiries, options or credentials.
if (!defined('WP_CLI')) exit(1);
$result=['schema'=>1,'pages'=>[],'shared'=>[]];
foreach(get_posts(['post_type'=>['page','is_fragment'],'post_status'=>'publish','numberposts'=>100,'orderby'=>'ID','order'=>'ASC']) as $post){
 $route=get_post_meta($post->ID,'_is_route',true);$component=get_post_meta($post->ID,'_is_component',true);
 if(!$route&&!$component)continue;
 $fields=[];is_collect_fields(parse_blocks($post->post_content),$fields);
 $entry=['title'=>$post->post_title,'slug'=>$post->post_name,'excerpt'=>$post->post_excerpt,'fields'=>$fields];
 if($route)$result['pages'][$route]=$entry;else$result['shared'][$component]=$entry;
}
echo wp_json_encode($result,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)."\n";
