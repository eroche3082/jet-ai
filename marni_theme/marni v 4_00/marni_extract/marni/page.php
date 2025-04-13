<?php get_header(); ?>

<div id="content" class="site-content no-sidebar">
	<div class="container">

		<div id="primary" class="content-area">
			<main id="main" class="site-main">

				<?php
				while ( have_posts() ) : the_post();

					get_template_part( 'template-parts/content', 'page' );

					// If comments are open or we have at least one comment, load up the comment template.
					if ( comments_open() || get_comments_number() ) :
						comments_template();
					endif;

				endwhile; // End of the loop.
				?>

			</main><!-- #main -->
		</div><!-- #primary -->

	</div><!-- .container -->
</div><!-- #content -->

<?php get_footer(); ?>