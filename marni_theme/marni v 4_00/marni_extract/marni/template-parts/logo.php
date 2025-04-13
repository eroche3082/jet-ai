<?php
$custom_logo_id = get_theme_mod( 'custom_logo' );
$logo = wp_get_attachment_image_src( $custom_logo_id , 'full' );
if ( is_front_page() && is_home() ) { 
	if ( function_exists( 'the_custom_logo' ) && has_custom_logo() ) { ?>
		<div class="logowrap logo-img">
			<h1 class="site-title site-logo">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
				    	<img src="<?php echo esc_url( $logo[0] ); ?>" width="<?php echo esc_attr( $logo[1] ); ?>" height="<?php echo esc_attr( $logo[2] ); ?>" alt="<?php bloginfo( 'name' ); ?>" />
				</a>
			</h1>
		</div>
	<?php } else { ?>
		<div class="logowrap text-logo">	
			<h1 class="site-title">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
					<?php bloginfo( 'name' ); ?>
				</a>
			</h1>
		</div>
	<?php } 
} else { 
	if ( function_exists( 'the_custom_logo' ) && has_custom_logo() ) { ?>
		<div class="logowrap  logo-img">		
			<h3 class="site-title site-logo">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
				<img src="<?php echo esc_url( $logo[0] ); ?>" width="<?php echo esc_attr( $logo[1] ); ?>" height="<?php echo esc_attr( $logo[2] ); ?>" alt="<?php bloginfo( 'name' ); ?>" />
				</a>
			</h3>
		</div>
	<?php } else { ?>
		<div class="logowrap text-logo">	
			<h3 class="site-title">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
					<?php bloginfo( 'name' ); ?>
				</a>
			</h3>
		</div>		
	<?php } 
} ?>






