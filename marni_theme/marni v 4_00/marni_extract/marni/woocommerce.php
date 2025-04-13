<?php get_header(); ?>

<div id="content" class="site-content">

	<div class="container">

	        <?php if ( is_active_sidebar( 'sidebar-woocommerce' ) ) :  ?>
			<aside id="sidebar-woocommerce" class="widget-area left-sidebar">
				<div class="theiaStickySidebar">
					<div class="widgets-wrap ">
						<?php dynamic_sidebar( 'sidebar-woocommerce' ); ?>
					</div>
				</div>
			</aside><!-- #sidebar-main -->
		<?php endif; ?> 

		<div id="primary" class="content-area <?php if ( is_active_sidebar( 'sidebar-woocommerce' ) ) :  ?>has-sidebar<?php endif; ?>">
			<main id="main" class="site-main">
			        <div id="woocommerce-content" class="content">
			                <div class="page-content">   
			                	<?php woocommerce_content(); ?> 
			                </div><!-- .page-content-->
			        </div>
			</main><!-- #main -->
		</div><!-- #primary -->


	</div><!-- .container -->
</div><!-- #content -->

<?php get_footer(); ?>