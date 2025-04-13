<?php get_header(); 

$archives_layout = get_theme_mod('marni_archives_layout', 'standard');
$archives_columns = get_theme_mod('marni_layout_archives_columns', 'two-items'); 
$archives_sidebar = get_theme_mod('marni_archives_sidebar', true);
?>
<div id="content" class="site-content <?php echo ( esc_html($archives_sidebar) ) ? 'has-sidebar' : 'fullwidth'; ?>">

	<header class="page-header archive-page-header">
		<?php the_archive_title( '<h1 class="archive-page-title">', '</h1>' ); ?>
	</header><!-- .page-header -->

	<div class="container <?php echo sanitize_html_class($archives_layout) ?>-layout ">

		<div id="primary" class="content-area <?php echo ( esc_html($archives_sidebar) ) ? 'has-sidebar' : 'fullwidth'; ?>">
			<main id="main" class="site-main <?php echo sanitize_html_class($archives_layout) ?> <?php echo sanitize_html_class($archives_columns) ?>">

			<?php if ( have_posts() ) { ?>

				<?php
				/* Start the Loop */
				while ( have_posts() ) : the_post();
					get_template_part( 'template-parts/content', $archives_layout );
				endwhile;

			} else {
				get_template_part( 'template-parts/content', 'none' );
			} ?>

			</main><!-- #main -->

			<nav id="pagination">
				<?php if (function_exists('marni_pagination')) {
					marni_pagination();
				}
				 else {
					 the_posts_navigation();
				} ?>
		        </nav><!-- #pagination-->
			
		</div><!-- #primary -->

		<?php if ( true == get_theme_mod( 'marni_archives_sidebar', true ) ) {
			get_sidebar('archives'); 
		} ?>

	</div><!-- .container -->


</div><!-- #content -->

<?php get_footer(); ?>