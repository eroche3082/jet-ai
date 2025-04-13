<div class="clear"></div>
<footer id="footer" class="site-footer">

	<?php if ( is_active_sidebar( 'sidebar-instagram' ) ) { ?>
		<aside id="sidebar-instagram" class="widget-area">
			<?php dynamic_sidebar( 'sidebar-instagram' ); ?>
		</aside>
	<?php } ?>


	<?php if (get_theme_mod('marni_social_footer', true) == true) {
		$icons = get_theme_mod( 'social_accounts', '' ); 
		if ($icons) { ?>
		<div class="social-footer">
			<?php marni_icon_list('true'); ?> 
		</div>
		<?php }
	} ?>

	<?php get_sidebar('footer'); ?>

	<div class="footer-wrap">
		<?php $footer_logo_url = get_theme_mod( 'marni_logo_footer' );
		if ( get_theme_mod('marni_logo_footer') != '' ) { ?>
			<div class="footer-logo">
			    	<img src="<?php echo esc_url($footer_logo_url); ?>" alt="<?php bloginfo( 'name' ); ?>" />
			</div>
		<?php }
		
		if ( get_theme_mod('marni_footer_left') != '' || get_theme_mod('marni_footer_middle') != '' || get_theme_mod('marni_footer_right') != '' ) { ?>
			<div class="footer-info-wrap">
				<div class="footer-info footer-info-left">
					<?php echo wp_kses_post(get_theme_mod('marni_footer_left', '&copy; ' .  date("Y") . ' Marni. All Rights Reserved.')); ?>
				</div>
				<div class="footer-info footer-info-middle">
					<?php echo wp_kses_post(get_theme_mod('marni_footer_middle', 'Thanks for reading!')); ?>
				</div>
				<div class="footer-info footer-info-right">
					<?php echo wp_kses_post(get_theme_mod('marni_footer_right', '')); ?>
				</div>
			</div>
		<?php } ?>
	</div>

</footer><!-- #footer -->

</div><!-- #page -->

<?php wp_footer(); ?>
</body>
</html>
