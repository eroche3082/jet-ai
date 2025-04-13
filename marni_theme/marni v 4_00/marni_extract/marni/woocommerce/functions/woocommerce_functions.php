<?php

/* Add theme support for lightbox*/
function marni_woo_setup() {
	add_theme_support( 'wc-product-gallery-slider' );
	add_theme_support( 'wc-product-gallery-lightbox' );
}
add_action( 'after_setup_theme', 'marni_woo_setup' );

/* Remove add to cart button from products overview **********************************/
function marni_remove_loop_button(){
	remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
}
add_action('init','marni_remove_loop_button');


/* Remove the product rating display on product loops ********************************/ 
function marni_remove_loop_rating(){
	remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_rating', 5 );
}
add_action('init','marni_remove_loop_rating');


/* Change number or products per page ************************************************/
add_filter( 'loop_shop_per_page', 'new_loop_shop_per_page', 20 );
function new_loop_shop_per_page( $cols ) {
  $cols = get_theme_mod( 'marni_productsperpage', '12'); 
  return $cols;
}

/* Remove results count ************************************************/
function marni_remove_results_count() {
	remove_action( 'woocommerce_before_shop_loop' , 'woocommerce_result_count', 20 );
}
add_action( 'init', 'marni_remove_results_count' );


/* Remove onsale flash ************************************************/
function marni_remove_sales_flash()
{
    return false;
}
add_filter('woocommerce_sale_flash', 'marni_remove_sales_flash');

?>