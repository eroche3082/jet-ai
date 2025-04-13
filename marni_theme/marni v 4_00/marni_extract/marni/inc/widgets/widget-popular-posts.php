<?php
/*
Plugin Name: Popular Posts Widget
Plugin URI: http://www.red-sun-design.com
Description: Display most popular posts.
Version: 1.0
Author: Gerda Gimpl
Author URI: http://www.red-sun-design.com
*/


class marni_Popular_Posts_Widget extends WP_Widget {

	/*--------------------------------------------------*/
	/* CONSTRUCT THE WIDGET
	/*--------------------------------------------------*/
	public function __construct() {
	$widget_options = array( 
		'classname' => 'popular_posts_widget', 
		'description' => esc_html__( 'Display most popular posts.', 'marni' ),
		'customize_selective_refresh' => true,
	);
	parent::__construct( 'popular_posts_widget', 'MARNI - Popular Posts', $widget_options );
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
		$number    = isset( $instance['number'] ) ? absint( $instance['number'] ) : 4;
		$show_thumb = isset( $instance['show_thumb'] ) ? esc_html( $instance['show_thumb'] ) : 'largethumb';
		$show_counter = isset( $instance['show_counter'] ) ? (bool) $instance['show_counter'] : true;
		$show_date = isset( $instance['show_date'] ) ? (bool) $instance['show_date'] : true;
		$sort = isset( $instance['sort'] ) ? esc_html( $instance['sort'] ) : 'views';
		$range = isset( $instance['range'] ) ? esc_html( $instance['range'] ) : 'monthly';
		$freshness = isset( $instance['freshness'] ) ? (bool) $instance['freshness'] : true;
		$cats = isset( $instance['cats'] ) ? esc_attr( $instance['cats'] ) : '';
		$exclude = isset( $instance['exclude'] ) ? esc_attr( $instance['exclude'] ) : '';

		$perrow = isset( $instance['perrow'] ) ? esc_html( $instance['perrow'] ) : 'four-items';
		$allowed_html = marni_allowed_html();
		
		/* before widget */
		echo wp_kses( $args['before_widget'] , $allowed_html );

		/* display title */
		if ( $title ) {
			echo wp_kses( $args['before_title'] , $allowed_html ) . esc_html($title) . wp_kses( $args['after_title'] , $allowed_html ); 
		}

		/* display popular posts */
		if ( $show_thumb == 'smallthumb' ) { 
			$thumbwidth = '240';
			$thumbheight = '180';			
		} elseif ( $show_thumb == 'smallthumbsquare' ) { 
			$thumbwidth = '240';
			$thumbheight = '240';
		} elseif ( $show_thumb == 'smallthumbportrait' ) { 
			$thumbwidth = '240';
			$thumbheight = '320';
		} elseif ( $show_thumb == 'largethumb' && $perrow == 'three-items' ) { 
			$thumbwidth = '760';
			$thumbheight = '570';
		}elseif ( $show_thumb == 'largethumb' ) { 
			$thumbwidth = '540';
			$thumbheight = '405';
		} elseif ( $show_thumb == 'largethumbsquare' && $perrow == 'three-items' ) { 
			$thumbwidth = '760';
			$thumbheight = '760';
		} elseif ( $show_thumb == 'largethumbsquare' ) { 
			$thumbwidth = '540';
			$thumbheight = '540';
		} elseif ( $show_thumb == 'largethumbportrait' && $perrow == 'three-items' ) { 
			$thumbwidth = '760';
			$thumbheight = '1000';
		} elseif ( $show_thumb == 'largethumbportrait' ) { 
			$thumbwidth = '540';
			$thumbheight = '710';
		} else { 
			$thumbwidth = '760';
			$thumbheight = '570';
		}

		if ( $show_counter ) { 
			$counter = "show-counter";
		} else { 
			$counter = "no-counter";
		}

		$output = '<li class=" '. $show_thumb .' '. $counter .' '. $perrow .' ">';
		$output .= '<div class="popular-post">';

		//thumb
		if ( $show_thumb == 'smallthumb'  || $show_thumb == 'smallthumbsquare' || $show_thumb == 'smallthumbportrait'  ) { 
			$output .= '<div class="popular-post-right popular-post-right-2col">';
		} else { 
			$output .= '<div class="popular-post-right">';
		}
		if ( $show_thumb == 'smallthumb' || $show_thumb == 'smallthumbsquare' || $show_thumb == 'smallthumbportrait' ) {
			$output .= '<div class="popular-post-thumb-small">{thumb}</div>';
		} elseif ( $show_thumb == 'largethumb' || $show_thumb == 'largethumbsquare' || $show_thumb == 'largethumbportrait' ) { 
			$output .= '<div class="popular-post-thumb">{thumb}</div>';
		} 

		// text
		$output .= '<div class="popular-post-text">';
		$output .= '<a href="{url}"><div class="post-title-small">{text_title}</div></a>';
		
		//date
		if ( $show_date ) {
			$output .= '<div class="post-info-small"><span class="post-info post-info-date"><span class="serif-italic">' . esc_html__('on ','marni') . '</span><a href="{url}">{date}</a></span></div>';
		} 

		$output .= '</div>';		
		$output .= '</div>';
		$output .= '</div>';
		$output .= '</li>';
	                                	
		// template tag
		$dateformat = get_option('date_format');
		$mp_args = array(
		    	'limit' => $number,
			'wpp_start' => '<ol class="popular-posts-list">',
			'wpp_end' => '</ol>',
			'thumbnail_width' => $thumbwidth,
			'thumbnail_height' => $thumbheight,
			'stats_date' => 1,		    	
		    	'stats_date_format' => $dateformat,
		    	'post_type' => 'post',
		    	'order_by' => $sort,
    			'range' => $range,
    			'cat' => $cats,
    			'pid' => $exclude,
    			'freshness' => $freshness,
		    	'post_html' => $output
		);

		if (function_exists('wpp_get_mostpopular')) {
			wpp_get_mostpopular( $mp_args );
		}

		/* after widget */
		echo wp_kses( $args['after_widget'] , $allowed_html );
	}

	/*--------------------------------------------------*/
	/* WIDGET ADMIN FORM
	/*--------------------------------------------------*/
	public function form( $instance ) {
    		$title     = isset( $instance['title'] ) ? esc_attr( $instance['title'] ) : 'Most Popular';
		$number    = isset( $instance['number'] ) ? absint( $instance['number'] ) : 4;
		$show_thumb = isset( $instance['show_thumb'] ) ? esc_html( $instance['show_thumb'] ) : 'largethumb';
		$show_counter = isset( $instance['show_counter'] ) ? (bool) $instance['show_counter'] : false;
		$show_date = isset( $instance['show_date'] ) ? (bool) $instance['show_date'] : false;
		$sort = isset( $instance['sort'] ) ? esc_html( $instance['sort'] ) : 'views';
		$range = isset( $instance['range'] ) ? esc_html( $instance['range'] ) : 'monthly';
		$freshness = isset( $instance['freshness'] ) ? (bool) $instance['freshness'] : false;
		$cats     = isset( $instance['cats'] ) ? esc_attr( $instance['cats'] ) : '';
		$exclude     = isset( $instance['exclude'] ) ? esc_attr( $instance['exclude'] ) : '';
		$perrow = isset( $instance['perrow'] ) ? esc_html( $instance['perrow'] ) : 'four-items';
		?>
		<p>
			<label for="<?php echo esc_attr($this->get_field_id( 'title') ); ?>"><?php esc_html_e( 'Title:', 'marni' ); ?></label>
			<input class="widefat" id="<?php echo esc_attr($this->get_field_id( 'title' )); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' )); ?>" type="text" value="<?php echo esc_attr($title); ?>" />
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'number' )); ?>"><?php esc_html_e( 'Number of Posts:', 'marni' ); ?></label>
			<input class="widefat" id="<?php echo esc_attr($this->get_field_id( 'number' ) ); ?>" name="<?php echo esc_attr($this->get_field_name( 'number' )); ?>" type="number" value="<?php echo esc_attr($number); ?>" />
		</p>

		<p>
			<label for="<?php echo esc_attr($this->get_field_id( 'show_thumb' ) ); ?>"><?php esc_html_e( 'Thumbnail:', 'marni' ); ?></label>
			<select class="widefat" id="<?php echo esc_attr($this->get_field_id( 'show_thumb' ) ); ?>" name="<?php echo esc_attr($this->get_field_name( 'show_thumb' )); ?>">
			    	<option value="nothumb" <?php selected( 'nothumb', $show_thumb ); ?>><?php esc_html_e( 'No Thumbnail', 'marni' ); ?></option>
			    	<option value="smallthumb" <?php selected( 'smallthumb', $show_thumb ); ?>><?php esc_html_e( 'Small Thumbnail Landscape', 'marni' ); ?></option>
			    	<option value="smallthumbsquare" <?php selected( 'smallthumbsquare', $show_thumb ); ?>><?php esc_html_e( 'Small Thumbnail Square', 'marni' ); ?></option>
			    	<option value="smallthumbportrait" <?php selected( 'smallthumbportrait', $show_thumb ); ?>><?php esc_html_e( 'Small Thumbnail Portrait', 'marni' ); ?></option>
			    	<option value="largethumb" <?php selected( 'largethumb', $show_thumb ); ?>><?php esc_html_e( 'Large Thumbnail Landscape', 'marni' ); ?></option>
			    	<option value="largethumbsquare" <?php selected( 'largethumbsquare', $show_thumb ); ?>><?php esc_html_e( 'Large Thumbnail Square', 'marni' ); ?></option>
			    	<option value="largethumbportrait" <?php selected( 'largethumbportrait', $show_thumb ); ?>><?php esc_html_e( 'Large Thumbnail Portrait', 'marni' ); ?></option>
			</select>
		</p>

		<p>
			<label for="<?php echo esc_attr($this->get_field_id( 'show_counter' ) ); ?>"><?php esc_html_e( 'Display Counter?', 'marni' ); ?></label>
			<input class="checkbox" type="checkbox"<?php checked( $show_counter ); ?> id="<?php echo esc_attr($this->get_field_id( 'show_counter' ) ); ?>" name="<?php echo esc_attr($this->get_field_name( 'show_counter' )); ?>" />
		</p>

		<p>
			<label for="<?php echo esc_attr($this->get_field_id( 'show_date' ) ); ?>"><?php esc_html_e( 'Display post date?', 'marni' ); ?></label>
			<input class="checkbox" type="checkbox"<?php checked( $show_date ); ?> id="<?php echo esc_attr($this->get_field_id( 'show_date' ) ); ?>" name="<?php echo esc_attr($this->get_field_name( 'show_date' )); ?>" />
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'sort' )); ?>"><?php esc_html_e( 'Sort posts by:', 'marni' ); ?></label>
			<select class="widefat" id="<?php echo esc_attr($this->get_field_id( 'perrow' ) ); ?>" name="<?php echo esc_attr($this->get_field_name( 'sort' )); ?>">
			    	<option value="comments" <?php selected( 'comments', $sort ); ?>><?php esc_html_e( 'Comments', 'marni' ); ?></option>
			    	<option value="views" <?php selected( 'views', $sort ); ?>><?php esc_html_e( 'Total Views', 'marni' ); ?></option>
			    	<option value="avg" <?php selected( 'avg', $sort ); ?>><?php esc_html_e( 'Avg Daily Views', 'marni' ); ?></option>
			</select>		
		</p>

		<br /><hr /><br />
		<legend><strong><?php esc_html_e('Filter', 'marni'); ?></strong></legend>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'range' )); ?>"><?php esc_html_e( 'Time Range:', 'marni' ); ?></label>
			<select class="widefat" id="<?php echo esc_attr($this->get_field_id( 'range' ) ); ?>" name="<?php echo esc_attr($this->get_field_name( 'range' )); ?>">
			    	<option value="daily" <?php selected( 'daily', $range ); ?>><?php esc_html_e( 'Last 24 Hours', 'marni' ); ?></option>
			    	<option value="weekly" <?php selected( 'weekly', $range ); ?>><?php esc_html_e( 'Last 7 Days', 'marni' ); ?></option>
			    	<option value="monthly" <?php selected( 'monthly', $range ); ?>><?php esc_html_e( 'Last 30 Days', 'marni' ); ?></option>
			    	<option value="all" <?php selected( 'all', $range ); ?>><?php esc_html_e( 'All Time', 'marni' ); ?></option>
			</select>		
		</p>

		<p>
			<label for="<?php echo esc_attr($this->get_field_id( 'freshness' ) ); ?>"><?php esc_html_e( 'Display only posts published within the selected Time Range?', 'marni' ); ?></label>
			<input class="checkbox" type="checkbox"<?php checked( $freshness ); ?> id="<?php echo esc_attr($this->get_field_id( 'freshness' ) ); ?>" name="<?php echo esc_attr($this->get_field_name( 'freshness' )); ?>" />
		</p>
		<p>
			<label for="<?php echo esc_attr($this->get_field_id( 'cats') ); ?>"><?php esc_html_e( 'Categories:', 'marni' ); ?></label>
			<input class="widefat" id="<?php echo esc_attr($this->get_field_id( 'cats' )); ?>" name="<?php echo esc_attr( $this->get_field_name( 'cats' )); ?>" type="text" value="<?php echo esc_attr($cats); ?>" />
			<small><?php esc_html_e( 'Enter category IDs, separated by comma', 'marni' ); ?></small
		</p>
		<p>
			<label for="<?php echo esc_attr($this->get_field_id( 'exclude') ); ?>"><?php esc_html_e( 'Exclude Posts:', 'marni' ); ?></label>
			<input class="widefat" id="<?php echo esc_attr($this->get_field_id( 'exclude' )); ?>" name="<?php echo esc_attr( $this->get_field_name( 'exclude' )); ?>" type="text" value="<?php echo esc_attr($exclude); ?>" />
			<small><?php esc_html_e( 'Enter post IDs, separated by comma', 'marni' ); ?></small
		</p>

		<br /><hr /><br />
		<legend><strong><?php esc_html_e('Settings for Sidebar Home Top', 'marni'); ?></strong></legend>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'perrow' )); ?>"><?php esc_html_e( 'Number of Posts per Row:', 'marni' ); ?></label>
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
		$instance['title'] = sanitize_text_field( $new_instance['title'] );
		$instance['number'] = (int) $new_instance['number'];
		$instance['show_thumb'] = isset( $new_instance['show_thumb'] ) ? strip_tags($new_instance['show_thumb']) : 'largethumb';
		$instance['show_counter'] = isset( $new_instance['show_counter'] ) ? (bool) $new_instance['show_counter'] : '';
		$instance['show_date'] = isset( $new_instance['show_date'] ) ? (bool) $new_instance['show_date'] : '';
		$instance['sort'] = isset( $new_instance['sort'] ) ? strip_tags($new_instance['sort']) : 'views';
		$instance['range'] = isset( $new_instance['range'] ) ? strip_tags($new_instance['range']) : 'monthly';
		$instance['freshness'] = isset( $new_instance['freshness'] ) ? (bool) $new_instance['freshness'] : false;
		$instance['cats'] = sanitize_text_field( $new_instance['cats'] );
		$instance['exclude'] = sanitize_text_field( $new_instance['exclude'] );
		$instance['perrow'] = isset( $new_instance['perrow'] ) ? strip_tags($new_instance['perrow']) : 'four-items';
	return $instance;
	}
}

	/*--------------------------------------------------*/
	/* REGISTER THE WIDGET
	/*--------------------------------------------------*/
	function marni_register_popular_posts_widget() { 
		register_widget( 'marni_Popular_Posts_Widget' );
	}
	add_action( 'widgets_init', 'marni_register_popular_posts_widget' );
?>