<?php

$x = drupal_add_js(drupal_get_path('theme', 'faculty_garland') .'/FacultyPages.js');

?>


<?php
/**
 * Override or insert variables into the html template.
 */
function faculty_garland_process_html(&$vars) {
  // Hook into color.module
  if (module_exists('color')) {
    _color_html_alter($vars);
  }
}
?>