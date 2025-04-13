<?php

//------------------------------------------------------------------------------
// POST columns
//------------------------------------------------------------------------------

function marni_manage_columns_for_post($columns){
	//add new columns
	$columns['post_featured_image'] = esc_html__('Featured Image','marni');
	return $columns;
}
add_action('manage_post_posts_columns','marni_manage_columns_for_post');

//Populate custom columns for `page` post type
function marni_populate_post_columns($column,$post_id){
	//featured image column
	if($column == 'post_featured_image'){
		//if this post has a featured image
		if(has_post_thumbnail($post_id)){
			$post_thumbnail_id = get_post_thumbnail_id($post_id);
			$post_thumbnail_src = wp_get_attachment_image_src( $post_thumbnail_id, $size = 'marni-square-mini' );
		    	echo '<img src=" ' . esc_url($post_thumbnail_src[0]) . ' " width="100px" height="100px"  />';
		} else {
		    echo ''; 
		}
	}
}
add_action('manage_post_posts_custom_column','marni_populate_post_columns',10,2);

// reorder columns
add_filter('manage_posts_columns', 'marni_post_column_order');
function marni_post_column_order($columns) {
	$n_columns = array();
	$before = 'comments'; // move before this

	foreach($columns as $key => $value) {
		if ($key==$before){
			$n_columns['post_featured_image'] = '';
		}
		$n_columns[$key] = $value;
	}
	return $n_columns;
}
?>