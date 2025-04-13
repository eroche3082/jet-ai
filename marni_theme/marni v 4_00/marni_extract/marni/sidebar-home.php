<?php if ( ! is_active_sidebar( 'sidebar-home' ) ) {
	return;
} 

if ( true == get_theme_mod( 'marni_sticky_sidebar', true ) ) {
	$sticky = "sticky";
} else {
	$sticky = "not-sticky";
}
?>

<aside id="sidebar-home" class="widget-area right-sidebar <?php echo esc_html($sticky); ?>">
	<div class="theiaStickySidebar">
		<div class="widgets-wrap ">
			<?php dynamic_sidebar( 'sidebar-home' ); ?>
		</div>
	</div>
</aside><!-- #sidebar-main -->
