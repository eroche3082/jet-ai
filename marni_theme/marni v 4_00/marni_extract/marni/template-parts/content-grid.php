<article id="post-<?php the_ID(); ?>" <?php post_class('post-grid'); ?>>

	<header class="entry-header">

		<div class="tnail-meta-wrap">
		<?php 
		if ( is_home() ) {
			$imageratio = get_theme_mod('marni_home_thumbnail', 'landscape');
		} else {
			$imageratio = get_theme_mod('marni_archives_thumbnail', 'landscape');
		}
		if ( 
		   (is_home()  && true == get_theme_mod( 'marni_home_sidebar', false ) ) ||
		   (!is_home() && true == get_theme_mod( 'marni_archives_sidebar', false ) ) ||
		   (is_home()  && 'three-items' == get_theme_mod( 'marni_layout_home_columns' ) ) ||
		   (!is_home() && 'three-items' == get_theme_mod( 'marni_layout_archives_columns' ) )
		   ) {
			$size = 'marni-' . $imageratio . '-medium';
		} else {
			$size = 'marni-' . $imageratio . '-large';
		}
			
		if ( has_post_format( 'video' )) { ?>
			<div class="tnail">
				<?php get_template_part( 'template-parts/video' ); ?>
			</div>
		<?php } elseif ( has_post_thumbnail() ) { ?>
			<div class="tnail">
	                        <a href="<?php the_permalink() ?>">
					<?php the_post_thumbnail($size); ?>
	                        </a>                            
			</div> <!-- .tnail -->
		<?php } ?>
		

			<div class="entry-meta-wrap">
			        <div class="entry-meta entry-meta-bgcolor <?php marni_has_home_meta(); ?> <?php marni_has_archive_meta(); ?>">
					<?php if ( 	
						(is_home() && get_theme_mod('marni_home_date',true) == true) ||
						(!is_home() && get_theme_mod('marni_archives_date',true) == true) ) { 
						marni_post_date();
					} 

					if ( 	
						(is_home() && get_theme_mod('marni_home_comments',true) == true) ||
						(!is_home() && get_theme_mod('marni_archives_comments',true) == true) ) { 
						marni_comments_count(false);
					} 

					if ( 	
						(is_home() && get_theme_mod('marni_home_author',true) == true) ||
						(!is_home() && get_theme_mod('marni_archives_author',true) == true) ) { 
						marni_post_author();
					} 

					if ( 	
						(is_home() && get_theme_mod('marni_home_location',true) == true) ||
						(!is_home() && get_theme_mod('marni_archives_location',true) == true) ) { 
						marni_location();
					} 

					if ( 	
						(is_home() && get_theme_mod('marni_home_views',false) == true) ||
						(!is_home() && get_theme_mod('marni_archives_views',false) == true) ) { 
        						marni_views_count();
        				}
					?>

				</div>
			</div>
		</div>

		<?php if ( 	
			(is_home() && get_theme_mod('marni_home_category',true) == true) ||
			(!is_home() && get_theme_mod('marni_archives_category',true) == true) ) { ?>
			<div class="categories">
				<?php the_category(' '); ?>
			</div>
		<?php } ?>
		
		<?php the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' ); ?>
	
	</header><!-- .entry-header -->

	<div class="entry-content">

		<div class="entry-text">
		<?php if (	
			(is_home() && get_theme_mod('marni_layout_home_summary_type','excerpt') == 'excerpt')  ||
			(!is_home() && get_theme_mod('marni_layout_archives_summary_type','excerpt') == 'excerpt')
			) {
			the_excerpt();
		} elseif (
			(is_home() && get_theme_mod('marni_layout_home_summary_type' ) == 'content')  ||
			(!is_home() && get_theme_mod('marni_layout_archives_summary_type' ) == 'content')
			) {
			the_content('');
		} ?>
		</div>

		<?php if ( 	
			(is_home() && get_theme_mod('marni_home_more',true) == true) ||
			(!is_home() && get_theme_mod('marni_archives_more',true) == true) ) { 
			marni_read_more();
		} ?>

		<?php if ( function_exists( 'marni_share_buttons' ) ) {
			if ( 	
			(is_home() && get_theme_mod('marni_home_share',true) == true) ||
			(!is_home() && get_theme_mod('marni_archives_share',true) == true) ) { 
			marni_share_buttons(); 
			}
  		} ?>
	</div><!-- .entry-content -->

</article><!-- #post-## -->
