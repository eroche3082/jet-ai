<?php get_header(); 

$archives_layout = get_theme_mod('marni_archives_layout', 'standard');
$archives_columns = get_theme_mod('marni_layout_archives_columns', 'two-items'); 
$archives_sidebar = get_theme_mod('marni_archives_sidebar', true);
?>
<div id="content" class="site-content <?php echo ( esc_html($archives_sidebar) ) ? 'has-sidebar' : 'fullwidth'; ?>">

	<h1 class="page-title search-title">
		<span class="notfound-title-small"> <?php esc_html_e('Search Results for', 'marni'); $key = esc_html($s, 1); ?> </span>
	        <span class="themecolor"> <?php echo esc_html($key); ?> </span>
	</h1>
	<div class="container <?php echo sanitize_html_class($archives_layout) ?>-layout">

		<div id="primary" class="content-area <?php echo ( esc_html($archives_sidebar) ) ? 'has-sidebar' : 'fullwidth'; ?>">

			<?php
			if ( class_exists( 'woocommerce' ) ) { 

			        /* SHOP Results ****************************************************************/
			        $s = isset($_GET["s"]) ? $_GET["s"] : "";
			        $posts = new WP_Query("s=$s&post_type=product");
			        
			        // Search Count
			        $skey = esc_html($s, 1);
			        $scount = $posts->post_count;

			        $perrow = get_theme_mod( 'marni_itemsperrow', 'three-items' );

			        if ( $posts->have_posts() ) { ?>

					<div class="woocommerce">
						<div class="<?php echo esc_html($perrow); ?>">
							<ul class="products">
								<?php
								/* Start the Loop */
								while ( $posts->have_posts() ) : $posts->the_post(); 
									woocommerce_get_template_part('content', 'product');
								endwhile; 
								wp_reset_postdata();
								?>
							</ul>
						</div>
					</div>
					<div class="divider2_hr"></div>
				<?php } ?>

			<?php } ?>

			<main id="main" class="site-main <?php echo sanitize_html_class($archives_layout) ?> <?php echo sanitize_html_class($archives_columns) ?>">
			
				<?php
			        /* BLOG Results ****************************************************************/
			        $s = isset($_GET["s"]) ? $_GET["s"] : "";
			        $posts = new WP_Query("s=$s&post_type=post&posts_per_page=-1");
			        
			        // Search Count
			        $bkey = esc_html($s, 1);
			        $bcount = $posts->post_count;

			        if ( $posts->have_posts() ) { ?>

					<?php
					/* Start the Loop */
					while ( $posts->have_posts() ) : $posts->the_post(); 
						get_template_part( 'template-parts/content', $archives_layout );
					endwhile;
					wp_reset_postdata();

				}  ?>

			</main><!-- #main -->

			<?php   $scount = $posts->post_count;
			        if ( ($scount == 0) && ($bcount == 0) ) { 
			 	get_template_part( 'template-parts/content', 'none' );
			} ?>

		</div><!-- #primary -->

		<?php if ( true == get_theme_mod( 'marni_archives_sidebar', true ) ) {
			get_sidebar('archives'); 
		} ?>

	</div><!-- .container -->

</div><!-- #content -->
<?php get_footer(); ?>