<?php
$slider_display = get_theme_mod('marni_slider_display', false);
$slider_type = get_theme_mod('marni_slider_type', 'carousel');
$slider_text_style = get_theme_mod('marni_slider_text_style', 'dark');
if ( $slider_type == 'carousel' ) {
	$slider_items = 2;
	$slider_autowidth = get_theme_mod('marni_slider_autowidth', false);
} else {
	$slider_items = 1;
	$slider_autowidth = 'false';
}
$slider_height = get_theme_mod('marni_slider_height', '540');
$slider_maxheight = get_theme_mod('marni_slider_maxheight', true);
if ( $slider_maxheight ) {
	$maxheight = 'useslidermaxheight';
} else {
	$maxheight = 'noslidermaxheight';
}

$slider_speed_value = get_theme_mod('marni_slider_speed', '5');
$slider_speed = $slider_speed_value . '000';

$slider = new WP_Query(
	array(
		'posts_per_page' => -1,
		'ignore_sticky_posts' => 1,
		'post_type'   => 'post',
		'orderby' => 'meta_value',
                'meta_key' => 'redsun_sliderpostorder',  
                'order_by' => 'meta_value',
		'order' => 'ASC',
	)
);

if ($slider_display) {
if ($slider->have_posts() ) : ?>
<div class="slider <?php echo sanitize_html_class("$slider_type"); ?> <?php echo sanitize_html_class("$maxheight"); ?> <?php echo sanitize_html_class("$slider_text_style"); ?>" data-slider-items="<?php echo intval($slider_items); ?>" data-slider-speed="<?php echo esc_attr($slider_speed); ?>" data-slider-autowidth="<?php echo esc_attr($slider_autowidth); ?>">
	
	<div class="owl-carousel" >

		<?php while ($slider->have_posts()) : $slider->the_post(); 

		$display = rwmb_meta( 'redsun_sliderpost' );

		if ( has_post_thumbnail() ) { 
			if ( $slider_type == 'carousel' ) {
				$image = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'marni-uncropped-full'); 
				$imageurl = $image[0];
			} else {
				$image = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'marni-uncropped-videox2'); 
				$imageurl = $image[0];
			}
		} 

		if ($image) {
			$imagewidth = $image[1]; 
			$imageheight = $image[2];
			$newwidth = $slider_height / $imageheight * $imagewidth ;
		}
		
		if ($display) { ?>
			<div class="owl-slide" style="background-image: url(<?php echo esc_url($imageurl); ?>);  <?php if ( $slider_type == 'carousel' && true == get_theme_mod( 'marni_slider_autowidth', false ) ) { ?> width:<?php echo esc_attr($newwidth); ?>px <?php } ?>">
				<div class="slider-dark-overlay">
					<div class="slider-overlay-container">

						<div class="slider-overlay-content">
							<div class="categories">
								<?php if (get_theme_mod('marni_slider_category',true) == true) {
									the_category(' ');
								} ?> 
							</div>
							<?php the_title( '<h2 class="slide-entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' ); ?>
							<?php if (get_theme_mod('marni_slider_more_button',true) == true) {
								marni_read_more();
							} ?> 
						</div>

						<!-- ENTRY META -->
						<div class="entry-meta-wrap">
						        <div class="entry-meta entry-meta-bgcolor <?php marni_has_slider_meta(); ?>">
								<?php 
								// date
								if (get_theme_mod('marni_slider_date',true) == true) { 
									marni_post_date(); 
								}
								// comments
								if (get_theme_mod('marni_slider_comments',true) == true ) {
									marni_comments_count(true);
								}
								// author
								if (get_theme_mod('marni_slider_author',true) == true) { 
									marni_post_author();
								}
								// location
								if ( get_theme_mod('marni_slider_location',true) == true ) { 
									marni_location();
								} 
								// views
								if ( get_theme_mod('marni_slider_views',true) == true) 
        								marni_views_count();
								?>

							</div>
						</div>

					</div>
				</div>
				<a href="<?php the_permalink();?>" class="overlay-link"></a>
			</div>
	    	<?php }
	    	endwhile; 
	    	wp_reset_postdata(); ?>

	</div>
</div>	    	
<?php endif;
} ?>