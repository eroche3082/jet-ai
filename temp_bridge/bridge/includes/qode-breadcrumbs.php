<?php

if(!function_exists('bridge_qode_custom_breadcrumbs')) {
	function bridge_qode_custom_breadcrumbs() {

		global $post;
		$homeLink = esc_url(home_url('/'));
		$blogTitle = get_option('blogname');
		$pageid = bridge_qode_get_page_id();
		$bread_style = "";
		if (get_post_meta($pageid, "qode_page_breadcrumbs_color", true) != "") {
			$bread_style = " style='color:" . get_post_meta($pageid, "qode_page_breadcrumbs_color", true) . "';";
		}
		$showOnHome = 0; // 1 - show breadcrumbs on the homepage, 0 - don't show
		$delimiter_sign = bridge_qode_options()->getOptionValue('breadcrumbs_delimiter_sign');
		if (!empty($delimiter_sign)) {
			$delimiter = '<span class="delimiter"' . $bread_style . '>&nbsp;' . $delimiter_sign . '&nbsp;</span>'; // delimiter between crumbs inserted in Qode Options
		} else {
			$delimiter = '<span class="delimiter"' . $bread_style . '>&nbsp;>&nbsp;</span>'; // default delimiter between crumbs
		}
		$home = esc_html__('Home', 'bridge'); // text for the 'Home' link
		$showCurrent = 1; // 1 - show current post/page title in breadcrumbs, 0 - don't show
		$before = '<span class="current"' . $bread_style . '>'; // tag before the current crumb
		$after = '</span>'; // tag after the current crumb

		if (is_home() && !is_front_page()) {


			echo '<div class="breadcrumbs"><div itemprop="breadcrumb" class="breadcrumbs_inner"><a' . $bread_style . ' href="' . $homeLink . '">' . $home . '</a>' . $delimiter . ' <a' . $bread_style . ' href="' . $homeLink . '">' . get_the_title($pageid) . '</a></div></div>';

		} elseif (is_home()) {

			if ($showOnHome == 1) echo '<div class="breadcrumbs"><div itemprop="breadcrumb" class="breadcrumbs_inner"><a' . $bread_style . ' href="' . $homeLink . '">' . $home . '</a></div></div>';
		} elseif (is_front_page()) {

			if ($showOnHome == 1) echo '<div class="breadcrumbs"><div itemprop="breadcrumb" class="breadcrumbs_inner"><a' . $bread_style . ' href="' . $homeLink . '">' . $home . '</a></div></div>';
		} else {

			echo '<div class="breadcrumbs"><div itemprop="breadcrumb" class="breadcrumbs_inner"><a' . $bread_style . ' href="' . $homeLink . '">' . $home . '</a>' . $delimiter;

			if (is_category() || bridge_qode_is_product_category() || bridge_qode_is_product_brand()) {
				$thisCat = get_category(get_query_var('cat'), false);
				if (isset($thisCat->parent) && $thisCat->parent != 0) echo get_category_parents($thisCat->parent, TRUE, ' ' . $delimiter);
				echo bridge_qode_get_module_part($before . single_cat_title('', false) . $after);

			} elseif (is_search()) {
				echo bridge_qode_get_module_part($before . esc_html__('Search results for "', 'bridge') . get_search_query() . '"' . $after);

			} elseif (is_day()) {
				echo '<a' . $bread_style . ' href="' . get_year_link(get_the_time('Y')) . '">' . get_the_time('Y') . '</a>' . $delimiter;
				echo '<a' . $bread_style . ' href="' . get_month_link(get_the_time('Y'), get_the_time('m')) . '">' . get_the_time('F') . '</a>' . $delimiter;
				echo bridge_qode_get_module_part($before . get_the_time('d') . $after);

			} elseif (is_month()) {
				echo '<a' . $bread_style . ' href="' . get_year_link(get_the_time('Y')) . '">' . get_the_time('Y') . '</a>' . $delimiter;
				echo bridge_qode_get_module_part($before . get_the_time('F') . $after);

			} elseif (is_year()) {
				echo bridge_qode_get_module_part($before . get_the_time('Y') . $after);

			} elseif (is_single() && !is_attachment()) {
				if (get_post_type() != 'post' && get_post_type() != 'product') {
					$post_type = get_post_type_object(get_post_type());
					$slug = $post_type->rewrite;
					if ($showCurrent == 1) echo bridge_qode_get_module_part($before . get_the_title() . $after);
				} elseif (get_post_type() == 'product') {
					$post_type = get_post_type_object(get_post_type());
					$shop_page = get_option('woocommerce_shop_page_id');
					if (!empty($shop_page)) {
						echo '<a' . $bread_style . ' href="' . get_permalink($shop_page) . '">' . get_the_title($shop_page) . '</a>' . $delimiter;
					}
					if ($showCurrent == 1) echo bridge_qode_get_module_part($before . get_the_title() . $after);
				} else {
					$cat = get_the_category();
					$cat = $cat[0];
					$cats = get_category_parents($cat, TRUE, ' ' . $delimiter);
					if ($showCurrent == 0) $cats = preg_replace("#^(.+)\s$delimiter\s$#", "$1", $cats);
					echo bridge_qode_get_module_part($cats);
					if ($showCurrent == 1) echo bridge_qode_get_module_part($before . get_the_title() . $after);
				}

			} elseif (is_attachment() && !$post->post_parent) {
				if ($showCurrent == 1) echo bridge_qode_get_module_part($before . get_the_title() . $after);

			} elseif (is_attachment()) {
				$parent = get_post($post->post_parent);
				$cat = get_the_category($parent->ID);
				if ($cat) {
					$cat = $cat[0];
					echo get_category_parents($cat, TRUE, ' ' . $delimiter);
				}
				echo '<a' . $bread_style . ' href="' . get_permalink($parent) . '">' . $parent->post_title . '</a>';
				if ($showCurrent == 1) echo bridge_qode_get_module_part($delimiter . $before . get_the_title() . $after);

			} elseif (is_page() && !$post->post_parent) {
				if ($showCurrent == 1) echo bridge_qode_get_module_part($before . get_the_title() . $after);

			} elseif (is_page() && $post->post_parent) {
				$parent_id = $post->post_parent;
				$breadcrumbs = array();
				while ($parent_id) {
					$page = get_page($parent_id);
					$breadcrumbs[] = '<a' . $bread_style . ' href="' . get_permalink($page->ID) . '">' . get_the_title($page->ID) . '</a>';
					$parent_id = $page->post_parent;
				}
				$breadcrumbs = array_reverse($breadcrumbs);
				for ($i = 0; $i < count($breadcrumbs); $i++) {
					echo bridge_qode_get_module_part($breadcrumbs[$i]);
					if ($i != count($breadcrumbs) - 1) echo ' ' . $delimiter;
				}
				if ($showCurrent == 1) echo bridge_qode_get_module_part($delimiter . $before . get_the_title() . $after);

			} elseif (is_tag()) {
				echo bridge_qode_get_module_part($before . esc_html__('Posts tagged "', 'bridge') . single_tag_title('', false) . '"' . $after);

			} elseif (is_author()) {
				global $author;
				$userdata = get_userdata($author);
				echo bridge_qode_get_module_part($before . esc_html__('Articles posted by ', 'bridge') . $userdata->display_name . $after);

			} elseif (is_404()) {
				echo bridge_qode_get_module_part($before . esc_html__('Error 404', 'bridge') . $after);
			} elseif (function_exists("is_woocommerce") && is_shop()) {

				if (get_option('woocommerce_shop_page_id')) {
					echo bridge_qode_get_module_part($before . get_the_title(get_option('woocommerce_shop_page_id')) . $after);
				}
			}

			if (get_query_var('paged')) {

				echo bridge_qode_get_module_part($before . " (" . esc_html__('Page', 'bridge') . ' ' . get_query_var('paged') . ")" . $after);

			}

			echo '</div></div>';

		}
	}
}