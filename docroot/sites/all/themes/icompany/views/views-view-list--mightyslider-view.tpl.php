<?php

/**
 * @file
 * Default simple view template to display a list of rows.
 *
 * - $title : The title of this group of rows.  May be empty.
 * - $options['type'] will either be ul or ol.
 * @ingroup views_templates
 */
?>
<?php print $wrapper_prefix; ?>
  <?php if (!empty($title)) : ?>
    <h3><?php print $title; ?></h3>
  <?php endif; ?>
  <?php print $list_type_prefix; ?>
   <?php foreach ($rows as $id => $row): ?>

    <?php $content_field_article_image = $view->render_field('field_article_image', $id); ?>
    <?php $img_srcs = array(); ?>
    <?php preg_match('/.*src=".*(\/sites.*)" width.*/', $content_field_article_image, $img_srcs); ?>

      <li class="<?php print $classes_array[$id]; ?>" data-mightyslider="cover:'<?php print $img_srcs[1]; ?>', link: { url: '<?php print $img_srcs[1]; ?>' }">
	<div class="details">
	  <?php print $row; ?>
	</div>
      </li>
    <?php endforeach; ?>

  <?php print $list_type_suffix; ?>
<?php print $wrapper_suffix; ?>
