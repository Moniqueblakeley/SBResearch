<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?>"<?php print $attributes; ?>>

	<?php print render($title_prefix); ?>
    <?php if (!$page): ?>
    <h2<?php print $title_attributes; ?> class="title"><a href="<?php print $node_url; ?>"><?php print $title; ?></a></h2>
    <?php endif; ?>
    <?php print render($title_suffix); ?>

	<?php if ($page == 0) { ?>

    <div class="taxonomy-meta">
    <?php if ($display_submitted) { print format_date($created, 'custom', "M d, Y"); } ?>
    <?php if (module_exists('comment')): ?> - <?php print t('Comments'); ?>: <?php print $node->comment_count ?><?php endif;?>
	<?php if (!empty($content['field_tags'])): ?> - <?php print t('Tags'); ?>:<?php print render($content['field_tags']); ?><?php endif; ?>
    </div>
    
    <div class="content clear-block taxonomy-node">
    
    <?php print render($content['field_image']); ?>
    
    <div class="taxonomy-description">
	<?php
    hide($content['comments']);
    hide($content['links']);
    print render($content);
    ?>
    
	<?php if (!empty($content['links'])): ?>
    <div class="links meta"><?php print render($content['links']); ?></div>
    <?php endif; ?>
    
    </div>
        
    </div>

	<?php } else { ?>

    <div class="content clear-block">

    <!--Subtitle-->
    <?php if (!empty($content['field_subtitle'])) { ?>  
    <div class="subtitle">
    <?php print render($content['field_subtitle']); ?>
    </div>
    <?php } ?> 
    
    <div class="meta-data">
    	<?php if ($display_submitted): ?>
        <div class="meta-left"><?php print t('Author'); ?>:</div><div class="meta-right"><?php print $name; ?></div>
        <div class="meta-left"><?php print t('Date'); ?>:</div><div class="meta-right"><?php print format_date($created, 'custom', "M d, Y"); ?></div>
        <?php endif; ?>
        
        <?php if (!empty($content['field_tags'])): ?>
        <div class="meta-left"><?php print t('Tags'); ?>:</div><div class="meta-right"><?php print render($content['field_tags']); ?></div>
        <?php endif; ?>
        
        <?php if (module_exists('comment')): ?>
        <div class="meta-left"><?php print t('Comments'); ?>:</div><div class="meta-right"><?php print $node->comment_count; ?></div>
        <?php endif;?>
    </div>

	<?php
    hide($content['comments']);
    hide($content['links']);
    print render($content);
    ?>
    
    <?php $node_author = user_load($uid); ?>
    
    <?php if (variable_get('user_signatures', 0)): ?>
    <div class="author-info">
    	<div class="author-picture"><?php print $user_picture ?></div>
        <div class="title"><?php print t('ABOUT THE AUTHOR'); ?></div>
        <div><?php print $node_author->signature; ?></div>
    </div>
    <?php endif;?>
    
    <?php if (module_exists('comment')): ?>
    <div class="comments-title"><?php print $node->comment_count; ?> <?php print t('Comment(s) to the'); ?> "<?php print $title ?>"</div>
    <?php endif;?>
    
  </div>

    <div class="clear-block">
        <?php if (!empty($content['links'])): ?>
        <div class="links meta"><?php print render($content['links']); ?></div>
        <?php endif; ?>
        <?php print render($content['comments']); ?>
    </div>
<?php }  ?>

</div>
