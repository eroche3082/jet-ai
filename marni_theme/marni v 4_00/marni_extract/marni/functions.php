<?php

/****************************************
** MARNI functions and definitions ******
****************************************/

if ( ! function_exists( 'marni_setup' ) ) :
function marni_setup() {

	/** Theme translation ********************************************************/
	load_theme_textdomain( 'marni', get_template_directory() . '/languages' );

	/** Feed links ***************************************************************/
	add_theme_support('automatic-feed-links');

	/** Title Tags ***************************************************************/
   	add_theme_support( 'title-tag' );

	/** Thumbnails ***************************************************************/
	add_theme_support( 'post-thumbnails' );
	//uncropped
	add_image_size( 'marni-uncropped', 2308, '', false );
	add_image_size( 'marni-uncropped-full', 1200,'', false);
	add_image_size( 'marni-uncropped-largex2', 1600,'', false);
	add_image_size( 'marni-uncropped-large', 800,'', false);
	add_image_size( 'marni-uncropped-medium', 560, '', false );
	// square
	add_image_size( 'marni-suare', 2308, 2308, true );
	add_image_size( 'marni-square-full', 1200, 1200, true );
	add_image_size( 'marni-square-largex2', 1600, 1600, true );
	add_image_size( 'marni-square-large', 800, 800, true );
	add_image_size( 'marni-square-medium', 560, 560, true );
	add_image_size( 'marni-square-small', 250, 250, true); 
	add_image_size( 'marni-square-mini', 120, 120, true );
	//landscape
	add_image_size( 'marni-landscape', 2308, 1731, true );
	add_image_size( 'marni-landscape-full', 1200, 900, true );
	add_image_size( 'marni-landscape-largex2', 1600, 1200, true );
	add_image_size( 'marni-landscape-large', 800, 600, true );
	add_image_size( 'marni-landscape-medium', 560, 420, true );
	add_image_size( 'marni-landscape-mini', 120, 90, true );

	/** Post Formats ***************************************************************/
	add_theme_support( 'post-formats', array( 'gallery', 'video' ) );

	/** Navigation Menu ***************************************************************/
	register_nav_menus( array(
		'primary' => esc_html__( 'Primary', 'marni' ),
	) );

	/** Switch default core markup for search form, comment form, and comments to output valid HTML5 */
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	) );

	/* custom logo */
	add_theme_support( 'custom-logo', array(
		'height'      => 50,
		'width'       => 200,
		'flex-height' => true,
		'flex-width'  => true,
		'header-text' => array( 'site-title', 'site-description' ),
	) );

	/* custom background */
	add_theme_support( 'custom-background', apply_filters( 'marni_custom_background_args', array(
		'default-color' => 'f7f7f8',
		'default-image' => '',
	) ) );

	/* add Gutenberg support */
	add_theme_support( 'align-wide' );
	add_theme_support( 'editor-styles' );

	/** editor style */
	add_editor_style( 'style-editor.css' );

	/* add support for custom color palettes in Gutenberg */ 
	add_theme_support(
		'editor-color-palette', array(
			array(
				'name'  => esc_html__( 'White', 'marni' ),
				'slug' => 'white',
				'color' => '#ffffff',
			),			
			array(
				'name'  => esc_html__( 'Grey', 'marni' ),
				'slug' => 'grey',
				'color' => '#a9a9ac',
			),
			array(
				'name'  => esc_html__( 'Anthracite', 'marni' ),
				'slug' => 'anthracite',
				'color' => '#3A3A3B',
			),							
			array(
				'name'  => esc_html__( 'Almost Black', 'marni' ),
				'slug' => 'almostblack',
				'color' => '#101020',
			)								
		)
	);
	

	add_theme_support( 
		'editor-font-sizes', array(
			array(
				'name' => esc_html__( 'small', 'marni' ),
				'shortName' => esc_html__( 'S', 'marni' ),
				'size' => 12,
				'slug' => 'small'
			),
			array(
				'name' => esc_html__( 'regular', 'marni' ),
				'shortName' => esc_html__( 'M', 'marni' ),
				'size' => 16,
				'slug' => 'regular'
			),
			array(
				'name' => esc_html__( 'large', 'marni' ),
				'shortName' => esc_html__( 'L', 'marni' ),
				'size' => 36,
				'slug' => 'large'
			),
			array(
				'name' => esc_html__( 'larger', 'marni' ),
				'shortName' => esc_html__( 'XL', 'marni' ),
				'size' => 50,
				'slug' => 'larger'
			)
	) );


	/* Restoring the classic Widgets Editor ***************************************************************/
	remove_theme_support( 'widgets-block-editor' );


        /** declare WooCommerce support */
        add_theme_support('woocommerce');

}
endif;
add_action( 'after_setup_theme', 'marni_setup' );



/** Demo Data Import *************************************************************/
function marni_ocdi_plugin_intro_text( $default_text ) {

    	$default_text .= '<div class="ocdi__intro-text">
	<h4> ' . esc_html__( 'STEP 1: Import the Demo Content', 'marni' ) . '  </h4>
	' . esc_html__( 'This import contains all the content: pages, a showcase of differently styled blog posts, images, categories, shop items and the menu.', 'marni' ) . '<br>
	' . esc_html__( 'You can skip this step if you already have content on your blog. ', 'marni' ) . '
	<h4> ' . esc_html__( 'STEP 2: Import Demo Style', 'marni' ) . '  </h4>
	' . esc_html__( 'This import contains all settings from the Theme Customizer as well as all widgets.', 'marni' ) . '<br>
	' . esc_html__( 'Select one of the three available styles.', 'marni' ) . '
	<br><br></div>';

    	return $default_text;
}
add_filter( 'pt-ocdi/plugin_intro_text', 'marni_ocdi_plugin_intro_text' );

add_filter( 'pt-ocdi/disable_pt_branding', '__return_true' ); // remove branding

function marni_ocdi_import_files() {
  	return array(
		array(
			'import_file_name'             => esc_html__( 'Demo Content', 'marni' ),
			'categories'                   => array( esc_html__( 'Demo Content', 'marni' ) ),
			'local_import_file'            => trailingslashit( get_template_directory() ) . 'inc/demo-data/marnidemodata.xml',
			'import_preview_image_url'     => 'https://marni.redsun.design/landing/wp-content/uploads/sites/2/2025/02/demodata.png',
			'preview_url'                  => 'http://www.marni.redsun.design/demodata',
		),  		
		array(
			'import_file_name'             => esc_html__( 'Style 1', 'marni' ),
			'categories'                   => array( esc_html__( 'Style', 'marni' ) ),
			'local_import_customizer_file' => trailingslashit( get_template_directory() ) . 'inc/demo-data/marni-customizer.dat',
      			'local_import_widget_file'     => trailingslashit( get_template_directory() ) . 'inc/demo-data/marni-widgets.wie',			
      			'import_preview_image_url'     => 'http://marni.redsun.design/landing/wp-content/uploads/sites/2/2017/04/marni-demo1_.jpg',
			'preview_url'                  => 'http://www.marni.redsun.design',
		),
		array(
			'import_file_name'             => esc_html__( 'Style 2', 'marni' ),
			'categories'                   => array( esc_html__( 'Style', 'marni' ) ),
			'local_import_customizer_file' => trailingslashit( get_template_directory() ) . 'inc/demo-data/marni-customizer2.dat',
      			'local_import_widget_file'     => trailingslashit( get_template_directory() ) . 'inc/demo-data/marni-widgets2.wie',			
			'import_preview_image_url'     => 'http://marni.redsun.design/landing/wp-content/uploads/sites/2/2017/10/mdemo2.jpg',
			'preview_url'                  => 'http://www.marni.redsun.design/demo2',
		),
		array(
			'import_file_name'             => esc_html__( 'Style 3', 'marni' ),
			'categories'                   => array( esc_html__( 'Style', 'marni' ) ),
			'local_import_customizer_file' => trailingslashit( get_template_directory() ) . 'inc/demo-data/marni-customizer3.dat',
      			'local_import_widget_file'     => trailingslashit( get_template_directory() ) . 'inc/demo-data/marni-widgets3.wie',						
			'import_preview_image_url'     => 'http://marni.redsun.design/landing/wp-content/uploads/sites/2/2017/04/d3_.jpg',
			'preview_url'                  => 'http://www.marni.redsun.design/demo3',
		),
				
  	);
}
add_filter( 'pt-ocdi/import_files', 'marni_ocdi_import_files' );

function marni_ocdi_after_import_setup() {

	// Assign menus to their locations.
	$main_menu = get_term_by( 'name', 'primary menu', 'nav_menu' );
	set_theme_mod( 'nav_menu_locations', array(
			'primary' => $main_menu->term_id,
		)
	);

}
add_action( 'pt-ocdi/after_import', 'marni_ocdi_after_import_setup' );




/** CONTENT WIDTH *************************************************************/
function marni_content_width() {
	$content_width = 1152;
	$GLOBALS['content_width'] = apply_filters( 'marni_content_width', $content_width );
}
add_action( 'after_setup_theme', 'marni_content_width', 0 );



/** EXCERPT *******************************************************************/
add_filter('the_excerpt', 'marni_shortcode_in_excerpt');
function marni_shortcode_in_excerpt($excerpt) {
	$excerptlength = get_theme_mod('marni_excerpt_length', '30');
	if ( has_excerpt() ) {
    		return get_the_excerpt();
	} else {
	    	return strip_tags(do_shortcode(wp_trim_words(get_the_content(), intval($excerptlength), ' ...')));
	}
    	
}


/** READ MORE *****************************************************************/
function marni_modify_read_more_link() {
    return ' ...';
}
add_filter( 'the_content_more_link', 'marni_modify_read_more_link' );


/** GRAVATAR ********************************************************************/
function marni_new_gravatar ($avatar_defaults) {
	if ( get_theme_mod( 'marni_gravatar' ) ) {
		$marni_avatar = get_theme_mod( 'marni_gravatar' );
	} else {
		$marni_avatar = get_template_directory_uri() . '/images/gravatar.jpg';
	}
	$avatar_defaults[$marni_avatar] = "Custom Gravatar";
	return $avatar_defaults;
}
add_filter( 'avatar_defaults', 'marni_new_gravatar' );





/** SIDEBARS ******************************************************************/
function marni_widgets_init() {

	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar Single', 'marni' ),
		'id'            => 'sidebar-single',
		'description'   => esc_html__( 'Add widgets to the single blog posts sidebar.', 'marni' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<div class="title-center"> <h2 class="widget-title">',
		'after_title'   => '</h2></div>',
	) );

	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar Archives', 'marni' ),
		'id'            => 'sidebar-archives',
		'description'   => esc_html__( 'Add widgets to the archives sidebar.', 'marni' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<div class="title-center"> <h2 class="widget-title">',
		'after_title'   => '</h2></div>',
	) );

	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar Pages', 'marni' ),
		'id'            => 'sidebar-pages',
		'description'   => esc_html__( 'Add widgets to pages with sidebar.', 'marni' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<div class="title-center"> <h2 class="widget-title">',
		'after_title'   => '</h2></div>',
	) );

	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar Home Right', 'marni' ),
		'id'            => 'sidebar-home',
		'description'   => esc_html__( 'Add widgets to the home page sidebar.', 'marni' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<div class="title-center"> <h2 class="widget-title">',
		'after_title'   => '</h2></div>',
	) );

	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar Home Top', 'marni' ),
		'id'            => 'sidebar-home-top',
		'description'   => esc_html__( 'Add widgets on the home page, above the posts.', 'marni' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<div class="title-center"> <h2 class="widget-title">',
		'after_title'   => '</h2></div>',
	) );

	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar WooCommerce', 'marni' ),
		'id'            => 'sidebar-woocommerce',
		'description'   => esc_html__( 'Add widgets to WooCommerce pages sidebar.', 'marni' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<div class="title-center"> <h2 class="widget-title">',
		'after_title'   => '</h2></div>',
	) );

	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar Footer Instagram', 'marni' ),
		'id'            => 'sidebar-instagram',
		'description'   => esc_html__( 'Add the Instagram widget here.', 'marni' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<div class="title-center"> <h2 class="widget-title">',
		'after_title'   => '</h2></div>',
	) );

	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar Footer Left', 'marni' ),
		'id'            => 'sidebar-footer1',
		'description'   => esc_html__( 'Add widgets to the left footer sidebar.', 'marni' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<div class="title-center"> <h2 class="widget-title">',
		'after_title'   => '</h2></div>',
	) );

	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar Footer Center', 'marni' ),
		'id'            => 'sidebar-footer2',
		'description'   => esc_html__( 'Add widgets to the center footer sidebar.', 'marni' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<div class="title-center"> <h2 class="widget-title">',
		'after_title'   => '</h2></div>',
	) );

	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar Footer Right', 'marni' ),
		'id'            => 'sidebar-footer3',
		'description'   => esc_html__( 'Add widgets to the right footer sidebar.', 'marni' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<div class="title-center"> <h2 class="widget-title">',
		'after_title'   => '</h2></div>',
	) );

}
add_action( 'widgets_init', 'marni_widgets_init' );




/** ADD FORMATS TO TINYMCE EDITOR **********************************************/
function marni_mce_buttons_2( $buttons ) {
	array_unshift( $buttons, 'styleselect' );
	return $buttons;
}
add_filter( 'mce_buttons_2', 'marni_mce_buttons_2' );

function marni_tiny_mce_before_init( $settings ) {
	$style_formats = array(
		array( 	'title' => esc_html__( 'Intro Text', 'marni' ),
			'block' => 'span', 
			'classes' => 'intro', 
			),							
	);
	$settings['style_formats'] = json_encode( $style_formats );
	return $settings;
}
add_filter( 'tiny_mce_before_init', 'marni_tiny_mce_before_init' );


/** ENQUEUE SCRIPTS AND STYLES ****************************************************/
function marni_scripts() {

	// load on Frontend only
	if (!is_admin()) {

		// styles 

		$faversion = get_theme_mod('marni_fontawesome-version', 'version6');

		if ( $faversion == 'version4' ) { 
			wp_enqueue_style( 'font-awesome', get_template_directory_uri().'/fonts/fontawesome/css/font-awesome.min.css', false, 'screen');
		} else {
			wp_enqueue_style( 'font-awesome6', get_template_directory_uri().'/fonts/fontawesome6/css/all.min.css', false, 'screen');
                	wp_enqueue_style( 'font-awesome-v4shims', get_template_directory_uri().'/fonts/fontawesome6/css/v4-shims.min.css', false, 'screen');	
		}
                
		wp_enqueue_style( 'iconfont-pe-stroke', get_template_directory_uri().'/fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css', false, 'screen');
                wp_enqueue_style( 'iconfont-pe-stroke-helper', get_template_directory_uri().'/fonts/pe-icon-7-stroke/css/helper.css', false, 'screen'); 
                wp_enqueue_style( 'owl-carousel', get_template_directory_uri().'/css/owl.carousel.min.css', false, 'screen');
                if ( true == get_theme_mod( 'marni_lightbox', true ) ) {
                	wp_enqueue_style( 'lightbox', get_template_directory_uri().'/css/magnific-popup.css', false, 'screen');	
                }
                wp_enqueue_style( 'slicknav', get_template_directory_uri().'/css/slicknav.css', false, 'screen');
		wp_enqueue_style( 'marni-style', get_stylesheet_uri() );

		// RTL
		wp_style_add_data( 'slicknav', 'rtl', 'replace' );
		wp_style_add_data( 'marni-style', 'rtl', 'replace' );


		// load on single pages  
		if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
			wp_enqueue_script( 'comment-reply' );
		}

		// scripts
		wp_enqueue_script( 'masonry' );			
		//wp_enqueue_script( 'imagesloaded', get_template_directory_uri().'/js/jquery.imagesloaded.min.js', array('jquery'), '4.1.2', true);
		wp_enqueue_script( 'slicknav', get_template_directory_uri().'/js/jquery.slicknav.js', array('jquery'), '1.0.10', true);                
		wp_enqueue_script( 'sticky', get_template_directory_uri().'/js/theia-sticky-sidebar.min.js', array('jquery'), '1.1.2', true);                
		wp_enqueue_script( 'resizesensor', get_template_directory_uri().'/js/ResizeSensor.min.js', array('jquery'), '1.1.2', true);                
                wp_enqueue_script( 'owl-carousel', get_template_directory_uri().'/js/owl.carousel.min.js', array('jquery'), '2.2.1', true); 
		wp_enqueue_script( 'marni-navigation', get_template_directory_uri() . '/js/navigation.js', array('jquery'), '20151215', true );
                wp_enqueue_script( 'fitvids', get_template_directory_uri().'/js/jquery.fitvids.js', array('jquery'), '1.1', true);
		wp_enqueue_script( 'marni-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20151215', true );
		if ( true == get_theme_mod( 'marni_lightbox', true ) ) {
			wp_enqueue_script( 'lightbox', get_template_directory_uri().'/js/jquery.magnific-popup.min.js', array('jquery'), '1.1.0', true);
		}
                wp_enqueue_script( 'marni-scripts', get_template_directory_uri().'/js/scripts.js', array('jquery'), ' ', true);                 

	}
}
add_action( 'wp_enqueue_scripts', 'marni_scripts' );


// enqueue editor styles for Gutenberg
function marni_editor_styles() {
	wp_enqueue_style( 'marni-editor-style', get_template_directory_uri() . '/css/gutenberg.css' );

}
add_action( 'enqueue_block_editor_assets', 'marni_editor_styles' );


// load on admin pages
function marni_admin_scripts() {

	// icon fonts
        wp_enqueue_style('iconfont-fontawesome', get_template_directory_uri().'/fonts/fontawesome/css/font-awesome.min.css', false, 'screen');
        wp_enqueue_style('iconfont-pe-stroke', get_template_directory_uri().'/fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css', false, 'screen');
        wp_enqueue_style('iconfont-pe-stroke-helper', get_template_directory_uri().'/fonts/pe-icon-7-stroke/css/helper.css', false, 'screen');

        // custom admin style CSS
        wp_enqueue_style('marni-admin-styles', get_template_directory_uri().'/css/admin-styles.css', false, 'screen');

}
add_action( 'admin_enqueue_scripts', 'marni_admin_scripts' );




/** INCLUDE THEME SPECIFIC FUNCTIONS ******************************************/
define( 'MARNI_INC_DIRECTORY', trailingslashit( get_template_directory().'/inc' ) );
require MARNI_INC_DIRECTORY . 'class-marni-kirki.php';     	// Wrapper class for Kirki
require MARNI_INC_DIRECTORY . 'customizer.php';     		// Customizer
require MARNI_INC_DIRECTORY . 'template-tags.php';     		// Custom template tags for this theme
require MARNI_INC_DIRECTORY . 'theme-functions.php';     	// Theme Functions
require MARNI_INC_DIRECTORY . 'admin-columns.php';     		// Admin Columns




/** LOAD GOOGLE FONTS IN KIRKI WITHOUT FOUT ************************************/
$file_path = wp_normalize_path( get_template_directory() . '/inc/class-kirki-modules-webfonts-link.php' );
if ( file_exists( $file_path ) && ! class_exists( 'Kirki_Modules_Webfonts_Link' ) ) {
	include_once $file_path;
}
if ( ! function_exists( 'marni_change_fonts_load_method' ) ) {
	/**
	 * Changes the font-loading method.
	 *
	 * @param string $method The font-loading method (async|link)
	 */
	function marni_change_fonts_load_method( $method ) {
		// Check for a theme-mod.
		// We don't want to force the use of the link method for googlefonts loading
	        // since the async method is better in general.
		if ( 'link' === get_theme_mod( 'marni_font_loading_method' ) ) {
			return 'link';
		}
		return $method;
	}
}
add_filter( 'kirki_googlefonts_load_method', 'marni_change_fonts_load_method' );


/** INCLUDE DYNAMIC CSS ******************************************/
define( 'MARNI_CSS_DIRECTORY', trailingslashit( get_template_directory().'/css' ) );
include_once MARNI_CSS_DIRECTORY . 'dynamic-css.php';


/** INCLUDE TGM PLUGIN ACTIVATION *********************************************/
define( 'MARNI_TGM_DIRECTORY', trailingslashit( get_template_directory().'/inc/tgm-plugin-activation' ) );
include_once MARNI_TGM_DIRECTORY . 'class-tgm-plugin-activation.php';
include MARNI_TGM_DIRECTORY . 'plugin-list.php';


/** CUSTOMIZING RESPONSIVE IMAGE MARKUP ****************************************/
if ( true == get_theme_mod( 'marni_responsiveimages', true ) ) {

	// content images
	function marni_content_image_sizes_attr( $sizes, $size ) {

		$width = $size[0];

		$layout = "fullwidth";
		if ( class_exists( 'RWMB_Field' ) ) { 
			$layout = rwmb_meta( 'redsun_single-layout' );
		}

		//Page and Post with sidebar
		if ( is_page_template( 'page-templates/page-with-sidebar.php' ) || ( $layout == 'has-sidebar' ||  $layout == 'sidebar-below-title' || $layout == 'sidebar-below-thumb' )  ) {
			if ($width > 780) {
				$sizes = '(max-width: 1248px) 63vw, (max-width: 960px) 90vw, (max-width: 767px) 95vw, 780px';
			}
		} 

		//Fullwidth Page and Post
		if ( $layout == 'fullwidth')  {
			if ($width > 1152) {
				$sizes = '(max-width: 1248px) 95vw, (max-width: 960px) 90vw, (max-width: 767px) 95vw, 1152px';
			}
		}

		return $sizes;
	}
	add_filter( 'wp_calculate_image_sizes', 'marni_content_image_sizes_attr', 10, 2 );

	// thumbnails
	function marni_post_thumbnail_sizes_attr($attr, $attachment, $size) {

		$home_layout = get_theme_mod('marni_home_layout', 'standard');
		$home_columns = get_theme_mod('marni_layout_home_columns', 'two-items'); 
		$home_sidebar = get_theme_mod('marni_home_sidebar', true);

		$archives_layout = get_theme_mod('marni_archives_layout', 'standard');
		$archives_columns = get_theme_mod('marni_layout_archives_columns', 'two-items'); 
		$archives_sidebar = get_theme_mod('marni_archives_sidebar', true);

		$listthumb = get_theme_mod( 'marni_home_listthumb', '65');
		

	   	// standard with sidebar
		if ( 	(is_home() && $home_layout == 'standard' && $home_sidebar == true ) ||
			(is_archive() && $archives_layout == 'standard' && $archives_sidebar == true )
			) {
	   		$attr['sizes'] = '(max-width: 1248px) 63vw, (max-width: 959px) 90vw, (max-width: 767px) 95vw, 780px';
	   	// standard without sidebar
	   	} elseif ((is_home() && $home_layout == 'standard') ||
			(is_archive() && $archives_layout == 'standard' )
			) {
		   	$attr['sizes'] = '(max-width: 1248px) 95vw, (max-width: 959px) 90vw, (max-width: 767px) 95vw, 1152px';

		// grid with sidebar 2 columns // grid 3 columns
	   	} elseif ((is_home() && ($home_layout == 'grid' || $home_layout == 'masonry') && $home_columns == 'two-items' && $home_sidebar == true  ) ||
			 (is_archive() && ($archives_layout == 'grid' || $archives_layout == 'masonry') && $archives_columns == 'two-items' && $archives_sidebar == true  ) ||
			  (is_home() && ($home_layout == 'grid' || $home_layout == 'masonry') && $home_columns == 'three-items') ||
			 (is_archive() && ($archives_layout == 'grid' || $archives_layout == 'masonry') && $archives_columns == 'three-items')
			) {
		   	$attr['sizes'] = '(max-width: 959px) 42vw, (max-width: 767px) 95vw, 378px';
		// grid without sidebar 2 columns
	   	} elseif ((is_home() && ($home_layout == 'grid' || $home_layout == 'masonry') && $home_columns == 'two-items') ||
			 (is_archive() && ($archives_layout == 'grid' || $archives_layout == 'masonry') && $archives_columns == 'two-items')
			) {
		   	$attr['sizes'] = '(max-width: 959px) 42vw, (max-width: 767px) 95vw, 576px';
		
		// list with sidebar
	   	} elseif ((is_home() && $home_layout == 'list'  && $home_sidebar == true  ) ||
			 (is_archive() && $archives_layout == 'list' &&  $archives_sidebar == true  )
			) {
	   		$listwidth = 8 * $listthumb;
		   	$attr['sizes'] = '(max-width: 959px) ' . $listthumb .'vw, (max-width: 767px) 95vw, ' . $listwidth .'px';
		// list without sidebar
	   	} elseif ((is_home() && $home_layout == 'list') ||
			 (is_archive() && $archives_layout == 'list' )
			) {
	   		$listwidth = 12 * $listthumb;
		   	$attr['sizes'] = '(max-width: 959px) ' . $listthumb .'vw, (max-width: 767px) 95vw, ' . $listwidth .'px';
		}

	   	return $attr;
	}
	add_filter('wp_get_attachment_image_attributes', 'marni_post_thumbnail_sizes_attr', 10 , 3);
}



/** IF WOOCOMMERCE PLUGIN IS ACTIVATED ****************************************/
if ( class_exists( 'woocommerce' ) ) { 

        //include woocommerce functions
        include_once (get_template_directory() . '/woocommerce/functions/woocommerce_functions.php');


	// Remove each style one by one
	add_filter( 'woocommerce_enqueue_styles', 'marni_dequeue_styles' );
	function marni_dequeue_styles( $enqueue_styles ) {
		unset( $enqueue_styles['woocommerce-general'] );	// Remove the gloss
		unset( $enqueue_styles['woocommerce-layout'] );	// Remove the layout
		//unset( $enqueue_styles['woocommerce-smallscreen'] );	// Remove the smallscreen optimisation
		return $enqueue_styles;
	}


        // enqueue custom woocommerce styles
	function marni_enqueue_woocommerce_style(){
		if ( !is_admin() ) {
			wp_enqueue_style('woo', get_template_directory_uri().'/woocommerce/css/woocommerce.css', false, 'screen');
			wp_style_add_data( 'woo', 'rtl', 'replace' );
		}
	}
	add_action( 'wp_enqueue_scripts', 'marni_enqueue_woocommerce_style' );
      
}
