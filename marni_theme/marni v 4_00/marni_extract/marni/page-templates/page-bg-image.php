<?php 
/*
Template Name: Page with Background Image
*/ 
?>


<?php get_header();

$thumb = wp_get_attachment_image_src(get_post_thumbnail_ID(), 'marni-uncropped');
$thumb_srcset = wp_get_attachment_image_srcset(get_post_thumbnail_ID(), 'marni-uncropped');

$width = '720';
if ( class_exists( 'RWMB_Field' ) ) { 
        $width = rwmb_meta( 'redsun_page-width' );
} ?>

<?php if ( $thumb && true == get_theme_mod( 'marni_responsiveimages', true ) ) { ?>
	<div class="page-fullbg" style="background-image: url(<?php echo esc_url($thumb[0]); ?>)" bg-srcset="<?php echo esc_attr($thumb_srcset); ?>" sizes="100vw">
<?php } elseif ($thumb) { ?>
	<div class="page-fullbg" style="background-image: url(<?php echo esc_url($thumb[0]); ?>)">
<?php } ?>

<div id="content" class="site-content" style="max-width:<?php echo esc_html($width); ?>px">
	<div class="container">
		<div id="primary" class="content-area">
			<main id="main" class="site-main">
				<?php while ( have_posts() ) : the_post();

					get_template_part( 'template-parts/content', 'page' );

					// If comments are open or we have at least one comment, load up the comment template.
					if ( comments_open() || get_comments_number() ) :
						comments_template();
					endif;

				endwhile; // End of the loop. ?>

			</main><!-- #main -->
		</div><!-- #primary -->
	</div><!-- .container -->
</div><!-- #content -->

</div>

<?php get_footer(); ?>