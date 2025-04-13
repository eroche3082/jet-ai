<?php
/**
 *
 * @see http://tgmpluginactivation.com/configuration/ for detailed documentation.
 *
 * @package    TGM-Plugin-Activation
 * @subpackage Example
 * @version    2.6.1 for parent theme Marni for publication on ThemeForest
 * @author     Thomas Griffin, Gary Jones, Juliette Reinders Folmer
 * @copyright  Copyright (c) 2011, Thomas Griffin
 * @license    http://opensource.org/licenses/gpl-2.0.php GPL v2 or later
 * @link       https://github.com/TGMPA/TGM-Plugin-Activation
 */


require_once get_template_directory() . '/inc/tgm-plugin-activation/class-tgm-plugin-activation.php';

add_action( 'tgmpa_register', 'marni_register_required_plugins' );

function marni_register_required_plugins() {

	$plugins = array(

		//required
		array(
			'name' 		=> esc_html__('Kirki', 'marni'),
			'slug' 		=> 'kirki',
			'required' 	=> true,
		),
		array(
			'name' 		=> esc_html__('Meta Box', 'marni'),
			'slug' 		=> 'meta-box',
			'required' 	=> true,
		),
		array(
			'name'               => esc_html__('Marni Meta Boxes', 'marni'),
			'slug'               => 'marni-meta-boxes',
			'source'             => get_template_directory() . '/inc/tgm-plugin-activation/plugins/marni-meta-boxes.zip', 
			'required'           => true, 
			'version'            => '2.1', 
		),		


		// recommended
		array(
			'name'               => esc_html__('Marni Custom Post Types', 'marni'), 
			'slug'               => 'marni-cpt',
			'source'             => get_template_directory() . '/inc/tgm-plugin-activation/plugins/marni-cpt.zip', 
			'required'           => false, 
			'version'            => '1.0', 
		),		
		array(
			'name'               => esc_html__('Marni Widgets', 'marni'),
			'slug'               => 'marni-widgets', 
			'source'             => get_template_directory() . '/inc/tgm-plugin-activation/plugins/marni-widgets.zip', 
			'required'           => false, 
			'version'            => '1.0', 
		),
		array(
			'name'               => esc_html__('Marni Shortcodes', 'marni'), 
			'slug'               => 'marni-shortcodes', 
			'source'             => get_template_directory() . '/inc/tgm-plugin-activation/plugins/marni-shortcodes.zip',
			'required'           => false, 
			'version'            => '1.0', 
		),

		array(
			'name'               => esc_html__('Marni Share Buttons', 'marni'), 
			'slug'               => 'marni-share', 
			'source'             => get_template_directory() . '/inc/tgm-plugin-activation/plugins/marni-share.zip',
			'required'           => false, 
			'version'            => '2.0', 
		),
		array(
			'name'          => 'WordPress Popular Posts',
			'slug'          => 'wordpress-popular-posts',
			'required'      => false,
			'version'            => '1.1', 
		),
		array(
			'name'          => 'Smash Balloon Social Photo Feed',
			'slug'          => 'instagram-feed',
			'required'      => false,
		),

		array(
			'name'          => 'MailChimp for WordPress',
			'slug'          => 'mailchimp-for-wp',
			'required'      => false,
		),
		array(
			'name' 		=> 'Intuitive Custom Post Order',
			'slug' 		=> 'intuitive-custom-post-order',
			'required' 	=> false,
		),	
		array(
			'name' 		=> 'Contact Form 7',
			'slug' 		=> 'contact-form-7',
			'required' 	=> false,
		),				
		array(
			'name' 		=> 'WooCommerce',
			'slug' 		=> 'woocommerce',
			'required' 	=> false,
		),	
		array(
			'name' 		=> 'One Click Demo Import',
			'slug' 		=> 'one-click-demo-import',
			'required' 	=> false,
		),

	);


	$config = array(
		'id'           => 'marni',                 // Unique ID for hashing notices for multiple instances of TGMPA.
		'default_path' => '',                      // Default absolute path to bundled plugins.
		'menu'         => 'tgmpa-install-plugins', // Menu slug.
		'has_notices'  => true,                    // Show admin notices or not.
		'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
		'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
		'is_automatic' => false,                   // Automatically activate plugins after installation or not.
		'message'      => '',                      // Message to output right before the plugins table.

	);

	tgmpa( $plugins, $config );
}
