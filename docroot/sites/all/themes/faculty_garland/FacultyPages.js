var firstMargin = 0;

var myScroll;

function OnReady_Function() {

	if(jQuery(".node-faculty-pages").length != 0)
	{
		jQuery("#center").addClass("FacultyPageNode");
		jQuery("#sidebar-first").addClass("FacultyPageSidebar");
		jQuery(".field-name-field-picture").css("border-bottom","0");
		jQuery(".field-label:contains('Picture:')").css("display","none");
		jQuery(".field-name-field-picture").css("padding-bottom","0");
		jQuery(".field-name-field-picture").css("padding-top","0");
		
	}

    var windowWidth = jQuery(window).width();
	jQuery('head').append('<meta http-equiv="X-UA-Compatible" content="IE=9">');
    var visibleLetters = parseInt(windowWidth / 26);
    var allLetters = jQuery("#A-Z").find("li");
	var tableDivHeight = jQuery(".view-content table:nth-child(2)").find("tr").length * 20;
	
	//jQuery(".view-content").css("height",(tableDivHeight +300)+"px");
	if ( jQuery.browser.msie ) {
		jQuery(".view-content").css("overflow","auto");
	}
	jQuery(".view-content").css("height","300px");
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
   // $("#LeftArrowDiv").click(LeftArrow_OnClick);
   // $("#RightArrowDiv").click(RightArrow_OnClick);
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

    var animationOffset = (visibleLetters * 75) + marginLeft - 225;
    if ((Math.abs(marginLeft)) < (visibleLetters * 75) + 75) {
        animationOffset = marginLeft + ((26 - (parseInt(Math.abs(animationOffset), 10) / 75)) * (75));
        jQuery('#A-Z ').animate({ "marginLeft": "0px" }, "fast");
    }
    else if (marginLeft < 0) {
        animationOffset = marginLeft + (visibleLetters * 75) -40;
        jQuery('#A-Z').animate({ "marginLeft": animationOffset + "px" }, "fast");
    }

}

function RightArrow_OnClick() {

    var marginLeft = parseInt(jQuery('#A-Z').css("margin-left").substring(0, jQuery('#A-Z').css("margin-left").length - 2));
    var animationOffset = (jQuery('#LettersContainer').width() * (-1)) + marginLeft +225 ;
    var movedElementsCount = (parseInt(Math.abs(animationOffset), 10) / 75);
    if (26 - movedElementsCount < jQuery('#LettersContainer').width() / 105) {
        if (26 - (Math.abs(animationOffset) / 75) != 0) {
            animationOffset = marginLeft + ((26 - movedElementsCount) * (-75)) ;
            jQuery('#A-Z').animate({ "marginLeft": animationOffset + "px" }, "fast");
        }

    }
    else if (jQuery('#LettersContainer').width() + marginLeft >= -2227) {
        var visibleLetters = Math.floor(jQuery('#LettersContainer').width() / 75);
        animationOffset = marginLeft + (visibleLetters * (-75)) +40;
        jQuery('#A-Z').animate({ "marginLeft": animationOffset + "px" }, "fast");
    }
}


jQuery(document).ready(OnReady_Function);

jQuery(window).resize(function () {

    if ((window.fullScreen) ||
   (window.innerWidth == screen.width) || (window.innerWidth > 783 && !(window.fullScreen))) {
        jQuery('#A-Z ').animate({ "marginLeft": "0px" }, "fast");
    }
	
	if(jQuery(window).width() < 1100 && jQuery("#FacultyLeftNavigation2").length == 0)
	{
		alert("Here");
		var navigationLinks = jQuery(".FacultyLeftNavigation a");
		var navigationLinkValues = [];
		var newUl = jQuery("<select id='FacultyLeftNavigation2'></select>");
		
		for( i=0; i< navigationLinks.length; i++)
		{
			newUl.append("<option value='"+navigationLinks[i]+"'>"+navigationLinks[i].innerText+"</option>");
		}
		var otherLinks = jQuery("#otherLinks");
		var selectOtherLinks = $("<select id="otherLinksSelectBox"></select>");
		for( i=0; i< otherLinks.length; i++)
		{
			selectOtherLinks.append("<option value='"+otherLinks[i]+"'>"+otherLinks[i].innerText+"</option>");
		}
		
		jQuery(".BackgroundBlock").before(newUl);
		jQuery(newUl).after(selectOtherLinks);
	}
});



























