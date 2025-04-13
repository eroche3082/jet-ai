<?php
/*
Plugin Name: Categories Widget
Plugin URI: http://www.red-sun-design.com
Description: Display Categories
Version: 1.0
Author: Gerda Gimpl
Author URI: http://www.red-sun-design.com
*/


class marni_Categories_Widget extends WP_Widget {

	/*--------------------------------------------------*/
	/* CONSTRUCT THE WIDGET
	/*--------------------------------------------------*/
	public function __construct() {
	$widget_options = array( 
		'classname' => 'categories_widget', 
		'description' => esc_html__( 'Display Categories with Category Image', 'marni' ) 
	);
	parent::__construct( 'categories_widget', 'MARNI - Categories', $widget_options );
	}

	/*--------------------------------------------------*/
	/* DISPLAY THE WIDGET
	/*--------------------------------------------------*/	
	public function widget( $args, $instance ) {

		$title = isset( $instance['title'] ) ? ( $instance['title'] ) : '';
		$inorex = isset( $instance['inorex'] ) ? esc_html( $instance['inorex'] ) : 'catexclude';
		$cats = isset( $instance['cats'] ) ? ( $instance['cats'] ) : '';
		$height = isset( $instance['height'] ) ? ( $instance['height'] ) : '120';
		$perrow = isset( $instance['perrow'] ) ? esc_html( $instance['perrow'] ) : 'four-items';


		$catinclude = '';
		$catexclude = '';
		if ($inorex == 'catexclude') {
			$catexclude = $cats;
		} elseif ($inorex == 'catinclude') {
			$catinclude = $cats;
		}

		$allowed_html = marni_allowed_html();
		
		/* before widget */
		echo wp_kses( $args['before_widget'] , $allowed_html );

		/* display title */
		if ( $title ) {
			echo wp_kses( $args['before_title'] , $allowed_html ) . esc_html($title) . wp_kses( $args['after_title'] , $allowed_html ); 
		}

		/* display categories */ 
		?> 
		<ul class="cats">
			<?php 
			$cat_args = array(
		        	'orderby' => 'menu_order',                                     
		                'term_order' => 'ASC',	
		                'exclude' => esc_attr($catexclude),
		                'include' => esc_attr($catinclude),                
		        	);

			$categories = get_categories( $cat_args );

			foreach ( $categories as $category ) { 
				$term_id = $category->term_id;
				$catimage = get_term_meta($term_id,'redsun_category-image', true);

				// check if array and if has category image
				if (is_array($catimage)) {
					$hascatimage = array_filter($catimage);
				} else {
					$hascatimage = $catimage;
				} 

				if ($hascatimage) {
					$thumb = wp_get_attachment_image_src( $catimage, 'marni-landscape-large' );
					?>
					<li class="widget-cat-has-image <?php echo esc_html($perrow); ?>">
						<div class="category-header overlay" style="height:<?php echo intval($height); ?>px">
							<a href=" <?php echo get_category_link( $category->term_id ) ?> " rel="bookmark">
								<div class="widget-cat-image" style="background-image: url(<?php echo esc_url($thumb[0]); ?>)">
									<div class="color-overlay">
										<div class="overlay-content">
											<?php echo esc_html( $category->name ); ?>
										</div>
									</div>
								</div>
							</a>
						</div>
					</li>
				<?php } else { ?>
					<li class="widget-cat <?php echo esc_html($perrow); ?>"> 
						<a href=" <?php echo get_category_link( $category->term_id ) ?> " rel="bookmark"> <?php echo esc_html($category->name); ?> </a> 
					</li>
				<?php }
			} ?>
		</ul> 
		<?php

		/* after widget */
		echo wp_kses( $args['after_widget'] , $allowed_html );
	}

	/*--------------------------------------------------*/
	/* WIDGET ADMIN FORM
	/*--------------------------------------------------*/
	public function form( $instance ) {

		$title = isset( $instance['title'] ) ? esc_attr( $instance['title'] ) : 'Categories';
		$inorex = isset( $instance['inorex'] ) ? esc_html( $instance['inorex'] ) : 'exclude';
		$cats = isset( $instance['cats'] ) ? esc_attr( $instance['cats'] ) : '';
		$height = isset( $instance['height'] ) ? absint( $instance['height'] ) : 120;
		$perrow = isset( $instance['perrow'] ) ? esc_html( $instance['perrow'] ) : 'four-items';


		?>

		<p>
			<label for="<?php echo esc_html($this->get_field_id( 'title' )); ?>"><?php esc_html_e( 'Title:', 'marni' ); ?></label>
			<input class="widefat" id="<?php echo esc_html($this->get_field_id( 'title' )); ?>" name="<?php echo esc_attr($this->get_field_name( 'title' )); ?>" type="text" value="<?php echo esc_attr($title); ?>" />
		</p>

		<p>
			<label for="<?php echo esc_attr($this->get_field_id( 'exclude' )); ?>"><?php esc_html_e( 'Categories:', 'marni' ); ?></label>
			<select class="widefat" id="<?php echo esc_attr($this->get_field_id( 'inorex' ) ); ?>" name="<?php echo esc_attr($this->get_field_name( 'inorex' )); ?>">
				<option value="catexclude" <?php selected( 'catexclude', $inorex ); ?>><?php esc_html_e( 'Exclude below categories', 'marni' ); ?></option>
				<option value="catinclude" <?php selected( 'catinclude', $inorex ); ?>><?php esc_html_e( 'Include below categories', 'marni' ); ?></option>
			</select>	
			<br><br>
			<input class="widefat" id="<?php echo esc_attr($this->get_field_id( 'cats' )); ?>" name="<?php echo esc_attr($this->get_field_name( 'cats' )); ?>" type="text" value="<?php echo esc_attr($cats); ?>" />
			<?php esc_html_e('Enter Category IDs, separated by comma.','marni');?>
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'height' )); ?>"><?php esc_html_e( 'Category image height (in px)', 'marni' ); ?></label>
			<input class="widefat" id="<?php echo esc_attr($this->get_field_id( 'height' ) ); ?>" name="<?php echo esc_attr($this->get_field_name( 'height' )); ?>" type="number" value="<?php echo esc_attr($height); ?>" />
		</p>		

		<br /><hr /><br />
		<legend><strong><?php esc_html_e('Settings for Sidebar Home Top', 'marni'); ?></strong></legend>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'perrow' )); ?>"><?php esc_html_e( 'Number of Categories per Row:', 'marni' ); ?></label>
			<select class="widefat" id="<?php echo esc_attr($this->get_field_id( 'perrow' ) ); ?>" name="<?php echo esc_attr($this->get_field_name( 'perrow' )); ?>">
			    	<option value="three-items" <?php selected( 'three-items', $perrow ); ?>><?php esc_html_e( 'Three', 'marni' ); ?></option>
			    	<option value="four-items" <?php selected( 'four-items', $perrow ); ?>><?php esc_html_e( 'Four', 'marni' ); ?></option>
			    	<option value="five-items" <?php selected( 'five-items', $perrow ); ?>><?php esc_html_e( 'Five', 'marni' ); ?></option>
			</select>		
		</p>
	<?php }


	/*--------------------------------------------------*/
	/* UPDATE THE WIDGET
	/*--------------------------------------------------*/
	public function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance[ 'title' ] = strip_tags( $new_instance[ 'title' ] );
		$instance[ 'inorex' ] = isset( $new_instance['inorex'] ) ? strip_tags($new_instance['inorex']) : 'exclude';
		$instance[ 'cats' ] = strip_tags( $new_instance[ 'cats' ] );
		$instance[ 'height' ] = intval( $new_instance[ 'height' ] );
		$instance['perrow'] = isset( $new_instance['perrow'] ) ? strip_tags($new_instance['perrow']) : 'four-items';

	return $instance;
	}
}

	/*--------------------------------------------------*/
	/* REGISTER THE WIDGET
	/*--------------------------------------------------*/
	function marni_register_categories_widget() { 
		register_widget( 'marni_Categories_Widget' );
	}
	add_action( 'widgets_init', 'marni_register_categories_widget' );
?>