<?php
$help = $page['help'];
$content = $page['content'];
$footer = $page['footer'];
$page_top = $page['page_top'];
$page_bottom = $page['page_bottom'];

$main_menu = $page['main_menu'];

$social_region = $page['social'];
$search_box = $page['search_box'];
$slider_region = $page['slider_region'];
$youtube = $page['youtube'];
$highlighted = $page['highlighted'];
$highlighted_2 = $page['highlighted_2'];

$column_block1 = $page['column_block1'];
$column_block2 = $page['column_block2'];
$column_block3 = $page['column_block3'];
$column_block4 = $page['column_block4'];
$column_block5 = $page['column_block5'];
$column_block6 = $page['column_block6'];

$column_block1_second_row = $page['column_block1_second_row'];
$column_block2_second_row = $page['column_block2_second_row'];
$column_block3_second_row = $page['column_block3_second_row'];
$column_block4_second_row = $page['column_block4_second_row'];
$column_block5_second_row = $page['column_block5_second_row'];
$column_block6_second_row = $page['column_block6_second_row'];

$under1 = $page['under1'];
$under2 = $page['under2'];
$under3 = $page['under3'];
$under4 = $page['under4'];
$under5 = $page['under5'];
$under6 = $page['under6'];

$bottom1 = $page['bottom1'];
$bottom2 = $page['bottom2'];
$bottom3 = $page['bottom3'];
$bottom4 = $page['bottom4'];
$bottom5 = $page['bottom5'];
$bottom6 = $page['bottom6'];

$footer1 = $page['footer1'];
$footer2 = $page['footer2'];
$footer3 = $page['footer3'];
$footer4 = $page['footer4'];
$footer5 = $page['footer5'];
$footer6 = $page['footer6'];

$modal = $page['modal'];
$modal_2 = $page['modal_2'];
$modal_3 = $page['modal_3'];

$tab1 = $page['tab1'];
$tab2 = $page['tab2'];
$tab3 = $page['tab3'];
$tab4 = $page['tab4'];
$tab5 = $page['tab5'];
$tab6 = $page['tab6'];
$tabs_sidebar = $page['tabs_sidebar'];

$adnan_superfish = $page['adnan_superfish'];
$content_top = $page['content_top'];
$content_bottom = $page['content_bottom'];
$left_sidebar = $page['left_sidebar'];
$right_sidebar = $page['right_sidebar'];


// this will test if block regions which are above orange titile regions exist or not. if exist, normal page title will show else, orange background page title will show
$upper_blocks1 = region_blocks_exist($slider_region, $youtube, $highlighted, $highlighted_2);
$upper_blocks2 = region_blocks_exist($column_block1, $column_block2, $column_block3, $column_block4, $column_block5, $column_block6);
$upper_blocks3 = region_blocks_exist($column_block1_second_row , $column_block2_second_row , $column_block3_second_row , $column_block4_second_row,  $column_block5_second_row , $column_block6_second_row );
$upper_blocks4 = region_blocks_exist($tab1,$tab2,$tab3,$tab4,$tab5,$tab6,$tabs_sidebar);

function upperRegionsExist($a = NULL, $b = NULL, $c = NULL , $d = NULL){
	if($a == TRUE || $b == TRUE || $c == TRUE ||$d == TRUE){
		return TRUE;
	}
	else {
		return FALSE;
	}
}

// for bread crumb use
$you_here = t("You are here: ");

?>
	
<!--<div id="testBed" class="row" style="padding: 100px;"></div> -->

<div class="container-fluid">
	<div id="topBar">
		<div class="clearfix row-fluid">
			<div id="top-bar-inner">
				<!-- Login | Register links -->
				<div class="span5 loginlinks">
					<?php if(theme_get_setting('use_login_links') == 1) { ?>
						<div id="user_links">			
							<?php if (!($user->uid)) { print user_login_links(); } else { print  icompany_welcome_user(); } ?>	
						</div>
					<?php } ?>
				</div>
				
				
				<!--Social Region -->
				<?php if($social_region) {?>
				<div class="social-region <?php if($search_box) print ' span7 '; else print ' span9 '?> hidden-phone">
					<div class="pull-right inner">
						<?php print render($social_region) ?>
					</div>
				</div>
				<?php } ?>
				
				
			
				
				
			</div>
		</div>
	</div><!--topBar-->
</div>


<div class="container-fluid theme-border" >
	
	<!--Header area -->
	<header class="row-fluid" id="header">
		
		<div id="header_left" class="span5 clearfix">
			<div class="inner">	
			<?php if ($logo) { ?><div id="logocontainer"><a href="<?php print $base_path ?>" title="<?php print t('Home') ?>"><img src="<?php print $logo ?>" alt="<?php print t('Home') ?>" /></a></div><?php } ?>
				<div id="texttitles">
					  <?php if ($site_name) { ?><h1 id='site-name'><a href="<?php print $base_path ?>" title="<?php print t('Home') ?>"><?php print $site_name ?></a></h1><?php } ?>
				      <?php if ($site_slogan) { ?><span id="slogan"><?php print $site_slogan ?></span><?php } ?>
				</div>
			</div>
		</div>
		
		<div id="wap-menu" class="span7">
			<div class="pull-right main_menu_container">
				
				<?php
		            /*
		            if ($main_menu) {
		            $pid = variable_get('menu_main_links_source', 'main-menu');
		            $tree = menu_tree($pid);
		            $main_menu = drupal_render($tree);
		            }else{
		            $main_menu = FALSE;
		            }
		            ?>
		            <?php
		            if ($main_menu): print $main_menu; endif;
					 * */
		        ?> 
		        
		        <?php if($main_menu) print render($main_menu) ?>
		        
		        <script type="text/javascript">
					(function ($) {	
							/* MENU DESCRIPTION MAKER*/								
							var wapoWindowWidth = $(window).width();
							
							// fetch titles and add descriptions
							$('.content > #nav > li > a').each(function(){
								var mainMenuTitle = $(this).attr('title');
								var linkParent = $(this).parent();
								
								$('<span>', {
									'class' : 'tip hidden-phone hidden-tablet',
									'text' : mainMenuTitle,
								}).appendTo(linkParent);
							});		
									
							/* END MENU DESCRIPTION MAKER*/
					})(jQuery);
				</script>
					
			</div>
		</div>
		
		<?php if(!$slider_region && !$title) { ?>
			<div id="header-inner-shadow"></div>
		<?php } ?>
		
	</header><!--Header area -->
	
<div class="container-fluid theme-border" id="page-wrapper">	
	<!--slider-->
  
  <?php  if($slider_region){ ?>
  
  	<style>
		#modern .frame {
			width: 100%;
			height: 500px;
		}
		#modern .frame ul {
			list-style: none;
			height: 100%;
			padding: 0;
			margin: 0;
		}
		#modern .frame ul li {
			float: left;
			height: 100%;
		}
		#modern .frame ul li img {
			max-width: none;
		}
		#modern .frame ul li .mSCover {
			position: relative;
		}
		#modern .frame ul li .mSCover:after {
			position: absolute;
			content: '';
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			background-color: rgba(0, 0, 0, 0);
			
			-webkit-transition: all 0.3s;
				-ms-transition: all 0.3s;
				 -o-transition: all 0.3s;
					transition: all 0.3s;
		}
		#modern .frame ul li:hover .mSCover:after {
			background-color: rgba(0, 0, 0, 0.6);
		}
		#modern.mSMedia .frame ul li:hover .mSCover:after {
			display: none;
		}
		#modern .details {
			position: absolute;
			bottom: 0;
			width: 100%;
			background-color: rgba(0, 0, 0, 0.2);
			padding: 15px;
			color: #FFF;
			
			-webkit-box-sizing: border-box;
			   -moz-box-sizing: border-box;
			        box-sizing: border-box;
			
			-webkit-transition: all 0.3s;
				-ms-transition: all 0.3s;
				 -o-transition: all 0.3s;
					transition: all 0.3s;
		}
		#modern.mSMedia .details {
			display: none;
		}
		#modern .frame ul li:hover .details {
			background-color: rgba(0, 0, 0, 0.6);
		}
		#modern .details .title {
			display: block;
			color: #FFF;
			font-size: 18px;
			text-transform: uppercase;
			text-decoration: none;
			margin-bottom: 10px;
			text-shadow: 1px 1px 0 #000;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		#modern .details .description {
			font-weight: 300;
			height: 0;
			overflow: hidden;
			color: #D5D5D5;
			
			-webkit-transition: all 0.3s;
				-ms-transition: all 0.3s;
				 -o-transition: all 0.3s;
					transition: all 0.3s;
		}
		#modern .frame ul li:hover .details .description {
			height: 60px;
			margin-bottom: 10px;
		}
		#modern .details .counts {
			height: 20px;
		}
		#modern .details .counts a {
			float: left;
			color: #AAA;
			font-size: 11px;
			text-transform: uppercase;
			margin-right: 15px;
			
			-webkit-transition: all 0.3s;
				-ms-transition: all 0.3s;
				 -o-transition: all 0.3s;
					transition: all 0.3s;
		}
		#modern .details .counts a:hover {
			color: #FFF;
			text-decoration: none;
		}
		#modern .details .counts a.more {
			float: right;
			opacity: 0;
			filter: alpha(opacity=0);
			margin: 0;
		}
		#modern .frame ul li:hover .details .counts a.more {
			opacity: 1;
			filter: alpha(opacity=100);
		}
	</style>
	<div class="container marketing span12">
		<div class="page-header">
			<h1 class="normal">Modern<br><small>(drag, page scroll & hover effect)</small></h1>
		<div class="featurette">
		</div>
			<div class="controls marginbottom">
				<button class="btn btn-default" id="modern_prev"><i class="icon-chevron-left"></i> Prev Page</button>
				<span class="divider"></span>
				<button class="btn btn-default" id="modern_next">Next Page <i class="icon-chevron-right"></i></button>
			</div>
		</div>
    </div>
    <div class="featurette featurette_full">
		<div class="mightyslider_carouselModern_skin clearfix" id="modern">
			<div class="frame" data-mightyslider="width: 1170, height: 370">
				<ul class="slide_element">
					<li class="slide" data-mightyslider="cover:'http://mightyslider.com/assets/img/plugin%20pictures/new/151121_tumblr_mb0tlwxyqv1ro1zebo1_500.jpg', link: { url: 'http://mightyslider.com/assets/img/plugin%20pictures/new/151121_tumblr_mb0tlwxyqv1ro1zebo1_500.jpg' }">
						<div class="details">
							<a href="javascript:void(0);" class="title">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet</a>
							<div class="description">Integer viverra felis a nisl volutpat placerat. Donec et lorem mauris. Proin pellentesque urna nulla. Nunc sed turpis semper, fermentum ipsum quis, ornare enim. Proin ut augue enim.</div>
							<div class="counts">
								<a href="javascript:void(0);" class="more">Read more</a>
								<a href="javascript:void(0);">156 Likes</a>
								<a href="javascript:void(0);">27 Comments</a>
							</div>
						</div>
					</li>
					<li class="slide" data-mightyslider="cover:'http://mightyslider.com/assets/img/plugin%20pictures/new/154430_tumblr_mbshki8exa1r46py4o1_1280.jpg', link: { url: 'http://mightyslider.com/assets/img/plugin%20pictures/new/154430_tumblr_mbshki8exa1r46py4o1_1280.jpg' }">
						<div class="details">
							<a href="javascript:void(0);" class="title">Integer viverra felis a nisl volutpat placerat</a>
							<div class="description">Nullam ornare, est vel scelerisque blandit, ligula lectus facilisis lectus, eget lacinia massa ante non magna. Cras sollicitudin diam eu tempor volutpat. Fusce scelerisque metus quam, ut ultrices eros blandit ac.</div>
							<div class="counts">
								<a href="javascript:void(0);" class="more">Read more</a>
								<a href="javascript:void(0);">132 Likes</a>
								<a href="javascript:void(0);">16 Comments</a>
							</div>
						</div>
					</li>
					<li class="slide" data-mightyslider="cover:'http://mightyslider.com/assets/img/plugin%20pictures/new/208568_tumblr_me02nuxdyr1rqgv0oo1_500.jpg', video: 'http://vimeo.com/44941805'">
						<div class="details">
							<a href="javascript:void(0);" class="title">Donec dignissim est ut ligula pulvinar elementum</a>
							<div class="description">Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam volutpat purus vel eleifend venenatis. Nulla bibendum mi sit amet elit convallis imperdiet.</div>
							<div class="counts">
								<a href="javascript:void(0);" class="more">Read more</a>
								<a href="javascript:void(0);">234 Likes</a>
								<a href="javascript:void(0);">23 Comments</a>
							</div>
						</div>
					</li>
					<li class="slide" data-mightyslider="cover:'http://mightyslider.com/assets/img/plugin%20pictures/new/michel-hamburg-germany-photography-wookmark-277809.jpg', link: { url: 'http://mightyslider.com/assets/img/plugin%20pictures/new/michel-hamburg-germany-photography-wookmark-277809.jpg' }">
						<div class="details">
							<a href="javascript:void(0);" class="title">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet</a>
							<div class="description">Integer viverra felis a nisl volutpat placerat. Donec et lorem mauris. Proin pellentesque urna nulla. Nunc sed turpis semper, fermentum ipsum quis, ornare enim. Proin ut augue enim.</div>
							<div class="counts">
								<a href="javascript:void(0);" class="more">Read more</a>
								<a href="javascript:void(0);">156 Likes</a>
								<a href="javascript:void(0);">27 Comments</a>
							</div>
						</div>
					</li>
					<li class="slide" data-mightyslider="cover:'http://mightyslider.com/assets/img/plugin%20pictures/new/276111_tumblr_mpqoghrt2k1r46py4o1_1280.jpg', link: { url: 'http://mightyslider.com/assets/img/plugin%20pictures/new/276111_tumblr_mpqoghrt2k1r46py4o1_1280.jpg' }">
						<div class="details">
							<a href="javascript:void(0);" class="title">Integer viverra felis a nisl volutpat placerat</a>
							<div class="description">Nullam ornare, est vel scelerisque blandit, ligula lectus facilisis lectus, eget lacinia massa ante non magna. Cras sollicitudin diam eu tempor volutpat. Fusce scelerisque metus quam, ut ultrices eros blandit ac.</div>
							<div class="counts">
								<a href="javascript:void(0);" class="more">Read more</a>
								<a href="javascript:void(0);">132 Likes</a>
								<a href="javascript:void(0);">16 Comments</a>
							</div>
						</div>
					</li>
					<li class="slide" data-mightyslider="cover:'http://mightyslider.com/assets/img/plugin%20pictures/new/267600_8be4e1a2503b369da3e8a70d90cbcfda.jpg', link: { url: 'http://mightyslider.com/assets/img/plugin%20pictures/new/267600_8be4e1a2503b369da3e8a70d90cbcfda.jpg' }">
						<div class="details">
							<a href="javascript:void(0);" class="title">Donec dignissim est ut ligula pulvinar elementum</a>
							<div class="description">Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam volutpat purus vel eleifend venenatis. Nulla bibendum mi sit amet elit convallis imperdiet.</div>
							<div class="counts">
								<a href="javascript:void(0);" class="more">Read more</a>
								<a href="javascript:void(0);">234 Likes</a>
								<a href="javascript:void(0);">23 Comments</a>
							</div>
						</div>
					</li>
					<li class="slide" data-mightyslider="cover:'http://mightyslider.com/assets/img/plugin%20pictures/new/tumblr_m8nhi25dRR1rxkz3no1_1280.jpg', link: { url: 'http://mightyslider.com/assets/img/plugin%20pictures/new/tumblr_m8nhi25dRR1rxkz3no1_1280.jpg' }">
						<div class="details">
							<a href="javascript:void(0);" class="title">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet</a>
							<div class="description">Integer viverra felis a nisl volutpat placerat. Donec et lorem mauris. Proin pellentesque urna nulla. Nunc sed turpis semper, fermentum ipsum quis, ornare enim. Proin ut augue enim.</div>
							<div class="counts">
								<a href="javascript:void(0);" class="more">Read more</a>
								<a href="javascript:void(0);">156 Likes</a>
								<a href="javascript:void(0);">27 Comments</a>
							</div>
						</div>
					</li>
					<li class="slide" data-mightyslider="cover:'http://mightyslider.com/assets/img/plugin%20pictures/new/151116_28780885089926722_f1qwqqsc_c.jpg', link: { url: 'http://mightyslider.com/assets/img/plugin%20pictures/new/151116_28780885089926722_f1qwqqsc_c.jpg' }">
						<div class="details">
							<a href="javascript:void(0);" class="title">Integer viverra felis a nisl volutpat placerat</a>
							<div class="description">Nullam ornare, est vel scelerisque blandit, ligula lectus facilisis lectus, eget lacinia massa ante non magna. Cras sollicitudin diam eu tempor volutpat. Fusce scelerisque metus quam, ut ultrices eros blandit ac.</div>
							<div class="counts">
								<a href="javascript:void(0);" class="more">Read more</a>
								<a href="javascript:void(0);">132 Likes</a>
								<a href="javascript:void(0);">16 Comments</a>
							</div>
						</div>
					</li>
					<li class="slide" data-mightyslider="cover:'http://mightyslider.com/assets/img/plugin%20pictures/new/272261_2d3824e47be54a448642833b1b039399.jpg', link: { url: 'http://mightyslider.com/assets/img/plugin%20pictures/new/272261_2d3824e47be54a448642833b1b039399.jpg' }">
						<div class="details">
							<a href="javascript:void(0);" class="title">Donec dignissim est ut ligula pulvinar elementum</a>
							<div class="description">Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam volutpat purus vel eleifend venenatis. Nulla bibendum mi sit amet elit convallis imperdiet.</div>
							<div class="counts">
								<a href="javascript:void(0);" class="more">Read more</a>
								<a href="javascript:void(0);">234 Likes</a>
								<a href="javascript:void(0);">23 Comments</a>
							</div>
						</div>
					</li>
					<li class="slide" data-mightyslider="cover:'http://mightyslider.com/assets/img/plugin%20pictures/new/102505_shangai-skyscrapers-above-the-clouds-jin-mao-tower-swfc-blackstation-6.jpg', link: { url: 'http://mightyslider.com/assets/img/plugin%20pictures/new/102505_shangai-skyscrapers-above-the-clouds-jin-mao-tower-swfc-blackstation-6.jpg' }">
						<div class="details">
							<a href="javascript:void(0);" class="title">Donec dignissim est ut ligula pulvinar elementum</a>
							<div class="description">Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam volutpat purus vel eleifend venenatis. Nulla bibendum mi sit amet elit convallis imperdiet.</div>
							<div class="counts">
								<a href="javascript:void(0);" class="more">Read more</a>
								<a href="javascript:void(0);">234 Likes</a>
								<a href="javascript:void(0);">23 Comments</a>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
    </div>
    <script>

		jQuery(document).ready(function(){
			var $win = jQuery(window),
				isTouch = !!('ontouchstart' in window),
				clickEvent = isTouch ? 'tap' : 'click';

            // Modern Example
			(function(){
				function calculator(width){
					var percent = '33.33%';
					if (width <= 768) {
						percent = '50%';
					}
					else {
						percent = '33.33%';
					}
					return percent;
				};

				var $carousel = jQuery('#modern'),
				$frame = jQuery('.frame', $carousel);
				$frame.mightySlider({
					speed: 500,
					autoScale: 1,
					viewport: 'fill',

					// Navigation options
					navigation: {
						navigationType: 'basic',
						activateOn:     clickEvent,
						slideSize: calculator($win.width())
					},
					
					// Buttons options
					buttons: {
						prevPage: jQuery('#modern_prev'),
						nextPage: jQuery('#modern_next')
					}
				});

				var API = $frame.data().mightySlider;

				$win.resize(function(){
					API.set({
						navigation: {
							slideSize: calculator($win.width())
						}
					});
				});
			})();
			// End of Modern Example

			jQuery('a[href*=".jpg"]').each(function(){
				jQuery(this).iLightBox({
					skin: 'metro-black',
					fullViewPort: 'fit'
				});
			});
		});

		window.___gcfg = {lang: "en"};
		(function() {
			var po = document.createElement("script"); po.type = "text/javascript"; po.async = true;
			po.src = "https://apis.google.com/js/plusone.js";
			var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(po, s);
		})();
    </script>
  
	<div id="main_slider" class="row-fluid <?php print theme_get_setting('slider_type').'-wrap'; ?>">
		<div id="slider-inner" class="span7">
			<div id="slider-inner-shadow"></div>
			<?php 
				$slider_type = theme_get_setting('slider_type') ? theme_get_setting('slider_type') : 'nivo';
				print  icomp_get_slider_html($slider_type) ;
			?>
			
			<?php if(theme_get_setting('slider_type') == 'piecemaker') { ?>							
				  <center>
				    <div id="piecemaker">
				      <p>Flash not supported by browser. It's probably about time you fixed that! <a href="http://get.adobe.com/flashplayer/"><strong> Get it here. </strong></a> </p>
				    </div>
				  </center>					
			<?php } ?>
			
			<div id="slider-inner-shadow-bottom"></div>
		</div>
		
	<!--Youtube Region-->	
		<div id="youtube" class="span5">
			<?php print render($youtube); ?>
		</div>

  </div>
  <?php } ?>	
 	 
  
	<!--content zone-->
	<div id="zone1" class="row-fluid">
		
		<?php if($highlighted || $highlighted_2) { ?>
		<div class="row-fluid">
			<?php if($highlighted) {?>
			<div id="highlighted" class="<?php if(!$highlighted_2) print 'span12'; else print 'span9'; ?>">
				<?php print render($highlighted) ?>
			</div>
			<?php }?>
			
			<?php if($highlighted_2) {?>
			<div id="highlighted_2" class="<?php if(!$highlighted) print 'span12'; else print 'span3'; ?>">		
				<?php print render($highlighted_2) ?>
			</div>
			<?php }?>
			
			<span class="border"></span>
		</div>
		<?php } ?>
		
		
		<?php if(region_blocks_exist($column_block1, $column_block2, $column_block3, $column_block4, $column_block5, $column_block6)) {?>
		<span class="divider"></span>
		<div id="column-region" class="row-fluid">
			
			<?php $column_blocks_span = get_block_span($column_block1, $column_block2, $column_block3, $column_block4, $column_block5, $column_block6); ?>
			<?php $column_block_count = count_blocks($column_block1, $column_block2, $column_block3, $column_block4, $column_block5, $column_block6) ?>
			
			
			<?php if($column_block1) {?>
				<div id="column_block1" class="<?php /* since 12 grids cannot be divided by 5, we use span4 for first block */ if($column_block_count == 5) print ' span4 '; else print $column_blocks_span ?>">
					<?php print render($column_block1) ?>
				</div>
			<?php } ?>
			
			<?php if($column_block2) {?>
				<div id="column_block2" class="<?php print $column_blocks_span ?>">
					<?php print render($column_block2) ?>
				</div>
			<?php } ?>
			
			<?php if($column_block3) {?>
				<div id="column_block3" class="<?php print $column_blocks_span ?>">
					<?php print render($column_block3) ?>
				</div>
			<?php } ?>
			
			<?php if($column_block4) {?>
				<div id="column_block4" class="<?php print $column_blocks_span ?>">
					<?php print render($column_block4) ?>
				</div>
			<?php } ?>
			<?php if($column_block5) {?>
				<div id="column_block5" class="<?php print $column_blocks_span ?>">
					<?php print render($column_block5) ?>
				</div>
			<?php } ?>
			
			<?php if($column_block6) {?>
				<div id="column_block6" class="<?php print $column_blocks_span ?>">
					<?php print render($column_block6) ?>
				</div>
			<?php } ?>
		</div>
		<span class="border-color"></span>
		<?php } ?>
		
		
		<?php if(region_blocks_exist($column_block1_second_row , $column_block2_second_row , $column_block3_second_row , $column_block4_second_row,  $column_block5_second_row , $column_block6_second_row )) {?>
		<span class="divider"></span>
		<div id="column-region-row2" class="row-fluid">
			
			<?php $column_blocks_span = get_block_span($column_block1_second_row , $column_block2_second_row , $column_block3_second_row , $column_block4_second_row , $column_block5_second_row , $column_block6_second_row); ?>
			<?php $column_row2_block_count = count_blocks($column_block1, $column_block2, $column_block3, $column_block4, $column_block5, $column_block6) ?>
			
			<?php if($column_block1_second_row ) {?>
				<div id="column_block1-row2" class="<?php /* since 12 grids cannot be divided by 5, we use span4 for first block */ if($column_row2_block_count == 5) print ' span4 '; else print $column_blocks_span ?>">
					<?php print render($column_block1_second_row ) ?>
				</div>
			<?php } ?>
			
			<?php if($column_block2_second_row ) {?>
				<div id="column_block2-row2" class="<?php print $column_blocks_span ?>">
					<?php print render($column_block2_second_row ) ?>
				</div>
			<?php } ?>
			
			<?php if($column_block3_second_row ) {?>
				<div id="column_block3-row2" class="<?php print $column_blocks_span ?>">
					<?php print render($column_block3_second_row ) ?>
				</div>
			<?php } ?>
			
			<?php if($column_block4_second_row ) {?>
				<div id="column_block4-row2" class="<?php print $column_blocks_span ?>">
					<?php print render($column_block4_second_row ) ?>
				</div>
			<?php } ?>
			
			<?php if($column_block5_second_row ) {?>
				<div id="column_block5-row2" class="<?php print $column_blocks_span ?>">
					<?php print render($column_block5_second_row ) ?>
				</div>
			<?php } ?>
			
			<?php if($column_block6_second_row ) {?>
				<div id="column_block6-row2" class="<?php print $column_blocks_span ?>">
					<?php print render($column_block6_second_row ) ?>
				</div>
			<?php } ?>
		</div>
		<span class="border"></span>
		<?php } ?>
		
		<!-- bootstrap tabs implementation on this region-->
		<?php if(region_blocks_exist($tab1,$tab2,$tab3,$tab4,$tab5,$tab6,$tabs_sidebar )) { 
			  $tabs_exist = region_blocks_exist($tab1,$tab2,$tab3,$tab4,$tab5,$tab6 );	?>
		<span class="divider"></span>
			<div id="tabs-region" class="row-fluid">
				
				<?php if($tabs_exist) {?>
				<div id="tabs-block" class="<?php if(region_blocks_exist($tabs_sidebar)) print ' span9 '; else print ' span12 ' ?>">
					 <div class="inner">
						 <div class="tabbable tabs-left"><!--bootstrap tabs implementation-->
						 	
						 	<ul class="nav nav-tabs">	
						 		 <!--tabs-->
								 <?php if($tab1) {?>					 	
								 	<li <?php if($tab1) print 'class="active"' ?> ><a href="#tab1" data-toggle="tab"><?php print theme_get_setting('tabname1'); ?></a></li>					 	
								 <?php } ?>
								 
								 <?php if($tab2) {?>					 	
								 	<li <?php if(!$tab1) print 'class="active"' ?> ><a href="#tab2" data-toggle="tab"><?php print theme_get_setting('tabname2'); ?></a></li>					 	
								 <?php } ?>
								 
								 <?php if($tab3) {?>					 	
								 	<li <?php if(!$tab1 && !$tab2) print 'class="active"' ?> ><a href="#tab3" data-toggle="tab"><?php print theme_get_setting('tabname3'); ?></a></li>					 	
								 <?php } ?>
								 
								 <?php if($tab4) {?>					 	
								 	<li <?php if(!$tab1 && !$tab2 && !$tab3) print 'class="active"' ?>><a href="#tab4" data-toggle="tab"><?php print theme_get_setting('tabname4'); ?></a></li>					 	
								 <?php } ?>
								 
								 <?php if($tab5) {?>					 	
								 	<li <?php if(!$tab1 && !$tab2 && !$tab3 && !$tab4) print 'class="active"' ?>><a href="#tab5" data-toggle="tab"><?php print theme_get_setting('tabname5'); ?></a></li>					 	
								 <?php } ?>
								 
								 <?php if($tab6) {?>					 	
								 	<li <?php if(!$tab1 && !$tab2 && !$tab3 && !$tab4 && $tab5) print 'class="active"' ?>><a href="#tab6" data-toggle="tab"><?php print theme_get_setting('tabname6'); ?></a></li>					 	
								 <?php } ?>
						 	</ul>
					 		
					 		<!--tabs content -->
						 	<div class="tab-content">
						 		  <?php if($tab1) {?>					 	
								 	<div class="tab-pane <?php if($tab1) print ' active ' ?>" id="tab1">
								 		<?php print render($tab1 ) ?>
								 	</div>					 	
								 <?php } ?>
								 
								 <?php if($tab2) {?>					 	
								 	<div class="tab-pane  fade  <?php if(!$tab1) print ' active ' ?>" id="tab2">
								 		<?php print render($tab2 ) ?>
								 	</div>				 	
								 <?php } ?>
								 
								 <?php if($tab3) {?>					 	
								 	<div class="tab-pane  fade  <?php if(!$tab1 && !$tab2) print ' active ' ?>" id="tab3">
								 		<?php print render($tab3 ) ?>
								 	</div>					 	
								 <?php } ?>
								 
								 <?php if($tab4) {?>					 	
								 	<div class="tab-pane  fade  <?php if(!$tab1 && !$tab2 && !$tab3) print ' active ' ?>" id="tab4">
								 		<?php print render($tab4) ?>
								 	</div>					 	
								 <?php } ?>
								 
								 <?php if($tab5) {?>					 	
								 	<div class="tab-pane  fade  <?php if(!$tab1 && !$tab2 && !$tab3 && !$tab4) print ' active ' ?>" id="tab5">
								 		<?php print render($tab5) ?>
								 	</div>					 	
								 <?php } ?>
								 
								 <?php if($tab6) {?>					 	
								 	<div class="tab-pane  fade  <?php if(!$tab1 && !$tab2 && !$tab3 && !$tab4 && $tab5) print ' active ' ?>" id="tab6">
								 		<?php print render($tab6 ) ?>
								 	</div>					 	
								 <?php } ?>
						 		 
						 	
						 	</div><!--tab content -->
						 </div><!--table--> 
					 </div><!--tab region inner-->
				</div>
				<?php } ?>
				
				<?php if($tabs_sidebar ) {?>
				<div id="tabs-Sidebar" class="span3 <?php if(!region_blocks_exist($tabs_exist)) print ' offset9 ';  ?>">
					<?php print render($tabs_sidebar ) ?>
				
				</div>				
				<?php } ?>
			
			</div>	
		<span class="divider"></span>
		<span class="border"></span>
		<?php } ?>
		
		
		<!--TITLE REGION-->
		<!--TITLE REGION-->
		<?php if(($title) && !(upperRegionsExist($upper_blocks1, $upper_blocks2, $upper_blocks3, $upper_blocks4))){ ?>
			<div id="title-region" class="row-fluid">	
				<div style="clear:both">
				<div class="span6" style="float:left">
					<?php if(!empty($breadcrumb)){  if(theme_get_setting('icompany_breadcrumb') == '1') print '<div class="breadcrumb">' . "<div id='home-icon'> <a href='$base_path'>" . ' <span class="icon-home"></span></a> </div> ' . $breadcrumb . ' &raquo; ' . breadcrumb_title($title) . '</div>'; elseif(!empty($breadcrumb)) print '<div class="breadcrumb">' . $breadcrumb . '</div>';  ?>
					
				<?php } ?>	
				</div>
				<div class="span4"  style="float:right">
					<!--Search Block -->
							
					
							<?php print render($search_box) ?>
						
				
			
				</div>
				</div>
				
				<div style="clear:both; ">
				<div class="inner">
						<?php print render($title_prefix); ?>
						<h1 class="page-title"><?php print $title ?></h1>  
						<?php print render($title_suffix); ?>
					</div>
										
				</div>
				</div>
			
		<?php } ?>
		
		
		
		<?php if($adnan_superfish) {?>
		<div id="adnan_superfish" >
		
				<div id="adnan_superfish" class="span12">
					<?php print render($adnan_superfish); ?>
				</div>
			
		</div>
		<?php } ?>
		
		<div id="zone2" class="row-fluid">
		
		<?php
		$left_right_count = count_blocks($left_sidebar, $right_sidebar);
		switch ($left_right_count) {
			case '0':
				$content_span = ' span12 ';
				break;
			
			case '1':
				$content_span = ' span9 ';
				break;
				
			case '2';
				$content_span = ' span6 ';
			break;
			
			default: 
				$content_span = ' span12 ';
				break;
		}
		?>
		
			<?php if($left_sidebar) {?>
				<div id="left-sidebar" class="span3">
					<?php print render($left_sidebar); ?>
				</div>
			<?php } ?>
			
			<div id="content-area" class="<?php print $content_span; ?>">
				<div class="inner <?php if(!$left_sidebar) print ' inner-no-left-sidebar '; if(!$right_sidebar) print ' inner-no-right-sidebar '; if(!$right_sidebar && !$left_sidebar) print ' inner-no-sidebar '; ?>">
					<?php if($content_top) {?>
						<div id="content-top">
							<?php print render($content_top); ?>
						</div>
					<?php } ?>
					
					<div id="content-region">
				        <?php if(!empty($tabs)){ ?><div class="tabs"><?php print render($tabs ); ?></div> <?php } ?>
				        <?php if ($show_messages) { print $messages; } ?>
				        <?php if($help){ ?><?php print render($help); ?><?php } ?>
				        <?php if(($title) && (upperRegionsExist($upper_blocks1, $upper_blocks2, $upper_blocks3, $upper_blocks4))){ ?>
				            <?php if(!empty($breadcrumb)){  if(theme_get_setting('icompany_breadcrumb') == '1') print '<div class="breadcrumb">' . $you_here . $breadcrumb . ' &raquo; ' . breadcrumb_title($title) . '</div>'; elseif(!empty($breadcrumb)) print '<div class="breadcrumb">' . $breadcrumb . '</div>';  ?><?php } ?>     
				        	<?php print render($title_prefix); ?>
								<h1 class="page-title"><?php print $title ?></h1>  
							<?php print render($title_suffix); ?>
				        <?php } ?>	
			              <?php if ($action_links): ?>
					        <ul class="links">
					          <?php print render($action_links); ?>
					        </ul>
					      <?php endif; ?>		        
				        <?php  print render($content); ?>	        
				        <?php if($feed_icons){ ?><?php print $feed_icons; ?><?php } ?>	
				        
					</div>
					
					<?php if($content_bottom) {?>
						<span class="divider"></span>
						<div id="content-bottom">
							<?php print render($content_bottom); ?>
						</div>
						
					<?php } ?>	
				</div>	
			</div><!--content area-->
			
			<?php if($right_sidebar) {?>
				<div id="right-sidebar" class="span3">
					<?php print render($right_sidebar); ?>	
				</div>
			<?php } ?>
			
		</div><!--content zone-->

	
	
	
	
	<?php if(region_blocks_exist($under1, $under2, $under3, $under4, $under5, $under6)) {?>
		<div id="under-content-region" class="row-fluid">
			
			<?php $under_blocks_span = get_block_span($under1, $under2, $under3, $under4, $under5, $under6); ?>
			<?php $under_block_count = count_blocks($under1, $under2, $under3, $under4, $under5, $under6) ?>
			
			
			<?php if($under1) {?>
				<div id="under1" class="<?php /* since 12 grids cannot be divided by 5, we use span4 for first block */ if($under_block_count == 5) print ' span4 '; else print $under_blocks_span ?>">
					<?php print render($under1) ?>
				</div>
			<?php } ?>
			
			<?php if($under2) {?>
				<div id="under2" class="<?php print $under_blocks_span ?>">
					<?php print render($under2) ?>
				</div>
			<?php } ?>
			
			<?php if($under3) {?>
				<div id="under3" class="<?php print $under_blocks_span ?>">
					<?php print render($under3) ?>
				</div>
			<?php } ?>
			
			<?php if($under4) {?>
				<div id="under4" class="<?php print $under_blocks_span ?>">
					<?php print render($under4) ?>
				</div>
			<?php } ?>
			<?php if($under5) {?>
				<div id="under5" class="<?php print $under_blocks_span ?>">
					<?php print render($under5) ?>
				</div>
			<?php } ?>
			
			<?php if($under6) {?>
				<div id="under6" class="<?php print $under_blocks_span ?>">
					<?php print render($under6) ?>
				</div>
			<?php } ?>
		</div>
		<?php } ?>
	
	
	
	
	
	<div id="zone3">
		<!--bottom region -->
		<?php if( region_blocks_exist($bottom1 , $bottom2 , $bottom3 , $bottom4,  $bottom5 , $bottom6 )) {?>	
		<div id="bottom-region" class="row-fluid">
			
			<?php $bottom_span = get_block_span($bottom1 , $bottom2 , $bottom3 , $bottom4,  $bottom5 , $bottom6); ?>
			<?php $bottom_blocks_count = count_blocks($bottom1 , $bottom2 , $bottom3 , $bottom4,  $bottom5 , $bottom6) ?>
			
			<?php if($bottom1 ) {?>
				<div id="bottom1" class="<?php /* since 12 grids cannot be divided by 5, we use span4 for first block */ if($bottom_blocks_count == 5) print ' span4 '; else print $bottom_span ?>">
					<?php print render($bottom1 ) ?>
				</div>
			<?php } ?>
			
			<?php if($bottom2 ) {?>
				<div id="bottom2" class="<?php print $bottom_span ?>">
					<?php print render($bottom2 ) ?>
				</div>
			<?php } ?>
			
			<?php if($bottom3 ) {?>
				<div id="bottom3" class="<?php print $bottom_span ?>">
					<?php print render($bottom3 ) ?>
				</div>
			<?php } ?>
			
			<?php if($bottom4 ) {?>
				<div id="bottom4" class="<?php print $bottom_span ?>">
					<?php print render($bottom4 ) ?>
				</div>
			<?php } ?>
			
			<?php if($bottom5 ) {?>
				<div id="bottom5" class="<?php print $bottom_span ?>">
					<?php print render($bottom5 ) ?>
				</div>
			<?php } ?>
			
			<?php if($bottom6 ) {?>
				<div id="bottom6" class="<?php print $bottom_span ?>">
					<?php print render($bottom6 ) ?>
				</div>
			<?php } ?>
			
			
			
		</div>

		<?php } ?>
		
		<!--footer region-->
		<?php if( region_blocks_exist($footer1 , $footer2 , $footer3 , $footer4,  $footer5 , $footer6 )) {?>	
		
		<div id="footer-region" class="row-fluid">
			 <div class="footer-inner">
			<?php 
			
			$footerLeft = region_blocks_exist($footer1 , $footer2 , $footer3 , $footer4,  $footer5 );
			$footerRight = region_blocks_exist($footer6);
			$footerSmalls = region_blocks_exist($footer2 , $footer3 , $footer4 , $footer5);
			
			 
			
			?>
			
			<?php if($footerLeft == TRUE) {?>
			<div id="footer-left" class="<?php if(!$footerRight) print 'span12'; else print 'span9'; ?>">
				
				
				<?php if($footer1) {?>
				<div class="row-fluid" id="footer1">
					<div class="span12">
						<div class="inner">
							<?php  print render($footer1) ?>					
						</div>
					</div>
					 
				</div>
				<?php } ?>
				
				<?php if($footerSmalls == TRUE) {?>
					<?php $footerSmallsSpan = get_block_span($footer2 , $footer3 , $footer4 , $footer5); ?>
					<div class="row-fluid" id="footerSmalls">
						
						<?php if($footer2) {?>
							<div class="<?php print $footerSmallsSpan ?>">
								<?php print render($footer2) ?>
							</div>
						<?php } ?>
						
						<?php if($footer3) {?>
							<div class="<?php print $footerSmallsSpan ?>">
								<?php print render($footer3) ?>
							</div>
						<?php } ?>
						
						<?php if($footer4) {?>
							<div class="<?php print $footerSmallsSpan ?>">
								<?php print render($footer4) ?>
							</div>
						<?php } ?>
						
						<?php if($footer5) {?>
							<div class="<?php print $footerSmallsSpan ?>">
								<?php print render($footer5) ?>
							</div>
						<?php } ?>
						
						
					</div>
				<?php } ?>
				
				
			</div>
			<?php } ?>
			
			<?php if($footer6) {?>
			<div id="footer-right" class="<?php if(!$footerLeft) print 'span12'; else print 'span3'; ?>">
				<?php print render($footer6) ?>
			</div>
			<?php } ?>
			
			<span class="divider"> </span>
			</div>
		</div>
		 
		<?php } ?>
		
		
		<div id="footer-bar" class="row-fluid">
			<?php if ($secondary_nav):  ?>
				<div id="secondary_menu" class="span5">
			      <?php print $secondary_nav; ?> 
			    </div>
			<?php endif; ?>
			
			<div id="footer-note" class="span12">
				<div class="inner">
			      <?php if(theme_get_setting('footer_note')) { print theme_get_setting('footer_note'); }  print render($footer); ?>
			    </div>
		    </div>
		</div><!--footer bar-->
		
	</div>
	
	
	
</div><!--container fluid and page wrapper-->
<span class="divider"></span>

<?php
$toTop = t('Go to top');
if(theme_get_setting('show_feedback_link') == 1) {
$give_feedback = t('Give us your valuable feedback');
?>
<div id="feedback-div" class="visible-desktop">
	<a data-original-title="<?php print $give_feedback ?>" rel="tooltip" data-placement="right" id="feedback-link" href="#myModal" role="button"  data-toggle="modal"><img src="<?php print base_path() . path_to_theme() ?>/img/feedback.png" alt="" /></a>
</div>
<?php } ?>

<?php if($modal) print render($modal); ?>
<?php if($modal_2) print render($modal_2); ?>
<?php if($modal_3) print render($modal_3); ?>

<div id="toTop" ><img class="visible-desktop" src="<?php print base_path() . path_to_theme() ?>/img/toTop.png" alt="<?php print $toTop ?>" />
</div>


<div id="preLoad" style="display:none; visibility:hidden;"> <!-- Preload Images for backgrounds -->
<?php if(drupal_is_front_page()) { ?>  <img style="display:none; visibility:hidden;" src="<?php print base_path() . path_to_theme() ?>/img/title-bg-shade.png" alt="" /><?php } ?>
</div>
