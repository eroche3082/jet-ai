<?php 
$header_layout = get_theme_mod('marni_header_layout', 'standard');

if (get_theme_mod('marni_menuleft', '')) {
	$leftvalue = get_theme_mod('marni_menuleft', '3'); 	
} else {
	$leftvalue = 3; 
	} 

$leftitems = $leftvalue + 1;
?>

<nav id="site-navigation" class="main-navigation" data-leftitems="<?php echo intval($leftitems); ?>">	
	<?php if ( $header_layout == 'header1' ) { ?>
		<ul class="primary-menu menu-logo-centered" data-leftitems="<?php echo intval($leftitems); ?>">
			<li class="menu-item-logo">
				<?php get_template_part( 'template-parts/logo' ); ?>
			</li>
			<?php $args = array(
			  	'theme_location'  => 'primary',
			  	'container'       => false,
			  	'items_wrap'      => '%3$s',
			  	'fallback_cb' 	  => 'marni_wp_page_menu'
			); 
			wp_nav_menu( $args ); ?>
		</ul>
	<?php } else {
		$args = array(
		  	'theme_location'  => 'primary',
		  	'menu_class' => 'primary-menu'
		); 
		wp_nav_menu( $args );
	} ?>
</nav>





