<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php _e('Page Not Found | Upskills Team Building Services', 'upskills'); ?></title>
  <link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/assets/css/style.css">
  <link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/assets/css/404.css">
  <?php wp_head(); ?>
  <style>

  </style>
</head>
<body <?php body_class('error-404-page'); ?>>

  <main class="page_404_container">
    <div class="page_404_card">
      <div class="page_404_logo">
        <a href="<?php echo esc_url(home_url('/')); ?>">
          <img src="<?php bloginfo('template_url'); ?>/assets/images/logo.webp" alt="<?php bloginfo('name'); ?>">
        </a>
      </div>

      <div class="page_404_content">
        <span class="badge_404">Error 404</span>
        <h1 class="title_404"><?php _e('Oops! Lost on the Trail?', 'upskills'); ?></h1>
        <p class="desc_404">
          <?php _e("The page you are looking for has been moved, renamed, or doesn't exist. Let's get your team back on track.", 'upskills'); ?>
        </p>
      </div>

      <div class="page_404_search">
        <?php get_search_form(); ?>
      </div>

      <div class="page_404_actions">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="btn_home">
          <?php _e('Back to Homepage', 'upskills'); ?>
        </a>
        <a href="<?php echo esc_url(home_url('/#contact')); ?>" class="btn_contact">
          <?php _e('Contact Us', 'upskills'); ?>
        </a>
      </div>
    </div>
  </main>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const searchInput = document.querySelector('.page_404_search input[type="search"], #s');
      if (searchInput) searchInput.focus();
    });
  </script>

  <?php wp_footer(); ?>
</body>
</html>