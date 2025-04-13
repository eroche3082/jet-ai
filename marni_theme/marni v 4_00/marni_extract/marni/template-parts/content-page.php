<?php
$titlecolor = '#101020';
if ( class_exists( 'RWMB_Field' ) ) { 
        $titlecolor = rwmb_meta( 'redsun_page-title-color' );
} ?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	
	<header class="entry-header">
		<?php 
		if ( is_page_template( 'page-templates/page-bg-image.php' ) ) {
			the_title( '<h1 class="page-title" style="color:' .  esc_html($titlecolor) . ' ">', '</h1>' ); ?>
		<?php } else {
			the_title( '<h1 class="page-title">', '</h1>' ); ?>
			<?php } ?>
	</header><!-- .entry-header -->

	<div class="entry-content">
		<?php
			the_content();

			wp_link_pages( array(
				'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'marni' ),
				'after'  => '</div>',
			) );
		?>
	</div><!-- .entry-content -->

</article><!-- #post-## -->
