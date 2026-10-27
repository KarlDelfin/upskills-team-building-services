<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php printf(__('Search Results for: %s | Upskills', 'upskills'), esc_html(get_search_query())); ?></title>
  <link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/assets/css/style.css">
  <link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/assets/css/search.css">
  <?php wp_head(); ?>
</head>

<body <?php body_class('search-results-page'); ?>>
  <?php wp_body_open(); ?>

  <!-- Top Minimal Header -->
  <header class="search_top_header">
    <div class="search_header_inner">
      <div class="search_logo">
        <a href="<?php echo esc_url(home_url('/')); ?>">
          <img src="<?php bloginfo('template_url'); ?>/assets/images/logo.webp" alt="<?php bloginfo('name'); ?>">
        </a>
      </div>
      <a href="<?php echo esc_url(home_url('/')); ?>" class="back_home_link">&larr; Back to Home</a>
    </div>
  </header>

  <main class="search_main">
    <div class="search_wrapper">
      <section class="search_hero">
        <span class="search_badge">Search Portal</span>
        <h1 class="search_title">
          Results for: <span>"<?php echo esc_html(get_search_query()); ?>"</span>
        </h1>
        <div class="search_bar_con">
          <?php get_search_form(); ?>
        </div>
      </section>

      <?php if (have_posts()) { ?>
        <div class="search_results_list">
          <?php while (have_posts()) : the_post(); ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class('search_result_item'); ?>>
              
              <?php if (has_post_thumbnail()) : ?>
                <div class="result_thumb">
                  <a href="<?php the_permalink(); ?>">
                    <?php the_post_thumbnail('medium'); ?>
                  </a>
                </div>
              <?php endif; ?>

              <div class="result_body">
                <div class="result_meta">
                  <span class="result_type"><?php echo esc_html(get_post_type()); ?></span>
                  <time datetime="<?php echo get_the_date('c'); ?>"><?php echo get_the_date(); ?></time>
                </div>

                <h2 class="result_title">
                  <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                </h2>

                <div class="result_excerpt">
                  <?php the_excerpt(); ?>
                </div>

                <a href="<?php the_permalink(); ?>" class="result_read_more">
                  Read More &rarr;
                </a>
              </div>

            </article>
          <?php endwhile; ?>
        </div>

        <div class="search_pagination">
          <?php
            the_posts_pagination(array(
              'mid_size'           => 2,
              'prev_text'          => __('&larr; Previous', 'upskills'),
              'next_text'          => __('Next &rarr;', 'upskills'),
              'screen_reader_text' => __('Posts navigation', 'upskills'),
            ));
          ?>
        </div>

      <?php } else { ?>
        <div class="search_empty_card">
          <div class="empty_icon">&#128269;</div>
          <h2>Nothing Found</h2>
          <p>We couldn't find any training packages, articles, or resources matching <strong>"<?php echo esc_html(get_search_query()); ?>"</strong>. Try checking for typos or searching with broader keywords.</p>
          
          <div class="empty_actions">
            <a href="<?php echo esc_url(home_url('/#services')); ?>" class="btn_search_accent">Browse Packages</a>
            <a href="<?php echo esc_url(home_url('/#contact-us')); ?>" class="btn_search_outline">Contact Facilitator</a>
          </div>
        </div>

      <?php } ?>

    </div>
  </main>

  <footer class="search_footer">
    <p>&copy; <?php echo date('Y'); ?> Upskills Team Building Services · Cebu, Philippines</p>
  </footer>

  <?php wp_footer(); ?>
</body>
</html>