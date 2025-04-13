<?php

/** ADD BODY CLASSES ********************************************************************************/
add_action( 'body_class', 'marni_custom_class');
function marni_custom_class( $classes ) {

	// is mobile?
	if( wp_is_mobile() ){
		$device = 'ismobile';
	} else { 
		$device = 'nomobile';
	} 

	// use bg image on mobile?
	$usemobilebg = get_theme_mod('marni_mobile_bg', false);
	if ( $usemobilebg ) { 
		$mobilebg ='nomobilebg';  
	} else { 
		$mobilebg =''; 
	}

    // Add custom class
    $classes[] = $device;
    $classes[] = $mobilebg;

    return $classes;
}


/** WP_KSES ALLOWED TAGS *****************************************************************************/
function marni_allowed_html() {

	$allowed_tags = array(
		
		'section' => array(
				'id' => array(),
				'class' => array()
			),

		'div' 	=> array( 'class' => array(), ),
		'span' 	=> array( 'class' => array(), ),
		'p' 	=> array( 'class' => array(), ),
		'i' 	=> array( 'class' => array(), ),

		'h1' 	=> array( 'class' => array(), ),
		'h2' 	=> array( 'class' => array(), ),
		'h3' 	=> array( 'class' => array(), ),
		'h4' 	=> array( 'class' => array(), ),
		'h5' 	=> array( 'class' => array(), ),
		'h6' 	=> array( 'class' => array(), ),

		'ol' 	=> array( 'class' => array(), ),
		'ul' 	=> array( 'class' => array(), ),
		'li' 	=> array( 'class' => array(), ),

		'a' 	=> array(
				'class' => array(),
				'href'  => array(),
				'rel'   => array(),
				'title' => array(),
			),

		'img' 	=> array(
				'alt'    => array(),
				'class'  => array(),
				'height' => array(),
				'src'    => array(),
				'width'  => array(),
			),

		'strong' => array(),
		'em' 	=> array(),

	);
	
	return $allowed_tags;
}



/** VIDEO POST ALLOWED TAGS ********************************************************************************/
function marni_video_allowed_html() {

	$video_allowed_tags = array(
		'iframe' => array(
				'src' => array(),
				'width' => array(),
				'height' => array(),
				'frameborder' => array(),
				'title' => array(),
				'webkitallowfullscreen' => array(),
				'mozallowfullscreen' => array(),
				'allowfullscreen' => array()
			),
	);
	
	return $video_allowed_tags;
}



/** AUTOMATICALLY ADD REL PRETTYPHOTO TO <A> TAGS THAT LINK TO AN IMAGE********/
add_filter('the_content', 'marni_addlightboxrel_replace', 12);
add_filter('get_comment_text', 'marni_addlightboxrel_replace');

function marni_addlightboxrel_replace ($content) {
         global $post;
         $pattern = "/<a(.*?)href=('|\")([^>]*).(bmp|gif|jpeg|jpg|png)('|\")(.*?)>(.*?)<\/a>/i";
         $replacement = '<a$1href=$2$3.$4$5 class="links_to_image" data-rel="prettyPhoto['.$post->ID.']"$6>$7</a>';
         $content = preg_replace($pattern, $replacement, $content);
         return $content;
}


/**  Fetch YouTube and Vimeo ID from URLs **********************************************/
function marni_youtube_id( $url ){
	$regex = '~(?:http|https|)(?::\/\/|)(?:www.|)(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w\-]{11})[a-z0-9;:@#?&%=+\/\$_.-]*~i';
 	$id = preg_replace( $regex, '$1', $url );
	return $id;
}

function marni_vimeo_id( $url ) {
	$regex = '~
		# Match Vimeo link and embed code
		(?:<iframe [^>]*src=")?         # If iframe match up to first quote of src
		(?:                             # Group vimeo url
				https?:\/\/             # Either http or https
				(?:[\w]+\.)*            # Optional subdomains
				vimeo\.com              # Match vimeo.com
				(?:[\/\w]*\/videos?)?   # Optional video sub directory this handles groups links also
				\/                      # Slash before Id
				([0-9]+)                # $1: VIDEO_ID is numeric
				[^\s]*                  # Not a space
		)                               # End group
		"?                              # Match end quote if part of src
		(?:[^>]*></iframe>)?            # Match the end of the iframe
		(?:<p>.*</p>)?                  # Match any title information stuff
		~ix';
	
	preg_match( $regex, $url, $matches );
	
	return $matches[1];
}



/**  Navigation fallback *****************************************************/
function marni_wp_page_menu() {
	$args = array(
	  	'container' => false,
	  	'before'      => '',
	  	'after'       => '',

	); 
	wp_page_menu( $args );
}


/** PAGINATION ****************************************************************/
function marni_pagination($pages = '', $range = 2) {
	$showitems = ($range * 2)+1;

	global $paged;
	if ( empty($paged) ) {
		$paged = 1;
	}
	
	if ($pages == '') {
		global $wp_query;
		$pages = $wp_query->max_num_pages;
		if (!$pages) {
			$pages = 1;
		}
	}

	if (1 != $pages) {
		
	         echo "<div class='pagination_main'>";
	         
	         if ($paged > 2 && $paged > $range+1 && $showitems < $pages) {
	         	echo "<a href='".get_pagenum_link(1)."'><i class='fa fa-angle-double-left'></i></a>";
	         }
	         
	         if ($paged > 1 && $showitems < $pages) {
	         	echo "<a href='".get_pagenum_link($paged - 1)."'><i class='fa fa-angle-left'></i></a>";
	         }
	         
	         for ($i=1; $i <= $pages; $i++) {
			if (1 != $pages &&( !($i >= $paged+$range+1 || $i <= $paged-$range-1) || $pages <= $showitems )) {
				echo (esc_html($paged) == $i)? "<span class='current'>".$i."</span>":"<a href='".get_pagenum_link($i)."' class='inactive' >".$i."</a>";
	             	}
	         }
	
	         if ($paged < $pages && $showitems < $pages) {
	         	echo "<a href='".get_pagenum_link($paged + 1)."'><i class='fa fa-angle-right'></i></a>";
	         }
	         
	         if ($paged < $pages-1 &&  $paged+$range-1 < $pages && $showitems < $pages) {
	         echo "<a href='".get_pagenum_link($pages)."'><i class='fa fa-angle-double-right'></i></a>";
	         }
	         
	         echo "</div>\n";
	}
}


/** STYLE COMMENTS ********************************************************************************/
function marni_commentlist($comment, $args, $depth) {
        $GLOBALS['comment'] = $comment;
        
        static $counter;
        if (!isset($counter))
        $counter = $args['per_page'] * ($args['page'] - 1) + 1;
        elseif ($comment->comment_parent==0) {
        $counter++;
        }
        
        ?>   
        <li <?php comment_class(); ?> id="li-comment-<?php comment_ID() ?>">
                <div id="comment-<?php comment_ID(); ?>" class="single-comment">
                	<div class="comment-left comment-author vcard">
                           <?php echo get_avatar( $comment, 96 ); ?>
                        </div>
                        <div class="comment-body">
                                <div class="comment-meta comment-metadata">
                                        <?php printf('<cite class="fn">%s</cite>', get_comment_author_link()) ?>
                                        <div class="comment-date"><?php comment_date() ?></div>                                  
                                </div>
                                <div class="comment-text">
                                        <?php if ($comment->comment_approved == '0') : ?>
                                           <em class="moderation"><?php esc_html_e('Your comment is awaiting moderation.', 'marni') ?></em>
                                           <br />
                                        <?php endif; ?>
                                                    
                                        <?php comment_text() ?>
                                </div>
                        </div>
                        <div class="comment-right">
                                <?php comment_reply_link( array_merge( $args, array(
				    'depth'     => $depth,
				    'max_depth' => $args['max_depth'],
				    'before'    => '<div class="reply-button">',
				    'after'     => '</div>'
				 ) ) );
				 ?>
                        </div>        
                </div>
<?php } ?>