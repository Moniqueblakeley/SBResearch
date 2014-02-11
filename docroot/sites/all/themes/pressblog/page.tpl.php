<?php if (theme_get_setting('scrolltop_display')): ?>
<div id="toTop"><?php print t('Back to Top'); ?></div>
<?php endif; ?>

<!-- #header -->
<div id="header" class="clearfix">

    <!-- #header-navigation -->
    <div id="header-navigation" class="clearfix">
    
        <div id="header-navigation-inner" class="container_12 clearfix">
        
            <div class="grid_12">
            
                <div class="grid_8 alpha">
                
                	<div id="main-menu" class="clearfix">
					<?php if ($page['main_navigation']) :
                    	print drupal_render($page['main_navigation']);
                    else :
						if (module_exists('i18n')) :
						$main_menu_tree = i18n_menu_translated_tree(variable_get('menu_main_links_source', 'main-menu'));
						else :
						$main_menu_tree = menu_tree(variable_get('menu_main_links_source', 'main-menu')); 
						endif;
						print drupal_render($main_menu_tree);
                    endif; ?>
                    </div>
                    
                </div>
                
                <div class="grid_4 omega">
                    <div id="search-box" class="clearfix">
                    <?php print render($page['search_area']); ?>
                    </div>
                </div>
                
            </div>
        
        </div>
        
    </div>
    <!--EOF:#header-navigation -->
    
    <!-- #header-content -->
    <div id="header-content" class="clearfix">
    
        <div id="header-content-inner" class="container_12 clearfix">
        
            <div class="grid_12">
				
                <div class="grid_6 alpha">
                
                    <div class="site-fields clearfix">
                    
                        <?php if ($logo): ?>
                        <div id="logo">
                        <a href="<?php print check_url($front_page); ?>" title="<?php print t('Home'); ?>"><img src="<?php print $logo; ?>" alt="<?php print t('Home'); ?>" /></a>
                        </div>
                        <?php endif; ?>
    
                        <?php if ($site_name || $site_slogan): ?>
                        <?php if ($site_name): ?>
                        <div id="site-name"><a href="<?php print check_url($front_page); ?>" title="<?php print t('Home'); ?>"><?php print $site_name; ?></a></div>
                        <?php endif; ?>
                        <?php if ($site_slogan): ?>
                        <div id="slogan"><?php print $site_slogan; ?></div>
                        <?php endif; ?>
                        <?php endif; ?>
               
                    </div>
                
                </div>
                
                <div class="grid_6 omega">
					
                    <div id="header-content-banner" class="clearfix"><?php print render($page['header']); ?></div>
                    
                </div>

            </div>
        
        </div>
        
    </div>
    <!--EOF:#header-content -->
    
    <!-- #header-subscribe -->
    <div id="header-subscribe" class="clearfix">
    
        <div id="header-subscribe-inner" class="container_12 clearfix">
        
            <div class="grid_12">

                <div class="grid_8 alpha">
                
                    <div id="secondary-menu" class="clearfix">
					<?php if ($page['secondary_navigation']) :
                    	print drupal_render($page['secondary_navigation']);
                    else :
						if (module_exists('i18n')) :
						$main_menu_tree = i18n_menu_translated_tree(variable_get('menu_secondary_links_source', 'secondary-menu'));
						else :
						$main_menu_tree = menu_tree(variable_get('menu_secondary_links_source', 'secondary-menu')); 
						endif;
						print drupal_render($main_menu_tree);
                    endif; ?>
                    </div>

                </div>
                
                <div class="grid_4 omega">
                    <?php print render($page['header_bottom']); ?>
                </div>

            </div>
        
        </div>
        
    </div>
	<!--EOF:#header-subscribe -->
	
</div>
<!--EOF:#header -->

<!-- #page -->
<div id="page" class="clearfix">
    
    <div id="page-inner" class="container_12">
        
            <div id="content" class="grid_12 clearfix">
            	
                <?php if ($page['sidebar_tabs'] || $page['sidebar_first']): ?>
                <div class="grid_8 alpha">
                <?php endif; ?>
                
					<?php if ($messages): ?>
                    <div id="console" class="clearfix"><?php print $messages; ?></div>
                    <?php endif; ?>
                    
                    <?php if ($page['highlighted']): ?>
                    <div id="highlighted" class="clearfix">
                    <?php print render($page['highlighted']); ?>
                    </div>
                    <?php endif; ?>
                    
					<?php if (theme_get_setting('breadcrumb_display')): print $breadcrumb; endif; ?>

					<?php if ($tabs): ?>
                    <div class="tabs">
                    <?php print render($tabs); ?>
                    </div>
                    <?php endif; ?>
                    
                    <?php print render($page['help']); ?>
                    
                    <a id="main-content"></a>
                    <?php print render($title_prefix); ?>
                    <?php if ($title): ?>
                    <h1 class="title"><?php print $title; ?></h1>
                    <?php endif; ?>
                    <?php print render($title_suffix); ?>
                    
                    <?php if ($action_links): ?>
                    <ul class="action-links">
                    <?php print render($action_links); ?>
                    </ul>
                    <?php endif; ?>
                    
                    <?php if ($is_front) {
                    if (theme_get_setting('frontpage_content_print')):
                    print render($page['content']);
                    print $feed_icons;
                    endif;
                    } else {
                    print render($page['content']);
                    print $feed_icons;  
                    } ?>
                    
                <?php if ($page['sidebar_tabs'] || $page['sidebar_first']): ?>
                </div>
                <?php endif; ?>
                 
                <?php if ($page['sidebar_tabs'] || $page['sidebar_first']): ?>
                <div class="grid_4 omega">
                	<?php if ($page['sidebar_tabs']): ?>
					<?php print pressblog_tabs_blocks('sidebar_tabs'); ?>
					<?php endif; ?>
                    
                    <?php print render($page['sidebar_first']); ?>
                    
                </div><!--EOF:.grid_4 omega -->
                <?php endif; ?> 
                
            </div>
        
    </div>
    <!--EOF:#page-inner -->
    
</div>
<!--EOF:#page -->

<!-- #footer -->
<div id="footer" class="clearfix">
    
    <div id="footer-inner" class="container_12">
            
                <div class="grid_3 clearfix">
                    <?php print render($page['footer_first']); ?>
                </div>
                
                <div class="grid_3 clearfix">
                    <?php print render($page['footer_second']); ?>
                </div>
                
                <div class="grid_3 clearfix">
                    <?php print render($page['footer_third']); ?>
                </div>
                
                <div class="grid_3 clearfix">
                    <?php print render($page['footer_fourth']); ?>
                </div>
                        
    </div>
    <!--EOF:#footer-inner -->
    
</div>
<!--EOF:#footer -->

<!-- #footer -->
<div id="footer-message" class="clearfix">
    
    <div id="footer-message-inner" class="container_12 clearfix">
        
		<div class="grid_12 clearfix">
       <?php print render($page['footer_message']);?>
        </div>
        
    </div>
    <!--EOF:#footer-message-inner -->
    
</div>
<!--EOF:#footer-message -->