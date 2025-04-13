<?php
if ( post_password_required() ) {
	return;
}
?>

<div id="comments" class="comments-area">

	<?php comment_form(); ?>

	<?php if ( have_comments() ) : ?>

		<div class="comment-list-wrap">
	
			<!-- Title -->
			<div class="title-center">
				<h2 class="comments-title">
					<?php
						printf( // WPCS: XSS OK.
							esc_html( _nx( 'One comment', '%1$s comments', get_comments_number(), 'comments title', 'marni' ) ),
							number_format_i18n( get_comments_number() ),
							'<span>' . get_the_title() . '</span>'
						);
					?>
				</h2>
			</div>

			<!-- Display the comments -->
			<ol class="comment-list">
				<?php
					wp_list_comments( array(
						'style'      => 'ol',
						'short_ping' => true,
						'callback' 	=> 'marni_commentlist',
					) );
				?>
			</ol><!-- .comment-list -->


			<div class="nav_pagination_bottom">
				<?php paginate_comments_links( array(
					'prev_text'    => '<i class="fa fa-angle-left"></i>',
					'next_text'    => '<i class="fa fa-angle-right"></i>'
				) ); ?>
			</div>
			<div class="clear"> </div>
			
		</div><!-- .comment-list-wrap -->

	<?php endif; // Check for have_comments().

	// If comments are closed and there are comments, let's leave a little note, shall we?
	if ( ! comments_open() && get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) : ?>
		<p class="no-comments"><?php esc_html_e( 'Comments are closed.', 'marni' ); ?></p>
	<?php endif; ?>

</div><!-- #comments -->
