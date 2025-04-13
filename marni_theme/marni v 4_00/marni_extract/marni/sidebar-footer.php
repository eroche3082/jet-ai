<?php if ( is_active_sidebar( 'sidebar-footer1' ) || is_active_sidebar( 'sidebar-footer2' ) || is_active_sidebar( 'sidebar-footer3' )  ) {
	
	$footer_sidebar_color = get_theme_mod('marni_footer_sidebar_color', 'dark');
	?>

	<div class="footer-sidebar-wrap <?php echo sanitize_html_class($footer_sidebar_color) ?>">
		<div class="footer-widget-area">
			<?php if ( is_active_sidebar( 'sidebar-footer1' ) ) { ?>
				<aside id="sidebar-footer1" class="widget-area footer-sidebar">
				<?php dynamic_sidebar( 'sidebar-footer1' ); ?>
				</aside>
			<?php } ?>

			<?php if ( is_active_sidebar( 'sidebar-footer2' ) ) { ?>
				<aside id="sidebar-footer2" class="widget-area footer-sidebar">
					<?php dynamic_sidebar( 'sidebar-footer2' ); ?>
				</aside>
			<?php } ?>

			<?php if ( is_active_sidebar( 'sidebar-footer3' ) ) { ?>
				<aside id="sidebar-footer3" class="widget-area footer-sidebar">
					<?php dynamic_sidebar( 'sidebar-footer3' ); ?>
				</aside>
			<?php } ?>
		</div>
	</div>
<?php } ?>