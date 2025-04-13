<?php get_header(); 

// LOAD SLIDER
if(is_home() && !is_paged()) {
	get_template_part( 'template-parts/slider' );
}

$home_layout = get_theme_mod('marni_home_layout', 'standard');
$home_columns = get_theme_mod('marni_layout_home_columns', 'two-items'); 
$home_sidebar = get_theme_mod('marni_home_sidebar', true);
?>

<div id="content" class="site-content <?php echo ( esc_html($home_sidebar) ) ? 'has-sidebar' : 'fullwidth'; ?>">


<?php if(is_home() && !is_paged()) {  
	if (class_exists( 'RWMB_Field' ) ) { 
		if (get_theme_mod('marni_featuredboxes_display', true)) { get_template_part( 'template-parts/content-boxes-loop' ); } 
	}
	get_sidebar('home-top'); 
} ?>

	<div class="container <?php echo sanitize_html_class($home_layout) ?>-layout">
		<div id="primary" class="content-area <?php echo ( esc_html($home_sidebar) ) ? 'has-sidebar' : 'fullwidth'; ?>">
			<main id="main" class="site-main <?php echo sanitize_html_class($home_layout) ?> <?php echo sanitize_html_class($home_columns) ?>">
			<?php if ( have_posts() ) {

				/* Start the Loop */
				while ( have_posts() ) : the_post();
					get_template_part( 'template-parts/content', $home_layout );
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
		<?php if ( true == get_theme_mod( 'marni_home_sidebar', true ) ) {
			get_sidebar('home'); 
		} ?>
	</div><!-- .container -->


        
</div><!-- #content -->
<?php get_footer(); ?>