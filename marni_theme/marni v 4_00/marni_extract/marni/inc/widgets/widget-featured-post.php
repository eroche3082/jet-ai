<?php
/*
Plugin Name: Featured Post Widget
Plugin URI: http://www.red-sun-design.com
Description: Display featured post.
Version: 1.0
Author: Gerda Gimpl
Author URI: http://www.red-sun-design.com
*/


class marni_Featured_Post_Widget extends WP_Widget {

	/*--------------------------------------------------*/
	/* CONSTRUCT THE WIDGET
	/*--------------------------------------------------*/
	public function __construct() {
	$widget_options = array( 
		'classname' => 'featured_post_widget', 
		'description' => esc_html__( 'Display featured post.', 'marni' ),
		'customize_selective_refresh' => true,
	);
	parent::__construct( 'featured_post_widget', 'MARNI - Featured Post', $widget_options );
	}

	/*--------------------------------------------------*/
	/* DISPLAY THE WIDGET
	/*--------------------------------------------------*/	
	public function widget( $args, $instance ) {

		if ( ! isset( $args['widget_id'] ) ) {
			$args['widget_id'] = $this->id;
		}

		$i = 1;
		$title = isset( $instance['title'] ) ? esc_attr( $instance['title'] ) : '';
		$select = esc_attr($instance['select']);
		$show_thumb = isset( $instance['show_thumb'] ) ? (bool) $instance['show_thumb'] : false;
		$show_category = isset( $instance['show_category'] ) ? (bool) $instance['show_category'] : false;
		$show_date = isset( $instance['show_date'] ) ? (bool) $instance['show_date'] : false;
		$allowed_html = marni_allowed_html();
		
		/* before widget */
		echo wp_kses( $args['before_widget'] , $allowed_html );

		/* display title */
		if ($title) {
			echo wp_kses( $args['before_title'] , $allowed_html ) . esc_html($title) . wp_kses( $args['after_title'] , $allowed_html ); 
		}

		/* display featured post */
		?>
		<ul>

		<?php 

			$featured = new WP_Query(
			array(
				'posts_per_page'=> 1, 
				'p' => $select,
				)
			);
			while ($featured->have_posts()) : $featured->the_post(); ?>
							
			<li>
				<div class="featured-post">

					<?php if ( $show_thumb ) { ?>
						<div class="tnail-meta-wrap">
							<?php 
							$thumb = wp_get_attachment_image_src( get_post_thumbnail_id(), 'marni-landscape-medium' );
							$thumb_alt = get_post_meta( get_post_thumbnail_id(), '_wp_attachment_image_alt', true);
							?>	
						        <?php if ( has_post_thumbnail() ) { ?>
						        	<div class="tnail">
						                        <a href="<?php the_permalink() ?>">
										<img src="<?php echo esc_url($thumb[0]); ?>" width="<?php echo esc_attr($thumb[1]); ?>" height="<?php echo esc_attr($thumb[2]); ?>" alt="<?php echo esc_attr($thumb_alt); ?>" >
						                        </a>                            
								</div> <!-- .tnail -->
						        <?php }
						        ?>

							<div class="entry-meta-wrap">
							        <div class="entry-meta entry-meta-bgcolor">
									<div class="categories">
										<?php the_category(' '); ?>
									</div>
								</div>
							</div>
						</div>
					<?php } elseif ( $show_category ) { ?>
						<div class="categories categories-top">
							<?php the_category(' '); ?>
						</div>
					<?php } ?>
					
                                	<div class="post-title-small"><a href="<?php the_permalink() ?>" class="post-title" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>"><?php the_title(); ?></a></div>                         
                                	<?php if ( $show_date ) : ?>
	                                	<div class="post-info-small">
	                                		<?php marni_post_date(); ?>
	                                	</div>
					<?php endif; ?>
	                        </div>
			</li>	
            	
			<?php endwhile; wp_reset_postdata(); ?>
		</ul>

		<?php
		/* after widget */
		echo wp_kses( $args['after_widget'] , $allowed_html );
	}

	/*--------------------------------------------------*/
	/* WIDGET ADMIN FORM
	/*--------------------------------------------------*/
	public function form( $instance ) {
    		$title     = isset( $instance['title'] ) ? esc_attr( $instance['title'] ) : 'Featured Post';
		$show_thumb = isset( $instance['show_thumb'] ) ? (bool) $instance['show_thumb'] : false;
		$show_category = isset( $instance['show_category'] ) ? (bool) $instance['show_category'] : false;
		$show_date = isset( $instance['show_date'] ) ? (bool) $instance['show_date'] : false;


		$selectpost = isset( $instance['select'] ) ? esc_attr( $instance['select'] ) : '';
	        
	        // Pull all the posts into an array
	        $args = array("numberposts" => -1 , "orderby" => "post_date" , "post_type" => "post"); 
	        $options_post = array();
	        $options_post_obj = get_posts($args);
	        $options_post[''] = '<option value="BLANK">Select a post:</option>';
	        foreach ($options_post_obj as $page) {
	                $selected = $selectpost == $page->ID ? ' selected="selected"' : '';
	                $options_post[$page->ID] = '<option value="' . $page->ID .'"' . $selected . '>' . $page->post_title . '</option>';
	        } 


		?>
		<p>
			<label for="<?php echo esc_attr($this->get_field_id( 'title') ); ?>"><?php esc_html_e( 'Title:', 'marni' ); ?></label>
			<input class="widefat" id="<?php echo esc_attr($this->get_field_id( 'title' )); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' )); ?>" type="text" value="<?php echo esc_attr($title); ?>" />
		</p>

		<p>
			<label for="<?php echo esc_attr($this->get_field_id( 'select' )); ?>"><?php esc_html_e('select a post:', 'marni') ?></label>
			<select id="<?php echo esc_attr($this->get_field_id( 'select' )); ?>" class="widefat" name="<?php echo esc_attr($this->get_field_name( 'select' )); ?>">
		                <?php echo implode('', $options_post); ?>
		        </select>
		</p>		

		<p>
			<label for="<?php echo esc_attr($this->get_field_id( 'show_thumb' ) ); ?>"><?php esc_html_e( 'Display Thumbnail?', 'marni' ); ?></label>
			<input class="checkbox" type="checkbox"<?php checked( $show_thumb ); ?> id="<?php echo esc_attr($this->get_field_id( 'show_thumb' ) ); ?>" name="<?php echo esc_attr($this->get_field_name( 'show_thumb' )); ?>" />
		</p>

		<p>
			<label for="<?php echo esc_attr($this->get_field_id( 'show_category' ) ); ?>"><?php esc_html_e( 'Display Category?', 'marni' ); ?></label>
			<input class="checkbox" type="checkbox"<?php checked( $show_category ); ?> id="<?php echo esc_attr($this->get_field_id( 'show_category' ) ); ?>" name="<?php echo esc_attr($this->get_field_name( 'show_category' )); ?>" />
		</p>

		<p>
			<label for="<?php echo esc_attr($this->get_field_id( 'show_date' ) ); ?>"><?php esc_html_e( 'Display post date?', 'marni' ); ?></label>
			<input class="checkbox" type="checkbox"<?php checked( $show_date ); ?> id="<?php echo esc_attr($this->get_field_id( 'show_date' ) ); ?>" name="<?php echo esc_attr($this->get_field_name( 'show_date' )); ?>" />
		</p>	

	<?php }


	/*--------------------------------------------------*/
	/* UPDATE THE WIDGET
	/*--------------------------------------------------*/
	public function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance['title'] = sanitize_text_field( $new_instance['title'] );
		$instance['select'] = strip_tags( $new_instance['select']);
		$instance['show_thumb'] = isset( $new_instance['show_thumb'] ) ? (bool) $new_instance['show_thumb'] : false;
		$instance['show_category'] = isset( $new_instance['show_category'] ) ? (bool) $new_instance['show_category'] : false;
		$instance['show_date'] = isset( $new_instance['show_date'] ) ? (bool) $new_instance['show_date'] : false;
	return $instance;
	}
}

	/*--------------------------------------------------*/
	/* REGISTER THE WIDGET
	/*--------------------------------------------------*/
	function marni_register_featured_post_widget() { 
		register_widget( 'marni_Featured_Post_Widget' );
	}
	add_action( 'widgets_init', 'marni_register_featured_post_widget' );
?>