<?php

?>

  <?php print render($page['header']); 








?>

  <div id="wrapper">
    <div id="container" class="clearfix">
      <div id="header">
        <div id="logo-floater">
        <?php if ($logo || $site_title): ?>
          <?php if ($title): ?>
            
            <?php if ($logo): ?>
              <img src="<?php print $logo ?>" alt="<?php print $site_name_and_slogan ?>" title="<?php print $site_name_and_slogan ?>" id="logo" />
            <?php endif; ?>
			
			
            <?php print $site_html ?>
            </a></strong></div>
          <?php else: /* Use h1 when the content title is empty */ ?>
		  <!--<div id="FacultyDirectoryTitle">
            <h1>Faculty Directory
            </h1>
            <div id="SearchBoxDiv">
                <input type="text" id="SearchBox" >
                <img alt="Stony Brook University" id="SearchButton" src="/sites/test/files/search_button.png" />
            </div>
        </div> -->
		 
            <?php if ($logo): ?>
              <img src="<?php print $logo ?>" alt="<?php print $site_name_and_slogan ?>" title="<?php print $site_name_and_slogan ?>" id="logo" />
            <?php endif; ?>
            <?php print $site_html ?>
            
        <?php endif; ?>
        <?php endif; ?>
        </div>
 <div id="FacultyDirectoryTitle">
            <h1 id="branding"><a href="<?php print $front_page ?>">Faculty Directory</a></h1>
			<div id="SearchBoxDiv">
                <input type="text" id="SearchBox" />
                <img alt="Stony Brook University" id="SearchButton" src="/sites/all/themes/faculty_garland/images/search_button.png" />
            </div>
        </div> 
	<!--[if IE]>
<style>
.views-table tbody{
    overflow: auto;
    height: 20px !important;

}
</style>

<![endif]-->

<div id="Container">
           <div id="LeftArrowDiv">  <img alt="left" id="LeftArrow" src="/sites/all/themes/faculty_garland/images/left.png"/>
               </div>
        <div id="LettersContainer">
            <div id="A-Z">
                <ul>
                    <li><a href="www.google.com">A</a></li><li><a href="www.google.com">B</a></li><li><a href="www.google.com">C</a></li><li><a href="www.google.com">D</a></li><li><a href="www.google.com">E</a></li><li><a href="www.google.com">F</a></li><li><a href="www.google.com">G</a></li><li><a href="www.google.com">H</a></li><li><a href="www.google.com">I</a></li><li><a href="www.google.com">J</a></li><li><a href="www.google.com">K</a></li><li><a href="www.google.com">L</a></li><li><a href="www.google.com">M</a></li><li><a href="www.google.com">N</a></li>                 <li><a href="www.google.com">O</a></li><li><a href="www.google.com">P</a></li><li><a href="www.google.com">Q</a></li><li><a href="www.google.com">R</a></li><li><a href="www.google.com">S</a></li><li><a href="www.google.com">T</a></li><li><a href="www.google.com">U</a></li>               <li><a href="www.google.com">V</a></li><li><a href="www.google.com">W</a></li><li><a href="www.google.com">X</a></li><li><a href="www.google.com">Y</a></li><li><a>Z</a></li>
                </ul>
            </div>
        </div>
            <div id="RightArrowDiv">
                <img id="RightArrow" alt="right" src="/sites/all/themes/faculty_garland/images/right.png"/>
        </div>
      </div>		 
        <?php if ($primary_nav): print $primary_nav; endif; ?>
        <?php if ($secondary_nav): print $secondary_nav; endif; ?>
      </div> <!-- /#header -->

      <?php if ($page['sidebar_first']): ?>
        <div id="sidebar-first" class="sidebar">
          <?php print render($page['sidebar_first']); ?>
        </div>
      <?php endif; ?>

      <div id="center">
          <?php //print $breadcrumb; 
		  ?>
          <?php if ($page['highlighted']): ?><div id="highlighted"><?php print render($page['highlighted']); ?></div><?php endif; ?>
          <a id="main-content"></a>
          <?php if ($tabs): ?><div id="tabs-wrapper" class="clearfix"><?php endif; ?>
          <?php print render($title_prefix); ?>
          <?php if ($title): ?>
            <h1<?php print $tabs ? ' class="with-tabs"' : '' ?>><?php print $title ?></h1>
          <?php endif; ?>
          <?php print render($title_suffix); ?>
          <?php if ($tabs): ?><?php print render($tabs); ?></div><?php endif; ?>
          <?php print render($tabs2); ?>
          
          <?php print render($page['help']); ?>
          <?php if ($action_links): ?><ul class="action-links"><?php print render($action_links); ?></ul><?php endif; ?>
          <div class="clearfix">
            <?php print render($page['content']); ?>
          </div>
          <?php print $feed_icons ?>
          <?php print render($page['footer']); ?>
      </div> <!-- /.left-corner, /.right-corner, /#squeeze, /#center -->

      <?php if ($page['sidebar_second']): ?>
        <div id="sidebar-second" class="sidebar">
          <?php print render($page['sidebar_second']); ?>
        </div>
      <?php endif; ?>

    </div> <!-- /#container -->
  </div> <!-- /#wrapper -->

