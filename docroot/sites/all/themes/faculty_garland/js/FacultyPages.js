var firstMargin = 0;

var myScroll;


function OnReady_Function() {
alert("hello");
    var windowWidth = jQuery(window).width();
    var visibleLetters = parseInt(windowWidth / 26);
    var allLetters = jQuery("#A-Z").find("li");

    var msTouchEnabled = window.navigator.msMaxTouchPoints;
    if ("ontouchstart" in document.documentElement) {
        jQuery("#LeftArrowDiv").hide();
        jQuery("#RightArrowDiv").hide();
        jQuery("ul").css("margin-left", "-10px");
        jQuery("#LettersContainer").css("margin-top", "0px");
        jQuery("#LettersContainer").css("width", "100%");
        jQuery("#FacultyDirectoryTitle").css("width", "91%");
        jQuery("ul").css("width", "100%");
        jQuery("#LettersContainer").css("margin-left", "0px");

    }

    jQuery("#LeftArrow").click(LeftArrow_OnClick);
    jQuery("#RightArrow").click(RightArrow_OnClick);
   // jQuery("#LeftArrowDiv").click(LeftArrow_OnClick);
   // jQuery("#RightArrowDiv").click(RightArrow_OnClick);
    if (window.innerWidth < 788) {
        jQuery("#LettersContainer").swipe({
            swipe: function (event, direction, distance, duration, fingerCount) {
                if (direction == "left") {
                    RightArrow_OnClick();
                }
                else if (direction == "right") {
                    LeftArrow_OnClick();

                }

            }
        });
    }


}

function LeftArrow_OnClick() {

    var marginLeft = parseInt(jQuery('#A-Z ').css("margin-left").substring(0, jQuery('#A-Z ').css("margin-left").length - 2));
    var visibleLetters = Math.floor(jQuery('#LettersContainer').width() / 75);

    var animationOffset = (visibleLetters * 75) + marginLeft +40;
    if ((Math.abs(marginLeft)) < (visibleLetters * 75) + 75) {
        animationOffset = marginLeft + ((26 - (parseInt(Math.abs(animationOffset), 10) / 75)) * (75));
        jQuery('#A-Z ').animate({ "marginLeft": "0px" }, "fast");
    }
    else if (marginLeft < 0) {
        animationOffset = marginLeft + (visibleLetters * 75);
        jQuery('#A-Z').animate({ "marginLeft": animationOffset + "px" }, "fast");
    }

}

function RightArrow_OnClick() {

    var marginLeft = parseInt(jQuery('#A-Z').css("margin-left").substring(0, jQuery('#A-Z').css("margin-left").length - 2));
    var animationOffset = (jQuery('#LettersContainer').width() * (-1)) + marginLeft +40 ;
    var movedElementsCount = (parseInt(Math.abs(animationOffset), 10) / 75);
    if (26 - movedElementsCount < jQuery('#LettersContainer').width() / 75) {
        if (26 - (Math.abs(animationOffset) / 75) != 0) {
            animationOffset = marginLeft + ((26 - movedElementsCount) * (-75)) ;
            jQuery('#A-Z').animate({ "marginLeft": animationOffset + "px" }, "fast");
        }

    }
    else if (jQuery('#LettersContainer').width() + marginLeft >= -1777) {
        var visibleLetters = Math.floor(jQuery('#LettersContainer').width() / 75);
        animationOffset = marginLeft + (visibleLetters * (-75)) ;
        jQuery('#A-Z').animate({ "marginLeft": animationOffset + "px" }, "fast");
    }
}


jQuery(document).ready(OnReady_Function);

jQuery(window).resize(function () {

    if ((window.fullScreen) ||
   (window.innerWidth == screen.width) || (window.innerWidth > 783 && !(window.fullScreen))) {
        jQuery('#A-Z ').animate({ "marginLeft": "0px" }, "fast");
    }
});