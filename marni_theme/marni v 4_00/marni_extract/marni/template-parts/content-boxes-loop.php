<?php 

global $post;

$args = array(
        'post_type' => 'contentboxes',
        'orderby'=>'menu_order',
        'order' => 'ASC',                                           
	'posts_per_page' => -1
        );

$loop = new WP_Query( $args );
    
if ($loop->have_posts()) : ?>

<div class="content-boxes-wrap">

<!-- CONTENT BOXES -->
<div class="content-boxes masonry">

	<div class="grid-sizer"></div>

		<?php
		while ( $loop->have_posts() ) : $loop->the_post();

		// post type
		$contentboxtype = rwmb_meta( 'redsun_contentbox-type' );

		// post style
		$contentboxwidth = rwmb_meta( 'redsun_contentbox-width' );
		$contentboxheight = rwmb_meta( 'redsun_contentbox-height' );
		$contentboxstyle= rwmb_meta( 'redsun_contentbox-style' );
		$contentboxdarkoverlay= rwmb_meta( 'redsun_contentbox-darkoverlay' );
		$contentboxverticaltext= rwmb_meta( 'redsun_contentbox-verticaltext' );
		$contentboxverticaltextcolor= rwmb_meta( 'redsun_contentbox-verticaltextbgcolor' );

		// post box
		$featuredpostid = rwmb_meta( 'redsun_contentbox-post' );
		$contentboxcategory = rwmb_meta( 'redsun_contentbox-category' );
		$contentboxmorebutton = rwmb_meta( 'redsun_contentbox-morebutton' );
		$contentboxdate = rwmb_meta( 'redsun_contentbox-date' );
		$contentboxcommentsnumber = rwmb_meta( 'redsun_contentbox-commentsnumber' );
		$contentboxauthor = rwmb_meta( 'redsun_contentbox-author' );
		$contentboxlocation = rwmb_meta( 'redsun_contentbox-location' );
		$contentboxviews = rwmb_meta( 'redsun_contentbox-views' );

		//content box
		$contentboxwidth = rwmb_meta( 'redsun_contentbox-width' );
		$contentboxheight = rwmb_meta( 'redsun_contentbox-height' );
		$contentboxurl = rwmb_meta( 'redsun_contentbox-url' );
		$contentboxicon = rwmb_meta( 'redsun_contentbox-icon' );
		$contentboxiconsize = rwmb_meta( 'redsun_contentbox-iconsize' );
		$contentboxfont = rwmb_meta( 'redsun_contentbox-font' );
		$contentboxfontsize = rwmb_meta( 'redsun_contentbox-fontsize' );
		if ($contentboxfontsize) {
			$contentboxlineheight = (1.6 - $contentboxfontsize/10);
			$contentboxcontentmargintop = (12 / $contentboxfontsize + 2);
		}
		$contentboxletterspacing = rwmb_meta( 'redsun_contentbox-letterspacing' );
		$contentboxcontent = rwmb_meta( 'redsun_contentbox-content' );
		
		// featured image
		if ($contentboxtype == 'post-box') { 
			$imageid = $featuredpostid;
		}  else {
			$imageid = $post->ID;
		}

		if (rwmb_meta( 'redsun_contentbox-height' ) == 'defined square') {
			$imageratio = 'square';
		} elseif (rwmb_meta( 'redsun_contentbox-height' ) == 'defined half-height') {
			$imageratio = 'landscape';
		} else { 
			$imageratio = 'uncropped';
		}

		if (($contentboxheight == 'defined double-height' && $contentboxwidth == 'one-third') ||
		($contentboxheight == 'defined one-and-a-half-height' && $contentboxwidth == 'one-half')) {
			$contentboxbgimage = wp_get_attachment_image_src( get_post_thumbnail_id($imageid), 'marni-' . $imageratio . '-largex2');
		} elseif (($contentboxheight == 'defined double-height' && $contentboxwidth == 'one-fourth') ||
		($contentboxheight == 'defined one-and-a-half-height' && $contentboxwidth == 'one-third')) {
			$contentboxbgimage = wp_get_attachment_image_src( get_post_thumbnail_id($imageid), 'marni-' . $imageratio . '-full');
		} elseif ($contentboxheight == 'defined one-and-a-half-height' && $contentboxwidth == 'one-fourth') {
			$contentboxbgimage = wp_get_attachment_image_src( get_post_thumbnail_id($imageid), 'marni-' . $imageratio . '-large');
		} elseif ($contentboxwidth == 'one-fourth') {
			$contentboxbgimage = wp_get_attachment_image_src( get_post_thumbnail_id($imageid), 'marni-' . $imageratio . '-medium');
		} elseif ($contentboxwidth == 'one-third') {
			$contentboxbgimage = wp_get_attachment_image_src( get_post_thumbnail_id($imageid), 'marni-' . $imageratio . '-large');
		} elseif ($contentboxwidth == 'one-half') {
			$contentboxbgimage = wp_get_attachment_image_src( get_post_thumbnail_id($imageid), 'marni-' . $imageratio . '-full');
		} elseif ($contentboxwidth == 'two-third') {
			$contentboxbgimage = wp_get_attachment_image_src( get_post_thumbnail_id($imageid), 'marni-' . $imageratio . '-largex2');
		} else {
			$contentboxbgimage = wp_get_attachment_image_src( get_post_thumbnail_id($imageid), 'marni-' . $imageratio);
		}
	

		/* POST BOX */
		if ($contentboxtype == 'post-box' && $featuredpostid != '') { 

		$featured = new WP_Query(
			array(
				'p' => $featuredpostid,
			)
		);

		if ($featured->have_posts() ) : while ($featured->have_posts()) : $featured->the_post(); ?> 

	        	<div class="masonry-item content-box content-box-<?php echo get_the_ID(); ?> <?php echo esc_html("{$contentboxwidth} {$contentboxheight} {$contentboxstyle}");  if ($contentboxheight != 'undefined') {  ?> use-defined-height<?php } ?> <?php if ($contentboxtype == 'content-box') { ?> content-content-box <?php } ?> <?php if($contentboxurl) { ?> has-url <?php } ?>" >

				<div class="content-box-inner">
			      		
					<div class="contentboxbgimage" style="background-image: url(<?php echo esc_url($contentboxbgimage[0]); ?>);"></div>
				
					<div class="content-box-overlay <?php if ($contentboxdarkoverlay) { ?>dark<?php } ?>">

					<?php if($contentboxverticaltext) { ?>
							<div class="vertical-text <?php if ($contentboxverticaltextcolor) { ?>has-bg-color<?php } ?>"   <?php if ($contentboxverticaltextcolor) { ?> style="background-color:<?php echo esc_html($contentboxverticaltextcolor); ?>;"<?php } ?>>
								<?php echo esc_html($contentboxverticaltext); ?>
							</div>
					<?php } ?>

					<div class="center-wrap <?php if($contentboxverticaltext) { ?>has-vertical-text<?php } ?>">
					<div class="contentbox-container">

						<div class="contentbox-content">

							<?php if ($contentboxcategory) { ?>
								<div class="categories">
									<?php the_category(' '); ?> 
								</div>
							<?php } ?>  	
							<?php the_title( '<h2 class="contentbox-post-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' ); ?>
							<?php if ($contentboxmorebutton) { marni_read_more(); } ?> 
						</div>
						
						<?php 
						// has contentbox post meta ?
						$location = rwmb_meta( 'redsun_location' );
						if (	($contentboxdate)  || 
						 	(comments_open() && $contentboxcommentsnumber )  ||
							($contentboxauthor)  ||
							( class_exists('WordpressPopularPosts') && $contentboxviews )  ||
							( class_exists( 'RWMB_Field' ) && ($location) && $contentboxlocation )
						) { 
							$meta = 'has-cb-post-meta';
						} else {
							$meta = '';
						} ?>
						<div class="entry-meta-wrap <?php echo esc_html($meta); ?>">
						        <div class="entry-meta entry-meta-bgcolor ">
								<?php 
								if ($contentboxdate) { marni_post_date(); }
								if ($contentboxcommentsnumber) { marni_comments_count(true); }
								if ($contentboxauthor) { marni_post_author(); }
								if ($contentboxlocation) { marni_location(); } 
								if ($contentboxviews) { marni_views_count(); } 
								?>
							</div>
						</div>
					</div>
					</div>  

					</div> 

				</div> <!-- .content-box-inner -->

			</div> <!-- .masonry-item -->

		<?php 
		endwhile; 
		wp_reset_postdata();
		endif;
		}

		/* CONTENT BOX */
		elseif ($contentboxtype == 'content-box') {  ?>

	        	<div class="masonry-item content-box content-box-<?php echo get_the_ID(); ?> <?php echo esc_html("{$contentboxwidth} {$contentboxheight} {$contentboxstyle}");  if ($contentboxheight != 'undefined') {  ?> use-defined-height<?php } ?> <?php if ($contentboxtype == 'content-box') { ?> content-content-box <?php } ?> <?php if($contentboxurl) { ?> has-url <?php } ?>" >

			<?php if($contentboxurl) { ?>
			<a href="<?php echo esc_url($contentboxurl); ?>">
			<?php } ?>

				<div class="content-box-inner">
			      		
        				<?php if ($contentboxbgimage != '') { ?>
        					<div class="contentboxbgimage" style="background-image: url(<?php echo esc_url($contentboxbgimage[0]); ?>);"></div>
        				<?php } ?>	
					
					<div class="content-box-overlay <?php if ($contentboxdarkoverlay) { ?>dark<?php } ?>">

						<?php if($contentboxverticaltext) { ?>
							<div class="vertical-text <?php if ($contentboxverticaltextcolor) { ?>has-bg-color<?php } ?>"   <?php if ($contentboxverticaltextcolor) { ?> style="background-color:<?php echo esc_html($contentboxverticaltextcolor); ?>;"<?php } ?>>
								<?php echo esc_html($contentboxverticaltext); ?>
							</div>
						<?php } ?>

						<div class="center-wrap <?php if($contentboxverticaltext) { ?>has-vertical-text<?php } ?>">
						<div class="contentbox-container">
							<div class="contentbox-content">
								<?php if($contentboxicon) { ?>  <i class="content-box-icon <?php echo esc_html($contentboxicon); ?>" style="font-size: <?php echo floatval($contentboxiconsize); ?>em;"></i> <?php } ?>
								<?php if($contentboxcontent) { ?> 
									<div class="content-box-wysiwyg <?php echo esc_html($contentboxfont); ?>" style="font-size: <?php echo floatval($contentboxfontsize); ?>em; line-height: <?php echo floatval($contentboxlineheight); ?>em; margin-top: <?php echo floatval($contentboxcontentmargintop); ?>px; margin-bottom: <?php echo floatval($contentboxcontentmargintop); ?>px; letter-spacing: <?php echo floatval($contentboxletterspacing); ?>px;">
										<?php $contentboxcontent = wp_kses_post( rwmb_meta( 'redsun_contentbox-content' ) );
										echo do_shortcode($contentboxcontent); ?>
									</div> 
								<?php } ?>
							</div>
						</div>
						</div>  
					</div> 							
				</div>

			<?php if($contentboxurl) { ?>
			</a>
			<?php } ?>

			</div> 

		<?php } ?>
	     
	<?php
	endwhile; ?>

	</div> <!-- content-boxes .isotope -->  

	</div> <!-- .content-boxes-wrap -->

<?php
endif;
?>