<?php defined('ABSPATH') || exit; $config=is_cms_config(); ?>
<!doctype html><html <?php language_attributes(); ?>><head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class(); ?>><?php wp_body_open(); ?>
<a class="screen-reader-text" href="#main-content">Przejdź do treści</a>
<div id="root"><?php
  $page=preg_replace('/[^a-z]/','',$config['page']);$template=__DIR__.'/templates/'.$page.'.html';
  if(is_file($template)) {
    $replace=[];foreach($config['values'] as $key=>$value) $replace['__IS_'.$key.'__']=esc_html($value);
    $replace['__IS_ADDITIONAL__']=$config['additional'];
    $replace['__IS_THEME__']=esc_url(get_template_directory_uri());
    echo strtr(file_get_contents($template),$replace);
  } else { while(have_posts()){the_post();the_content();} }
?></div>
<?php if(has_nav_menu('additional')) wp_nav_menu(['theme_location'=>'additional','container'=>'nav','container_aria_label'=>'Dodatkowe strony','menu_class'=>'cms-additional']); ?>
<noscript><nav aria-label="Strony serwisu"><?php foreach($config['urls'] as $key=>$url) echo '<a href="'.esc_url($url).'">'.esc_html(is_routes()[$key]).'</a> '; ?></nav><p>Formularze i interaktywne elementy wymagają JavaScript.</p></noscript>
<?php wp_footer(); ?></body></html>
