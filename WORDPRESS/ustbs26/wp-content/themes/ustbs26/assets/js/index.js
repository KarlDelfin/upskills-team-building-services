  const { gsap, ScrollTrigger, MotionPathPlugin, SplitText, ScrambleTextPlugin, DrawSVGPlugin } = window
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, ScrambleTextPlugin, SplitText, DrawSVGPlugin)

  /* FLAIR CURSOR FOLLOWER */
  


  /* ================= HIDE HEADER ON SCROLL DOWN, SHOW ON SCROLL UP ================= */
  function initHeaderScroll() {
    if(window.location.pathname === '/' || window.location.pathname === '/ustbs26/') {
      const header = document.querySelector('#header')
      if (!header) return

      const showAnim = gsap.from(header, {
        yPercent: -100,
        paused: true,
        duration: 0.3,
        ease: 'power2.out'
      }).progress(1)

      ScrollTrigger.create({
        start: 'top top',
        end: 'max',
        onUpdate: (self) => {
          if (self.scroll() < 80) {
            showAnim.play()
          } else {
            self.direction === 1 ? showAnim.reverse() : showAnim.play()
          }
        }
      })
    }
  }

  /* ================= 1. SMOOTH SCROLL (LENIS) ================= */
  function initSmoothScroll() {
    try {
      /* LENIS */
      const lenis = new Lenis({
          duration: 0.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Smooth scroll initialization failed:', e)
    }
  }

  /* ================= 2. PAGE LOADER ================= */
  function initLoaderAnimation(onCompleteCallback) {
    const loaderEl = document.getElementById('loader')
    if (!loaderEl) {
      if (typeof onCompleteCallback === 'function') onCompleteCallback()
      return
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' }
    })

    tl.to('.loader_progress_fill', {
      width: '100%',
      duration: 1.1
    })
      .to(
        '.loader_status',
        {
          duration: 0.5,
          scrambleText: { text: 'Experience Ready', chars: 'UpskillsTeamBuilding' },
          ease: 'none'
        },
        '-=0.3'
      )
      .to('.loader_con', {
        y: -25,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in'
      })
      .to('#loader', {
        yPercent: -100,
        duration: 0.75,
        ease: 'expo.inOut',
        onComplete: () => {
          loaderEl.style.setProperty('display', 'none', 'important')
          ScrollTrigger.refresh()
          if (typeof onCompleteCallback === 'function') onCompleteCallback()
        }
      })
  }

  /* ================= 3. HEADER & LOGO ================= */
  function initHeaderAnimations() {
    initSmoothScroll()
    const navLinks = document.querySelectorAll('#nav ul li a')
    if (navLinks.length > 0) {
      gsap.from(navLinks, {
        y: -15,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          start: 'top top',
          end: 'bottom bottom'
        }
      })
    }

    if (document.querySelector('.comp_logo')) {
      gsap.from('.comp_logo', {
        y: -25,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      })
    }
  }

  /* ================= NAVIGATION SCROLLSPY ================= */
  function initNavScrollSpy() {
    if(window.location.pathname === '/' || window.location.pathname === '/ustbs26/') {
      const navLinks = document.querySelectorAll('#nav ul li a, .nav_mobile nav a')
      const sections = document.querySelectorAll('#banner, #middle, #about, #services, #packages, #our-works, #our-team, #testimonials, #contact-us')
      if (!navLinks.length || !sections.length) return

      const homeLink = navLinks[0]

      function setActive(activeLink) {
        navLinks.forEach((link) => link.classList.remove('active'))
        if (activeLink) activeLink.classList.add('active')
      }

      setActive(homeLink)

      sections.forEach((section) => {
        const id = section.id
        const targetLink = id === 'banner' 
          ? homeLink 
          : document.querySelector(`#nav a[href*="#${id}"], .nav_mobile a[href*="#${id}"]`)

        if (!targetLink) return

        ScrollTrigger.create({
          trigger: section,
          start: id === 'banner' ? 'top top' : 'top 40%',
          end: 'bottom 40%',
          onEnter: () => setActive(targetLink),
          onEnterBack: () => setActive(targetLink)
        })
      })

      window.addEventListener('scroll', () => {
        if (window.scrollY < 50) setActive(homeLink)
      }, { passive: true })
    }
  }

  /* ================= 4. HOMEPAGE ANIMATIONS ================= */
  function initHomeAnimations() {
    // A. Hero Banner Entrance & GPU-Parallax
    if (document.querySelector('#banner')) {

      gsap.from('#banner', {
        backgroundPosition: '0% 0%'
      })
      
      gsap.to('#banner', {
        yPercent: 5,
        backgroundPosition: '0% -50%',
        ease: 'none',
        scrollTrigger: {
          trigger: '#banner',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })
    }

    if (document.querySelector('.banner_info p')) {
      if (typeof SplitText !== 'undefined') {
        const bannerSplit = new SplitText('.banner_info p', { type: 'lines' })
        gsap.from(bannerSplit.lines, {
          y: 45,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.1
        })
      } else {
        gsap.from('.banner_info p', {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        })
      }
    }

    if (document.querySelector('.banner_scroll')) {
      gsap.from('.banner_scroll', {
        opacity: 0,
        y: -10,
        duration: 0.8,
        delay: 0.6,
        ease: 'power2.out'
      })
    }

    // B. Middle / Welcome Section
    if (document.querySelector('.middle_img img')) {
      gsap.from('.middle_img img', {
        objectPosition: '50% 50%'
      })

      gsap.to('.middle_img img', {
        yPercent: 5,
        objectPosition: '50% -50%',
        ease: 'none',
        scrollTrigger: {
          trigger: '#middle',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })
    }

    const middleTexts = document.querySelectorAll('.middle_con h2, .middle_con p')
    if (middleTexts.length > 0) {
      gsap.from(middleTexts, {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.middle_con',
          start: 'top 78%'
        }
      })
    }

    // C. Services Section
    if (document.querySelector('.services_head')) {
      gsap.from('.services_head > *', {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services_head',
          start: 'top 78%'
        }
      })
    }

    if (document.querySelector('.bootcamp_card')) {
      gsap.from('.bootcamp_card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.1)',
        scrollTrigger: {
          trigger: '.pathway',
          start: 'top 78%'
        }
      })
    }

    // D. About / Mission Section
    const aboutSections = document.querySelectorAll('.founded_info section, .foundational_guiding > div')
    if (aboutSections.length > 0) {
      gsap.from(aboutSections, {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.main_con',
          start: 'top 72%'
        }
      })
    }

    if (document.querySelector('.pathway_line path') && typeof DrawSVGPlugin !== 'undefined') {
      gsap.fromTo(
        '.pathway_line path',
        { drawSVG: '0%' },
        {
          drawSVG: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: '.foundational_guiding',
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 0.5
          }
        }
      )
    }

    // E. Circular Rotating 3D Gallery
    const galleryImages = gsap.utils.toArray('.gallery_con img')
    if (galleryImages.length > 0 && document.querySelector('.gallery_con')) {
      const galleryTL = gsap.timeline({
        scrollTrigger: {
          trigger: '#our-works',
          start: 'top top',
          end: '+=2500',
          scrub: 0.8,
          pin: true,
          anticipatePin: 1
        }
      })

      const isMobile = window.innerWidth < 768
      const radiusX = isMobile ? 260 : 580
      const radiusY = isMobile ? 130 : 230

      galleryImages.forEach((img, i) => {
        const angle = (i / galleryImages.length) * Math.PI * 2
        galleryTL.to(
          img,
          {
            x: Math.cos(angle) * radiusX,
            y: Math.sin(angle) * radiusY,
            rotation: gsap.utils.random(-8, 8),
            scale: 1,
            duration: 1.5,
            ease: 'expo.out'
          },
          0
        )
      })

      if (document.querySelector('.gallery_con p')) {
        galleryTL.from(
          '.gallery_con p',
          {
            opacity: 0,
            scale: 0.6,
            duration: 1,
            ease: 'power2.out'
          },
          0
        )
      }

      const orbitTracker = { angle: 0 }
      galleryTL.to(
        orbitTracker,
        {
          angle: Math.PI * 2,
          duration: 3,
          ease: 'none',
          onUpdate: () => {
            galleryImages.forEach((img, i) => {
              const currentAngle = (i / galleryImages.length) * Math.PI * 2 + orbitTracker.angle
              gsap.set(img, {
                x: Math.cos(currentAngle) * radiusX,
                y: Math.sin(currentAngle) * radiusY,
                zIndex: Math.round((Math.sin(currentAngle) + 1) * 10)
              })
            })
          }
        },
        1.2
      )
    }

    // F. Leadership Team
    if (document.querySelector('.team_head')) {
      gsap.from('.team_head', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#our-team',
          start: 'top 80%'
        }
      })
    }

    if (document.querySelector('.team_card')) {
      gsap.from('.team_card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.team_grid',
          start: 'top 80%'
        }
      })
    }
  }

 function initPackagesPinning() {
  const pinSection = document.querySelector('.packages_pin_section')
  if (!pinSection) return

  const mm = gsap.matchMedia()

  // Desktop Pin & Timeline Scrub (min-width: 901px)
  mm.add('(min-width: 901px)', () => {
    const slides = gsap.utils.toArray('.package_slide')
    const navItems = gsap.utils.toArray('.package_nav_item')
    const fill = document.querySelector('.packages_fill')
    const count = slides.length

    if (count === 0) return

    // 1. Initial State: show first card and set base fill position
    gsap.set(slides[0], { autoAlpha: 1, y: 0 })
    if (fill) {
      gsap.set(fill, { scaleY: 1 / count, transformOrigin: 'top center' })
    }

    // 2. Main Timeline: Pin whole section while scrolling
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinSection,
        start: 'top top',
        end: () => `+=${count * 120}%`, // Gives smooth scroll length
        pin: true,
        scrub: 0.8,
        anticipatePin: 1
      }
    })

    // 3. Fill bar progression throughout the total duration
    if (fill) {
      tl.to(fill, {
        scaleY: 1,
        transformOrigin: 'top center',
        ease: 'none',
        duration: count
      }, 0)
    }

    // 4. Stagger crossfade each slide and activate the corresponding nav item
    slides.forEach((slide, i) => {
      if (i === 0) return // First slide is already visible

      const prevSlide = slides[i - 1]
      const currentNav = navItems[i]
      const prevNav = navItems[i - 1]
      const stepTime = i

      // Out with previous slide
      tl.to(prevSlide, {
        autoAlpha: 0,
        y: -25,
        duration: 0.4,
        ease: 'power1.inOut'
      }, stepTime)

      // In with current slide
      tl.fromTo(slide, {
        autoAlpha: 0,
        y: 25
      }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: 'power1.inOut'
      }, stepTime)

      // Swap active state on the left text list
      tl.call(() => {
        navItems.forEach((n) => n.classList.remove('active'))
        currentNav.classList.add('active')
      }, null, stepTime)

      // Reverse trigger to reactivate previous item on scroll up
      tl.call(() => {
        navItems.forEach((n) => n.classList.remove('active'))
        prevNav.classList.add('active')
      }, null, stepTime - 0.05)
    })

    // Small hold buffer at the end so the user can read the MVP card before unpinning
    tl.to({}, { duration: 0.4 })
  })
}

// Call on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initPackagesPinning()
})

  /* ================= 6. FOOTER ================= */
  function initFooterAnimations() {
    const footerTargets = document.querySelectorAll('.footer_cta h2, .footer_cta ul, .footer_link')
    if (footerTargets.length > 0) {
      gsap.from(footerTargets, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#contact-us',
          start: 'top 82%'
        }
      })
    }

    if(document.querySelector('#contact-us')) {
      gsap.to('#contact-us', {
        width: '95%',
        scrollTrigger: {
          trigger: '#contact-us',
          start: 'top bottom',
          end: 'bottom center',
          scrub: true
        }
      })
    }


    
  }

  /* ================= 7. MOBILE MENU ================= */
  function initMobileMenu() {
      var isOpen = false;

      var entrance = gsap.fromTo(".nav_mobile", {
          x: 0,
          y: "100vh"
      }, {
          duration: 2,
          ease: "elastic.out(1, 0.3)",
          x: 0,
          y: 0,
          autoAlpha: 1,
          paused: true,
      });


      var exit = gsap.to(".nav_mobile", {
          duration: .8,
          ease: "power4.in",
          x: "100vw",
          autoAlpha: 0,
          paused: true
      });

     document.querySelector("#open_menu").addEventListener("click", function() {
      isOpen = true
      console.log('open')
      entrance.restart();

      gsap.fromTo(".nav_mobile nav a", {
          xPercent: -100, // Fixed syntax error (removed broken string quotes)
          opacity: 0
      }, {
          duration: 2,
          opacity: 1,
          xPercent: 0,
          stagger: 0.1,
          ease: "elastic.out(1, 0.3)",
      });
    
  });
     document.querySelector("#close_menu").addEventListener("click", function() {
      isOpen = false
      console.log('close')
      exit.restart();
  });
  }

  /* ================= RUN ON DOM READY ================= */
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll()
    initMobileMenu()
    initHeaderAnimations()
    initHomeAnimations()
   /*  initSlidesPinning() */
    initFooterAnimations()
    initNavScrollSpy()
    initLoaderAnimation(() => {
      ScrollTrigger.refresh()
    })
  })

  // Recalculate ScrollTrigger on complete image/font load
  window.addEventListener('load', () => {
    ScrollTrigger.refresh()
  })