<?php
/**
 * marni Theme Customizer.
 *
 * @package marni
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function marni_customize_register( $wp_customize ) {
	$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
	$wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';

	$wp_customize->get_section('title_tagline')->priority = 1;
	$wp_customize->get_section('colors')->priority = 4;
}
add_action( 'customize_register', 'marni_customize_register' );


/* Add the theme configuration */
Marni_Kirki::add_config( 'marni_theme_mod', array(
    	'capability'    => 'edit_theme_options',
    	'option_type'   => 'theme_mod',
) );


/* Add Marni logo to customizer */
function kirki_demo_configuration_sample_styling( $config ) {
	return wp_parse_args( array(
		'logo_image'   => 'http://www.files.red-sun-design.com/marni/marni-logo2.png',
	), $config );
}
add_filter( 'kirki_config', 'kirki_demo_configuration_sample_styling' );


/* Add LAYOUT panel *********************************************************************/
Marni_Kirki::add_panel( 'layout', array(
  	'title'          => esc_html__( 'Layout', 'marni' ),
  	'priority'       => 2,
));

	/* Add HEADER section *********************************************************************/
	Marni_Kirki::add_section( 'header', array(
	  	'title'          => esc_html__( 'Header', 'marni' ),
	  	'priority'       => 1,
		'capability' => 'edit_theme_options',
		'panel'          => 'layout',
	));

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'radio',
				'settings'    => 'marni_header_layout',
				'label'       => esc_html__( 'Header Layout', 'marni' ),
				'section'     => 'header',
				'default'     => 'header2',
				'priority'    => 10,
				'choices'     => array(
					'header1'   => esc_html__( 'Logo centered between Navigation items', 'marni' ),
					'header2'   => esc_html__( 'Navigation below Logo', 'marni' ),
					'header3'   => esc_html__( 'Navigation in top bar', 'marni' ),
					'header4'   => esc_html__( 'Logo left - Navigation right', 'marni' ),
			  	),
			));

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'number',
				'settings'    => 'marni_menuleft',
				'label'       => esc_html__( 'Number of Menu items left of logo', 'marni' ),
				'section'     => 'header',
				'default'     => '2',
				'priority'    => 10,
				'choices'     => array(
							'min'  => 0,
							'step' => 1,
						),
				'active_callback' => array(
					array(
						'setting'  => 'marni_header_layout',
						'operator' => '==',
						'value'    => 'header1',
					),
				),
			) );

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'toggle',
				'settings'    => 'marni_topbar_searchbutton_h1',
				'label'       => esc_html__( 'Search Button in Top Bar', 'marni' ),
				'section'     => 'header',
				'default'     => true,
				'priority'    => 10,
				'active_callback' => array(
						array(
						'setting'  => 'marni_header_layout',
						'operator' => '==',
						'value'    => 'header1',
						),
				),
			) );


			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'toggle',
				'settings'    => 'marni_topbar_searchbutton_h4',
				'label'       => esc_html__( 'Search Button in Top Bar', 'marni' ),
				'section'     => 'header',
				'default'     => true,
				'priority'    => 10,
				'active_callback' => array(
						array(
						'setting'  => 'marni_header_layout',
						'operator' => '==',
						'value'    => 'header4',
						),
				),
			) );

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'toggle',
				'settings'    => 'marni_topbar_socialicons_h1',
				'label'       => esc_html__( 'Social Icons in Top Bar', 'marni' ),
				'section'     => 'header',
				'default'     => true,
				'priority'    => 10,
				'active_callback' => array(
						array(
						'setting'  => 'marni_header_layout',
						'operator' => '==',
						'value'    => 'header1',
						),
				),
			) );

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'toggle',
				'settings'    => 'marni_topbar_socialicons_h4',
				'label'       => esc_html__( 'Social Icons in Top Bar', 'marni' ),
				'section'     => 'header',
				'default'     => true,
				'priority'    => 10,
				'active_callback' => array(
						array(
						'setting'  => 'marni_header_layout',
						'operator' => '==',
						'value'    => 'header4',
						),
				),
			) );

		if ( class_exists( 'woocommerce' ) ) { 
			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'toggle',
				'settings'    => 'marni_topbar_cart_h1',
				'label'       => esc_html__( 'Cart Icon in Top Bar', 'marni' ),
				'section'     => 'header',
				'default'     => true,
				'priority'    => 10,
				'active_callback' => array(
						array(
						'setting'  => 'marni_header_layout',
						'operator' => '==',
						'value'    => 'header1',
						),
				),
			) );
		}

		if ( class_exists( 'woocommerce' ) ) { 
			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'toggle',
				'settings'    => 'marni_topbar_cart_h4',
				'label'       => esc_html__( 'Cart Icon in Top Bar', 'marni' ),
				'section'     => 'header',
				'default'     => true,
				'priority'    => 10,
				'active_callback' => array(
						array(
						'setting'  => 'marni_header_layout',
						'operator' => '==',
						'value'    => 'header4',
						),
				),
			) );
		}

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'radio',
				'settings'    => 'marni_search_position_h2',
				'label'       => esc_html__( 'Search Button', 'marni' ),
				'section'     => 'header',
				'default'     => 'topbar',
				'priority'    => 10,
				'choices'     => array(
					'none'   => esc_html__( 'No Search Button', 'marni' ),
					'topbar'   => esc_html__( 'Display In Top Bar', 'marni' ),
					'logo'   => esc_html__( 'Display Right of Logo', 'marni' ),
			  	),
				'active_callback' => array(
						array(
						'setting'  => 'marni_header_layout',
						'operator' => '==',
						'value'    => 'header2',
						),
				),		  
			));

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'radio',
				'settings'    => 'marni_search_position_h3',
				'label'       => esc_html__( 'Search Button', 'marni' ),
				'section'     => 'header',
				'default'     => 'topbar',
				'priority'    => 10,
				'choices'     => array(
					'none'   => esc_html__( 'No Search Button', 'marni' ),
					'topbar'   => esc_html__( 'Display In Top Bar', 'marni' ),
					'logo'   => esc_html__( 'Display Right of Logo', 'marni' ),
			  	),
				'active_callback' => array(
						array(
						'setting'  => 'marni_header_layout',
						'operator' => '==',
						'value'    => 'header3',
						),
				),		  
			));


			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'radio',
				'settings'    => 'marni_social_position_h2',
				'label'       => esc_html__( 'Social Icons Position', 'marni' ),
				'section'     => 'header',
				'default'     => 'topbar',
				'priority'    => 10,
				'choices'     => array(
					'none'   => esc_html__( 'No Social icons', 'marni' ),
					'topbar'   => esc_html__( 'In Top Bar', 'marni' ),
					'logoleft'   => esc_html__( 'Left of Logo', 'marni' ),
					'logoright'   => esc_html__( 'Right of Logo', 'marni' ),
			  	),
			  	'active_callback' => array(
						array(
						'setting'  => 'marni_header_layout',
						'operator' => '==',
						'value'    => 'header2',
						),
				),
			));

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'radio',
				'settings'    => 'marni_social_position_h3',
				'label'       => esc_html__( 'Social Icons Position', 'marni' ),
				'section'     => 'header',
				'default'     => 'topbar',
				'priority'    => 10,
				'choices'     => array(
					'none'   => esc_html__( 'No Social icons', 'marni' ),
					'topbar'   => esc_html__( 'In Top Bar', 'marni' ),
					'logoleft'   => esc_html__( 'Left of Logo', 'marni' ),
					'logoright'   => esc_html__( 'Right of Logo', 'marni' ),
			  	),
			  	'active_callback' => array(
						array(
						'setting'  => 'marni_header_layout',
						'operator' => '==',
						'value'    => 'header3',
						),
				),
			));

		if ( class_exists( 'woocommerce' ) ) { 
			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'radio',
				'settings'    => 'marni_cart_position_h2',
				'label'       => esc_html__( 'Cart Icon Position', 'marni' ),
				'section'     => 'header',
				'default'     => 'topbar',
				'priority'    => 10,
				'choices'     => array(
					'none'   => esc_html__( 'No Cart icon', 'marni' ),
					'topbar'   => esc_html__( 'In Top Bar', 'marni' ),
					'logoright'   => esc_html__( 'Right of Logo', 'marni' ),
			  	),
			  	'active_callback' => array(
						array(
						'setting'  => 'marni_header_layout',
						'operator' => '==',
						'value'    => 'header2',
						),
				),
			));
		}

		if ( class_exists( 'woocommerce' ) ) { 
			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'radio',
				'settings'    => 'marni_cart_position_h3',
				'label'       => esc_html__( 'Cart Icon Position', 'marni' ),
				'section'     => 'header',
				'default'     => 'topbar',
				'priority'    => 10,
				'choices'     => array(
					'none'   => esc_html__( 'No Cart icon', 'marni' ),
					'topbar'   => esc_html__( 'In Top Bar', 'marni' ),
					'logoright'   => esc_html__( 'Right of Logo', 'marni' ),
			  	),
			  	'active_callback' => array(
						array(
						'setting'  => 'marni_header_layout',
						'operator' => '==',
						'value'    => 'header3',
						),
				),
			));
		}

			Marni_Kirki::add_field( 'marni_theme_mod', array(
			  	'type'        => 'radio',
			  	'settings'    => 'marni_navi_style',
			  	'label'       => esc_html__( 'Navigation Style', 'marni' ),
			  	'section'     => 'header',
			  	'default'     => 'standard',
			  	'priority'    => 10,
			  	'choices'     => array(
				    	'standard'   => esc_html__( 'Standard', 'marni' ),
				    	'solid'   => esc_html__( 'Solid line above and below Navigation', 'marni' ),
				    	'dotted'   => esc_html__( 'Dotted line above and below Navigation', 'marni' ),
		  		),
			  	'active_callback' => array(
					array(
						'setting'  => 'marni_header_layout',
						'operator' => '==',
						'value'    => 'header2',
					),
				),
			));




	/* Add FOOTER section *********************************************************************/
	Marni_Kirki::add_section( 'footer', array(
		'title'      => esc_attr__( 'Footer', 'marni' ),
		'priority'   => 2,
		'capability' => 'edit_theme_options',
		'panel'          => 'layout',
	) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_social_footer',
			'label'       => esc_html__( 'Display social icons in footer', 'marni' ),
			'section'     => 'footer',
			'default'     => true,
			'priority'    => 3,
		) );

		/* footer logo */
		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'image',
			'settings'    => 'marni_logo_footer',
			'label'       => esc_html__( 'Display logo in footer', 'marni' ),
			'section'     => 'footer',
			'default'     => '',
			'priority'    => 4,
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'number',
			'settings'    => 'marni_logo_footer_height',
			'label'       => esc_html__( 'Footer Logo Height', 'marni' ),
			'description' => esc_html__( 'Logo height in pixels. Upload a logo 2x the entered height, to make it look sharp on Retina screens.', 'marni' ),
			'section'     => 'footer',
			'priority'    => 5,
			'default'     => 40,
			'output' => array(
					array(
						'element'  => '.footer-logo img',
						'property' => 'max-height',
						'units'    => 'px',
					)
				),
		));

		/* footer text */
		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'textarea',
			'settings'    => 'marni_footer_left',
			'label'       => esc_html__( 'Footer Text Left', 'marni' ),
			'section'     => 'footer',
			'default'     => '&copy; ' . date("Y") . ' Marni. All Rights Reserved.',
			'priority'    => 7,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'textarea',
			'settings'    => 'marni_footer_middle',
			'label'       => esc_html__( 'Footer Text Middle', 'marni' ),
			'section'     => 'footer',
			'default'     => 'Thanks for reading!',
			'priority'    => 8,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'textarea',
			'settings'    => 'marni_footer_right',
			'label'       => esc_html__( 'Footer Text Right', 'marni' ),
			'section'     => 'footer',
			'default'     => '',
			'priority'    => 9,
		));



	/* Add SIDEBAR section *********************************************************************/
	Marni_Kirki::add_section( 'sidebar', array(
		'title'      => esc_attr__( 'Sidebar', 'marni' ),
		'priority'   => 2,
		'capability' => 'edit_theme_options',
		'panel'          => 'layout',
	) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_sticky_sidebar',
			'label'       => esc_html__( 'Sticky Sidebar', 'marni' ),
			'description'	=> esc_html__('Glues your sidebars, making them permanently visible when scrolling up and down.  ', 'marni'),
			'section'     => 'sidebar',
			'default'     => true,
			'priority'    => 3,
		) );




	/* Add SLIDER section ********************************************************/
	Marni_Kirki::add_section( 'slider', array(
	  	'title'          => esc_html__( 'Slider', 'marni' ),
	  	'panel'          => 'layout',
	  	'priority'       => 3,
	));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_slider_display',
			'label'       => esc_html__( 'Display slider', 'marni' ),
			'section'     => 'slider',
			'default'     => false,
			'priority'    => 1,
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'radio',
			'settings'    => 'marni_slider_type',
			'label'       => esc_html__( 'Slider Type', 'marni' ),
			'section'     => 'slider',
			'default'     => 'carousel',
			'priority'    => 1,
			'choices'     => array(
				'carousel'   => esc_attr__( 'Carousel', 'marni' ),
				'fullwidth'   => esc_attr__( 'Full Width', 'marni' ),
				'boxed'   => esc_attr__( 'Boxed', 'marni' ),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_slider_autowidth',
			'label'       => esc_html__( 'Images Auto Width', 'marni' ),
			'section'     => 'slider',
			'default'     => false,
			'priority'    => 2,
			'active_callback' => array(
				array(
					array(
						'setting'  => 'marni_slider_type',
						'operator' => '==',
						'value'    => 'carousel',
					),
				),
			),
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'number',
			'settings'    => 'marni_slider_height',
			'label'       => esc_html__( 'Slider Height', 'marni' ),
			'section'     => 'slider',
			'priority'    => 2,
			'default'     => 540,
			'output' => array(
					array(
						'element'  => '.owl-item, .owl-carousel .owl-stage-outer',
						'property' => 'height',
						'units'    => 'px',
					)
				),
		));


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_slider_maxheight',
			'label'       => esc_html__( 'Slider Max Height', 'marni' ),
			'description' => esc_html__( 'Adjust slider max height to browser window height', 'marni' ),
			'section'     => 'slider',
			'default'     => true,
			'priority'    => 2,
		));


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_slider_dots',
			'label'       => esc_html__( 'Display dots navigation', 'marni' ),
			'section'     => 'slider',
			'default'     => false,
			'priority'    => 3,
			'output'      => array(
			        array(
			            'element'       => '.owl-dots',
			            'property'      => 'display',
			            'exclude'       => array( false ), 
			            'value_pattern' => 'flex',
			        ),
			),
		) );


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'slider',
			'settings'    => 'marni_slider_speed',
			'label'       => esc_html__( 'Slider Speed (in seconds)', 'marni' ),
			'section'     => 'slider',
			'default'     => '5',
			'priority'    => 3,
			'choices'     => array(
				'min'  => '1',
				'max'  => '10',
				'step' => '1',
			),
		));


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'radio',
			'settings'    => 'marni_slider_text_style',
			'label'       => esc_html__( 'Slider Text Overlay Style', 'marni' ),
			'section'     => 'slider',
			'default'     => 'dark',
			'priority'    => 3,
			'choices'     => array(
				'dark'   => esc_attr__( 'Dark Text in White Box', 'marni' ),
				'white'   => esc_attr__( 'White Text', 'marni' ),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_slider_category',
			'label'       => esc_html__( 'Display category', 'marni' ),
			'section'     => 'slider',
			'default'     => true,
			'priority'    => 4,
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_slider_more_button',
			'label'       => esc_html__( 'Display More Button', 'marni' ),
			'section'     => 'slider',
			'default'     => true,
			'priority'    => 5,
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_slider_date',
			'label'       => esc_html__( 'Display Date', 'marni' ),
			'section'     => 'slider',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_slider_comments',
			'label'       => esc_html__( 'Display Comments Number', 'marni' ),
			'section'     => 'slider',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_slider_author',
			'label'       => esc_html__( 'Display Author', 'marni' ),
			'section'     => 'slider',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_slider_location',
			'label'       => esc_html__( 'Display Location', 'marni' ),
			'section'     => 'slider',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_slider_views',
			'label'       => esc_html__( 'Display Number of Views', 'marni' ),
			'section'     => 'slider',
			'default'     => false,
			'priority'    => 10,
		));



	/* Add HOME LAYOUT section ******************************************************/
	Marni_Kirki::add_section( 'home_layout', array(
	  	'title'          => esc_html__( 'Home', 'marni' ),
	  	'panel'          => 'layout',
	  	'priority'       => 4,
	));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_featuredboxes_display',
			'label'       => esc_html__( 'Display Featured Boxes', 'marni' ),
			'section'     => 'home_layout',
			'default'     => true,
			'priority'    => 1,
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'radio',
			'settings'    => 'marni_home_layout',
			'label'       => esc_html__( 'Home Layout', 'marni' ),
			'section'     => 'home_layout',
			'default'     => 'standard',
			'priority'    => 10,
			'choices'     => array(
				'standard'   => esc_attr__( 'Standard Post', 'marni' ),
				'grid'   => esc_attr__( 'Grid Post', 'marni' ),
				'list'   => esc_attr__( 'List Post', 'marni' ),
				'masonry'   => esc_attr__( 'Masonry', 'marni' ),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'radio',
			'settings'    => 'marni_home_thumbnail',
			'label'       => esc_html__( 'Thumbnail Ratio', 'marni' ),
			'section'     => 'home_layout',
			'default'     => 'uncropped',
			'priority'    => 10,
			'choices'     => array(
				'uncropped'   => esc_attr__( 'Uncropped', 'marni' ),
				'square'   => esc_attr__( 'Square', 'marni' ),
				'landscape'   => esc_attr__( 'Landscape', 'marni' ),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_home_evenstyle',
			'label'       => esc_html__( 'Staggered thumbnail position', 'marni' ),
			'section'     => 'home_layout',
			'default'     => true,
			'priority'    => 10,
			'active_callback' => array(
				array(
					array(
						'setting'  => 'marni_home_layout',
						'operator' => '==',
						'value'    => 'list',
					),
				),
			),
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_home_listtextcenter',
			'label'       => esc_html__( 'Center text', 'marni' ),
			'section'     => 'home_layout',
			'default'     => false,
			'priority'    => 10,
			'active_callback' => array(
				array(
					array(
						'setting'  => 'marni_home_layout',
						'operator' => '==',
						'value'    => 'list',
					),
				),
			),

		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_home_listcenter',
			'label'       => esc_html__( 'Verticaly center content', 'marni' ),
			'section'     => 'home_layout',
			'default'     => false,
			'priority'    => 10,
			'active_callback' => array(
				array(
					array(
						'setting'  => 'marni_home_layout',
						'operator' => '==',
						'value'    => 'list',
					),
				),
			),

		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'slider',
			'settings'    => 'marni_home_listthumb',
			'label'       => esc_html__( 'Thumbnail width', 'marni' ),
			'section'     => 'home_layout',
			'default'     => '40',
			'priority'    => 10,
			'choices'     => array(
				'min'  => '30',
				'max'  => '65',
				'step' => '1',
			),
			'output' => array(
				array(
					'element'  => '.home .post-list .tnail',
					'property' => 'flex-basis',
					'units'    => '%',
				)
			),
			'active_callback' => array(
				array(
					array(
						'setting'  => 'marni_home_layout',
						'operator' => '==',
						'value'    => 'list',
					),
				),
			),
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'select',
			'settings'    => 'marni_layout_home_columns',
			'label'       => esc_html__( 'Number of Columns', 'marni' ),
			'section'     => 'home_layout',
			'default'     => 'two-items',
			'priority'    => 10,
			'choices'     => array(
				    'two-items'      => '2',
				    'three-items'    => '3',
			),
			'active_callback' => array(
				array(
					array(
					'setting'  => 'marni_home_layout',
					'operator' => '==',
					'value'    => 'grid',
					),
					array(
					'setting'  => 'marni_home_layout',
					'operator' => '==',
					'value'    => 'masonry',
					),
				),
				array(
					'setting'  => 'marni_home_sidebar',
					'operator' => '==',
					'value'    => '0',
				),
			),
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'radio',
			'settings'    => 'marni_layout_home_summary_type',
			'label'       => esc_html__( 'Post Summary Type', 'marni' ),
			'section'     => 'home_layout',
			'default'     => 'excerpt',
			'priority'    => 10,
			'choices'     => array(
				'content'   => esc_html__( 'Full', 'marni' ),
				'excerpt'   => esc_html__( 'Excerpt', 'marni' ),
				'none'   => esc_html__( 'None', 'marni' ),
				
		  	),
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'number',
			'settings'    => 'marni_excerpt_length',
			'label'       => esc_html__( 'Excerpt Length', 'marni' ),
			'description' => esc_html__( 'Number of words used for the post excerpt. Applies to home AND archives layout.', 'marni' ),
			'section'     => 'home_layout',
			'priority'    => 10,
			'default'     => 60,
			'active_callback' => array(
				array(
					array(
					'setting'  => 'marni_layout_post_summary_type',
					'operator' => '==',
					'value'    => 'excerpt',
					),
				),
			),
		));





		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_home_sidebar',
			'label'       => esc_html__( 'Sidebar', 'marni' ),
			'section'     => 'home_layout',
			'default'     => true,
			'priority'    => 10,
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_home_category',
			'label'       => esc_html__( 'Category', 'marni' ),
			'section'     => 'home_layout',
			'default'     => true,
			'priority'    => 10,
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_home_more',
			'label'       => esc_html__( ' "View Post" Button', 'marni' ),
			'section'     => 'home_layout',
			'default'     => true,
			'priority'    => 10,
		) );

		if ( function_exists( 'marni_share_buttons' ) ) {
		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_home_share',
			'label'       => esc_html__( 'Share Buttons', 'marni' ),
			'section'     => 'home_layout',
			'default'     => true,
			'priority'    => 10,
		));
		}

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_home_date',
			'label'       => esc_html__( 'Date', 'marni' ),
			'section'     => 'home_layout',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_home_comments',
			'label'       => esc_html__( 'Comments Number', 'marni' ),
			'section'     => 'home_layout',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_home_author',
			'label'       => esc_html__( 'Author', 'marni' ),
			'section'     => 'home_layout',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_home_location',
			'label'       => esc_html__( 'Location', 'marni' ),
			'section'     => 'home_layout',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_home_views',
			'label'       => esc_html__( 'Number of Views', 'marni' ),
			'section'     => 'home_layout',
			'default'     => false,
			'priority'    => 10,
		));


	/* Add ARCHIVES section ********************************************************/
	Marni_Kirki::add_section( 'archives_layout', array(
	  	'title'          => esc_html__( 'Archives', 'marni' ),
	  	'panel'          => 'layout',
	  	'description'	=> esc_html__('Archives Pages are Category Pages, Tag Pages, 
	  					Author Pages, Search Result Pages, etc. ', 'marni'),
	  	'priority'       => 5,
	));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'radio',
			'settings'    => 'marni_archives_layout',
			'label'       => esc_html__( 'Archives Layout', 'marni' ),
			'section'     => 'archives_layout',
			'default'     => 'masonry',
			'priority'    => 10,
			'choices'     => array(
				'standard'   => esc_attr__( 'Standard Post', 'marni' ),
				'grid'   => esc_attr__( 'Grid Post', 'marni' ),
				'list'   => esc_attr__( 'List Post', 'marni' ),
				'masonry'   => esc_attr__( 'Masonry', 'marni' ),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'radio',
			'settings'    => 'marni_archives_thumbnail',
			'label'       => esc_html__( 'Thumbnail Ratio', 'marni' ),
			'section'     => 'archives_layout',
			'default'     => 'uncropped',
			'priority'    => 10,
			'choices'     => array(
				'uncropped'   => esc_attr__( 'Uncropped', 'marni' ),
				'square'   => esc_attr__( 'Square', 'marni' ),
				'landscape'   => esc_attr__( 'Landscape', 'marni' ),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_archive_evenstyle',
			'label'       => esc_html__( 'Staggered thumbnail position', 'marni' ),
			'section'     => 'archives_layout',
			'default'     => true,
			'priority'    => 10,
			'active_callback' => array(
				array(
					array(
						'setting'  => 'marni_archives_layout',
						'operator' => '==',
						'value'    => 'list',
					),
				),
			),
		));


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_archive_listtextcenter',
			'label'       => esc_html__( 'Center text', 'marni' ),
			'section'     => 'archives_layout',
			'default'     => false,
			'priority'    => 10,
			'active_callback' => array(
				array(
					array(
						'setting'  => 'marni_home_layout',
						'operator' => '==',
						'value'    => 'list',
					),
				),
			),
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_archive_listcenter',
			'label'       => esc_html__( 'Verticaly center content', 'marni' ),
			'section'     => 'archives_layout',
			'default'     => false,
			'priority'    => 10,
			'active_callback' => array(
				array(
					array(
						'setting'  => 'marni_archives_layout',
						'operator' => '==',
						'value'    => 'list',
					),
				),
			),
		));



		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'slider',
			'settings'    => 'marni_archives_listthumb',
			'label'       => esc_html__( 'Thumbnail width', 'marni' ),
			'section'     => 'archives_layout',
			'default'     => '40',
			'priority'    => 10,
			'choices'     => array(
				'min'  => '30',
				'max'  => '65',
				'step' => '1',
			),
			'output' => array(
				array(
					'element'  => '.archive .post-list .tnail',
					'property' => 'flex-basis',
					'units'    => '%',
				)
			),
			'active_callback' => array(
				array(
					array(
						'setting'  => 'marni_archives_layout',
						'operator' => '==',
						'value'    => 'list',
					),
				),
			),
		));



		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'select',
			'settings'    => 'marni_layout_archives_columns',
			'label'       => esc_html__( 'Number of Columns', 'marni' ),
			'section'     => 'archives_layout',
			'default'     => 'two-items',
			'priority'    => 10,
			'choices'     => array(
				    'two-items'      => '2',
				    'three-items'    => '3',
			),
			'active_callback' => array(
				array(
					array(
					'setting'  => 'marni_archives_layout',
					'operator' => '==',
					'value'    => 'grid',
					),
					array(
					'setting'  => 'marni_archives_layout',
					'operator' => '==',
					'value'    => 'masonry',
					),
				),
				array(
					'setting'  => 'marni_archives_sidebar',
					'operator' => '==',
					'value'    => '0',
				),
			),
		));


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'radio',
			'settings'    => 'marni_layout_archives_summary_type',
			'label'       => esc_html__( 'Post Summary Type', 'marni' ),
			'section'     => 'archives_layout',
			'default'     => 'excerpt',
			'priority'    => 10,
			'choices'     => array(
				'content'   => esc_html__( 'Full', 'marni' ),
				'excerpt'   => esc_html__( 'Excerpt', 'marni' ),
				'none'   => esc_html__( 'None', 'marni' ),
				
		  	),
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_archives_sidebar',
			'label'       => esc_html__( 'Sidebar', 'marni' ),
			'section'     => 'archives_layout',
			'default'     => true,
			'priority'    => 10,
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_archives_category',
			'label'       => esc_html__( 'Category', 'marni' ),
			'section'     => 'archives_layout',
			'default'     => true,
			'priority'    => 10,
		));


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_archives_more',
			'label'       => esc_html__( ' "View Post" Button', 'marni' ),
			'section'     => 'archives_layout',
			'default'     => true,
			'priority'    => 10,
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_archives_date',
			'label'       => esc_html__( 'Date', 'marni' ),
			'section'     => 'archives_layout',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_archives_comments',
			'label'       => esc_html__( 'Comments Number', 'marni' ),
			'section'     => 'archives_layout',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_archives_author',
			'label'       => esc_html__( 'Author', 'marni' ),
			'section'     => 'archives_layout',
			'default'     => true,
			'priority'    => 10,
		));

		if ( function_exists( 'marni_share_buttons' ) ) {
		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_archives_share',
			'label'       => esc_html__( 'Show Share Buttons', 'marni' ),
			'section'     => 'archives_layout',
			'default'     => true,
			'priority'    => 10,
		));
		}


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_archives_location',
			'label'       => esc_html__( 'Location', 'marni' ),
			'section'     => 'archives_layout',
			'default'     => true,
			'priority'    => 10,
		));


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_archives_views',
			'label'       => esc_html__( 'Number of Views', 'marni' ),
			'section'     => 'archives_layout',
			'default'     => false,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'number',
			'settings'    => 'marni_categoryimageheight',
			'label'       => esc_html__( 'Category Image Height', 'marni' ),
			'description' => esc_html__( 'Set the height for the category image below the title on Category Archive pages', 'marni' ),
			'section'     => 'archives_layout',
			'priority'    => 10,
			'default'     => 360,
			'output' => array(
				array(
					'element'  => '.category-header.overlay',
					'property' => 'min-height',
					'units'    => 'px',
				)
			),
		));
			



	/* Add SINGLE POSTS LAYOUT section *********************************************************************/
	Marni_Kirki::add_section( 'single', array(
	  	'title'          => esc_html__( 'Single Posts', 'marni' ),
	  	'priority'       => 6,
	  	'panel'          => 'layout',
	));


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_single_thumb',
			'label'       => esc_html__( 'Display Thumbnail', 'marni' ),
			'section'     => 'single',
			'default'     => true,
			'priority'    => 10,
		));


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_single_category',
			'label'       => esc_html__( 'Display Category', 'marni' ),
			'section'     => 'single',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_single_date',
			'label'       => esc_html__( 'Display Date', 'marni' ),
			'section'     => 'single',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_single_comments',
			'label'       => esc_html__( 'Display Comments Number', 'marni' ),
			'section'     => 'single',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_single_author',
			'label'       => esc_html__( 'Display Author', 'marni' ),
			'section'     => 'single',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_single_location',
			'label'       => esc_html__( 'Display Location', 'marni' ),
			'section'     => 'single',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_single_views',
			'label'       => esc_html__( 'Display Number of Views', 'marni' ),
			'section'     => 'single',
			'default'     => false,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_single_tags',
			'label'       => esc_html__( 'Display Tags', 'marni' ),
			'section'     => 'single',
			'default'     => true,
			'priority'    => 10,
		));

		if ( function_exists( 'marni_share_buttons' ) ) {
		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_single_share',
			'label'       => esc_html__( 'Display Share Buttons', 'marni' ),
			'section'     => 'single',
			'default'     => true,
			'priority'    => 10,
		));
		}

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_single_recommended',
			'label'       => esc_html__( 'Display Recommended Posts', 'marni' ),
			'section'     => 'single',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'radio',
			'settings'    => 'marni_related_source',
			'label'       => esc_html__( 'Recommended Posts Source', 'marni' ),
			'section'     => 'single',
			'default'     => 'category',
			'priority'    => 10,
			'choices'     => array(
				'category'   => esc_html__( 'Categories', 'marni' ),
				'tags'   => esc_html__( 'Tags', 'marni' ),
			),
			'active_callback' => array(
					array(
					'setting'  => 'marni_single_recommended',
					'operator' => '==',
					'value'    => true,
					),
			),

		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'radio',
			'settings'    => 'marni_related_order',
			'label'       => esc_html__( 'Recommended Posts Order', 'marni' ),
			'section'     => 'single',
			'default'     => 'rand',
			'priority'    => 10,
			'choices'     => array(
				'rand'   => esc_html__( 'Random', 'marni' ),
				'date'   => esc_html__( 'Latest', 'marni' ),
			),
			'active_callback' => array(
					array(
					'setting'  => 'marni_single_recommended',
					'operator' => '==',
					'value'    => true,
					),
			),
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'slider',
			'settings'    => 'marni_single_thumbheight',
			'description'       => esc_attr__( 'Set the Featured Image height in px. Applies to "Widescreeen + Overlay Title" Featured Image only.', 'marni' ),
			'label'       => esc_html__( 'Widescreen Featured Image Height', 'marni' ),
			'section'     => 'single',
			'priority'    => 10,
			'default'     => 720,
			'choices'     => array(
				'min'  => '300',
				'max'  => '1400',
				'step' => '1',
			),
			'output' => array(
					array(
						'element'  => '.entry-header.overlay',
						'property' => 'min-height',
						'units'    => 'px',
					)
				),
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'slider',
			'settings'    => 'marni_single_contentwidth',
			'description'       => esc_attr__( 'Set the Content width in px. Applies to "Fullwidth Page Narrow" layout only.', 'marni' ),			
			'label'       => esc_html__( 'Content Width (Fullwidth Page Narrow)', 'marni' ),
			'section'     => 'single',
			'default'     => '1056',
			'priority'    => 10,
			'choices'     => array(
				'min'  => '600',
				'max'  => '1248',
				'step' => '1',
			),
			'output' => array(
				array(
					'element'  => '.single .site-content.fullwidth-narrow',
					'property' => 'max-width',
					'units'    => 'px',
				)
			),
		));


/* Add TYPOGRAPHY panel *********************************************************************/
Marni_Kirki::add_panel( 'typography', array(
  	'title'          => esc_html__( 'Typography', 'marni' ),
  	'priority'       => 3,
));

	/* Add BASE FONT section ********************************************************/
	Marni_Kirki::add_section( 'typography_base', array(
	  	'title'          => esc_html__( 'Base Font', 'marni' ),
	  	'panel'          => 'typography',
	  	'priority'       => 1,
	));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_bodytext',
			'label'       => esc_attr__( 'Base Font', 'marni' ),
			'description'       => esc_attr__( 'Set the font size in px. Default size: 16px.
PLEASE NOTE: Changing the base font will also affect most other text elements.
Please read the documentation on how to make changes to the typography (documentation > Theme Features > Theme Customizer > Typography).', 'marni' ),

			'section'     => 'typography_base',
			'default'     => array(
				'font-family'    => 'Lato',
				'variant'        => '300',
				'font-size'      => '16px',
				'line-height'    => '1.75em',
				'letter-spacing' => '0',
				'subsets'        => array( 'latin-ext' ),
			),
			'priority'    => 10,
			'output'      => [
				[
					'element'   => array( 'body', 'p', 'ul', 'ol', 'input', '.search-field', 'select', 'textarea', 'cite.fn', 
							      '.footer-info-wrap', '.widget_recent_comments .comment-author-link', 
							      '.widget_recent_comments .recentcomments a'  ),
				],
				[
					'element' => '.edit-post-visual-editor.editor-styles-wrapper, .edit-post-visual-editor.editor-styles-wrapper .wp-block-cover__inner-container p, cite',
					'context' => [ 'editor' ],
				],
			],
		) );


	/* Add HEADLINES FONT section ********************************************************/
	Marni_Kirki::add_section( 'typography_headlines', array(
	  	'title'          => esc_html__( 'Headings', 'marni' ),
	  	'panel'          => 'typography',
	  	'priority'       => 1,
	));


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_headings',
			'label'       => esc_attr__( 'Headings', 'marni' ),
			'section'     => 'typography_headlines',
			'default'     => array(
				'font-family'    => 'Playfair Display',
				'variant'        => 'regular',
				'letter-spacing' => '0',
				'text-transform' => 'none',
				'subsets'        => array( 'latin-ext' ),
			),
			'priority'    => 10,
			'output'      => [
				[
					'element'   => array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.post-title-small', '.dropcap', '.has-drop-cap:not(:focus)::first-letter', '.content-box-wysiwyg.heading', '.wp-block-cover-image-text' ),
				],
				[
					'element' => '.edit-post-visual-editor.editor-styles-wrapper h1,
					.edit-post-visual-editor.editor-styles-wrapper h2,
					.edit-post-visual-editor.editor-styles-wrapper h3,
					.edit-post-visual-editor.editor-styles-wrapper h4,
					.edit-post-visual-editor.editor-styles-wrapper h5,
					.edit-post-visual-editor.editor-styles-wrapper h6,
					.edit-post-visual-editor.editor-styles-wrapper .dropcap,
					.edit-post-visual-editor.editor-styles-wrapper .wp-block-cover-image-text,
					.editor-post-title__block .editor-post-title__input',
					'context' => [ 'editor' ],
				],
			],
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_site_title_size',
			'label'       => esc_attr__( 'Page Title', 'marni' ),
			'section'     => 'typography_headlines',
			'default'     => array(
				'font-size'      => '3.125em',
				'line-height'    => '1.1em',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( '.page-title' ),
				),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_cat_page_title_font',
			'label'       => esc_attr__( 'Category and Archives Page Title', 'marni' ),
			'section'     => 'typography_headlines',
			'default'     => array(
				'font-family'    => 'Lato',
				'variant'        => '700',
				'font-size'      => '3.125em',
				'line-height'    => '1.1em',
				'letter-spacing' => '24px',
				'text-transform' => 'uppercase',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( '.archive-page-title' ),
				),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_posttitle_size',
			'label'       => esc_attr__( 'Post Title', 'marni' ),
			'section'     => 'typography_headlines',
			'default'     => array(
				'font-size'      => '1.618em',
				'line-height'    => '1.3em',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( '.entry-title' ),
				),
			),
		) );


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_single_entry_title_size',
			'label'       => esc_attr__( 'Single Post Title', 'marni' ),
			'section'     => 'typography_headlines',
			'default'     => array(
				'font-size'      => '2.618em',
				'line-height'    => '1.2em',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( '.single .entry-title' ),
				),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_small_title_size',
			'label'       => esc_attr__( 'Small Post Title', 'marni' ),
			'description' => esc_attr__( 'e.g. Post Title in Widgets, Related Posts etc.', 'marni' ),
			'section'     => 'typography_headlines',
			'default'     => array(
				'font-size'      => '1.1em',
				'line-height'    => '1.4em',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( '.post-title-small', '.wpp-post-title ' ),
				),
			),
		) );


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_heading_one',
			'label'       => esc_attr__( 'Post Content Heading 1', 'marni' ),
			'section'     => 'typography_headlines',
			'default'     => array(
				'font-size'      => '3.125em',
				'line-height'    => '1.1em',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( 'h1' ),
				),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_heading_two',
			'label'       => esc_attr__( 'Post Content Heading 2', 'marni' ),
			'section'     => 'typography_headlines',
			'default'     => array(
				'font-size'      => '2.618em',
				'line-height'    => '1.2em',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( 'h2' ),
				),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_heading_three',
			'label'       => esc_attr__( 'Post Content Heading 3', 'marni' ),
			'section'     => 'typography_headlines',
			'default'     => array(
				'font-size'      => '1.931em',
				'line-height'    => '1.2em',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( 'h3' ),
				),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_heading_four',
			'label'       => esc_attr__( 'Post Content Heading 4', 'marni' ),
			'section'     => 'typography_headlines',
			'default'     => array(
				'font-size'      => '1.618em',
				'line-height'    => '1.75em',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( 'h4' ),
				),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_heading_five',
			'label'       => esc_attr__( 'Post Content Heading 5', 'marni' ),
			'section'     => 'typography_headlines',
			'default'     => array(
				'font-size'      => '1.194em',
				'line-height'    => '1.75em',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( 'h5' ),
				),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_heading_six',
			'label'       => esc_attr__( 'Post Content Heading 6', 'marni' ),
			'section'     => 'typography_headlines',
			'default'     => array(
				'font-size'      => '1em',
				'line-height'    => '1.75em',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( 'h6' ),
				),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_section_title_size',
			'label'       => esc_attr__( 'Section and Widget Title', 'marni' ),
			'description' => esc_attr__( 'Titles for Widgets in all Sidebars, and Titles of Sections such as Comments, Related Posts etc.', 'marni' ),
			'section'     => 'typography_headlines',
			'default'     => array(
				'font-family'    => 'Lato',
				'variant'        => 'regular',
				'font-size'      => '0.6em',
				'line-height'    => '1em',
				'letter-spacing' => '4px',
				'text-transform' => 'uppercase'

			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( '.widget-title', '#reply-title', '.comments-title', '.section-title ' ),
				),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_section_title_border',
			'label'       => esc_html__( 'Add top/bottom border to Section and Widget Title', 'marni' ),
			'section'     => 'typography_headlines',
			'default'     => true,
			'priority'    => 10,
			'output'      => array(
			        array(
			            'element'       => array( 	'.single-comment',
								'.widget-title:before', '.widget-title:after',
								'#reply-title:before', '#reply-title:after',
								'.comments-title:before', '.comments-title:after',
								'.section-title:before', '.section-title:after' ),
			            'property'      => 'border-top',
			            'exclude'       => array( true ),
			            'value_pattern' => 'none',
			        ),

	    		),
		) );



	/* Add POST META section ********************************************************/
	Marni_Kirki::add_section( 'typography_postmeta', array(
	  	'title'          => esc_html__( 'Post Meta', 'marni' ),
	  	'panel'          => 'typography',
	  	'priority'       => 1,
	));


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_meta_font',
			'label'       => esc_attr__( 'Post Meta', 'marni' ),
			'description' => esc_attr__( 'categories / author / location / date ...', 'marni' ),
			'section'     => 'typography_postmeta',
			'default'     => array(
				'font-family'    => 'Lato',
				'variant'        => '400',
				'text-transform' => 'uppercase',
				'letter-spacing' => '2px',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( '.entry-meta, .post-info, .post-info-small .post-info a, .categories a' ),
				),
			),
		) );


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_prettydate_font',
			'label'       => esc_attr__( 'Standard Post Date / Popular Post Counter Number', 'marni' ),
			'section'     => 'typography_postmeta',
			'default'     => array(
				'font-family'    => 'Lato',
				'variant'        => '700',
				'text-transform' => 'uppercase',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( '.post-date.pretty-date, .popular-post-thumb-small::before, .popular-post-thumb-small::before, li.show-counter .popular-post-text::before' ),
				),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_smallitalic_font',
			'label'       => esc_attr__( 'Small Text', 'marni' ),
			'description' => esc_attr__( 'by / with / on etc.', 'marni' ),
			'section'     => 'typography_postmeta',
			'default'     => array(
				'font-family'    => 'Merriweather',
				'variant'        => '400italic',
				'font-size'      => '1em',
				'letter-spacing' => '1px',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( '.post-info .serif-italic' ),
				),
			),
		) );


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_tags_font',
			'label'       => esc_attr__( 'Post Tags', 'marni' ),
			'section'     => 'typography_postmeta',
			'default'     => array(
				'font-family'    => 'Lato',
				'variant'        => '300italic',
				'font-size'      => '11px',
				'line-height' 	 => '19px',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( '.post-tag' ),
				),
			),
		) );

	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'multicolor',
		'settings'    => 'marni_tag_colors',
		'label'       => esc_html__( 'Post Tag Color', 'marni' ),
		'section'     => 'typography_postmeta',
		'priority'    => 10,
		'choices'     => array(
			'background'  => esc_html__( 'Background', 'marni' ),
			'text'    	=> esc_html__( 'Text', 'marni' ),
	  	),
		'default'     => array(
			'background'   	=> '#101020',
			'text'     	=> '#ffffff',
		),
		'output'    => array(
			array(
				'choice'    => 'background',
				'element'   => '.post-tag',
				'property'  => 'background-color',
			),		
			array(
				'choice'    => 'text',
				'element'   => '.post-tag .post-tag-hashtag, .post-tags a, .post-tags a:link, .post-tags a:active, .post-tags a:focus, .post-tags a:visited',
				'property'  => 'color',
			),
	  	),
	));



	/* Add HEADER FOOTER section ********************************************************/
	Marni_Kirki::add_section( 'typography_headerfooter', array(
	  	'title'          => esc_html__( 'Header / Footer', 'marni' ),
	  	'panel'          => 'typography',
	  	'priority'       => 1,
	));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_navigation_font',
			'label'       => esc_attr__( 'Navigation Menu', 'marni' ),
			'section'     => 'typography_headerfooter',
			'default'     => array(
				'font-family'    => 'Lato',
				'variant'        => 'regular',
				'font-size'      => '0.7em',
				'letter-spacing' => '2px',
				'text-transform' => 'uppercase',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( '.main-navigation ul li a' ),
				),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_socilalfooter_font',
			'label'       => esc_attr__( 'Social Icons Text in Footer', 'marni' ),
			'section'     => 'typography_headerfooter',
			'default'     => array(
				'font-family'    => 'Lato',
				'variant'        => '300',
				'font-size'      => '0.6em',
				'letter-spacing' => '1px',
				'text-transform' => 'uppercase',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( 'footer .social-footer a' ),
				),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_footer_font',
			'label'       => esc_attr__( 'Footer', 'marni' ),
			'section'     => 'typography_headerfooter',
			'default'     => array(
				'font-size'      => '0.7em',
				'letter-spacing' => '2px',
				'text-transform' => 'uppercase',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( '.footer-info-wrap' ),
				),
			),
		) );




	/* Add ELEMENTS section ********************************************************/
	Marni_Kirki::add_section( 'typography_elements', array(
	  	'title'          => esc_html__( 'Other Elements', 'marni' ),
	  	'panel'          => 'typography',
	  	'priority'       => 1,
	));



		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_buttons_font',
			'label'       => esc_attr__( 'Buttons', 'marni' ),
			'section'     => 'typography_elements',
			'default'     => array(
				'font-family'    => 'Lato',
				'letter-spacing' => '2px',
				'text-transform' => 'uppercase',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( 	'button', '.button', '.button-outline', 
								'input[type="button"]', 'input[type="reset"]', 'input[type="submit"]', '.wc-proceed-to-checkout, .woocommerce-cart a.wc-block-components-button' ),
				),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_caption_font',
			'label'       => esc_attr__( 'Image Caption', 'marni' ),
			'section'     => 'typography_elements',
			'default'     => array(
				'font-family'    => 'Lato',
				'variant'        => '300',
				'font-size'      => '0.7em',
				'letter-spacing' => '1px',
				'text-transform' => 'uppercase',
			),
			'priority'    => 10,
			'output'      => [
				[
					'element'   => array( '.wp-caption-text, .wp-block-image figcaption, .wp-block-audio figcaption, .wp-block-video figcaption' ),
				],
				[
					'element' => '.edit-post-visual-editor.editor-styles-wrapper .wp-caption-text, .edit-post-visual-editor.editor-styles-wrapper .wp-block-image figcaption, 
						.edit-post-visual-editor.editor-styles-wrapper .wp-block-audio figcaption, 
						.edit-post-visual-editor.editor-styles-wrapper .wp-block-video figcaption, 
						.edit-post-visual-editor.editor-styles-wrapper cite',
					'context' => [ 'editor' ],
				],
			],
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_form_font',
			'label'       => esc_attr__( 'Form Label', 'marni' ),
			'description' => esc_attr__( 'comment form, contact form, ...', 'marni' ),
			'section'     => 'typography_elements',
			'default'     => array(
				'font-size'      => '0.7em',
				'letter-spacing' => '2px',
				'text-transform' => 'uppercase',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( 'label' ),
				),
			),
		) );



	/* Add SHOP TYPOGRAPHY section *********************************************************************/
	Marni_Kirki::add_section( 'shoptypography', array(
		'title'      => esc_attr__( 'Shop Typography', 'marni' ),
		'panel'      => 'typography',
		'priority'   => 99,
	) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_shop_page_title_font',
			'label'       => esc_attr__( 'Shop Page Title', 'marni' ),
			'section'     => 'shoptypography',
			'default'     => array(
				'font-family'    => 'Lato',
				'variant'        => '300',
				'font-size'      => '36px',
				'letter-spacing' => '2px',
				'text-transform' => 'uppercase',
				'text-align'     => 'center'
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( '.woocommerce h1.page-title', '.woocommerce-cart h1.page-title', '.woocommerce-checkout h1.page-title' ),
				),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_shop_headline_font',
			'label'       => esc_attr__( 'Shop Products Font', 'marni' ),
			'section'     => 'shoptypography',
			'default'     => array(
				'font-family'    => 'Lato',
				'variant'        => '300',
				'letter-spacing' => '2px',
				'text-transform' => 'uppercase',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( 	'.woocommerce .product h3', '.woocommerce .product h2.woocommerce-loop-product__title', '.woocommerce h2.woocommerce-loop-category__title',
								'.woocommerce .widget .product-title', '.woocommerce .widget_shopping_cart .mini_cart_item a',
								'.woocommerce .entry-summary h1.product_title',
								'.woocommerce-cart td.product-name a', '.wc-block-components-product-name' ),
				),
			),
		) );



		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_shop_product_overview_font',
			'label'       => esc_attr__( 'Product Overview Title', 'marni' ),
			'section'     => 'shoptypography',
			'default'     => array(
				'font-size'      => '13px',
				'line-height'    => '1.9em',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( '.woocommerce .product h3', '.woocommerce .product h2.woocommerce-loop-product__title', '.woocommerce h2.woocommerce-loop-category__title' ),
				),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_shop_single_product_font',
			'label'       => esc_attr__( 'Single Product Title', 'marni' ),
			'section'     => 'shoptypography',
			'default'     => array(
				'font-size'      => '2em',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element'   => array( '.woocommerce .entry-summary h1.product_title' ),
				),
			),
		) );


	/* Add RESPONSIVE Typography section *********************************************************************/
	Marni_Kirki::add_section( 'responsive_typography', array(
		'title'      => esc_attr__( 'Responsive Typography', 'marni' ),
		'panel'      => 'typography',
		'description'      => 'Typography for small screens with 767px screen width and below.<br><br> You can use px or em. For example enter 18px or 2.5em. <br> <br> More info in the documentation under Theme Features > Theme Customizer > Typography). <br>',
		'priority'   => 99,
	) );


		// TEXT LOGO
		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'custom',
			'settings'    => 'marni_text_logo_responsive',
			'section'     => 'responsive_typography',
			'default'     => '<div class="customizer-larger-header">' . esc_html__( 'Text Logo', 'marni' ) . '</div>',
			'priority'    => 1,
		) );

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_text_logo_size_responsive',
				'label'       => esc_attr__( 'Font Size', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 1,
				'default'     => '1.6em',
				'output'      => array(
					array(
						'element'   => array( '.text-logo .site-title, .text-logo .site-title a' ),
						'property'      => 'font-size',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_text_logo_lineheight_responsive',
				'label'       => esc_attr__( 'Line Height', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 1,
				'default'     => '',
				'output'      => array(
					array(
						'element'   => array( '.text-logo .site-title, .text-logo .site-title a' ),
						'property'      => 'line-height',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );


			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_text_logo_letterspacing_responsive',
				'label'       => esc_attr__( 'Letter Spacing', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 1,
				'default'     => '',
				'output'      => array(
					array(
						'element'   => array( '.text-logo .site-title, .text-logo .site-title a' ),
						'property'      => 'letter-spacing',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );



		// PAGE TITLE
		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'custom',
			'settings'    => 'marni_site_title_responsive',
			'section'     => 'responsive_typography',
			'default'     => '<div class="customizer-larger-header">' . esc_html__( 'Page Title', 'marni' ) . '</div>',
			'priority'    => 2,
		) );


			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_site_title_size_responsive',
				'label'       => esc_attr__( 'Font Size', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 2,
				'output'      => array(
					array(
						'element'   => array( '.page-title' ),
						'property'      => 'font-size',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_site_title_lineheight_responsive',
				'label'       => esc_attr__( 'Line Height', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 2,
				'output'      => array(
					array(
						'element'   => array( '.page-title' ),
						'property'      => 'line-height',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );


		// CATEGORY AND ARCHIVES PAGE TITLE
		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'custom',
			'settings'    => 'marni_site_title_responsive2',
			'section'     => 'responsive_typography',
			'default'     => '<div class="customizer-larger-header">' . esc_html__( 'Category and Archives Page Title', 'marni' ) . '</div>',
			'priority'    => 3,
		) );

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_archive_title_size_responsive',
				'label'       => esc_attr__( 'Font Size', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 3,
				'default'     => '2.618em',
				'output'      => array(
					array(
						'element'   => array( '.archive-page-title' ),
						'property'      => 'font-size',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_archive_title_lineheight_responsive',
				'label'       => esc_attr__( 'Line Height', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 3,
				'default'     => '1.3em',
				'output'      => array(
					array(
						'element'   => array( '.archive-page-title' ),
						'property'      => 'line-height',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );


			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_archive_title_letterspacing_responsive',
				'label'       => esc_attr__( 'Letter Spacing', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 3,
				'default'     => '8px',
				'output'      => array(
					array(
						'element'   => array( '.archive-page-title' ),
						'property'      => 'letter-spacing',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );


		// POST TITLE
		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'custom',
			'settings'    => 'marni_post_title_responsive',
			'section'     => 'responsive_typography',
			'default'     => '<div class="customizer-larger-header">' . esc_html__( 'Post Title', 'marni' ) . '</div>',
			'priority'    => 4,
		) );


			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_post_title_size_responsive',
				'label'       => esc_attr__( 'Font Size', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 4,
				'output'      => array(
					array(
						'element'   => array( '.entry-title' ),
						'property'      => 'font-size',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_post_title_lineheight_responsive',
				'label'       => esc_attr__( 'Line Height', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 4,
				'output'      => array(
					array(
						'element'   => array( '.entry-title' ),
						'property'      => 'line-height',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );


		// SINGLE POST TITLE
		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'custom',
			'settings'    => 'marni_singlepost_title_responsive',
			'section'     => 'responsive_typography',
			'default'     => '<div class="customizer-larger-header">' . esc_html__( 'Single Post Title', 'marni' ) . '</div>',
			'priority'    => 5,
		) );


			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_singlepost_title_size_responsive',
				'label'       => esc_attr__( 'Font Size', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 5,
				'output'      => array(
					array(
						'element'   => array( '.single .entry-title' ),
						'property'      => 'font-size',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_singlepost_title_lineheight_responsive',
				'label'       => esc_attr__( 'Line Height', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 5,
				'output'      => array(
					array(
						'element'   => array( '.single .entry-title' ),
						'property'      => 'line-height',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );


		// SMALL POST TITLE
		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'custom',
			'settings'    => 'marni_smallepost_title_responsive',
			'section'     => 'responsive_typography',
			'default'     => '<div class="customizer-larger-header">' . esc_html__( 'Small Post Title', 'marni' ) . '</div>',
			'priority'    => 6,
		) );


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'custom',
			'settings'    => 'marni_smallepost_title_responsive2',
			'section'     => 'responsive_typography',
			'default'     => '<div>' . esc_html__( 'e.g. Post Title in Widgets, Related Posts etc.', 'marni' ) . '</div>',
			'priority'    => 6,
		) );

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_smallepost_title_size_responsive',
				'label'       => esc_attr__( 'Font Size', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 6,
				'output'      => array(
					array(
						'element'   => array( '.post-title-small', '.wpp-post-title' ),
						'property'      => 'font-size',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_smallepost_title_lineheight_responsive',
				'label'       => esc_attr__( 'Line Height', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 6,
				'output'      => array(
					array(
						'element'   => array( '.post-title-small', '.wpp-post-title' ),
						'property'      => 'line-height',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );






		// SHOP TYPOGRAPHY RESPONSIVE	
		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'custom',
			'settings'    => 'marni_shop_typography_responsive',
			'section'     => 'responsive_typography',
			'default'     => '<div class="customizer-xlarge-header">' . esc_html__( 'Shop', 'marni' ) . '</div>',
			'priority'    => 7,
		) );



		// SHOP PAGE TITLE
		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'custom',
			'settings'    => 'marni_shop_page_title_font_responsive',
			'section'     => 'responsive_typography',
			'default'     => '<div class="customizer-larger-header">' . esc_html__( 'Shop Page Title', 'marni' ) . '</div>',
			'priority'    => 7,
		) );


			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_shop_page_title_font_size_responsive',
				'label'       => esc_attr__( 'Font Size', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 7,
				'output'      => array(
					array(
						'element'   => array( '.woocommerce h1.page-title', '.woocommerce-cart h1.page-title', '.woocommerce-checkout h1.page-title' ),
						'property'      => 'font-size',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_shop_product_page_title_lineheight_responsive',
				'label'       => esc_attr__( 'Line Height', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 7,
				'output'      => array(
					array(
						'element'   => array( '.woocommerce h1.page-title', '.woocommerce-cart h1.page-title', '.woocommerce-checkout h1.page-title' ),
						'property'      => 'line-height',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );



		// SHOP PRODUCT OVERVIEW TITLE
		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'custom',
			'settings'    => 'marni_shop_product_overview_font_responsive',
			'section'     => 'responsive_typography',
			'default'     => '<div class="customizer-larger-header">' . esc_html__( 'Shop Product Overview Title', 'marni' ) . '</div>',
			'priority'    => 8,
		) );


			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_shop_product_overview_font_size_responsive',
				'label'       => esc_attr__( 'Font Size', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 8,
				'output'      => array(
					array(
						'element'   => array( '.woocommerce .product h3', '.woocommerce .product h2.woocommerce-loop-product__title', '.woocommerce h2.woocommerce-loop-category__title' ),
						'property'      => 'font-size',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_shop_product_overview_font_lineheight_responsive',
				'label'       => esc_attr__( 'Line Height', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 8,
				'output'      => array(
					array(
						'element'   => array( '.woocommerce .product h3', '.woocommerce .product h2.woocommerce-loop-product__title', '.woocommerce h2.woocommerce-loop-category__title' ),
						'property'      => 'line-height',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );


		// SHOP SINLGE PRODUCT TITLE
		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'custom',
			'settings'    => 'marni_shop_single_product_font_responsive',
			'section'     => 'responsive_typography',
			'default'     => '<div class="customizer-larger-header">' . esc_html__( 'Shop Single Product Title', 'marni' ) . '</div>',
			'priority'    => 9,
		) );


			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_shop_single_product_font_size_responsive',
				'label'       => esc_attr__( 'Font Size', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 9,
				'output'      => array(
					array(
						'element'   => array( '.woocommerce .entry-summary h1.product_title' ),
						'property'      => 'font-size',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'dimension',
				'settings'    => 'marni_shop_single_product_font_lineheight_responsive',
				'label'       => esc_attr__( 'Line Height', 'marni' ),
				'section'     => 'responsive_typography',
				'priority'    => 9,
				'output'      => array(
					array(
						'element'   => array( '.woocommerce .entry-summary h1.product_title' ),
						'property'      => 'line-height',
						'media_query'	=>  '@media (max-width: 767px)',
					),
				),
			) );

			Marni_Kirki::add_field( 'marni_theme_mod', array(
				'type'        => 'typography',
				'settings'    => 'marni_shop_headline_font',
				'label'       => esc_attr__( 'Shop Product Title Font', 'marni' ),
				'section'     => 'shoptypography',
				'default'     => array(
					'font-family'    => 'Lato',
					'variant'        => '300',
					'letter-spacing' => '2px',
					'text-transform' => 'uppercase',
				),
				'priority'    => 9,
				'output'      => array(
					array(
						'element'   => array( 	'.woocommerce .product h3', '.woocommerce .product h2.woocommerce-loop-product__title', '.woocommerce h2.woocommerce-loop-category__title',
									'.woocommerce .widget .product-title', '.woocommerce .widget_shopping_cart .mini_cart_item a',
									'.woocommerce .entry-summary h1.product_title',
									'.woocommerce-cart td.product-name a' ),
					),
				),
			) );









	/* Add FONT LOADING section *********************************************************************/
	Marni_Kirki::add_section( 'fontloading', array(
		'title'      => esc_attr__( 'Font Loading', 'marni' ),
		'panel'      => 'typography',
		'priority'   => 99,
	) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'radio',
			'settings'    => 'marni_font_loading_method',
			'description'       => esc_attr__( 'Async Method: Flash of unstyled text but better pagespeed results. Link Method: No flash of unstyled text but decreases page speed. 
				', 'marni' ),

			'label'       => esc_html__( 'Font Loading Method', 'marni' ),
			'section'     => 'fontloading',
			'default'     => 'link',
			'priority'    => 10,
			'choices'     => array(
				'async'   => esc_html__( 'Async Method', 'marni' ),
				'link'   => esc_html__( 'Link Method', 'marni' ),
			),
		));





/** COLORS section *************************************************************************/

$theme_color            = '#ffb5b5';

$base_color          	= '#3a3a3b';
$dark_bg_color          = '#101020';
$hover_color            = '#a9a9ac';

$button_color        	= '#242434';
$headlines_color        = '#101020';

$post_link_color        = '#ffb5b5';
$post_link_hover_color  = '#a9a9ac';



	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'color',
		'settings'    => 'marni_base_color',
		'label'       => esc_html__( 'Base Text Color', 'marni' ),
		'section'     => 'colors',
		'default'     => $base_color,
		'priority'    => 10,
		'choices'     => array(
			'alpha' => false,
		),
		'output'      => array(
		        array(
		            'element'       => array( '	body, p, input, select, textarea, .dropcap, 
		            				.main-navigation ul li a, .main-navigation ul li a:link, .main-navigation ul li a:focus, .main-navigation ul li a:active,
		            				.woocommerce-cart .entry-content .woocommerce-cart-form .cart_item a, .woocommerce .price,
		            				.entry-meta-single a, .entry-meta-single a:link, .entry-meta-single a:active, .entry-meta-single a:visited ' ),
		            'property'      => 'color',
		        ),
    		),
	) );

	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'multicolor',
		'settings'    => 'marni_post_link_colors',
		'label'       => esc_html__( 'Link Color', 'marni' ),
		'description' => esc_html__( 'Applies to posts, pages and text widget links.', 'marni' ),
		'section'     => 'colors',
		'priority'    => 10,
		'choices'     => array(
			'link'    => esc_html__( 'Link', 'marni' ),
			'hover'   => esc_html__( 'Link Hover', 'marni' ),
	  	),
		'default'     => array(
			'link'     => $post_link_color,
			'hover'     => $post_link_hover_color,
		),
		'output'    => array(
			array(
				'choice'    => 'link',
				'element'   => array( '.entry-content a:not(.button):not(.wp-block-button__link)', '.comment-text a', '.textwidget a' ),
				'property'  => 'color',
			),
			array(
				'choice'    => 'hover',
				'element'   => array( '.entry-content a:not(.button):hover:not(.wp-block-button__link):hover', '.widget-area a:hover', '.comment-text a:hover, .blog .post-share i:hover, .post-share a i:hover, .social_widget a i:hover' ),
				'property'  => 'color',
			),
			array(
				'choice'    => 'hover',
				'element'   => array( '.post-tag:hover' ),
				'property'  => 'background-color',
			),
	  	),
	));



	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'toggle',
		'settings'    => 'marni_theme_mod',
		'label'       => esc_html__( 'Link Underline', 'marni' ),
		'description' => esc_html__( 'Add a bottom border to links. Applies to posts, pages and text widget links.', 'marni' ),
		'section'     => 'colors',
		'default'     => true,
		'priority'    => 10,
		'output'      => array(
		        array(
		            'element'       => array( '.entry-content a:not(.wp-block-button__link)', '.entry-content a', '.entry-content a:link:not(.wp-block-button__link)', '.entry-content a:focus', '.entry-content a:active', '.textwidget a', '.comment-text a' ),
		            'property'      => 'border-bottom',
		            'exclude'       => array( false ),
		            'value_pattern' => '1px solid #101020',
		        ),
    		),

	));



	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'multicolor',
		'settings'    => 'marni_headline_colors',
		'label'       => esc_html__( 'Headlines Color', 'marni' ),
		'section'     => 'colors',
		'priority'    => 10,
		'choices'     => array(
			'headlines'    	=> esc_html__( 'Headlines', 'marni' ),
			'hover'   	=> esc_html__( 'Headlines Hover', 'marni' ),
	  	),
		'default'     => array(
			'headlines'     => $headlines_color,
			'hover'     	=> $theme_color,
		),
		'output'    => array(
			array(
				'choice'    => 'headlines',
				'element'   => array( '	h1, h2, h3, h4, h5, h6,
							h1 a, h2 a, h3 a, h4 a, h5 a, h6 a,
							h1 a:link, h2 a:link, h3 a:link, h4 a:link, h5 a:link, h6 a:link,
							.site-title a, .site-title a:link, .site-title a:focus, .site-titlea:active, .site-title a:hover,
							h1 a:visited, h2 a:visited, h3 a:visited, h4 a:visited, h5 a:visited, h6 a:visited,
							.post-title-small, .post-title-small a,
							.single .entry-title, .post-title-small', '.wpp-post-title', '.entry-content a:not(.button):not(.wp-block-button__link).wc-block-components-product-name' ),
				'property'  => 'color',
			),
			array(
				'choice'    => 'hover',
				'element'   => array( '	h1 a:hover, h2 a:hover, h3 a:hover, h4 a:hover, h5 a:hover, h6 a:hover,
							.site-title a:hover, .post-title-small:hover, .post-title-small a:hover' ),
				'property'  => 'color',
			),
	  	),
	));



	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'multicolor',
		'settings'    => 'marni_buttons_colors',
		'label'       => esc_html__( 'Regular Buttons Color', 'marni' ),
		'section'     => 'colors',
		'priority'    => 10,
		'choices'     => array(
			'buttons'    	=> esc_html__( 'Regular Buttons Background Color', 'marni' ),
			'hover'   	=> esc_html__( 'Regular Buttons Hover Color', 'marni' ),
	  	),
		'default'     => array(
			'buttons'     	=> $button_color,
			'hover'     	=> $hover_color,
		),
		'output'    => array(
			array(
				'choice'    => 'buttons',
				'element'   => array( '	.button:not(.button-outline), a.button:not(.button-outline), .reply, .reply-button a,
							input[type="button"], input[type="reset"], input[type="submit"], .wc-proceed-to-checkout, .woocommerce-cart a.wc-block-components-button' ),
				'property'  => 'background-color',
			),	
			array(
				'choice'    => 'buttons',
				'element'   => array( '	.button:not(.button-outline), a.button:not(.button-outline), .reply, .reply-button a,
							input[type="button"], input[type="reset"], input[type="submit"], .wc-proceed-to-checkout, .woocommerce-cart a.wc-block-components-button' ),
				'property'  => 'border-color',
			),
			array(
				'choice'    => 'hover',
				'element'   => array( '	.button:hover, a.button:hover, .reply:hover, .reply-button a:hover,
							input[type="button"]:hover, input[type="reset"]:hover, input[type="submit"]:hover, .wc-proceed-to-checkout:hover' ),
				'property'  => 'background-color',
			),
			array(
				'choice'    => 'hover',
				'element'   => array( '	.button:hover, a.button:hover, .reply:hover, .reply-button a:hover,
							input[type="button"]:hover, input[type="reset"]:hover, input[type="submit"]:hover, .wc-proceed-to-checkout:hover' ),
				'property'  => 'border-color',
			),			
	  	),
	));

	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'multicolor',
		'settings'    => 'marni_buttons_outline_colors',
		'label'       => esc_html__( 'Outline Buttons Color', 'marni' ),
		'section'     => 'colors',
		'priority'    => 10,
		'choices'     => array(
			'text'    	=> esc_html__( 'Outline Buttons Text Color', 'marni' ),
			'border'   	=> esc_html__( 'Outline Buttons Border Color', 'marni' ),
	  	),
		'default'     => array(
			'text'     	=> $button_color,
			'border'     	=> '#aaaaaa',
		),
		'output'    => array(
			array(
				'choice'    => 'text',
				'element'   => array('.button-outline:hover', 'a.button.button-outline:hover', '.button-more.button-outline:hover' ),
				'property'  => 'background-color',
			),
			array(
				'choice'    => 'text',
				'element'   => array( '.button-outline', 'a.button.button-outline', '.button-more.button-outline' ),
				'property'  => 'color',
			),
			array(
				'choice'    => 'text',
		            	'element'       => array( '.button-outline:hover', 'a.button.button-outline:hover', '.button-more.button-outline:hover' ),
		            	'property'      => 'border-color',
		        ),
		        array(
				'choice'    => 'border',
		            	'element'       => array( '.button-outline','a.button.button-outline', '.button-more.button-outline' ),
		            	'property'      => 'border-color',
		        ),
	  	),
	));



	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'multicolor',
		'settings'    => 'marni_entrymeta_color',
		'label'       => esc_html__( 'Entry Meta Color', 'marni' ),
		'section'     => 'colors',
		'priority'    => 10,
		'choices'     => array(
			'background'    => esc_html__( 'Entry Meta Background ', 'marni' ),
			'text'   	=> esc_html__( 'Entry Meta Text Color', 'marni' ),
			'hover'   	=> esc_html__( 'Entry Meta Hover Color', 'marni' ),
	  	),
		'default'     => array(
			'background'     => $dark_bg_color,
			'text'     	 => '#ffffff',
			'hover'     	 => $theme_color,
		),
		'output'    => array(
			array(
				'choice'    => 'background',
				'element'   => array( '	.slider.dark .entry-meta-bgcolor.has-slider-meta,
							.home #primary .entry-meta-bgcolor.has-home-meta,
							.blog #primary .entry-meta-bgcolor.has-home-meta,
							.archive #primary .entry-meta-bgcolor.has-archive-meta,
							.search #primary .entry-meta-bgcolor.has-archive-meta,
							.featured-post .entry-meta-bgcolor ' ),
				'property'  => 'background-color',
			),
			array(
				'choice'    => 'text',
				'element'   => array( '	.slider.dark .entry-meta-bgcolor.has-slider-meta,
							.home #primary .entry-meta-bgcolor.has-home-meta,
							.blog #primary .entry-meta-bgcolor.has-home-meta,
							.archive #primary .entry-meta-bgcolor.has-archive-meta,
							.search #primary .entry-meta-bgcolor.has-archive-meta,
							.featured-post .entry-meta-bgcolor,
							.slider.dark .entry-meta-bgcolor.has-slider-meta a,
							.home #primary .entry-meta-bgcolor.has-home-meta a,
							.blog #primary .entry-meta-bgcolor.has-home-meta a,
							.archive #primary .entry-meta-bgcolor.has-archive-meta a,
							.search #primary .entry-meta-bgcolor.has-archive-meta a,
							.featured-post .entry-meta-bgcolor a,
							.slider.dark .entry-meta-bgcolor.has-slider-meta .serif-italic,
							.home #primary .entry-meta-bgcolor.has-home-meta .serif-italic,
							.blog #primary .entry-meta-bgcolor.has-home-meta .serif-italic,
							.archive #primary .entry-meta-bgcolor.has-archive-meta .serif-italic,
							.search #primary .entry-meta-bgcolor.has-archive-meta .serif-italic,
							.featured-post .entry-meta-bgcolor .serif-italic' ),
				'property'  => 'color',
			),
			array(
				'choice'    => 'hover',
				'element'   => array( '	.slider.dark .entry-meta-bgcolor.has-slider-meta a:hover,
							.home #primary .entry-meta-bgcolor.has-home-meta a:hover,
							.blog #primary .entry-meta-bgcolor.has-home-meta a:hover,
							.archive #primary .entry-meta-bgcolor.has-archive-meta a:hover,
							.search #primary .entry-meta-bgcolor.has-archive-meta a:hover,
							.featured-post .entry-meta-bgcolor a:hover' ),
				'property'  => 'color',
			),
	  	),
	));



	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'multicolor',
		'settings'    => 'topbar_colors',
		'label'       => esc_html__( 'Top Bar Color', 'marni' ),
		'section'     => 'colors',
		'priority'    => 10,
		'choices'     => array(
			'background'  => esc_html__( 'Background', 'marni' ),
			'text'    => esc_html__( 'Text/Icons', 'marni' ),
			'hover'   => esc_html__( 'Link Hover', 'marni' ),
	  	),
		'default'     => array(
			'background'   	=> $dark_bg_color,
			'text'     	=> '#ffffff',
			'hover'     	=> $theme_color,
		),
		'output'    => array(
			array(
				'choice'    => 'background',
				'element'   => '.topbar',
				'property'  => 'background-color',
			),
			array(
				'choice'    => 'text',
				'element'   => '.topbar-content i, .topbar-content a, .topbar .cart-contents:before, .topbar .cart-contents-count,
						.topbar-content .main-navigation ul li a, .topbar-content .main-navigation ul li a:link, .topbar-content .main-navigation ul li a:focus, .topbar-content .main-navigation ul li a:active',
				'property'  => 'color',
			),
			array(
				'choice'    => 'hover',
				'element'   => '.topbar-content i:hover, .topbar-content a:hover, .cart-contents:hover:before',
				'property'  => 'color',
			),
	  	),
	));



	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'multicolor',
		'settings'    => 'navigation_colors',
		'label'       => esc_html__( 'Navigation Color', 'marni' ),
		'section'     => 'colors',
		'priority'    => 10,
		'choices'     => array(
			'hover'   	=> esc_html__( 'Navi Hover', 'marni' ),
			'subbackground' => esc_html__( 'Subnavi Background', 'marni' ),
			'subtext'    	=> esc_html__( 'Subnavi Text', 'marni' ),
			'subhover'   	=> esc_html__( 'Subnavi Hover', 'marni' ),
	  	),
		'default'     => array(
			'hover'     	=> $hover_color,
			'subbackground' => $dark_bg_color,
			'subtext'     	=> '#ffffff',
			'subhover'      => $theme_color,
		),
		'output'    => array(
			array(
				'choice'    => 'hover',
				'element'   => '.main-navigation ul li a:hover',
				'property'  => 'color',
			),
			array(
				'choice'    => 'subbackground',
				'element'   => '.main-navigation .sub-menu,.main-navigation .children',
				'property'  => 'background-color',
			),
			array(
				'choice'    => 'subtext',
				'element'   => '.main-navigation ul.sub-menu li a, .main-navigation ul.children li a',
				'property'  => 'color',
			),
			array(
				'choice'    => 'subhover',
				'element'   => '.main-navigation ul.sub-menu li a:hover,.main-navigation ul.children li a:hover',
				'property'  => 'color',
			)
	  	),
	));

	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'color',
		'settings'    => 'marni_list_color',
		'label'       => esc_html__( 'Ordered List Numbers and Undordered List Symbol Color', 'marni' ),
		'section'     => 'colors',
		'default'     => '#b9b9bc',
		'priority'    => 10,
		'choices'     => array(
			'alpha' => true,
		),
		'output'      => array(
		        array(
		            'element'       => array( '.entry-content li:before', '.comment-text li:before' ),
		            'property'      => 'color',
		        ),
    		),
	) );

	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'radio',
		'settings'    => 'marni_footer_sidebar_color',
		'label'       => esc_html__( 'Footer Sidebar Color', 'marni' ),
		'section'     => 'colors',
		'default'     => 'dark',
		'priority'    => 10,
		'choices'     => array(
			'dark'   => esc_html__( 'Dark Background - Light Text', 'marni' ),
			'light'   => esc_html__( 'Light Background - Dark Text', 'marni' ),
		),
	));

	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'multicolor',
		'settings'    => 'footer_colors',
		'label'       => esc_html__( 'Footer Color', 'marni' ),
		'section'     => 'colors',
		'priority'    => 10,
		'choices'     => array(
			'background'  => esc_html__( 'Background', 'marni' ),
			'text'    	=> esc_html__( 'Text/Icons', 'marni' ),
			'hover'   	=> esc_html__( 'Link Hover', 'marni' ),
	  	),
		'default'     => array(
			'background'   	=> $dark_bg_color,
			'text'     	=> '#ffffff',
			'hover'     	=> $theme_color,
		),
		'output'    => array(
			array(
				'choice'    => 'background',
				'element'   => '.footer-wrap',
				'property'  => 'background-color',
			),
			array(
				'choice'    => 'text',
				'element'   => '.footer-info-wrap',
				'property'  => 'color',
			),
			array(
				'choice'    => 'hover',
				'element'   => '.footer-info-wrap a:hover',
				'property'  => 'color',
			),
	  	),
	));



/* SITE IDENTITY section *********************************************************************/

	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'number',
		'settings'    => 'marni_logo_width',
		'label'       => esc_html__( 'Logo Width', 'marni' ),
		'description' => esc_html__( 'Logo width in pixels. Upload a logo 2x the entered with, to make it look sharp on Retina screens.', 'marni' ),
		'section'     => 'title_tagline',
		'priority'    => 9,
		'default'     => '',
		'output' => array(
				array(
					'element'  => '.logowrap.logo-img',
					'property' => 'max-width',
					'units'    => 'px',
				)
			),
	));

	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'image',
		'settings'    => 'marni_gravatar',
		'label'       => esc_html__( 'Gravatar', 'marni' ),
		'description' => esc_html__( 'Upload an image to use as default Gravatar on comments. You can then select the new Gravatar in Settings > Discussion.', 'marni' ),
		'section'     => 'title_tagline',
		'priority'    => 99,
	));


/* BACKGROUND IMAGE section *********************************************************************/

	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'toggle',
		'settings'    => 'marni_mobile_bg',
		'label'       => esc_html__( 'Remove Background Image on mobile devices', 'marni' ),
		'section'     => 'background_image',
		'default'     => false,
		'priority'    => 10,
	) );







/* Add ICONS section *********************************************************************/
Marni_Kirki::add_section( 'icons', array(
	'title'      => esc_attr__( 'Icons', 'marni' ),
	'priority'   => 8,
	'capability' => 'edit_theme_options',
) );

	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'radio',
		'settings'    => 'marni_fontawesome-version',
		'label'       => esc_html__( 'FontAwesome Icon Font Version', 'marni' ),
		'section'     => 'icons',
		'default'     => 'version6',
		'priority'    => 9,
		'choices'     => array(
				    'version4'  => 'Version 4',
				    'version6'  => 'Version 6',
			),
	) );


/* Add MEDIA section *********************************************************************/
Marni_Kirki::add_section( 'media', array(
	'title'      => esc_attr__( 'Media', 'marni' ),
	'priority'   => 9,
	'capability' => 'edit_theme_options',
) );

	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'toggle',
		'settings'    => 'marni_lightbox',
		'label'       => esc_html__( 'Open Images in a lightbox', 'marni' ),
		'section'     => 'media',
		'default'     => true,
		'priority'    => 1,
	) );

	Marni_Kirki::add_field( 'marni_theme_mod', array(
		'type'        => 'toggle',
		'settings'    => 'marni_responsiveimages',
		'label'       => esc_html__( 'ADVANCED: Add custom responsive image markup', 'marni' ),
		'description' => esc_html__( 'If you are experiencing problems with displaying your images, you may want to disable this.', 'marni' ),
		'section'     => 'media',
		'default'     => true,
		'priority'    => 3,
	) );


/* Add SHOP panel *********************************************************************/
Marni_Kirki::add_panel( 'shop', array(
  	'title'          => esc_html__( 'Shop', 'marni' ),
  	'priority'       => 5,
));

	/* Add SHOP SETTINGS section *********************************************************************/
	Marni_Kirki::add_section( 'shopsettings', array(
		'title'      => esc_attr__( 'Shop Settings', 'marni' ),
		'panel'      => 'shop',
		'priority'   => 99,
	) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'number',
			'settings'    => 'marni_productsperpage',
			'label'       => esc_html__( 'Products per page', 'marni' ),
			'section'     => 'shopsettings',
			'default'     => '12',
			'priority'    => 10,

		));



	/* Add SHOP IMAGE section *********************************************************************/
	Marni_Kirki::add_section( 'shopimage', array(
		'title'      => esc_attr__( 'Shop Frontpage Image', 'marni' ),
		'panel'      => 'shop',
		'priority'   => 99,
	) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'image',
			'settings'    => 'marni_shopimage',
			'label'       => esc_html__( 'Upload Image', 'marni' ),
			'description' => esc_html__( 'Upload an image to display on the shop frontpage.', 'marni' ),
			'section'     => 'shopimage',
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'number',
			'settings'    => 'marni_shopimageheight',
			'label'       => esc_html__( 'Image Height', 'marni' ),
			'section'     => 'shopimage',
			'default'     => '540',
			'priority'    => 10,
			'output' => array(
				array(
					'element'  => '.top-image-wrap',
					'property' => 'min-height',
					'units'    => 'px',
				)
			),
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'textarea',
			'settings'    => 'marni_shopimage_title',
			'description' => esc_html__( 'You can also use HTML and shortcodes here.', 'marni' ),
			'label'       => esc_html__( 'Title Over Image', 'marni' ),
			'section'     => 'shopimage',
			'priority'    => 10,
		));


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_shopimage_title_type',
			'label'       => esc_attr__( 'Title Font', 'marni' ),
			'section'     => 'shopimage',
			'default'     => array(
				'variant'        => 'regular',
				'font-size'      => '68px',
				'line-height'    => '1',
				'letter-spacing' => '12px',
				'color'          => '#101020',
				'text-transform' => 'uppercase',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element' => '.top-image-content',
				),
			),
		) );


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'slider',
			'settings'    => 'marni_topimage_overlay',
			'label'       => esc_html__( 'Top Image dark overlay opacity.', 'marni' ),
			'section'     => 'shopimage',
			'default'     => '0',
			'priority'    => 10,
			'choices'     => array(
				'min'  => '0',
				'max'  => '0.5',
				'step' => '0.01',
			),
			'output' => array(
				array(
					'element'  => '.top-image-content',
					'property' => 'background',
					'value_pattern' => 'rgba(32, 32, 36, $)',
				)
			),
		));








	/* Add SHOP PROMO BOXES section *********************************************************************/
	Marni_Kirki::add_section( 'shoppromo', array(
		'title'      => esc_attr__( 'Shop Frontpage Promo Boxes', 'marni' ),
		'panel'      => 'shop',
		'priority'   => 99,
	) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'repeater',
			'label'       => esc_html__( 'Promo Boxes', 'marni' ),
			'section'     => 'shoppromo',
			'priority'    => 10,
			'row_label' => array(
				'type'  => 'field',
				'value' => esc_attr__('Promo Box', 'marni' ),
				'field' => 'text',
			),
			'settings'    => 'promoboxes',
			'default'     => array(),
			'fields' => array(
				'image' => array(
					'type'        => 'image',
					'label'       => esc_html__( 'Box Background Image', 'marni' ),
					'default'     => '',
				),
				'text' => array(
					'type'        => 'text',
					'label'       => esc_html__( 'Box Overlay Text', 'marni' ),
					'default'     => '',
				),
				'url' => array(
					'type'        => 'text',
					'label'       => esc_html__( 'Box Links To', 'marni' ),
					'description'       => esc_html__( 'Enter full URL', 'marni' ),
					'default'     => '',
				),				
			),
		));


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'typography',
			'settings'    => 'marni_promoboxes_type',
			'label'       => esc_attr__( 'Promoboxes Text Font', 'marni' ),
			'section'     => 'shoppromo',
			'default'     => array(
				'font-family'    => 'Lato',
				'variant'        => '300',
				'font-size'      => '1em',
				'line-height'    => '1.5em',
				'letter-spacing' => '6px',
				'color'          => '#ffffff',
				'text-transform' => 'uppercase',
			),
			'priority'    => 10,
			'output'      => array(
				array(
					'element' => '.promoboxes .overlay-content',
				),
			),
		) );

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'slider',
			'settings'    => 'marni_promoboxes_overlay',
			'label'       => esc_html__( 'Promo Boxes dark overlay opacity.', 'marni' ),
			'section'     => 'shoppromo',
			'default'     => '0.12',
			'priority'    => 10,
			'choices'     => array(
				'min'  => '0',
				'max'  => '0.5',
				'step' => '0.01',
			),
			'output' => array(
				array(
					'element'  => '.promoboxes .color-overlay',
					'property' => 'background',
					'value_pattern' => 'rgba(32, 32, 36, $)',
				)
			),
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'slider',
			'settings'    => 'marni_promoboxes_textbg',
			'label'       => esc_html__( 'Promo Boxes text background color opacity.', 'marni' ),
			'section'     => 'shoppromo',
			'default'     => '0',
			'priority'    => 10,
			'choices'     => array(
				'min'  => '0',
				'max'  => '1',
				'step' => '0.01',
			),
			'output' => array(
				array(
					'element'  => '.promoboxes .overlay-content',
					'property' => 'background',
					'value_pattern' => 'rgba(32, 32, 36, $)',
				)
			),
		));




/* Add CONNECT panel *********************************************************************/
Marni_Kirki::add_panel( 'connect', array(
  	'title'          => esc_html__( 'Connect', 'marni' ),
  	'priority'       => 5,
));

	/* Add SOCIAL ACCOUNTS section *********************************************************************/
	Marni_Kirki::add_section( 'social', array(
		'title'      => esc_attr__( 'Social Accounts', 'marni' ),
		'panel'      => 'connect',
		'priority'   => 99,
	) );

		$faversion = get_theme_mod( 'marni_fontawesome-version', '' ); 
		if ( $faversion == 'version4' ) { 
			$facebookicon = 'facebook';
			$snapchaticon = 'snapchat-square';
		} else {
			
			$facebookicon = 'facebook-f';
			$snapchaticon = 'snapchat';
		}

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'repeater',
			'label'       => esc_html__( 'Social Accounts', 'marni' ),
			'description'=> esc_html__( 'These social accounts can be displayed in the top bar, footer and social widget.', 'marni' ),
			'section'     => 'social',
			'priority'    => 10,
			'row_label' => array(
				'type'  => 'field',
				'value' => esc_attr__('social account', 'marni' ),
			),
			'settings'    => 'social_accounts',
			'default'     => array(),
			'fields' => array(
				'type' => array(
					'type'        => 'select',
					'label'       => esc_html__( 'Account Type', 'marni' ),
					'default'     => 'instagram',
					'choices'     => array(
						'instagram'   => esc_html__( 'Instagram', 'marni'),
						'tiktok'   => esc_html__( 'TikTok', 'marni'),
						$facebookicon    => esc_html__( 'Facebook', 'marni' ),
						'x-twitter'     => esc_html__( 'X (Twitter)', 'marni'),
						'youtube'     => esc_html__( 'YouTube', 'marni'),
						$snapchaticon    => esc_html__( 'Snapchat', 'marni'),
						'tumblr'      => esc_html__( 'Tumblr', 'marni'),
						'pinterest'   => esc_html__( 'Pinterest', 'marni'),
						'google-plus' => esc_html__( 'Google Plus', 'marni'),
						'linkedin'    => esc_html__( 'LinkedIn', 'marni'),
						'skype'       => esc_html__( 'Skype', 'marni'),
						'pocket'      => esc_html__( 'Pocket', 'marni'),
						'whatsapp'    => esc_html__( 'WhatsApp', 'marni'),
						'vimeo'       => esc_html__( 'Vimeo', 'marni'),
						'dribbble'    => esc_html__( 'Dribbble', 'marni'),
						'spotify'     => esc_html__( 'Spotify', 'marni'),
						'behance'     => esc_html__( 'Behance', 'marni'),
						'rss'         => esc_html__( 'RSS', 'marni'),
					),
				),
				'url' => array(
					'type'        => 'text',
					'label'       => esc_html__( 'Account URL', 'marni' ),
					'default'     => '',
				),
				'text' => array(
					'type'        => 'text',
					'label'       => esc_html__( 'Text', 'marni' ),
					'description'       => esc_html__( 'will display in the footer only.', 'marni' ),
					'default'     => '',
				),
			),
		));


	if ( function_exists( 'marni_share_buttons' ) ) {
	/* Add SHARE section *********************************************************************/
	Marni_Kirki::add_section( 'share', array(
		'title'      => esc_attr__( 'Share', 'marni' ),
		'panel'      => 'connect',
		'description'       => esc_html__( 'Select whicht share buttons to display for each post.', 'marni' ),
		'priority'   => 99,
	) );


		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_facebook',
			'label'       => esc_html__( 'Facebook', 'marni' ),
			'section'     => 'share',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_twitter',
			'label'       => esc_html__( 'Twitter', 'marni' ),
			'section'     => 'share',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_pinterest',
			'label'       => esc_html__( 'Pinterest', 'marni' ),
			'section'     => 'share',
			'default'     => true,
			'priority'    => 10,
		));

		Marni_Kirki::add_field( 'marni_theme_mod', array(
			'type'        => 'toggle',
			'settings'    => 'marni_email',
			'label'       => esc_html__( 'Email', 'marni' ),
			'section'     => 'share',
			'default'     => true,
			'priority'    => 10,
		));
	}

