<?php get_header(); 

$home_layout = get_theme_mod('marni_home_layout', 'standard');
$home_sidebar = get_theme_mod('marni_home_sidebar', true);
?>

<div id="content" class="site-content">
	<div class="container <?php echo sanitize_html_class($home_layout) ?>-layout">

		<div id="primary" class="content-area <?php echo ( esc_html($home_sidebar) ) ? 'has-sidebar' : 'fullwidth'; ?>">
			<main id="main" class="site-main <?php echo sanitize_html_class($home_layout) ?>">

			<?php if ( have_posts() ) {

				if ( is_home() && ! is_front_page() ) { ?>
					<header>
						<h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
					</header>
				<?php }

				/* Start the Loop */
				while ( have_posts() ) : the_post();
					get_template_part( 'template-parts/content', $home_layout );
				endwhile;

				?>
				<nav id="pagination">
					<?php if (function_exists('marni_pagination')) {
						marni_pagination();
					}
					 else {
						 the_posts_navigation();
					} ?>
		                </nav><!-- #pagination-->
		                <?php

			} else {
				get_template_part( 'template-parts/content', 'none' );
			} ?>

			</main><!-- #main -->

		</div><!-- #primary -->

		<?php if ( true == get_theme_mod( 'marni_homepage_sidebar', true ) ) {
			get_sidebar(); 
		} ?>

	</div><!-- .container -->
</div><!-- #content -->

<?php get_footer(); ?>