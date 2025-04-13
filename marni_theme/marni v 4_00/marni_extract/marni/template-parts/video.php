<?php
$video = '';
if ( class_exists( 'RWMB_Field' ) ) { 
	$video = rwmb_meta( 'redsun_videourl' );
}
if ($video) {
	if (strpos($video,'iframe') !== false) {
		$video_allowed_html = marni_video_allowed_html();
		echo wp_kses( $video , $video_allowed_html );
	} else {
		// http
		if (strpos($video,'https') !== false) {
			$http = 'https:';
		} else {
			$http = 'http:';
		}
		// YOUTUBE
		if (strpos($video,'youtu') !== false) {
		        $id = marni_youtube_id($video);
		        $video_URL = "//www.youtube.com/embed/";
		}
		// VIMEO
		elseif (strpos($video,'vimeo') !== false) {
			sscanf(parse_url($video, PHP_URL_PATH), '/%d',  $id);
			$video_URL = "//player.vimeo.com/video/";
		} 
		?>
		<iframe src="<?php echo esc_html($http); ?><?php echo esc_url($video_URL); ?><?php echo esc_html($id); ?>" width="800" height="450" allowfullscreen></iframe>
	<?php } 
} ?>









