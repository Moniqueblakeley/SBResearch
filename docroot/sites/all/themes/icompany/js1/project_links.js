jQuery(document).ready(function(){
	var projectsContainer = jQuery('ul#projects_container'),
	projects = {
		"mightySlider": "http://mightyslider.com/",
		"iLightBox": "http://ilightbox.net/",
		"iCarousel&trade;": "http://codecanyon.net/item/icarousel/2527180",
		"iCarousel&trade; - Wordpress": "http://codecanyon.net/item/icarousel-wordpress/2589154"
	};

		jQuery.each(projects, function(key, val) {
			if(key.toLowerCase() != 'mightyslider') projectsContainer.append('<li><a href="'+val+'">'+key+'</a></li>');
		});
});