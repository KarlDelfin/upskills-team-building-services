<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">

<?php get_template_part('template-parts/head' ); ?>

<body>
  <?php get_template_part('template-parts/header' ); ?>
  <?php if(is_front_page()) { get_template_part('template-parts/banner' ); } ?>
  <?php if(is_front_page()) { get_template_part('template-parts/middle' ); } ?>
  
  <!-- HOME -->
  <?php if(is_front_page()) { ?>
    <main id="about">
      <div class="main_con">
        <div class="founded_info">
          <div>
            <h3>Founded</h3>
            <p>2026</p>
          </div>
          <div>
            <h3>Founders</h3>
            <p>Reb Camacho &amp; Myrene Camingawan</p>
          </div>
          <div>
            <h3>Headquarters</h3>
            <p>Cebu, Philippines</p>
          </div>
        </div>

        <div class="foundational_guiding">
          <svg class="pathway_line" viewBox="0 0 3 600" preserveAspectRatio="none">
            <path d="M 1.5 0 L 1.5 600" />
          </svg>

          <div class="mission">
            <h2>Mission</h2>
            <p>To empower individuals and organizations through transformative, customized learning experiences that build trust, drive execution excellence, and cultivate service-oriented leaders.</p>
          </div>

          <div class="vision">
            <h2>Vision</h2>
            <p>To be the premier corporate partner in the Visayas for unlocking collective potential and developing purpose-driven teams that make lasting organizational impact.</p>
          </div>

          <div class="core_values">
            <h2>Core Values</h2>
            <ul>
              <li><b>Transformation</b> — Driving proactive growth and helping teams adapt confidently to modern workplace challenges.</li>
              <li><b>Excellence</b> — Upholding uncompromising facilitation standards, disciplined coordination, and tangible training outcomes.</li>
              <li><b>Altruism</b> — Fostering empathetic leadership, genuine collaboration, and selfless community contribution.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  <?php } ?>

  <!-- NON-HOME -->
  <?php if ( ! is_front_page() ) : ?>
    <div class="main_con entry-content">
      <?php if ( function_exists( 'yoast_breadcrumb' ) ) : ?>
        <?php yoast_breadcrumb( '<p id="breadcrumbs">', '</p>' ); ?>
      <?php endif; ?>

      <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
          
          <!-- PAGE HAS NO CONTENTS -->
          <?php if ( empty( trim( get_the_content() ) ) && ! is_page( 'sitemap' ) ) : ?>
            <p class="empty-notice">
              <?php esc_html_e( 'We are still updating our website with content. Please check back next time.', 'ustbs26' ); ?>
            </p>
          <?php endif; ?>

        
            <?php the_content(); ?>

            <!-- SITEMAP PAGE -->
            <?php if ( is_page( 'sitemap' ) ) : ?>
              <ul class="sitemap col2">
                <?php wp_list_pages( array( 'title_li' => '' ) ); ?>
              </ul>
            <?php endif; ?>

            <?php edit_post_link( __( 'Edit', 'ustbs26' ), '<span class="edit-link">', '</span>' ); ?>

        </article>

      <?php endwhile; endif; ?>
    </div>
    
  <?php endif; ?>

  <?php if(is_front_page()) { get_template_part('template-parts/bottom' ); }?>
  <?php get_template_part('template-parts/footer' ); ?>
  
</body>
</html>