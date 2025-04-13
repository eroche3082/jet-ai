<?php 
if ( (get_theme_mod('marni_single_date',true) == true) ) { 
	marni_post_date();
}
if ( (get_theme_mod('marni_single_comments',true) == true) ) { 
	marni_comments_count(false);
}
if ( (get_theme_mod('marni_single_author',true) == true) ) { 
	marni_post_author();
}
if ( (get_theme_mod('marni_single_location',true) == true) ) { 
	marni_location();
} 
if ( (get_theme_mod('marni_single_views',true) == true) ) {  
	marni_views_count();
} 
?>






