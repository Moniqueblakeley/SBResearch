var firstMargin = 0;

var myScroll;


function OnReady_Function() {

    var windowWidth = $(window).width();
    var visibleLetters = parseInt(windowWidth / 26);
    var allLetters = $("#A-Z").find("li");

    var msTouchEnabled = window.navigator.msMaxTouchPoints;
    if ("ontouchstart" in document.documentElement) {
        $("#LeftArrowDiv").hide();
        $("#RightArrowDiv").hide();
        $("ul").css("margin-left", "-10px");
        $("#LettersContainer").css("margin-top", "0px");
        $("#LettersContainer").css("width", "100%");
        $("#FacultyDirectoryTitle").css("width", "91%");
        $("ul").css("width", "100%");
        $("#LettersContainer").css("margin-left", "0px");

    }

    $("#LeftArrow").click(LeftArrow_OnClick);
    $("#RightArrow").click(RightArrow_OnClick);
   // $("#LeftArrowDiv").click(LeftArrow_OnClick);
   // $("#RightArrowDiv").click(RightArrow_OnClick);
    if (window.innerWidth < 788) {
        $("#LettersContainer").swipe({
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

    var marginLeft = parseInt($('#A-Z ').css("margin-left").substring(0, $('#A-Z ').css("margin-left").length - 2));
    var visibleLetters = Math.floor($('#LettersContainer').width() / 75);

    var animationOffset = (visibleLetters * 75) + marginLeft;
    if ((Math.abs(marginLeft)) < (visibleLetters * 75) + 75) {
        animationOffset = marginLeft + ((26 - (parseInt(Math.abs(animationOffset), 10) / 75)) * (75));
        $('#A-Z ').animate({ "marginLeft": "0px" }, "fast");
    }
    else if (marginLeft < 0) {
        animationOffset = marginLeft + (visibleLetters * 75);
        $('#A-Z').animate({ "marginLeft": animationOffset + "px" }, "fast");
    }

}

function RightArrow_OnClick() {

    var marginLeft = parseInt($('#A-Z').css("margin-left").substring(0, $('#A-Z').css("margin-left").length - 2));
    var animationOffset = ($('#LettersContainer').width() * (-1)) + marginLeft +40 ;
    var movedElementsCount = (parseInt(Math.abs(animationOffset), 10) / 75);
    if (26 - movedElementsCount < $('#LettersContainer').width() / 75) {
        if (26 - (Math.abs(animationOffset) / 75) != 0) {
            animationOffset = marginLeft + ((26 - movedElementsCount) * (-75)) ;
            $('#A-Z').animate({ "marginLeft": animationOffset + "px" }, "fast");
        }

    }
    else if ($('#LettersContainer').width() + marginLeft >= -2002) {
        var visibleLetters = Math.floor($('#LettersContainer').width() / 75);
        animationOffset = marginLeft + (visibleLetters * (-75)) ;
        $('#A-Z').animate({ "marginLeft": animationOffset + "px" }, "fast");
    }
}


$(document).ready(OnReady_Function);

$(window).resize(function () {

    if ((window.fullScreen) ||
   (window.innerWidth == screen.width) || (window.innerWidth > 783 && !(window.fullScreen))) {
        $('#A-Z ').animate({ "marginLeft": "0px" }, "fast");
    }
});