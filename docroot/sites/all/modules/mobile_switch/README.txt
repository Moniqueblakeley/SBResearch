Mobile Switch module

Simple automatic theme switch for mobile devices, detected by browscap.

DEPENDENCIES
------------

  - Drupal 7.
  - The Browscap module from drupal.org/project/browscap.

RECOMMENDED
-----------

  - The Mobile Switch Block module from drupal.org/project/mobile_switch_block.

INSTALL
-------

  1) Copy the Mobile Switch folder to the modules folder in your installation.
     Usually this is sites/all/modules.
     Or use the UI and install it via admin/modules/install.

  2) In your Drupal site, enable the module under Administration -> Modules.
    /admin/modules

ADMINISTER
----------

  1) Administer themes under Appearance.
     /admin/appearance

     - Enable your preffered mobile theme (Not set as default).
     - Use as default theme a 'not mobile theme'.

  2) Administer the Mobile Switch module under:
     Administration -> Configuration -> User interface
     /admin/config/user-interface/mobile-switch

     - Choose your mobile theme.

     If a theme used as mobile theme, their displayed informations on the
     Appearance administration page are altered for better visualisation.

     A Mobile Switch mobile theme is default not available on administration
     pages and in the maintenance mode.

     Mobile theme on administration pages

       Configure the 'Administration usage' in the module 'Basic settings' to
       enable the use of the mobile theme on administration pages.

     Mobile device prevention

       It is possible to bypass the automatic switching to the mobile theme for
       mobile devices.
       This is useful, for example, to exclude large tablets for the theme
       switching.

       To use this,

       administer the 'Advanced' settings under:
       Administration -> Configuration -> User interface -> Mobile Switch
       /admin/config/user-interface/mobile-switch/advanced

       enable the 'Use preventing' option and configure the user agent strings
       for such devices.

       To test this feature, without a real mobile device, it is a good
       solution to use the desktop browser with a user agent switcher extension
       and custom defined user agents.

     For the development of a web site

       Administer the 'Development' settings under:
       Administration -> Configuration -> User interface -> Mobile Switch
       /admin/config/user-interface/mobile-switch/development

       a) Enable/disable the 'Developer modus'.

          If a desktop mobile emulator not detected from browscap it is
          possible to configure additional user agents.

       b) Enable/disable desktop browser usage of the mobile theme.

DEVELOPMENT
-----------

  Development with Mobile Switch.

  The module provides three system variables:

  1. mobile_switch_ismobiledevice
  2. mobile_switch_ismobiletheme
  3. theme_mobile

  - The value of the variables 1. and 2. is a boolean value.
  - The value of the variable 3. is FALSE or the machine name of the used theme.

EXTERNAL RECOURCES
------------------

  Mobile Emulators & Simulators: The Ultimate Guide
  http://www.mobilexweb.com/emulators
