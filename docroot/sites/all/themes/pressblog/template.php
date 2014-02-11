<?php 

function pressblog_breadcrumb($variables){
  $breadcrumb = $variables['breadcrumb'];
  if (!empty($breadcrumb)) {
    $breadcrumb[] = drupal_get_title();
    return '<div class="breadcrumb">' . implode(' / ', $breadcrumb) . '</div>';
  }
}

function pressblog_tabs_blocks($region) {
  $output = $t = '';
  $i = 1;
  if ($list = block_list($region)) {
	$c = count($list);
    foreach ($list as $key => $block) {
	$renderable_block=  _block_get_renderable_array(array($block));
	
	if ($i == 1) $t .= '<li class="TabbedPanelsTab">'.$renderable_block[0]['#block']->subject.'</li>';
	elseif ($i == $c) $t .= '<li class="TabbedPanelsTab last">'.$renderable_block[0]['#block']->subject.'</li>';
	else $t .= '<li class="TabbedPanelsTab">'.$renderable_block[0]['#block']->subject.'</li>';
	$renderable_block[0]['#block']->subject = '';
	$output .= '<div class="TabbedPanelsContent">'.drupal_render($renderable_block).'</div>';
	$i++;
	
    }
  }
  $output = '<div id="TabbedPanelsSidebar">
  <ul class="TabbedPanelsTabGroup">'.$t.'</ul><div class="TabbedPanelsContentGroup">'.$output.'</div>
  <script type="text/javascript">var TabbedPanelsSidebar = new Spry.Widget.TabbedPanels("TabbedPanelsSidebar");</script>
  </div>
  ';
  return $output;
}

/**
 * Override or insert variables into the html template.
 */
function pressblog_preprocess_html(&$variables) {
	
	$color_scheme = theme_get_setting('color_scheme');
	
	if ($color_scheme != 'default') {
	drupal_add_css(drupal_get_path('theme', 'pressblog') . '/style-' .$color_scheme. '.css', array('group' => CSS_THEME, 'type' => 'file'));
	}
	
	if (empty($variables['page']['sidebar_tabs'])) {
	$variables['classes_array'][] = 'no-sidebar-tabs';
	}
	
	/**
	* Font settings
	*/
	// Adding PT_Sans embedded font
	if (theme_get_setting('headings_font_family')=='hff-1' || theme_get_setting('paragraph_font_family')=='pff-1') {
	drupal_add_css(drupal_get_path('theme', 'pressblog') . '/font-styles/ptsans-font.css', array('group' => CSS_THEME, 'type' => 'file'));
	}
	
	// Adding PT Serif embedded font
	if (theme_get_setting('headings_font_family')=='hff-2' || theme_get_setting('paragraph_font_family')=='pff-6') {
	drupal_add_css(drupal_get_path('theme', 'pressblog') . '/font-styles/ptserif-font.css', array('group' => CSS_THEME, 'type' => 'file'));
	}
	
	// Adding Lato embedded font
	if (theme_get_setting('paragraph_font_family')=='pff-4') {
	drupal_add_css(drupal_get_path('theme', 'pressblog') . '/font-styles/lato-font.css', array('group' => CSS_THEME, 'type' => 'file'));
	}

	// Adding Asap embedded font
	if (theme_get_setting('paragraph_font_family')=='pff-5') {
	drupal_add_css(drupal_get_path('theme', 'pressblog') . '/font-styles/asap-font.css', array('group' => CSS_THEME, 'type' => 'file'));
	}
	
	drupal_add_css(path_to_theme() . '/css/layout-ie.css', array('group' => CSS_THEME, 'browsers' => array('IE' => '(lt IE 9)&(!IEMobile)', '!IE' => FALSE), 'preprocess' => FALSE));
	drupal_add_css(path_to_theme() . '/css/ie.css', array('group' => CSS_THEME, 'browsers' => array('IE' => '(lt IE 9)&(!IEMobile)', '!IE' => FALSE), 'preprocess' => FALSE));
	
}

/**
 * Override or insert variables into the html template.
 */
function pressblog_process_html(&$vars) {

  $classes = explode(' ', $vars['classes']);
  $classes[] = theme_get_setting('headings_font_family');
  $classes[] = theme_get_setting('paragraph_font_family');
  $vars['classes'] = trim(implode(' ', $classes));
 
}

function pressblog_page_alter($page) {
	// <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
	$viewport = array(
		'#type' => 'html_tag',
		'#tag' => 'meta',
		'#attributes' => array(
		'name' =>  'viewport',
		'content' =>  'width=device-width, initial-scale=1, maximum-scale=1'
		)
	);
	drupal_add_html_head($viewport, 'viewport');
}

function pressblog_form_alter(&$form, &$form_state, $form_id) {
  if ($form_id == 'search_block_form') {
  
    unset($form['search_block_form']['#title']);
	
    $form['search_block_form']['#title_display'] = 'invisible';
	$form_default = t('Search');
    $form['search_block_form']['#default_value'] = $form_default;

 	$form['search_block_form']['#attributes'] = array('onblur' => "if (this.value == '') {this.value = '{$form_default}';}", 'onfocus' => "if (this.value == '{$form_default}') {this.value = '';}" );
  }
}

/**
 * Add javascript files for front-page jquery slideshow.
 */
//Initialize slideshow using theme settings
$effect=theme_get_setting('slideshow_effect');
$effect_time=theme_get_setting('slideshow_effect_time')*1000;
drupal_add_js('jQuery(document).ready(function($) { 

$("#slideshow").cycle({
	fx:    "'.$effect.'",
	speed:  "slow",
	timeout: "'.$effect_time.'",
	next:   "#next",
	prev:   "#prev",
	slideResize: true,
	containerResize: false,
	width: "100%",
	height: "auto",
	fit: 1,
	before: function(){
    	$(this).parent().find(".slider-item.current").removeClass("current");
    },
	after: onAfter
});

function onAfter(curr, next, opts, fwd) {
	var $ht = $(this).height();
	$(this).parent().height($ht);
	$(this).addClass("current");
}

$(".slider-text").show();

$(window).load(function() {
	var $ht = $(".current img").height();
	$("#slideshow").height($ht);
});

$(window).resize(function() {
	var $ht = $(".current img").height();
	$("#slideshow").height($ht);
});

});',
array('type' => 'inline', 'scope' => 'footer', 'weight' => 5)
);
//EOF:Javascript

/**
 * Add javascript for enable/disable scroll to top action button
 */
if (theme_get_setting('scrolltop_display')) {
drupal_add_js('jQuery(document).ready(function($) { 
$(window).scroll(function() {
	if($(this).scrollTop() != 0) {
		$("#toTop").fadeIn();	
	} else {
		$("#toTop").fadeOut();
	}
});

$("#toTop").click(function() {
	$("body,html").animate({scrollTop:0},800);
});	

});',
array('type' => 'inline', 'scope' => 'header'));
}
//EOF:Javascript