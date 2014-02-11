CONTENTS OF THIS FILE
---------------------

 * Introduction
 * Installation


INTRODUCTION
------------

Menu Subtitle adds a new field to menu items to set a subtitle to show on menu links!

It should work on primary/secondary menu and normal menu items.


INSTALLATION
------------
Follow the drupal.org guidelines http://drupal.org/documentation/install/modules-themes/modules-7


USAGE
-----
1. Go to menu administration page at admin/structure/menu.

2. Add or edit a menu item. You will find a new fieldset called "Menu Subtitle" where you can optionaly set a string to show as subtitle on the menu link, the position where to show it (above or below the menu link, default is below) and if to print the subtitle as link.


TODO
----
#show the subtitle even on page title when the page related is showing
#generate the subtitle with custom php code
#integration with token
#integration with views


KNOW BUGS
---------
1. This module breaks Context module UI configruation
2. This module stops theme_menu_link() hooks from being run at the theme layer
