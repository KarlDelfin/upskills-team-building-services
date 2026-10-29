<?php 
// REMOVE POST AND COMMENT MENU ON WORDPRESS DASHBOARD
function remove_wordpress_menus() {
    // 1. Hide the visual menu links from the sidebar
    remove_menu_page( 'edit.php' );
    remove_menu_page( 'edit-comments.php' );
    remove_submenu_page( 'themes.php', 'font-library.php' ); 
    remove_submenu_page( 'themes.php', 'site-editor.php?p=/pattern' );
    remove_submenu_page( 'themes.php', 'site-editor.php?path=/pattern' );
    remove_submenu_page( 'plugins.php', 'plugin-editor.php' );
    remove_submenu_page( 'tools.php', 'tools.php' );
    remove_submenu_page( 'tools.php', 'import.php' );
    remove_submenu_page( 'tools.php', 'export.php' );
    remove_submenu_page( 'tools.php', 'export-personal-data.php' );
    remove_submenu_page( 'tools.php', 'erase-personal-data.php' );
    remove_submenu_page( 'users.php', 'user-new.php' );
    remove_submenu_page( 'users.php', 'users.php' );

    global $pagenow;
    $current_query = $_SERVER['QUERY_STRING'] ?? '';
    $full_request  = $pagenow . ( $current_query ? '?' . $current_query : '' );

    $blocked_pages = array(
        'edit.php',
        'edit-comments.php',
        'plugin-editor.php',
        'import.php',
        'export.php',
        'export-personal-data.php',
        'erase-personal-data.php',
        'user-new.php',
        'users.php'
    );

    $blocked_queries = array(
        'font-library.php',
        'site-editor.php?p=/pattern',
        'site-editor.php?path=/pattern'
    );

    if ( in_array( $pagenow, $blocked_pages ) ) {
        wp_die( __( 'Access Denied: This screen has been disabled.', 'textdomain' ), '', array( 'response' => 403 ) );
    }

    foreach ( $blocked_queries as $query ) {
        if ( strpos( $full_request, $query ) !== false ) {
            wp_die( __( 'Access Denied: This screen has been disabled.', 'textdomain' ), '', array( 'response' => 403 ) );
        }
    }
}
add_action( 'admin_menu', 'remove_wordpress_menus', 999 );


// RESTORE APPEARANCE > MENUS
function my_custom_theme_setup() {
    add_theme_support('menus');
    register_nav_menus(array(
        'primary' => __( 'Primary Menu', 'textdomain' ),
    ));
}
add_action( 'after_setup_theme', 'my_custom_theme_setup' );

