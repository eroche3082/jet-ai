<?php  if ( class_exists( 'woocommerce' ) ) { 
/*
Template Name: Shop Frontpage
*/ 
} ?>

<?php get_header();

$perrow = get_theme_mod( 'marni_itemsperrow', 'three-items' );
$topimage = get_theme_mod( 'marni_shopimage' );
$topimage_id = attachment_url_to_postid( $topimage );
$topimage_srcset = wp_get_attachment_image_srcset($topimage_id, 'marni-uncropped');

$title = get_theme_mod( 'marni_shopimage_title', '');
if ( get_theme_mod('marni_shopimage') != '' ) { ?>
<div class="top-image-wrap">
	<?php if ( true == get_theme_mod( 'marni_responsiveimages', true ) ) { ?>
		<div class="top-image image-fullbg" style="background-image: url(<?php echo esc_url( $topimage ); ?>)" bg-srcset="<?php echo esc_attr($topimage_srcset); ?>" sizes="(max-width: 767px) 95vw, 1200px">
	<?php } else { ?>
		<div class="top-image image-fullbg" style="background-image: url(<?php echo esc_url( $topimage ); ?>)">
	<?php } ?>
		<div class="top-image-content">
			<div class="top-image-content-wrap">
				<div class="topimage-title"><?php echo do_shortcode( wp_kses_post($title) ); ?></div>
			</div>
		</div>
	</div>
</div>
<?php } ?>

<div id="content" class="site-content">

	<?php 
	/* promo boxex */
	$boxes = get_theme_mod( 'promoboxes', '' ); 
	if ($boxes) { ?> 
		<ul class="promoboxes">
		<?php foreach( $boxes as $box ) { 
			$image = $box['image'];
			$text = $box['text'];
			$url = $box['url']; ?>
			<li class="promobox">
				<a href="<?php echo esc_url($url); ?>" rel="bookmark">
						<div class="promobox-image" style="background-image: url(<?php echo esc_url($image); ?>)">
						<div class="color-overlay">
							<div class="overlay-content">
								<?php echo esc_html($text); ?>

							</div>
						</div>
					</div>
				</a>
			</li>
		<?php } ?>
		</ul>
	<?php } ?>

	<?php while ( have_posts() ) : the_post(); ?>
		<article id="post-<?php the_ID(); ?>" <?php post_class( 'woocommerce'); ?>>
			<div class="entry-content <?php echo esc_html($perrow); ?>">
				<?php the_content();?>
			</div><!-- .entry-content -->
		</article><!-- #post-## -->
	<?php endwhile; ?>

</div><!-- #content -->

<?php get_footer(); ?>