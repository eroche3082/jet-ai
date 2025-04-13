/*jshint multistr: true */
/*global jQuery*/


jQuery(document).ready(function(){

	'use strict';

	// RTL
	if (jQuery('body').hasClass("rtl")) {
	     var rtlorigin = false;
	} else {
	     var rtlorigin = true;
	}


	/** MASONRY ********************************************************************************/
	var jQuerycontainer = jQuery('.masonry');
	jQuerycontainer.imagesLoaded( function() {
	  	jQuerycontainer.masonry({
	  		isOriginLeft: rtlorigin,
	  		});
	});

	var jQuerygallerycontainer = jQuery('.gallery');
	jQuerygallerycontainer.imagesLoaded( function() {
	  	jQuerygallerycontainer.masonry({
		  	itemSelector: '.gallery-item',
		  	gutter: 12,
		  	percentPosition: true
		});
	});


	var jQueryblockgallerycontainer = jQuery('.wp-block-gallery:not(.is-cropped) .blocks-gallery-grid');
	jQueryblockgallerycontainer.imagesLoaded( function() {
	  	jQueryblockgallerycontainer.masonry({
		  	itemSelector: '.blocks-gallery-item',
		  	gutter: 12,
		  	percentPosition: true
		});
	});

	var jQueryblockgallerycontainer2 = jQuery('.wp-block-gallery:not(.is-cropped)');
	jQueryblockgallerycontainer2.imagesLoaded( function() {
	  	jQueryblockgallerycontainer2.masonry({
		  	itemSelector: '.wp-block-image',
		  	gutter: 12,
		  	percentPosition: true
		});
	});




	/** OWL CAROUSEL ************************************************************/
	var sliderItems = jQuery(".slider").data("slider-items");
	var sliderAutoWidth = jQuery(".slider").data("slider-autowidth");
	var sliderHeight = jQuery(".slider").data("slider-height");
	var sliderSpeed = jQuery(".slider").data("slider-speed");
	var sliderWidth = sliderHeight * 16 / 9;

	if (jQuery('body').hasClass("rtl")) {
	     var rtlval = true;
	} else {
	     var rtlval = false;
	}

	jQuery(".owl-carousel").owlCarousel({
		autoplay: true,
		autoplayTimeout: sliderSpeed,
		items: sliderItems,
		lazyLoad: true,
		margin: 24,
		loop: true,
		center: true,
		dots: true,
		nav: false,
		rtl: rtlval,
		responsiveClass:true,
		    responsive:{
		        0:{
		            items:1,
		            autoWidth:false,
		        },
		        960:{
		            items: sliderItems,
		            autoWidth:sliderAutoWidth,
		        }
		}
	});

	/** FITVIDS ************************************************************/
	jQuery(document).ready(function(){
		jQuery("#content").fitVids();
		});



	/** GUTENBERG cover images ************************************************************/
	jQuery('.wp-block-cover.alignwide').wrap('<div class="wp-block-cover-image-outer-wrap alignwide custom-bg-color"><div class="wp-block-cover-image-wrap"></div></div>');
	jQuery('.wp-block-cover.alignfull').wrap('<div class="wp-block-cover-image-outer-wrap alignfull custom-bg-color"><div class="wp-block-cover-image-wrap"></div></div>');
	jQuery('.wp-block-gallery.alignwide').wrap('<div class="wp-block-gallery-wrap alignwide"></div>');
	jQuery('.wp-block-gallery.alignfull').wrap('<div class="wp-block-gallery-wrap alignfull"></div>');
	jQuery('.wp-block-embed.alignwide').wrap('<div class="wp-block-embed-wrap alignwide"></div>');
	jQuery('.wp-block-embed.alignfull').wrap('<div class="wp-block-embed-wrap alignfull"></div>');



	/** LIGHTBOX ***********************************************************/
	if (jQuery.fn.magnificPopup) {
		jQuery('.entry-content, .gallery').magnificPopup({
			fixedContentPos: true,
		  	delegate: 'a.links_to_image',
		  	type: 'image',
		  	gallery: {
			      enabled: true
			},
			image: {
			    // options for image content type
			    titleSrc: 'caption'
			  }
		});
	}



	/** WP GALLERY HOVER ***********************************************************/
	jQuery('.gallery-item').on({
		mouseenter: function() {
			jQuery(this).addClass('gallery-item-hover');
		}, mouseleave: function() {
			jQuery(this).removeClass('gallery-item-hover');
		}
	});


	/** SLICKNAV RESPONSIVE MENU *****************************************************/
	jQuery('.primary-menu').slicknav({
		label: '<i class="toggle-nav fa fa-navicon"></i>',
		openedSymbol: '',
		closedSymbol: '',
		closeOnClick: true,
		prependTo:'#site-navigation-responsive'
	});


	/** SEARCH OVERLAY ************************************************************/
	jQuery( document ).ready(function() {
		jQuery(document).on('click', '.search-close', function(){
			jQuery('#search-overlay').fadeOut();
		});
		jQuery(document).on('click', '.searchbutton', function(){
			jQuery('#search-overlay').fadeIn();
			jQuery('.search-content-wrap .search-field').focus();

		});
	});


	/** OUTLINE BUTTON HOVER COLOR **********************************************/
	jQuery('.has-color.shortcode-button.button-outline').on({
		mouseenter: function() {
			var jQuerythis = jQuery(this);
			var colorValue = jQuerythis.data("color"); 
			jQuerythis.css('background-color', colorValue);
			jQuerythis.css('color', '#ffffff');
		}, mouseleave: function() {
			var jQuerythis = jQuery(this);
			var colorValue = jQuerythis.data("color"); 
			jQuerythis.css('background-color', 'transparent');
			jQuerythis.css('color', colorValue);
		}
	});

});




/** RESIZING  ********************************************************************************/
//Initial load of page
jQuery(window).on('load',sizeContent);

//Every resize of window
jQuery(window).resize(sizeContent);

//Dynamically assign height and width
function sizeContent() {

	'use strict';

	var windowWidth = jQuery(window).width();
	var windowHeight = jQuery(window).height();
	var newHeight = jQuery(window).height();
        var wpadmin = jQuery('#wpadminbar').height();
        var headerHeight = jQuery("header").height(); 

	// content box one third and two third round numbers  
	var contentboxeswidth = jQuery(".content-boxes.masonry").width(); 
	var onethirdwidth = contentboxeswidth / 3; 
	var onethirdwidthround = Math.round(onethirdwidth);
	var twothirdwidthround = onethirdwidthround * 2; 

	jQuery('.content-box.one-third').each(function(){
		jQuery(this).css( "width" , onethirdwidthround );
	});

	jQuery('.content-box.two-third').each(function(){
		jQuery(this).css( "width" , twothirdwidthround );
	});

	//content boxes height - square     
	jQuery('.content-box.square').each(function(){
		var boxheight = jQuery(this).find('.contentbox-container').height();
		var boxwidth = jQuery(this).width() - 24;

		if (boxheight < boxwidth ) {
		       jQuery(this).addClass( 'use-defined-height centered-content' );
		} else if (boxheight > boxwidth) {
		       jQuery(this).removeClass( 'use-defined-height centered-content');
		} 
	});


	//content boxes height - half       
	jQuery('.content-box.half-height').each(function(){
		var boxheight = jQuery(this).find('.contentbox-container').height();
		var halfboxheight = boxheight * 2;
		var boxwidth = jQuery(this).width() - 24;
		
		if (halfboxheight < boxwidth ) {
		       jQuery(this).addClass( 'use-defined-height' );
		} else if (halfboxheight > boxwidth) {
		       jQuery(this).removeClass( 'use-defined-height');
		} 
	});

	//content boxes height - portrait       
	jQuery('.content-box.one-and-a-half-height').each(function(){
		var boxheight = jQuery(this).find('.contentbox-container').height();
		var oneandahalfheight = boxheight / 1.5;
		var boxwidth = jQuery(this).width() - 24;
		
		if (oneandahalfheight < boxwidth ) {
		       jQuery(this).addClass( 'use-defined-height' );
		} else if (oneandahalfheight > boxwidth) {
		       jQuery(this).removeClass( 'use-defined-height');
		} 
	});


	//content boxes height - portrait high       
	jQuery('.content-box.double-height').each(function(){
		var boxheight = jQuery(this).find('.contentbox-container').height();
		var doubleheight = boxheight / 2;
		var boxwidth = jQuery(this).width() - 24;
		
		if (doubleheight < boxwidth ) {
		       jQuery(this).addClass( 'use-defined-height' );
		} else if (doubleheight > boxwidth) {
		       jQuery(this).removeClass( 'use-defined-height');
		} 
	});



	/* Navigation with centered logo *******************/

	// menu total width
	var totalWidth = 0;
	jQuery('.header1 ul.menu-logo-centered > li').each(function(index) {
    		totalWidth += parseInt(jQuery(this).outerWidth(), 10);
	});

	// left menu inkl logo width
	var leftAndLogoWidth = 0;
	var leftitems = jQuery('.main-navigation').data('leftitems');
	jQuery('ul.menu-logo-centered > li:nth-child(-n+'+ leftitems +')').each(function(index) {
	      leftAndLogoWidth += parseInt(jQuery(this).outerWidth(), 10);
	});

	// logo width
	var logoWidth = jQuery('ul.menu-logo-centered .menu-item-logo').outerWidth();

	// left menu width
	var leftWidth = (leftAndLogoWidth - logoWidth );

	// right menu width	
	var rightWidth = (totalWidth - leftAndLogoWidth );

	// padding left
	var padding = (rightWidth - leftWidth);
	if (padding > 0) {
	    	jQuery(".main-navigation ul.menu-logo-centered").css("padding-left", padding);
	} else {
		var paddingRight = Math.abs(padding);
		jQuery(".main-navigation ul.menu-logo-centered").css("padding-right", paddingRight);
	}

	
	/** STICKY SIDEBAR ******************************/
	if ( jQuery( ".sticky" ).length ) {
		if (windowWidth > 960) {
			jQuery('.right-sidebar.sticky').theiaStickySidebar({
				additionalMarginTop: 24,
				additionalMarginBottom: 24
			});
		} 
	}


	/** SLIDER IMAGE MAX WIDTH AND HEIGHT **********************/ 
	var slidertoppadding = parseInt(jQuery(".slider").css('padding-top'));
	var carouseltoppadding = parseInt(jQuery(".owl-carousel").css('padding-top'));


	  
        jQuery(".owl-carousel .owl-item").css("max-width", windowWidth);    
        jQuery(".useslidermaxheight .owl-carousel .owl-item, .useslidermaxheight .owl-carousel .owl-stage-outer").css("max-height", newHeight - wpadmin - headerHeight - 36 - carouseltoppadding - slidertoppadding );


}



// WINDOW LOAD
jQuery(window).on('load', function () {
	
	'use strict';

	// layout masonry after each image loads
	var jQuerycontainer = jQuery('.masonry');
	jQuerycontainer.imagesLoaded( function() {
		jQuerycontainer.masonry('layout');
	});

	var jQuerygallerycontainer = jQuery('.gallery');
	jQuerygallerycontainer.imagesLoaded( function() {
		jQuerygallerycontainer.masonry('layout');
	});

	var jQueryblockgallerycontainer = jQuery('.wp-block-gallery:not(.is-cropped) .blocks-gallery-grid');
	jQueryblockgallerycontainer.imagesLoaded( function() {
		jQueryblockgallerycontainer.masonry('layout');
	});


});
