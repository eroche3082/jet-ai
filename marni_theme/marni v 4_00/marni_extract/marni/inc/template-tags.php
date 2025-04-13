<?php

/* Social Accounts list *************************************************************************/
if ( ! function_exists( 'marni_icon_list' ) ) {
	function marni_icon_list($label = false) {
		$icons = get_theme_mod( 'social_accounts', '' ); 
		if ($icons) { ?> 
			<div class="social-wrap">
				<ul class="socialicons">
				<?php foreach( $icons as $icon ) { 
					$type = $icon['type'];
					$url = $icon['url'];
					$text = $icon['text'];
					if ($url !== '') { ?>
						<li><a href="<?php echo esc_url($url); ?>" rel="noreferrer noopener" target="_blank">
							<i class="fa-brands fa-<?php echo esc_html($type); ?>"></i>
							<?php if ($label == true && $text !== '') { ?>
								<span class="social-label"><?php echo esc_html($text); ?></span>
							<?php } ?>
						</a></li>
					<?php }	
				} ?>
				</ul>
			</div>
		<?php }
	}
}


/* Read More Button *************************************************************************/
if ( ! function_exists( 'marni_read_more' ) ) {
	function marni_read_more() { ?>
		<a href="<?php the_permalink() ?>" class="more-link">
			<span class="button-more button-outline">
				<?php 
				if ( has_post_format( 'video' )) { 
				  	esc_html_e('Watch Video','marni');
				} else {
					esc_html_e('View Post','marni'); 
				} ?>
				<?php the_title( '<span class="screen-reader-text">', '</span>', true ); ?>
			</span>
		</a>
  	<?php }
}


/* Pretty Date *************************************************************************/
if ( ! function_exists( 'marni_pretty_date' ) ) {
  	function marni_pretty_date() { ?>
			<div class="post-date pretty-date">
		                <a href="<?php the_permalink() ?>" rel="bookmark" title="<?php esc_attr_e('Permanent link to', 'marni') ?> <?php the_title_attribute(); ?>">
					<span class="d"><?php the_time('d'); ?></span>
		                        <span class="date-right">
						<span class="m"><?php the_time('M'); ?></span>
						<span class="y"><?php the_time('Y'); ?></span>
					</span> 			        
		                </a>
	                </div> <!-- .post-date-->
  	<?php }
}


/* Post Date *************************************************************************/
if ( ! function_exists( 'marni_post_date' ) ) {
function marni_post_date() { ?>
	<span class="post-info post-info-date">
		<?php $time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
		if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
			$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
		}

		$time_string = sprintf( $time_string,
			esc_attr( get_the_date( 'c' ) ),
			esc_html( get_the_date() ),
			esc_attr( get_the_modified_date( 'c' ) ),
			esc_html( get_the_modified_date() )
		);

		if (is_single()) {
			$posted_on = sprintf(
				esc_html_x( '%s', 'post date', 'marni' ), $time_string );
		} else {
			$posted_on = sprintf(
				esc_html_x( '%s', 'post date', 'marni' ),
				'<a href="' . esc_url( get_permalink() ) . '" rel="bookmark">' . $time_string . '</a>'
			);			
		}

		echo '<span class="serif-italic">' . esc_html__('on ','marni') . '</span>' . $posted_on; // WPCS: XSS OK.
		?>
	</span>
<?php 
} 
}


/* Post Comment Count *************************************************************************/
if ( ! function_exists( 'marni_comments_count' ) ) {
function marni_comments_count($icon = true) { 
	if (comments_open() ) { ?>
		<span class="post-info post-info-comment">
			<?php if ( $icon == true ) { ?><i class="fa fa-comment-o"></i><?php } 
			if ( $icon == false ) {
				echo '<span class="serif-italic">' . esc_html__('with ','marni') . '</span>';
				comments_popup_link(esc_html__('0 comments','marni'), esc_html__('1 comment','marni'), '% ' . esc_html__('comments','marni'), 'comments-link', '');
			} else {
				comments_popup_link('0', '1', '%', 'comments-link', '');
			} ?>
		</span>
	<?php }
}
}


/* Post Views *************************************************************************/
if ( ! function_exists( 'marni_views_count' )  ) {
function marni_views_count() { 
	if ( function_exists('wpp_get_views') ) { ?>
		<span class="post-info post-info-views">
			<?php 	
			echo wpp_get_views( get_the_ID() ); 
        		esc_html_e(' views','marni'); 
        		?>
		</span>
	<?php }
}
}


/* Post Author *************************************************************************/
if ( ! function_exists( 'marni_post_author' ) ) {
function marni_post_author() { ?>
		<span class="post-info post-info-author">
			<?php $byline = sprintf(
				'<span class="serif-italic">' . esc_html_x( 'by %s', 'post author', 'marni' ),
				'</span><span class="author vcard"><a class="url fn n" href="' . esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ) . '">' . esc_html( get_the_author() ) . '</a></span>'
			);
			echo '<span class="post-author"> ' . $byline . '</span>'; // WPCS: XSS OK.
			?>
		</span>
<?php }
}


/* Location *************************************************************************/
if ( ! function_exists( 'marni_location' ) ) {
function marni_location() { 
	if (class_exists( 'RWMB_Field' ) ) { 
        	$location = rwmb_meta( 'redsun_location' );
        	if ( $location ) { ?>
	        	<span class="post-info post-info-location">
	        		<i class="fa fa-map-marker"></i> 
	        		<?php echo esc_html($location); ?>
	        	</span>
        	<?php }
	} 
}
}



/* The Related Posts ********************************************************************/
if ( ! function_exists( 'marni_related_posts' ) ) {
	function marni_related_posts() {

		$post_id = get_the_ID();

		if (get_theme_mod('marni_related_source','cagegory') == 'category') {
			$relatedposts = get_the_category($post_id);
			$relatedposts_in = 'category__in';
		} else {
			$relatedposts = get_the_tags($post_id);
			$relatedposts_in = 'tag__in';
		};

		$order = get_theme_mod('marni_related_order','rand');
		
		if ($relatedposts) {

		$relatedposts_ids = array();
		foreach($relatedposts as $relatedpost) $relatedposts_ids[] = $relatedpost->term_id;
		$related_args = array(
			$relatedposts_in   => $relatedposts_ids,
			'post__not_in'     => array($post_id),
			'posts_per_page'   => 3,
			'orderby' 	   => $order
			);
		$related = new WP_Query( $related_args );

		if ( $related->have_posts() && $related->post_count >= 1) { 

			$layout = "has-sidebar";
			if ( class_exists( 'RWMB_Field' ) ) { 
				if ( has_post_format( 'video' ) ) {
					$layout = rwmb_meta( 'redsun_single-video-layout' );
				} else {
					$layout = rwmb_meta( 'redsun_single-layout' );
				}
			}
			?>

		<div class="related-posts">

			<div class="title-center">
				<h3 class="related section-title" ><?php esc_html_e('Recommended for you','marni');?></h3>
			</div>

			<div class="related-articles-wrap">

				<?php while ( $related->have_posts() ) : $related->the_post(); ?>

					<article <?php post_class('post-related post-list'); ?>>

						<?php if ( has_post_thumbnail() ) { ?>
							<a href="<?php the_permalink();?>">
								<div class="post-thumbnail">
									<?php 
									if ( $layout == 'has-sidebar' ||  
									     $layout == 'sidebar-below-title' || 
									     $layout == 'sidebar-below-thumb' ) { 
										the_post_thumbnail('marni-square-small');
								       	 } else {
								       	 	the_post_thumbnail('marni-square-medium');
								       	 } ?>
								</div>
							</a>
						<?php } ?>

						<div class="post-title-small"><a href="<?php the_permalink();?>" class="related-post-title"><?php the_title(); ?></a></div>

						<div class="post-info-small"><?php marni_post_date(); ?></div>

					</article>

				<?php endwhile; ?>
			</div>
		</div>
		<?php wp_reset_postdata(); ?>
		<?php }
		}
	}
}


/* WOOCOMMERCE */
if ( class_exists( 'woocommerce' ) ) { 
	/** Add Cart icon and count to header if WC is active **********************************************/
	if ( ! function_exists( 'marni_cart_count' ) ) {
		function marni_cart_count() {
				$count = WC()->cart->get_cart_contents_count(); ?>
				<a class="cart-contents" href="<?php echo wc_get_cart_url(); ?>" title="<?php esc_attr_e( 'View your shopping cart','marni' ); ?>"><?php
				if ( $count > 0 ) { ?>
					<span class="cart-contents-count"><?php echo esc_html( $count ); ?></span>
				<?php } ?>
				</a>
		<?php }
	}

	// Ensure cart contents update when products are added to the cart via AJAX
	function marni_add_to_cart_fragment( $fragments ) {
		global $woocommerce;
		ob_start();
		$count = WC()->cart->cart_contents_count; ?>
		<a class="cart-contents" href="<?php echo wc_get_cart_url(); ?>" title="<?php esc_attr_e( 'View your shopping cart','marni' ); ?>"><?php
		if ( $count > 0 ) { ?>
			<span class="cart-contents-count"><?php echo esc_html( $count ); ?></span>
		<?php } ?>
		</a>
		<?php $fragments['a.cart-contents'] = ob_get_clean();
		return $fragments;
	}
	add_filter( 'woocommerce_add_to_cart_fragments', 'marni_add_to_cart_fragment' );
}



/* Archive Page Title *********************************************************************/  
add_filter( 'get_the_archive_title', function ($title) {  
  
    	if ( is_category() ) {  
  
            $title = single_cat_title( '', false );  
  
        } elseif ( is_month() ) {  
  
            $title = single_month_title( ' ', false );  

        } elseif ( is_tag() ) {  
  
            $title = '#' . single_tag_title( '', false );  
  
        } elseif ( is_author() ) {  
  
            $title = '<span class="vcard">' . get_the_author() . '</span>' ;  
  
        }  
  
    return $title;  
  
}); 



/* Prints HTML with meta information for the categories, tags and comments. **************/
if ( ! function_exists( 'marni_entry_footer' ) ) :

function marni_entry_footer() {
	// Hide category and tag text for pages.
	if ( 'post' === get_post_type() ) {
		/* translators: used between list items, there is a space after the comma */
		$categories_list = get_the_category_list( esc_html__( ', ', 'marni' ) );
		if ( $categories_list && marni_categorized_blog() ) {
			printf( '<span class="cat-links">' . esc_html__( 'Posted in %1$s', 'marni' ) . '</span>', $categories_list ); // WPCS: XSS OK.
		}

		/* translators: used between list items, there is a space after the comma */
		$tags_list = get_the_tag_list( '', esc_html__( ', ', 'marni' ) );
		if ( $tags_list ) {
			printf( '<span class="tags-links">' . esc_html__( 'Tagged %1$s', 'marni' ) . '</span>', $tags_list ); // WPCS: XSS OK.
		}
	}

	if ( ! is_single() && ! post_password_required() && ( comments_open() || get_comments_number() ) ) {
		echo '<span class="comments-link">';
		/* translators: %s: post title */
		comments_popup_link( sprintf( wp_kses( __( 'Leave a Comment<span class="screen-reader-text"> on %s</span>', 'marni' ), array( 'span' => array( 'class' => array() ) ) ), get_the_title() ) );
		echo '</span>';
	}

	edit_post_link(
		sprintf(
			/* translators: %s: Name of current post */
			esc_html__( 'Edit %s', 'marni' ),
			the_title( '<span class="screen-reader-text">"', '"</span>', false )
		),
		'<span class="edit-link">',
		'</span>'
	);
}
endif;


/**
 * Returns true if a blog has more than 1 category.
 *
 * @return bool
 */
function marni_categorized_blog() {
	if ( false === ( $all_the_cool_cats = get_transient( 'marni_categories' ) ) ) {
		// Create an array of all the categories that are attached to posts.
		$all_the_cool_cats = get_categories( array(
			'fields'     => 'ids',
			'hide_empty' => 1,
			// We only need to know if there is more than one category.
			'number'     => 2,
		) );

		// Count the number of categories that are attached to the posts.
		$all_the_cool_cats = count( $all_the_cool_cats );

		set_transient( 'marni_categories', $all_the_cool_cats );
	}

	if ( $all_the_cool_cats > 1 ) {
		// This blog has more than 1 category so marni_categorized_blog should return true.
		return true;
	} else {
		// This blog has only 1 category so marni_categorized_blog should return false.
		return false;
	}
}

/**
 * Flush out the transients used in marni_categorized_blog.
 */
function marni_category_transient_flusher() {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	// Like, beat it. Dig?
	delete_transient( 'marni_categories' );
}
add_action( 'edit_category', 'marni_category_transient_flusher' );
add_action( 'save_post',     'marni_category_transient_flusher' );



/* META *************************************************************************/
// has slider meta
if ( ! function_exists( 'marni_has_slider_meta' ) ) {
function marni_has_slider_meta() { 
	if (class_exists( 'RWMB_Field' ) ) { 
		$location = rwmb_meta( 'redsun_location' );
		if (	(get_theme_mod('marni_slider_date',true) == true)  || 
		 	(comments_open() && get_theme_mod('marni_slider_comments',true) == true )  ||
			(get_theme_mod('marni_slider_author',true) == true)  ||
			( class_exists('WordpressPopularPosts') && (get_theme_mod('marni_slider_views',true) == true) )  ||
			( class_exists( 'RWMB_Field' ) && ($location) && get_theme_mod('marni_slider_location',true) == true )
		) { 
			echo 'has-slider-meta';
		}
	}
}
}

// has contentbox post meta
if ( ! function_exists( 'marni_has_cb_post_meta' ) ) {
function marni_has_cb_post_meta() {
	if (class_exists( 'RWMB_Field' ) ) {  
		$contentboxdate = rwmb_meta( 'redsun_contentbox-date' );
		$contentboxcommentsnumber = rwmb_meta( 'redsun_contentbox-commentsnumber' );
		$contentboxauthor = rwmb_meta( 'redsun_contentbox-author' );
		$location = rwmb_meta( 'redsun_location' );
		$contentboxlocation = rwmb_meta( 'redsun_contentbox-location' );
		$contentboxviews = rwmb_meta( 'redsun_contentbox-views' );
		if (	($contentboxdate)  || 
		 	(comments_open() && $contentboxcommentsnumber )  ||
			($contentboxauthor)  ||
			( class_exists('WordpressPopularPosts') && $contentboxviews )  ||
			( class_exists( 'RWMB_Field' ) && ($location) && $contentboxlocation )
		) { 
			echo 'has-cb-post-meta';
		} else {
			echo 'hello';
		}
	}
}
}

// has home meta
if ( ! function_exists( 'marni_has_home_meta' ) ) {
function marni_has_home_meta() { 
	if (class_exists( 'RWMB_Field' ) ) { 
		$location = rwmb_meta( 'redsun_location' );
		if (	(get_theme_mod('marni_home_date',true) == true)  || 
		 	(comments_open() && get_theme_mod('marni_home_comments',true) == true )  ||
			(get_theme_mod('marni_home_author',true) == true)  ||
			(get_theme_mod('marni_home_views',true) == true)  ||
			( class_exists( 'RWMB_Field' ) && ($location) && get_theme_mod('marni_home_location',true) == true )
		) { 
			echo 'has-home-meta';
		}
	}
}
}




// has archive meta
if ( ! function_exists( 'marni_has_archive_meta' ) ) {
function marni_has_archive_meta() { 
	if (class_exists( 'RWMB_Field' ) ) { 
		$location = rwmb_meta( 'redsun_location' );
		if (	(get_theme_mod('marni_archives_date',true) == true)  || 
		 	(comments_open() && get_theme_mod('marni_archives_comments',true) == true )  ||
			(get_theme_mod('marni_archives_author',true) == true)  ||
			(get_theme_mod('marni_archives_views',true) == true)  ||
			( class_exists( 'RWMB_Field' ) && ($location) && get_theme_mod('marni_archives_location',true) == true )
		) { 
			echo 'has-archive-meta';
		}
	}
}
}

?>