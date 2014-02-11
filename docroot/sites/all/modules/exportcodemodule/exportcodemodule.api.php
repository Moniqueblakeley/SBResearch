<?php

/**
 * @file
 * Bulk export of objects generated by Bulk export module.
 */

/**
 * Implements hook_views_api().
 */
function exportcodemodule_views_api($module, $api) {
  if ($module == 'views' && $api == 'views_default') {
    return array('version' => 2);
  }
}

/**
 * Implements hook_ctools_plugin_api().
 */
function exportcodemodule_ctools_plugin_api($module, $api) {
  if ($module == 'ctools_custom_content' && $api == 'ctools_content') {
    return array('version' => 1);
  }
  if ($module == 'feeds' && $api == 'feeds_importer_default') {
    return array('version' => 1);
  }
  if ($module == 'file_entity' && $api == 'file_default_displays') {
    return array('version' => 1);
  }
  if ($module == 'flexslider' && $api == 'flexslider_default_preset') {
    return array('version' => 1);
  }
  if ($module == 'panels' && $api == 'pipelines') {
    return array('version' => 1);
  }
  if ($module == 'panels' && $api == 'layouts') {
    return array('version' => 1);
  }
  if ($module == 'panels_mini' && $api == 'panels_default') {
    return array('version' => 1);
  }
  if ($module == 'quicktabs' && $api == 'quicktabs') {
    return array('version' => 1);
  }
  if ($module == 'page_manager' && $api == 'pages_default') {
    return array('version' => 1);
  }
}