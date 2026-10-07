<?php
defined('ABSPATH') || exit;
function is_seed() { static $seed; return $seed ??= json_decode(file_get_contents(__DIR__.'/content-seed.json'),true); }
function is_routes() { return ['home'=>'Strona główna','architects'=>'Dla architektów','homes'=>'Domy i apartamenty','offices'=>'Biura','about'=>'Jak pracujemy','team'=>'Kim jesteśmy','projects'=>'Salon i przykłady','solutions'=>'Rozwiązania','knowledge'=>'Wiedza','knx'=>'Standard KNX','contact'=>'Kontakt']; }
add_action('after_setup_theme',function(){ add_theme_support('title-tag'); add_theme_support('post-thumbnails'); add_theme_support('wp-block-styles'); add_theme_support('responsive-embeds'); register_nav_menus(['additional'=>'Dodatkowe strony']); });
add_action('init',function(){
  register_post_type('is_fragment',['labels'=>['name'=>'Elementy wspólne','singular_name'=>'Element wspólny','add_new_item'=>'Dodaj element'], 'public'=>false,'show_ui'=>true,'show_in_rest'=>true,'supports'=>['title','editor','revisions'],'menu_icon'=>'dashicons-layout','capability_type'=>'page','map_meta_cap'=>true]);
  wp_register_script('is-editor',get_template_directory_uri().'/editor.js',['wp-blocks','wp-element','wp-components','wp-block-editor'],filemtime(__DIR__.'/editor.js'),true);
  wp_register_style('is-editor',get_template_directory_uri().'/editor.css',[],filemtime(__DIR__.'/editor.css'));
  register_block_type('intelispaces/section',['api_version'=>3,'editor_script'=>'is-editor','editor_style'=>'is-editor','attributes'=>['title'=>['type'=>'string','default'=>'Sekcja strony'],'fields'=>['type'=>'array','default'=>[]]],'render_callback'=>function(){return '';}]);
});
function is_collect_fields($blocks,&$values) {
  foreach($blocks as $block) {
    if($block['blockName']==='intelispaces/section') foreach($block['attrs']['fields']??[] as $field) {
      $key=$field['key']??'';
      if(preg_match('/^[a-zA-Z0-9._-]{1,100}$/',$key)) $values[$key]=($field['type']??'text')==='image' ? esc_url_raw($field['value']??'') : sanitize_textarea_field($field['value']??'');
    }
    if(!empty($block['innerBlocks'])) is_collect_fields($block['innerBlocks'],$values);
  }
}
function is_cms_config() {
  $values=[];foreach(is_seed() as $fields) foreach($fields as $field) $values[$field['key']]=$field['value'];
  foreach(get_posts(['post_type'=>'is_fragment','posts_per_page'=>100,'post_status'=>'publish']) as $fragment) is_collect_fields(parse_blocks($fragment->post_content),$values);
  $post=get_queried_object();$page=is_front_page()?'home':get_post_meta($post->ID??0,'_is_route',true);$page=$page?:'custom';
  $extra=''; if($post instanceof WP_Post) {
    $blocks=parse_blocks($post->post_content);is_collect_fields($blocks,$values);
    foreach($blocks as $block) if($block['blockName']!=='intelispaces/section') $extra.=render_block($block);
  }
  $urls=[];foreach(is_routes() as $route=>$title) {
    $ids=get_posts(['post_type'=>'page','post_status'=>'publish','meta_key'=>'_is_route','meta_value'=>$route,'numberposts'=>1,'fields'=>'ids']);
    if($ids) $urls[$route]=get_permalink($ids[0]);
  }
  return ['page'=>$page,'values'=>$values,'urls'=>$urls,'additional'=>$extra,'title'=>html_entity_decode(wp_get_document_title(),ENT_QUOTES,'UTF-8'),'description'=>get_the_excerpt($post),'endpoint'=>rest_url('intelispaces/v1/inquiries'),'nonce'=>wp_create_nonce('is_inquiry'),'restNonce'=>wp_create_nonce('wp_rest')];
}
add_action('wp_enqueue_scripts',function(){
  $manifest=json_decode(file_get_contents(__DIR__.'/dist/.vite/manifest.json'),true);
  $entry=$manifest['src/main.tsx'];
  foreach($entry['css']??[] as $i=>$css) wp_enqueue_style('is-site-'.$i,get_template_directory_uri().'/dist/'.$css,[],null);
  wp_enqueue_script('is-site',get_template_directory_uri().'/dist/'.$entry['file'],[],null,true);
  wp_add_inline_script('is-site','globalThis.__INTELISPACES__ = '.wp_json_encode(is_cms_config(),JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT).';','before');
});
add_filter('script_loader_tag',function($tag,$handle){return $handle==='is-site'?str_replace('<script ','<script type="module" ',$tag):$tag;},10,2);
add_filter('excerpt_more',fn()=> '…');
add_action('wp_head',function(){
  $config=is_cms_config();echo '<meta name="description" content="'.esc_attr($config['description']).'">';
  echo '<meta property="og:title" content="'.esc_attr($config['title']).'"><meta property="og:description" content="'.esc_attr($config['description']).'">';
  echo '<link rel="canonical" href="'.esc_url(get_permalink()).'">';
  echo '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">';
},2);
add_action('admin_notices',function(){ if(get_current_screen()->id==='dashboard') echo '<div class="notice notice-info"><p><strong>InteliSpaces / DARKA — wersja testowa.</strong> Treści: Strony → Edytuj. Nagłówek, stopka, zdjęcia i formularze: Elementy wspólne. Zgłoszenia: Zapytania. Kolejne akapity i zdjęcia można dopisywać standardowymi blokami WordPressa.</p></div>'; });
