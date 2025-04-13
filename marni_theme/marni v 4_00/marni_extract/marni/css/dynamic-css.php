<?php

function marni_dynamic_styles() {

	$custom_css = "";

	/* number of menu items left of logo */
	if (get_theme_mod('marni_menuleft', '')) {
		$leftvalue = get_theme_mod('marni_menuleft', '3'); 	
	} else {
		$leftvalue = 3; 
	}

	$leftitems = $leftvalue + 1; 
	$selector1 = ".menu-logo-centered li.menu-item:nth-child(-n+" . intval($leftitems) . ")";
	$selector2 = ".menu-logo-centered li.page-item:nth-child(-n+" . intval($leftitems) . ")";
	if ($leftvalue) {
		$custom_css .= " 
		$selector1,
		$selector2 {
	  		order: 0; 
		}

		.menu-logo-centered .menu-item-logo {
		  	order: 1;
			}

		.menu-logo-centered .menu-item,
		.menu-logo-centered .page_item  {
		  	order: 2; 
		}
		";
	}

	/* CSS output from Customizer */
	if ( get_theme_mod('marni_home_listtextcenter',false) == true) {
		$custom_css .= "
			.home .post-list .entry-wrap, 
			.home .post-list .entry-header, 
			.home article.post-list.even-style:nth-child(even) .entry-wrap, 
			.home article.post-list.even-style:nth-child(even) .entry-header,
			.home article.post-list.even-style:nth-child(even) .entry-meta-wrap,
			.home .post-list .entry-meta-wrap {
				text-align: center;
				}
		";
	}
	if ( get_theme_mod('marni_archive_listtextcenter',false) == true) {
		$custom_css .= "
			.archive .post-list .entry-wrap, 
			.archive .post-list .entry-header, 
			.archive article.post-list.even-style:nth-child(even) .entry-wrap, 
			.archive article.post-list.even-style:nth-child(even) .entry-header,
			.archive article.post-list.even-style:nth-child(even) .entry-meta-wrap,
			.archive .post-list .entry-meta-wrap {
				text-align: center;
				}
		";

	}
	if ( get_theme_mod('marni_home_listcenter',false) == true) {
		$custom_css .= "
			.home .post-list .entry-wrap {
				align-items: center;
				}
		";
	} 
	if ( get_theme_mod('marni_archive_listcenter',false) == true) {
		$custom_css .= "
			.archive .post-list .entry-wrap {
				align-items: center;
				}
		
		";

	} 

	/* promoboxes text background padding left */
	$pbtype = get_theme_mod( 'marni_promoboxes_type', array() );
	if (!empty($pbtype)) {
		$letterspacing = $pbtype['letter-spacing'];
	} else {
		$letterspacing = "";
	} 
	if (!empty($letterspacing)) {
		$paddingleft = "12" + intval($letterspacing);
	} else {
		$paddingleft = "12";
	} 

	$custom_css .= "
	.promoboxes .overlay-content {
		padding-left: {$paddingleft}px;
		} 
	
	";


	/* tags padding if white or no background color */
	$defaults = array(
		'background'   	=> '#101020',
		'bghover' 	=> '#a9a9ac',
		'text'  	=> '#ffffff',
		'texthover'  	=> '#ffffff',
	);

	$tagbg = get_theme_mod('marni_tag_colors', $defaults);
	if ( '#ffffff' == $tagbg['background'] || '' == $tagbg['background'] ) {
		$custom_css .= "
			.post-tag {
				padding: 0;
				}
			.post-tag:hover {
				background-color: transparent !important;
				}
			.post-tag:hover a,
			.post-tag:hover .post-tag-hashtag {
			    color: #a9a9ac !important;
			}
		";
	}

	/* add custom background color to CSS class - for gutenberg cover images */
	$background_color = get_background_color();
	$custom_css .= "
	.custom-bg-color,
	.no-sidebar .entry-content .alignwide.custom-bg-color,
	.no-sidebar .entry-content .alignfull.custom-bg-color {
			background-color: #{$background_color};
			}

	";

        wp_add_inline_style( 'marni-style', $custom_css );
}
add_action( 'wp_enqueue_scripts', 'marni_dynamic_styles' );

?>