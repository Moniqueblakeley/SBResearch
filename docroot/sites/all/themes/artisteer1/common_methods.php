<?php

/* Common Drupal methods definitons using in Artisteer theme export */

function art_node_worker($node) {
  $links_output = art_links_woker($node->links);
  $terms_output = art_terms_worker($node->taxonomy);

  $output = $links_output;
  if (!empty($links_output) && !empty($terms_output)) {
    $output .= '&nbsp;|&nbsp;';
  }
  $output .= $terms_output;
  return $output;
}

/*
 * Split out taxonomy terms by vocabulary.
 *
 * @param $terms
 *   An object providing all relevant information for displaying terms:
 *
 * @ingroup themeable
 */
function art_terms_worker($terms) {
  $result = '';
  $terms = get_terms_D7($content);
if (!empty($terms)) {
ob_start();?>
<span class="art-posttagicon"><?php
$result .= ($result == '') ? ob_get_clean() : '&nbsp;|&nbsp;' . ob_get_clean();
$result .= '<div class="art-tags">' . render($terms) . '</div>';
ob_start();?>
</span><?php
$result .= ob_get_clean();
}

  return $result;
}

/**
 * Return a themed set of links.
 *
 * @param $links
 *   A keyed array of links to be themed.
 * @param $attributes
 *   A keyed array of attributes
 * @return
 *   A string containing an unordered list of links.
 */
function art_links_woker($links, $attributes = array('class' => 'links')) {
  $output = '';

  if (!empty($links)) {
    $output = '';

    $num_links = count($links);
    $index = 0;

    foreach ($links as $key => $link) {
      $class = $key;
      if (strpos ($class, "read_more") !== FALSE) {
        continue;
      }

      // Automatically add a class to each link and also to each LI
      if (isset($link['attributes']) && isset($link['attributes']['class'])) {
        $link['attributes']['class'] .= ' ' . $key;
      }
      else {
        $link['attributes']['class'] = $key;
      }

      // Add first and last classes to the list of links to help out themers.
      $extra_class = '';
      if ($index == 1) {
        $extra_class .= 'first ';
      }
      if ($index == $num_links) {
        $extra_class .= 'last ';
      }

      $link_output = get_html_link_output($link);
      if (!empty($class)) {
        if (strpos ($key, "comment") !== FALSE) {
if ($index > 0 && !empty($link_output) && !empty($output)) {
$output .= '&nbsp;|&nbsp;';
}
ob_start();?>
<span class="art-postcommentsicon"><?php
$output .= ob_get_clean();
$output .= $link_output;
$index++;
ob_start();?>
</span><?php
$output .= ob_get_clean();
continue;}

        if ($index > 0 && !empty($link_output) && !empty($output)) {
$output .= '&nbsp|&nbsp';
}
ob_start();?>
<span class="art-postcategoryicon"><?php
$output .= ob_get_clean();
$output .= $link_output;
$index++;
ob_start();?>
</span><?php
$output .= ob_get_clean();

      }
      else {
        $output .= '&nbsp;|&nbsp;' . $link_output;
        $index++;
      }
    }
  }

  return $output;
}

function get_html_link_output($link) {
  $output = '';
  // Is the title HTML?
  $html = isset($link['html']) ? $link['html'] : NULL;

  // Initialize fragment and query variables.
  $link['query'] = isset($link['query']) ? $link['query'] : NULL;
  $link['fragment'] = isset($link['fragment']) ? $link['fragment'] : NULL;

  if (isset($link['href'])) {
    if (get_drupal_major_version() == 5) {
      $output = l($link['title'], $link['href'], $link['attributes'], $link['query'], $link['fragment'], FALSE, $html);
    }
    else {
      $output = l($link['title'], $link['href'], array('language' => $link['language'], 'attributes'=>$link['attributes'], 'query'=>$link['query'], 'fragment'=>$link['fragment'], 'absolute'=>FALSE, 'html'=>$html));
    }
  }
  else if ($link['title']) {
    if (!$html) {
      $link['title'] = check_plain($link['title']);
    }
    $output = $link['title'];
  }

  return $output;
}

function art_content_replace($content) {
  $first_time_str = '<div id="first-time"';
  $article_str = ' class="art-article"';
  $pos = strpos($content, $first_time_str);
  if($pos !== FALSE)
  {
    $output = str_replace($first_time_str, $first_time_str . $article_str, $content);
    $output = <<< EOT
    <div class="art-box art-post">
      <div class="art-box-body art-post-body">
  <article class="art-post-inner art-article">
   <div class="art-postcontent">
      $output
    </div>
  <div class="cleared"></div>
    </article>
  <div class="cleared"></div>
  </div>
  </div>
EOT;
  }
  else 
  {
    $output = $content;
  }
  return $output;
}

function art_placeholders_output($var1, $var2, $var3) {
  $output = '';
  if (!empty($var1) && !empty($var2) && !empty($var3)) {
    $output .= <<< EOT
      <table class="position" cellpadding="0" cellspacing="0" border="0">
        <tr valign="top">
          <td class="third-width">$var1</td>
          <td class="third-width">$var2</td>
          <td>$var3</td>
        </tr>
      </table>
EOT;
  }
  else if (!empty($var1) && !empty($var2)) {
    $output .= <<< EOT
      <table class="position" cellpadding="0" cellspacing="0" border="0">
        <tr valign="top">
          <td class="third-width">$var1</td>
          <td>$var2</td>
        </tr>
      </table>
EOT;
  }
  else if (!empty($var2) && !empty($var3)) {
    $output .= <<< EOT
      <table class="position" cellpadding="0" cellspacing="0" border="0">
        <tr valign="top">
          <td class="two-thirds-width">$var2</td>
          <td>$var3</td>
        </tr>
      </table>
EOT;
  }
  else if (!empty($var1) && !empty($var3)) {
    $output .= <<< EOT
      <table class="position" cellpadding="0" cellspacing="0" border="0">
        <tr valign="top">
          <td class="half-width">$var1</td>
          <td>$var3</td>
        </tr>
      </table>
EOT;
  }
  else {
    if (!empty($var1)) {
      $output .= <<< EOT
        <div id="var1">$var1</div>
EOT;
    }
    if (!empty($var2)) {
      $output .= <<< EOT
        <div id="var1">$var2</div>
EOT;
    }
    if (!empty($var3)) {
      $output .= <<< EOT
        <div id="var1">$var3</div>
EOT;
    }
  }

  return $output;
}

function art_get_sidebar($sidebar, $vnavigation, $class) {
  $result = 'art-layout-cell ';
  if (empty($sidebar) && empty($vnavigation)) {
    $result .= 'art-content';
  }
  else {
    $result .= $class;
  }

  $output = '<div class="'.$result.'">'.render($vnavigation) . render($sidebar).'</div>'; 
  return $output;
}

function art_submitted_worker($date, $author) {
  $output = '';
  if ($date != '') {
    ob_start();?>
<span class="art-postdateicon"><?php
$output .= ob_get_clean();
$output .= $date;
ob_start();?>
</span><?php $output .= ob_get_clean();

  }
  if ($author != '') {
    ob_start();?>
<span class="art-postauthoricon"><?php if ($output != '') {
$output .= '&nbsp;|&nbsp;';
}
$output .= ob_get_clean();
$output .= $author;
ob_start();?>
</span><?php $output .= ob_get_clean();

  }
  return $output;
}

function is_art_links_set($links) {
  $size = sizeof($links);
  if ($size == 0) {
    return FALSE;
  }

  //check if there's "Read more" in node links only  
  $read_more_link = $links['node_read_more'];
  if ($read_more_link != NULL && $size == 1) {
    return FALSE;
  }

  return TRUE;
}

/**
 * Method to define node title output.
 *
*/
function art_node_title_output($title, $node_url, $page) {
  $output = '';
  if (!$page)
    $output = "<h2 class='art-postheader'><span class='art-postheadericon'><a href='$node_url' title='$title'>$title</a></span></h2>";
  else
    $output = "<h1 class='art-postheader'><span class='art-postheadericon'>$title</span></h1>";
  return $output;
}

function art_process_menu_class($menu, $menu_class) {
  $result = $menu;
  $matches = array();
  $pattern = '~<ul(.*?class=[\'"])(.*?)([\'"])~';
  if (preg_match($pattern, $menu, $matches)) { // Has attribute 'class'
    $class_attr = $matches[2];
    $pattern = '/^menu$|^menu\s|\smenu\s|\smenu$/';
    $new_class_attr = preg_replace($pattern, ' '.$menu_class.' ', $class_attr);
    $str_pos = strpos($menu, $class_attr);
    $result = substr_replace($menu, $new_class_attr, $str_pos, strlen($class_attr));
  } else {
	$start = '<ul';
    $str_pos = strpos($menu, $start);
	if ($str_pos !== FALSE) { // Attribute 'class' doesn't exist
	  $new_str = $start." class='$menu_class'";
	  $result = substr_replace($menu, $new_str, $str_pos, strlen($start));
	}
  }
  
  return $result;
}

function art_hmenu_output($content) {
  return art_process_menu_class($content, 'art-hmenu');
}

function art_vmenu_output($subject, $content) {
  if (empty($content))
    return;

  $result = '';
  $vmenu = art_process_menu_class($content, 'art-vmenu');
  
  return $result;
}

function art_replace_image_path($content) {
  $content = preg_replace_callback('/(src=)([\'"])(?:images[\/\\\]?)?(.*?)\2()/', 'art_real_path', $content);
  $content = preg_replace_callback('/(url\()([\'"])(?:images[\/\\\]?)?(.*?)\2(\))/', 'art_real_path', $content);
  return $content;
}

function art_real_path($match) {
  list($str, $start, $quote, $filename, $end) = $match;
  $full_path = get_full_path_to_theme().'/images';
  return $start . $quote . $full_path . '/' . $filename . $quote . $end;
}