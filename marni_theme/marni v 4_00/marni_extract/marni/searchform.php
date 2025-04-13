<!-- searchform-->

<?php $unique_id = uniqid( 'search-form-' ); ?>

<form role="search" method="get" class="searchform" action="<?php echo esc_url( home_url( '/' ) ); ?>">

	<label for="<?php echo esc_attr($unique_id); ?>" class="search-field-label">
		<span class="screen-reader-text"><?php echo _x( 'Search for:', 'label', 'marni' ); ?></span>
	</label>

	<input id="<?php echo esc_attr($unique_id); ?>" type="search" class="search-field" placeholder="<?php echo esc_attr_x( 'Search here &hellip;', 'placeholder', 'marni' ); ?>" value="<?php echo get_search_query(); ?>" name="s">

 	<button type="submit" class="button button-searchform">
            	<i class="fa fa-search"></i>
        </button>

</form>
