<?php if ( ! is_active_sidebar( 'sidebar-home-top' ) ) {
	return;
} ?>

<aside id="sidebar-home-top" class="widget-area">
	<div class="widgets-wrap ">
		<?php dynamic_sidebar( 'sidebar-home-top' ); ?>
	</div>
</aside><!-- #sidebar-main -->
