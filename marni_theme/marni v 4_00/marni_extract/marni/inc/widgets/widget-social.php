<?php
/*
Plugin Name: Social Widget
Plugin URI: http://www.red-sun-design.com
Description: Display Social Accounts
Version: 1.0
Author: Gerda Gimpl
Author URI: http://www.red-sun-design.com
*/


class marni_Social_Widget extends WP_Widget {

	/*--------------------------------------------------*/
	/* CONSTRUCT THE WIDGET
	/*--------------------------------------------------*/
	public function __construct() {
	$widget_options = array( 
		'classname' => 'social_widget', 
		'description' => esc_html__( 'Display Your Social Accounts.', 'marni' ) 
	);
	parent::__construct( 'social_widget', 'MARNI - Social', $widget_options );
	}

	/*--------------------------------------------------*/
	/* DISPLAY THE WIDGET
	/*--------------------------------------------------*/	
	public function widget( $args, $instance ) {

		$title = isset( $instance['title'] ) ? esc_attr( $instance['title'] ) : '';

		$allowed_html = marni_allowed_html();
		
		/* before widget */
		echo wp_kses( $args['before_widget'] , $allowed_html );

		/* display title */
		if ( $title ) {
			echo wp_kses( $args['before_title'] , $allowed_html ) . esc_html($title) . wp_kses( $args['after_title'] , $allowed_html ); 
		}
		
		/* display social icons */
		marni_icon_list(); 

		/* after widget */
		echo wp_kses( $args['after_widget'] , $allowed_html );
	}

	/*--------------------------------------------------*/
	/* WIDGET ADMIN FORM
	/*--------------------------------------------------*/
	public function form( $instance ) {

		$title = 'Follow Along'; 
		if( !empty( $instance['title'] ) ) { $title = $instance['title']; }
		?>

		<p>
			<label for="<?php echo esc_attr($this->get_field_id( 'title' )); ?>"><?php esc_html_e( 'Title:', 'marni' ); ?></label>
			<input class="widefat" id="<?php echo esc_attr($this->get_field_id( 'title' )); ?>" name="<?php echo esc_attr($this->get_field_name( 'title' )); ?>" type="text" value="<?php echo esc_attr($title); ?>" />
		</p>

		<p>
			<?php esc_html_e('Add social icons in Appearance > Customize > Connect > Social Accounts.','marni');?>
		</p>
		

	<?php }


	/*--------------------------------------------------*/
	/* UPDATE THE WIDGET
	/*--------------------------------------------------*/
	public function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance[ 'title' ] = strip_tags( $new_instance[ 'title' ] );
	return $instance;
	}
}

	/*--------------------------------------------------*/
	/* REGISTER THE WIDGET
	/*--------------------------------------------------*/
	function marni_register_social_widget() { 
		register_widget( 'marni_Social_Widget' );
	}
	add_action( 'widgets_init', 'marni_register_social_widget' );
?>