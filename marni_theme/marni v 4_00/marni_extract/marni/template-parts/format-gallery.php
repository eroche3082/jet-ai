<?php
$rows = rwmb_meta('redsun_gallery_rows');
?>

<div class="gallery gallery-overlay gallery-columns-<?php echo sanitize_html_class($rows); ?>">
<?php

if ( class_exists( 'RWMB_Field' ) ) {
	$images = rwmb_meta( 'redsun_gallery', 'type=image&size=full' );

        foreach ( $images as $image ) {
                	$imageurl = $image['url'];
                	$imagecaption = $image['caption'];
                	$imagefull = $image['full_url'];
                	$imagealt = $image['alt'];
                ?>

                <figure class="gallery-item ">

                        <div class="single-gallery-image ">      
                                <a class="pretty_image links_to_image" title="<?php echo esc_attr($imagecaption); ?>" data-rel="prettyPhoto[pp_gallery]" href="<?php echo esc_url($imagefull); ?>">                     
                                        <img class="gallery-thumb-single" alt="<?php echo esc_attr($imagealt); ?>" src="<?php echo esc_url($imageurl); ?>">
                                </a>

                        </div>

			<?php if ($imagecaption) { ?>
	                        <figcaption class="wp-caption-text gallery-caption">
	                		<?php echo esc_html($imagecaption); ?>
	                	</figcaption>
	                <?php } ?>
                </figure>

        <?php } 

} ?> 
</div>
