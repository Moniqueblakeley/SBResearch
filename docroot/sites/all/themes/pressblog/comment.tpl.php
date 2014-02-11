<div class="<?php print $classes . ' ' . $zebra; ?>"<?php print $attributes; ?>>

  <div class="clearfix">

  <?php if ($new) : ?>
    <span class="new"><?php print drupal_ucfirst($new) ?></span>
  <?php endif; ?>
  
        <div class="comment-left">
        
        	<?php print $picture ?>
            
        </div><!--EOF:.comment-left-->
        
        <div class="comment-right">
        
            <div class="comment-title">
            
            	<strong><?php print $author; ?></strong> <?php print t('says'); ?>:
                
            </div>
            
            <div class="comment-body">
            
                <?php print render($title_prefix); ?>
                <?php print $title ?>
                <?php print render($title_suffix); ?>
                
                <div class="content"<?php print $content_attributes; ?>>
                  <?php hide($content['links']); print render($content); ?>
                  <?php if ($signature): ?>
                  <div class="clearfix signature">
                    <div>—</div>
                    <?php print $signature ?>
                  </div>
                  <?php endif; ?>
                </div>
                
            </div>
        
        </div><!--EOF:.comment-right-->
        
        <div class="comment-meta">
        
            <div class="comment-meta-time">
                <?php print $submitted ?>
            </div>
            
            <div class="comment-links">
                <?php if ($content['links']): ?>
                <div class="links"><?php print render($content['links']) ?></div>
                <?php endif; ?>
            </div>
        
        </div><!--EOF:.comment-meta-->
    
    </div>

</div>
