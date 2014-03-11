/**
 * @file
 * Required functions to use the Mobile Switch administration.
 */

(function ($) {
 Drupal.behaviors.mobileSwitch = {
  attach: function(context, settings) {
   // Basic settings form; Hide/show "Administration usage"
   if ($('#edit-mobile-switch-mobile-theme').val() == 'none') {
    $('.form-item-mobile-switch-admin-usage').hide();
   }
   else {
    $('.form-item-mobile-switch-admin-usage').show();
   }
   $('#edit-mobile-switch-mobile-theme').click(function() {
    if ($(this).val() == 'none') {
     $('.form-item-mobile-switch-admin-usage').hide();
    }
    else {
     $('.form-item-mobile-switch-admin-usage').show();
    }
   });
   // Advanced form; Hide/show preventing strings textarea.
   if ($('#edit-mobile-switch-prevent-devices').val() == 0) {
    $('.form-item-mobile-switch-prevent-devices-strings').hide();
   }
   else {
    $('.form-item-mobile-switch-prevent-devices-strings').show();
   }
   $('#edit-mobile-switch-prevent-devices').click(function() {
    if ($(this).val() == '0') {
     $('.form-item-mobile-switch-prevent-devices-strings').hide();
    }
    else {
     $('.form-item-mobile-switch-prevent-devices-strings').show();
    }
   });
   // Development form; Uncheck "Display user agent".
   $('#edit-mobile-switch-mobile-theme').click(function() {
    if ($(this).val() == 'none') {
     //togggleUa();
     $('.form-item-mobile-switch-prevent-devices-strings').hide;
    }
    else {
     ('.form-item-mobile-switch-prevent-devices-strings').show;
    }
   });
   $('#edit-mobile-switch-developer').click(function() {
    if ($(this).val() == 0) {
     togggleUa();
    }
   });
   function togggleUa() {
    if ($('#edit-mobile-switch-display-useragent').is(':checked')) {
     $('#edit-mobile-switch-display-useragent').attr('checked', false);
    }
    if ($('#edit-mobile-switch-display-browscapinfo').is(':checked')) {
     $('#edit-mobile-switch-display-browscapinfo').attr('checked', false);
    }
   }
  }
 };
})(jQuery);
