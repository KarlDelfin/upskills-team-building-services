<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">

<?php get_template_part('template-parts/head' ); ?>

<body>
    <?php get_template_part('template-parts/header' ); ?>

    <?php 
        if(is_front_page()): 
            get_template_part('template-parts/banner' );
            get_template_part('template-parts/middle');
            get_template_part('template-parts/main'); 
        endif; 
    ?>

  <!-- NON-HOME -->
  <?php if (!is_front_page()) : ?>
    <main class="entry-content">
        <?php if (function_exists( 'yoast_breadcrumb')) : ?>
            <?php yoast_breadcrumb( '<p id="breadcrumbs">', '</p>' ); ?>
            <div class="page_title">
                <h1><?php echo get_the_title(); ?></h1>
            </div>
        <?php endif; ?>

        <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <?php if (empty(trim(get_the_content())) && ! is_page('sitemap')) : ?>
                    <p class="empty-notice">
                    <?php esc_html_e( 'We are still updating our website with content. Please check back next time.', 'ustbs26' ); ?>
                    </p>
                <?php endif; ?>

                <?php the_content(); ?>
                <?php if (is_page('sitemap')) : ?>
                    <ul class="sitemap col2">
                    <?php wp_list_pages( array( 'title_li' => '' ) ); ?>
                    </ul>
                <?php endif; ?>

                <?php edit_post_link( __( 'Edit', 'ustbs26' ), '<span class="edit-link">', '</span>' ); ?>

            </article>

        <?php endwhile; endif; ?>
    </main>
    
  <?php endif; ?>

  <?php if(is_front_page()) { get_template_part('template-parts/bottom' ); }?>
  <?php get_template_part('template-parts/footer' ); ?>
  
</body>
</html>