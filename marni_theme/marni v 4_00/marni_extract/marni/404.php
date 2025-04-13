<?php get_header(); 
$archives_sidebar = get_theme_mod('marni_archives_sidebar', true);
?>
<div id="content" class="site-content">
	<div class="container">
		<div id="primary" class="content-area <?php echo ( esc_html($archives_sidebar) ) ? 'has-sidebar' : 'fullwidth'; ?>">
			<main id="main" class="site-main">
				<section class="error-404 not-found">
					<header class="page-header">
						<h1 class="page-title">
							<span class="nothingfound-title"> <?php esc_html_e( '404', 'marni' ); ?> </span>
						        <span class="nothingfound-title"> <?php esc_html_e( 'Nothing found', 'marni' ); ?></span>
						</h1>
					</header><!-- .page-header -->
					<div class="page-content">
						<p><?php esc_html_e( 'Sorry, but the page you were trying to view does not exist.', 'marni' ); ?></p>
						<?php get_search_form(); ?>
					</div><!-- .page-content -->
				</section><!-- .error-404 -->
			</main><!-- #main -->
		</div><!-- #primary -->
		<?php if ( true == get_theme_mod( 'marni_archives_sidebar', true ) ) {
			get_sidebar('archives'); 
		} ?>
	</div><!-- .container -->
</div><!-- #content -->
<?php get_footer(); ?>
