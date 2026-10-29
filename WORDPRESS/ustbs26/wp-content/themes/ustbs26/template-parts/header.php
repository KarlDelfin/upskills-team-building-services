<?php if(is_front_page()) { ?>
    <div id="loader">
        <div class="loader_con">
            <div class="loader_progress_bar">
                <div class="loader_progress_fill"></div>
            </div>
            <p class="loader_status">Loading experience...</p>
        </div>
    </div>
<?php } ?>

<header id="header">
    <div class="header_con">
        <div class="comp_logo">
            <a href="<?php echo esc_url(home_url('/')); ?>">
                <img src="<?php bloginfo('template_url'); ?>/assets/images/logo.webp" alt="Upskills Team Building Services" />
            </a>
        </div>

        <nav id="nav">
            <?php wp_nav_menu(array('theme_location' => 'primary', 'container' => false)); ?>
        </nav>

        <button class="menu_toggle" id="open_menu" aria-label="Toggle Navigation">
            <svg width="64" height="64" viewBox="0 0 20 20" fill="none">
            <line x1="3" y1="6" x2="17" y2="6" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            <line x1="3" y1="10" x2="17" y2="10" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            <line x1="3" y1="14" x2="17" y2="14" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </button>
    </div>
</header>

<div class="nav_mobile">
    <button class="menu_toggle" id="close_menu" aria-label="Toggle Navigation">
        <svg xmlns="http://w3.org" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" stroke="#ffffff" stroke-width="2" stroke-linecap="round"></line>
            <line x1="6" y1="6" x2="18" y2="18" stroke="#ffffff" stroke-width="2" stroke-linecap="round"></line>
        </svg>
    </button>
    <nav class="nav_panel">
        <?php wp_nav_menu(array('theme_location' => 'primary', 'container' => false)); ?>
    </nav>
</div>