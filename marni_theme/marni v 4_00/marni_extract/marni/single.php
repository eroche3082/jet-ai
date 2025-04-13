<?php get_header(); ?>
<?php while ( have_posts() ) : the_post(); 

$layout = "has-sidebar";
$featured_image = "standard";	
if ( class_exists( 'RWMB_Field' ) ) { 
	if ( has_post_format( 'video' ) ) {
		$layout = rwmb_meta( 'redsun_single-video-layout' );
	} else {
		$layout = rwmb_meta( 'redsun_single-layout' );
	}
	$video = rwmb_meta( 'redsun_videourl' );
        $featured_image = rwmb_meta( 'redsun_featured-image' );
}
if ( $featured_image == 'fullwidth-overlay' || $layout == 'sidebar-below-thumb' || $layout == 'fullwidth' || $layout == 'fullscreen'  ) {
	$thumb = wp_get_attachment_image_src(get_post_thumbnail_ID(), 'marni-uncropped'); 
	$thumb_srcset = wp_get_attachment_image_srcset(get_post_thumbnail_ID(), 'marni-uncropped');
} else {
	$thumb = wp_get_attachment_image_src(get_post_thumbnail_ID(), 'marni-uncropped-full');
	$thumb_srcset = wp_get_attachment_image_srcset(get_post_thumbnail_ID(), 'marni-uncropped-full'); 
}
$floatingthumb = wp_get_attachment_image_src(get_post_thumbnail_ID(), 'marni-uncropped-medium');
$floatingthumb_srcset = wp_get_attachment_image_srcset(get_post_thumbnail_ID(), 'marni-uncropped-medium');

$thumb_alt = get_post_meta( get_post_thumbnail_id(), '_wp_attachment_image_alt', true);

if ( $layout == 'has-sidebar' ||  $layout == 'sidebar-below-title' || $layout == 'sidebar-below-thumb' ) { 
	$sidebar = 'has-sidebar';
} else {
	$sidebar = 'no-sidebar';	
}

if (get_theme_mod('marni_single_thumb',true) == false ) {
	$displaythumb = 'hide-thumb';
} else {
	$displaythumb = 'show-thumb';
}

/* is mobile? */
if( wp_is_mobile() ){
	$device = 'ismobile';
} else { 
	$device = 'nomobile';
} 



/* Fullwidth Image + Overlay Title *****************/
if ( $featured_image == 'fullwidth-overlay' && !has_post_format( 'video' ) ) { ?>
 
<div class="entry-header overlay <?php echo esc_html($device); ?> <?php echo esc_html($displaythumb) ; ?>">
	<div class="image-fullbg" style="background-image: url(<?php echo esc_url($thumb[0]); ?>)">
		<div class="color-overlay">
			<div class="overlay-content">
		    		<?php if ( (get_theme_mod('marni_single_category',true) == true) ) { ?>
		    			<div class="categories">
		    				<?php the_category(' '); ?>
		    			</div>
		    		<?php } ?>
			    	
				<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
				<div class="entry-meta entry-meta-single">
					<?php get_template_part( 'template-parts/meta-single'); ?>
				</div><!-- .entry-meta -->
			</div>
		</div>
	</div>
</div>
<?php } ?>

<div id="content" class="site-content <?php echo esc_html($layout); ?> <?php echo esc_html($device); ?> <?php echo esc_html($featured_image); ?> <?php echo esc_html($displaythumb) ; ?>">
	<article id="post-<?php the_ID(); ?>" <?php post_class($sidebar); ?>>

		<?php 
		if ( $featured_image == 'standard' && ( $layout == 'sidebar-below-title' || $layout == 'sidebar-below-thumb' ) || 
			( has_post_format( 'video' ) && ( $layout == 'sidebar-below-title' || $layout == 'sidebar-below-thumb' ) ) ) { ?>
			<div class="entry-header entry-header-top">

				<?php 
				/* Title Top ****************************************/ 
				?>
				<?php if ( (get_theme_mod('marni_single_category',true) == true) ) { ?>
		    			<div class="categories">
		    				<?php the_category(' '); ?>
		    			</div>
		    		<?php } ?>

				<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
				<div class="entry-meta entry-meta-single">
					<?php get_template_part( 'template-parts/meta-single'); ?>
				</div><!-- .entry-meta -->


				<?php 
				/* Thumbnail Top ****************************************/
				if ( has_post_format( 'video' ) && $layout == 'sidebar-below-thumb' ) { ?>
					<div class="tnail tnail-top">
						<?php get_template_part( 'template-parts/video' ); ?>
				  	</div>
				<?php } elseif ( $layout == 'sidebar-below-thumb'  ) {
					if ( get_theme_mod('marni_single_thumb',true) == true && has_post_thumbnail() )  { ?>
				        	<div class="tnail tnail-top">
							<?php if ( true == get_theme_mod( 'marni_responsiveimages', true ) ) { ?>
								<img src="<?php echo esc_url($thumb[0]); ?>" srcset="<?php echo esc_attr($thumb_srcset); ?>" sizes="(max-width: 1248px) 95vw, (max-width: 959px) 90vw, (max-width: 767px) 95vw, 1152px" width="<?php echo esc_attr($thumb[1]); ?>" height="<?php echo esc_attr($thumb[2]); ?>" alt="<?php echo esc_attr($thumb_alt); ?>" >
							<?php } else { ?>
								<img src="<?php echo esc_url($thumb[0]); ?>" width="<?php echo esc_attr($thumb[1]); ?>" height="<?php echo esc_attr($thumb[2]); ?>" alt="<?php echo esc_attr($thumb_alt); ?>" >
							<?php } ?>
						</div> <!-- .tnail -->
				        <?php }
				} ?>

			</div>
			 
	        <?php } ?>

		<div class="container">
			<div id="primary" class="content-area <?php echo esc_html($layout); ?>">
				<div id="main" class="site-main">
					<div class="blog-content-wrap">
					
						<?php 
						/* Title Regular ****************************************/
						if (  ( $layout !== 'sidebar-below-title' && $layout !== 'sidebar-below-thumb' && $featured_image !== 'fullwidth-overlay'  ) ||
						      ( $featured_image == 'floating-right' || $featured_image == 'floating-left'  )  ) { ?>	
							<div class="entry-header">							
								<?php if ( (get_theme_mod('marni_single_category',true) == true) ) { ?>
						    			<div class="categories">
						    				<?php the_category(' '); ?>
						    			</div>
						    		<?php } ?>

								<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
								<div class="entry-meta entry-meta-single">
									<?php get_template_part( 'template-parts/meta-single'); ?>
								</div><!-- .entry-meta -->
							</div><!-- .entry-header -->
						<?php }

						/* Thumbnail Regular ****************************************/
						if ( has_post_format( 'video' ) && $layout !== 'sidebar-below-thumb' ) { ?>
							<div class="tnail">
								<?php get_template_part( 'template-parts/video' ); ?>
						  	</div>
						<?php } elseif (  $layout !== 'sidebar-below-thumb' && $featured_image !== 'fullwidth-overlay'  ) {
							if ( get_theme_mod('marni_single_thumb',true) == true && has_post_thumbnail() )  { ?>
						        	<div class="tnail">
						        		<?php if ( true == get_theme_mod( 'marni_responsiveimages', true ) ) {
							        		if (  $layout == 'fullwidth' || $layout == 'fullscreen' ) { ?>
											<img src="<?php echo esc_url($thumb[0]); ?>" srcset="<?php echo esc_attr($thumb_srcset); ?>" sizes="(max-width: 1248px) 63vw, (max-width: 959px) 90vw, (max-width: 767px) 95vw, 1152px" width="<?php echo esc_attr($thumb[1]); ?>" height="<?php echo esc_attr($thumb[2]); ?>" alt="<?php echo esc_attr($thumb_alt); ?>" >
										<?php } else { ?>
											<img src="<?php echo esc_url($thumb[0]); ?>" srcset="<?php echo esc_attr($thumb_srcset); ?>" sizes="(max-width: 1248px) 63vw, (max-width: 959px) 90vw, (max-width: 767px) 95vw, 780px" width="<?php echo esc_attr($thumb[1]); ?>" height="<?php echo esc_attr($thumb[2]); ?>" alt="<?php echo esc_attr($thumb_alt); ?>" >
										<?php }
									} else { ?>
										<img src="<?php echo esc_url($thumb[0]); ?>" width="<?php echo esc_attr($thumb[1]); ?>" height="<?php echo esc_attr($thumb[2]); ?>" alt="<?php echo esc_attr($thumb_alt); ?>" >
									<?php } ?>

								</div> <!-- .tnail -->
							<?php }
						} elseif ($featured_image == 'floating-right' || $featured_image == 'floating-left'  ) {
							if ( get_theme_mod('marni_single_thumb',true) == true && has_post_thumbnail() )  { ?>
						        	<div class="tnail">
									<?php if ( true == get_theme_mod( 'marni_responsiveimages', true ) ) { ?>
											<img src="<?php echo esc_url($floatingthumb[0]); ?>" srcset="<?php echo esc_attr($floatingthumb_srcset); ?>" sizes="(max-width: 959px) 42vw, (max-width: 767px) 95vw, 552px" width="<?php echo esc_attr($floatingthumb[1]); ?>" height="<?php echo esc_attr($floatingthumb[2]); ?>" alt="<?php echo esc_attr($thumb_alt); ?>" >
									<?php } else { ?>
											<img src="<?php echo esc_url($floatingthumb[0]); ?>" width="<?php echo esc_attr($floatingthumb[1]); ?>" height="<?php echo esc_attr($floatingthumb[2]); ?>" alt="<?php echo esc_attr($thumb_alt); ?>" >
									<?php } ?>
								</div> <!-- .tnail -->
						        <?php }
						}						

						/* POST CONTENT *****************/
						?>
						<div class="entry-content">
							<?php
								the_content( sprintf(
									/* translators: %s: Name of current post. */
									wp_kses( __( '<span class="button-more button-outline">Continue reading %s </span>', 'marni' ), array( 'span' => array( 'class' => array() ) ) ),
									the_title( '<span class="screen-reader-text">"', '"</span>', false )
								) );

								wp_link_pages( array(
									'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'marni' ),
									'after'  => '</div>',
								) );
							?>
						</div><!-- .entry-content -->

						<?php if ( has_post_format( 'gallery' )) {
						  	get_template_part('template-parts/format', 'gallery');
						} 

						/* POST FOOTER *****************/
						?>
						<footer class="entry-footer">
							<div class="post-tags">
								<?php if ( get_theme_mod('marni_single_tags',true) == true && has_tag() ) {
									the_tags("<span class='post-tag'> <span class='post-tag-hashtag'>#</span>","</span> <span class='post-tag'> <span class='post-tag-hashtag'>#</span>" ,"</span>");
								} ?>	
							</div>
							<?php 
							/* SHARE BUTTONS **************/
							if ( function_exists( 'marni_share_buttons' ) ) {
								if ( get_theme_mod('marni_single_share',true) == true) { 
								marni_share_buttons(); 
								}
				  			} ?>

						</footer><!-- .entry-footer -->

					</div><!-- .blog-content-wrap -->

					<?php 
					/* RELATED POSTS **************/
					if ( get_theme_mod('marni_single_recommended',true) == true) { 
						marni_related_posts(); 
					} ?>

					<?php
					/* POST NAVIGATION **************/
					?>
					<div class="post-navigation">
						<div class="nav-previous-wrap"> 

						<?php 
						$prev_post = get_previous_post();


						if (!empty( $prev_post )) { 
							$prev_thumb = get_the_post_thumbnail($prev_post->ID,'marni-square-small'); ?>
							<div class="nav-previous"> 
								<?php if($prev_thumb) { ?>
									<div class="prev-post-thumb">
										<?php previous_post_link('%link', $prev_thumb); ?>
									</div>
								<?php } ?>
								<div class="prev-post-right">
									<div class="post-nav-top-text"><?php esc_html_e('previous post', 'marni'); ?></div>
									<div class="post-title-small"><?php previous_post_link('%link'); ?></div> 
								</div> 
							</div> 
						<?php } ?>
						</div> 
						<div class="nav-next-wrap"> 
						<?php $next_post = get_next_post();
						if (!empty( $next_post )) { 
							$next_thumb = get_the_post_thumbnail($next_post->ID,'marni-square-small'); ?>
							<div class="nav-next"> 
								<div class="next-post-left">
									<div class="post-nav-top-text"><?php esc_html_e('next post', 'marni'); ?></div>
									<div class="post-title-small"><?php next_post_link('%link'); ?></div> 
								</div> 
								<?php if($next_thumb) { ?>
									<div class="next-post-thumb">
										<?php next_post_link('%link', $next_thumb); ?>
									</div>
								<?php } ?>
							</div> 
						<?php } ?>
						</div> 
					</div>
					<?php

					/* COMMENTS **********************/
					if ( comments_open() || get_comments_number() ) :
						comments_template();
					endif;?>

				</div><!-- #main -->
			</div><!-- #primary -->

			
			<?php if ( is_active_sidebar( 'sidebar-single' ) ) { 
				if ( $layout == 'has-sidebar' ||  $layout == 'sidebar-below-title' || $layout == 'sidebar-below-thumb' ) { 
					get_sidebar('single'); 
				}
		        } ?>

		</div><!-- .container -->
	</article><!-- #post-## -->
</div><!-- #content -->

<?php endwhile; ?>
<?php get_footer(); ?>