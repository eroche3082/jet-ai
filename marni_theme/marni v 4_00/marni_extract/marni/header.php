<!DOCTYPE html>

<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<?php 
do_action( 'marni_body_hook' ); 

$header_layout = get_theme_mod('marni_header_layout', 'header2');
$navi_style = get_theme_mod('marni_navi_style', 'standard');
$social_position_h2 = get_theme_mod('marni_social_position_h2', 'topbar');
$social_position_h3 = get_theme_mod('marni_social_position_h3', 'topbar');
$search_position_h2 = get_theme_mod('marni_search_position_h2', 'topbar');
$search_position_h3 = get_theme_mod('marni_search_position_h3', 'topbar');
$cart_position_h2 = get_theme_mod('marni_cart_position_h2', 'topbar');
$cart_position_h3 = get_theme_mod('marni_cart_position_h3', 'topbar');
?>


<!-- SEARCH OVERLAY -->
<div id="search-overlay">
	<a href="#" class="search-close"> <i class="icon-close pe-7s-close"></i></a>
	<?php get_template_part( 'template-parts/searchform' ); ?>
</div><!-- .search-overlay -->

<div id="page" class="site-wrap">
	<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'marni' ); ?></a>

	<header id="header" class="site-header">

		<div id="header-regular" class="<?php echo sanitize_html_class($header_layout) ?> naviborder-<?php echo sanitize_html_class($navi_style) ?> socialpos-h2-<?php echo sanitize_html_class($social_position_h2) ?> socialpos-h3-<?php echo sanitize_html_class($social_position_h3) ?> searchpos-h2-<?php echo sanitize_html_class($search_position_h2) ?> searchpos-h3-<?php echo sanitize_html_class($search_position_h3) ?> cartpos-h2-<?php echo sanitize_html_class($cart_position_h2) ?> cartpos-h3-<?php echo sanitize_html_class($cart_position_h3) ?>">

			<div class="topbar"> 
				<div class="topbar-content"> 
					
					<!-- NAVI -->
					<?php if ( $header_layout == 'header3' ) { 
						get_template_part( 'template-parts/navigation' ); 
					} ?>		

					<!-- SOCIAL -->
					<?php if (	(true == get_theme_mod( 'marni_topbar_socialicons_h1', true ) && $header_layout == 'header1') ||
							(true == get_theme_mod( 'marni_topbar_socialicons_h4', true ) && $header_layout == 'header4') ||
							( $social_position_h2 == 'topbar' && $header_layout == 'header2') ||
							( $social_position_h3 == 'topbar' && $header_layout == 'header3')    ) {
						marni_icon_list(); 
					} ?>

					<!-- CART ICON -->
					<?php if ( class_exists( 'woocommerce' ) ) { 
						if (	(true == get_theme_mod( 'marni_topbar_cart_h1', true ) && $header_layout == 'header1') ||
							(true == get_theme_mod( 'marni_topbar_cart_h4', true ) && $header_layout == 'header4') ||
							( $cart_position_h2 == 'topbar' && $header_layout == 'header2') ||
							( $cart_position_h3 == 'topbar' && $header_layout == 'header3')    ) {

							if (sizeof(WC()->cart->get_cart()) != 0) { ?>
								<div class="cart-icon-wrap">
									<?php marni_cart_count(); ?>
								</div>
							<?php } 
						}
					} ?>

	        			<!-- SEARCH -->
					<?php if (	(true == get_theme_mod( 'marni_topbar_searchbutton_h1', true ) && $header_layout == 'header1') ||
							(true == get_theme_mod( 'marni_topbar_searchbutton_h4', true ) && $header_layout == 'header4') ||
							( $search_position_h2 == 'topbar' && $header_layout == 'header2') ||
							( $search_position_h3 == 'topbar' && $header_layout == 'header3')  ) { ?>
				        	<div class="searchbutton"> <div class="search-icon-wrap"> <a href="#"> <i class="icon-search fa fa-search"></i> </a> </div></div> <!-- .searchbutton-->
	        			<?php } ?>

		                </div> <!-- .topbar-content -->

			</div> <!-- .topbar -->

			<div class="header-wrap">
			<?php if ( $header_layout == 'header2' ||  $header_layout == 'header3' ) { ?>
				<div class="header-wrap1">

					<!-- SOCIAL -->
					<?php if ( 	($social_position_h2 == 'logoleft' && $header_layout == 'header2') || 
							($social_position_h3 == 'logoleft' && $header_layout == 'header3')  
						) { ?>
					<div class="logo-left">
				        	<?php marni_icon_list();?>
					</div>
					<?php } else { ?>
		        		<div class="spaceholder"> </div>
		        		<?php } ?>

					<!-- LOGO -->
					<?php get_template_part( 'template-parts/logo' ); ?>

					<!-- SOCIAL & SEARCHBUTTON -->
					<?php if ( 	($social_position_h2 == 'logoright' && $header_layout == 'header2') || 
							($social_position_h3 == 'logoright' && $header_layout == 'header3') ||  
							($search_position_h2 == 'logo' && $header_layout == 'header2') ||  
							($search_position_h3 == 'logo' && $header_layout == 'header3') || 
							( class_exists( 'woocommerce' ) && $cart_position_h2 == 'logoright' && $header_layout == 'header2') ||  
							( class_exists( 'woocommerce' ) && $cart_position_h3 == 'logoright' && $header_layout == 'header3') 
						) { ?>
						<div class="logo-right">
							<?php 
							if ( 	($social_position_h2 == 'logoright' && $header_layout == 'header2') || 
								($social_position_h3 == 'logoright' && $header_layout == 'header3') 
							) {
								marni_icon_list(); 
			        			}

			        			if ( 	($cart_position_h2 == 'logoright' && $header_layout == 'header2') || 
			        				($cart_position_h3 == 'logoright' && $header_layout == 'header3') 
			        				) {
								if ( class_exists( 'woocommerce' ) ) { 
									if (sizeof(WC()->cart->get_cart()) != 0) { ?>
										<div class="cart-icon-wrap">
											<?php marni_cart_count(); ?>
										</div>
									<?php } 
								}
			        			} 

							if ( 	($search_position_h2 == 'logo' && $header_layout == 'header2')  ||  
								($search_position_h3 == 'logo' && $header_layout == 'header3')  
							) { ?>
						        <div class="searchbutton"><a href="#" class="search-button"> <i class="icon-search fa fa-search"></i> </a> </div></div> <!-- .searchbutton-->
			        			<?php } ?>
			        		</div>
		        		<?php } else { ?>
		        			<div class="spaceholder"> </div>
		        		<?php } ?>

				</div>
			<?php }  ?>	

				<div class="header-wrap2">	

					<!-- LOGO -->
					<div class="logo-left">
					<?php get_template_part( 'template-parts/logo' ); ?>
					</div>

					<!-- NAVI -->
					<div class="nav-wrap <?php echo sanitize_html_class($navi_style) ?>">
						<?php get_template_part( 'template-parts/navigation' ); ?>
					</div>

				</div>
			</div>

		</div> <!-- #header-regular -->


		<div id="header-responsive">

			<div class="topbar"> 
				<div class="topbar-content"> 
					<div class="topbar-left"> </div>

					<div class="topbar-center">
					<!-- SOCIAL -->
					<?php if (	(true == get_theme_mod( 'marni_topbar_socialicons_h1', true ) && $header_layout == 'header1') ||
							(true == get_theme_mod( 'marni_topbar_socialicons_h4', true ) && $header_layout == 'header4') ||
							( $social_position_h2 !== 'none' && $header_layout == 'header2') ||
							( $social_position_h3 !== 'none' && $header_layout == 'header3')    ) {
						marni_icon_list(); 
					} ?>
					</div>
					<div class="topbar-right">
						<!-- CART ICON -->
						<?php if ( class_exists( 'woocommerce' ) ) { 
							if (	(true == get_theme_mod( 'marni_topbar_cart_h1', true ) && $header_layout == 'header1') ||
								(true == get_theme_mod( 'marni_topbar_cart_h4', true ) && $header_layout == 'header4') ||
								( $cart_position_h2 == 'topbar' && $header_layout == 'header2') ||
								( $cart_position_h3 == 'topbar' && $header_layout == 'header3')  ||    
								( $cart_position_h2 == 'logoright' && $header_layout == 'header2') || 
				        			( $cart_position_h3 == 'logoright' && $header_layout == 'header3') ) {

								if (sizeof(WC()->cart->get_cart()) != 0) { ?>
									<div class="cart-icon-wrap">
										<?php marni_cart_count(); ?>
									</div>
								<?php } 
							}
						} ?>

					</div>

		                </div> <!-- .topbar-content -->
			</div> <!-- .topbar -->

			<div class="header-wrap">
				<div class="header-top">
					<div class="header-left"> </div>

					<div class="header-center">
						<?php get_template_part( 'template-parts/logo' ); ?>
					</div>

					<div class="header-right">
						<?php if (	(true == get_theme_mod( 'marni_topbar_searchbutton_h1', true ) && $header_layout == 'header1' ) ||
							(true == get_theme_mod( 'marni_topbar_searchbutton_h4', true ) && $header_layout == 'header4' ) ||
								($search_position_h2 !== 'none' && $header_layout == 'header2' ) ||
								($search_position_h3 !== 'none' && $header_layout == 'header3' )
							) { ?>
					        	<div class="searchbutton"> <div class="search-icon-wrap"> <a href="#"> <i class="icon-search fa fa-search"></i> </a> </div></div> <!-- .searchbutton-->
		        			<?php } ?>
					</div>
				</div>

				<nav id="site-navigation-responsive" class="menu-responsive <?php echo sanitize_html_class($header_layout) ?>"></nav>
				
			</div>

		</div> <!-- #header-responsive -->
		
	</header><!-- #header -->