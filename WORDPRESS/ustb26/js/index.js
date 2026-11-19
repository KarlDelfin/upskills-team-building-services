const {
  gsap,
  ScrollTrigger,
  MotionPathPlugin,
  SplitText,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  ScrollToPlugin,
} = window

gsap.registerPlugin(
  ScrollTrigger,
  MotionPathPlugin,
  ScrambleTextPlugin,
  SplitText,
  DrawSVGPlugin,
  ScrollToPlugin,
)

let mm = gsap.matchMedia()

/* BACK TO TOP */
function initBackToTop() {
  const backToTopBtn = document.querySelector('#back_to_top')

  gsap.set(backToTopBtn, { autoAlpha: 0, scale: 0.8 })

  ScrollTrigger.create({
    trigger: '#banner',
    start: 'top top',
    end: 'bottom top',
    onEnter: () => gsap.to(backToTopBtn, { autoAlpha: 1, scale: 1, duration: 0.3 }),
    onLeaveBack: () => gsap.to(backToTopBtn, { autoAlpha: 0, scale: 0.8, duration: 0.3 }),
  })

  backToTopBtn.addEventListener('click', () => {
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: 0 },
      ease: 'power2.easeInOut',
    })
  })
}
/* NAVIGATION SPY */
function initNavScrollSpy() {
  const navLinks = [...document.querySelectorAll('#nav a, .nav_mobile a')]
  if (!navLinks.length) return

  const getHash = (link) => new URL(link.href, location.origin).hash
  const hashes = [...new Set(navLinks.map(getHash).filter(Boolean))]

  const setActive = (targetHash = '') => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', getHash(link) === targetHash)
    })
  }

  setActive()

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const url = new URL(link.href, location.origin)
      if (url.pathname !== location.pathname) return

      const target = url.hash ? document.querySelector(url.hash) : 0
      if (url.hash && !target) return

      e.preventDefault()
      setActive(url.hash)
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: target, offsetY: target ? 120 : 0 },
        ease: 'power2.out',
      })
    })
  })

  hashes.forEach((hash, index) => {
    const section = document.querySelector(hash)
    if (!section) return

    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      end: 'bottom 60%',
      onEnter: () => setActive(hash),
      onEnterBack: () => setActive(hash),
      ...(index === 0 && { onLeaveBack: () => setActive() }),
    })
  })
}

/* SMOOTH SCROLL */
function initSmoothScroll() {
  let lenis = new Lenis()
  gsap.ticker.add((time) => {
    lenis.raf(time * 3000)
  })
  gsap.ticker.lagSmoothing(0)
}

/* HEADER ANIMATION */
function initHeaderAnimations() {
  const navLinks = document.querySelectorAll('#nav ul li a')
  if (navLinks.length > 0) {
    let navLinksSplit = new SplitText(navLinks, {
      type: 'lines, words',
      linesClass: 'line',
    })
    gsap.from(navLinksSplit.words, {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      ease: 'back.out',
    })
  }
}

/* ================= 4. HOMEPAGE ANIMATIONS ================= */
function initHomeAnimations() {
  // A. Hero Banner Entrance & GPU-Parallax
  if (document.querySelector('#banner')) {
    gsap.to('#banner', {
      yPercent: 5,
      backgroundPosition: '0% -50%',
      ease: 'none',
      scrollTrigger: {
        trigger: '#banner',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  }

  let bannerIcon = document.querySelector('.banner_info img')
  if (bannerIcon) {
    gsap.to(bannerIcon, {
      rotate: 360,
      ease: 'none',
      repeat: -1,
      duration: 10,
    })
  }

  let bannerHeading = document.querySelector('.banner_info h1')
  if (bannerHeading) {
    const splitText = new SplitText(bannerHeading, {
      type: 'lines, words',
      linesClass: 'line',
    })
    gsap.from(splitText.words, {
      y: 200,
      ease: 'back.out',
      stagger: 0.1,
    })
  }

  let bannerTexts = document.querySelector('.banner_info p')
  if (bannerTexts) {
    const splitText = new SplitText(bannerTexts, {
      type: 'lines, words',
      linesClass: 'line',
    })
    gsap.from(splitText.words, {
      y: 20,
      ease: 'back.out',
      stagger: 0.1,
    })
  }

  /* MAIN VIDEO */
  let aboutVideo = document.querySelector('.about_vid')
  if (aboutVideo) {
    mm.add('(min-width: 1025px)', () => {
      gsap.to(aboutVideo, {
        maxWidth: '30%',
        scrollTrigger: {
          trigger: aboutVideo,
          scrub: 1,
          pin: true,
          pinSpacing: false,
          start: 'top top',
          end: 'bottom center',
        },
      })
    })
  }

  let aboutInfo = document.querySelector('.about_info')
  if (aboutInfo) {
    gsap.from(aboutInfo, {
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: aboutInfo,
        start: 'top 78%',
      },
    })
  }

  let aboutSections = document.querySelectorAll('.founded_info section')
  if (aboutSections.length > 0) {
    gsap.from(aboutSections, {
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.founded_info',
        start: 'top 72%',
      },
    })
  }

  if (document.querySelector('.pathway_line path')) {
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
          scrub: 0.5,
        },
      },
    )
  }

  /* SERVICES */
  let serviceInfo = document.querySelector('.services_info')
  if (serviceInfo) {
    gsap.from(serviceInfo, {
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services_info',
        start: 'top 78%',
      },
    })
  }

  /* SERVICES CARD */
  if (document.querySelector('.bootcamp_card')) {
    gsap.from('.bootcamp_card', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.1)',
      scrollTrigger: {
        trigger: '.bootcamp_card',
        start: 'top 78%',
      },
    })
  }

  // GALLERY
  const galleryImages = gsap.utils.toArray('.gallery_con img')
  if (galleryImages.length > 0 && document.querySelector('.gallery_con')) {
    const galleryTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#our-works',
        start: 'top top',
        scrub: 0.8,
        pin: true,
      },
    })

    const radiusX = 580
    const radiusY = 230

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
          ease: 'expo.out',
        },
        0,
      )
    })

    if (document.querySelector('.gallery_con p')) {
      galleryTL.from(
        '.gallery_con p',
        {
          opacity: 0,
          scale: 0.6,
          duration: 1,
          ease: 'power2.out',
        },
        0,
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
              zIndex: Math.round((Math.sin(currentAngle) + 1) * 10),
            })
          })
        },
      },
      1.2,
    )
  }

  const testimonialsInfo = document.querySelector('.testmonials_info')
  if (testimonialsInfo) {
    gsap.from(testimonialsInfo, {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.testmonials_info',
        start: 'top 78%',
      },
    })
  }

  // OUR TEAM
  if (document.querySelector('.team_head')) {
    gsap.from('.team_head', {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#our-team',
        start: 'top 80%',
      },
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
        start: 'top 80%',
      },
    })
  }
}

function initPackagesPinning() {
  const pinSection = document.querySelector('.packages_pin_section')
  if (!pinSection) return

  mm.add('(min-width: 1001px)', () => {
    const slides = gsap.utils.toArray('.package_slide')
    const navItems = gsap.utils.toArray('.package_nav_item')
    const fill = document.querySelector('.packages_fill')
    const count = slides.length

    if (count === 0) return

    slides.forEach((slide, i) => {
      gsap.set(slide, {
        autoAlpha: i === 0 ? 1 : 0,
        y: i === 0 ? 0 : 30,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      })
    })

    if (fill) {
      gsap.set(fill, { scaleY: 1 / count, transformOrigin: 'top center' })
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinSection,
        start: 'top top',
        end: () => `+=${window.innerHeight * count * 0.8}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const activeIndex = Math.min(Math.floor(progress * count), count - 1)

          navItems.forEach((item, idx) => {
            if (idx === activeIndex) {
              item.classList.add('active')
            } else {
              item.classList.remove('active')
            }
          })

          if (fill) {
            gsap.set(fill, { scaleY: Math.max(progress, 1 / count) })
          }
        },
      },
    })

    slides.forEach((slide, i) => {
      if (i === 0) {
        tl.to(
          slide,
          {
            autoAlpha: 0,
            y: -30,
            ease: 'power1.inOut',
            duration: 0.5,
          },
          0.3,
        )
      } else {
        const enterTime = i - 0.4
        const exitTime = i + 0.4

        tl.fromTo(
          slide,
          {
            autoAlpha: 0,
            y: 30,
          },
          {
            autoAlpha: 1,
            y: 0,
            ease: 'power1.out',
            duration: 0.5,
          },
          enterTime,
        )

        if (i < count - 1) {
          tl.to(
            slide,
            {
              autoAlpha: 0,
              y: -30,
              ease: 'power1.in',
              duration: 0.5,
            },
            exitTime,
          )
        }
      }
    })
  })
}

/* FOOTER ANIMATION */
function initFooterAnimations() {
  const footerTargets = document.querySelectorAll('.footer_cta h2, .footer_cta ul')
  if (footerTargets.length > 0) {
    gsap.from(footerTargets, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#contact-us',
        start: 'top 82%',
      },
    })
  }

  if (document.querySelector('#footer')) {
    gsap.to('#footer', {
      clipPath: 'inset(80px 20px 20px 20px round 20px)',
      scrollTrigger: {
        trigger: '#footer',
        start: 'top bottom',
        end: 'bottom center',
        scrub: 1,
      },
    })
  }
}

let footerTitle = document.querySelector('.footer_title h2')
if (footerTitle) {
  let footerTitleSplit = new SplitText(footerTitle, {
    type: 'lines, chars',
    linesClass: 'line',
  })
  mm.add('(min-width: 1025px)', () => {
    gsap.from(footerTitleSplit.chars, {
      y: 400,
      stagger: {
        each: 0.1,
        from: 'edges',
      },
      scrollTrigger: {
        trigger: '#footer',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    })
  })
}

/* MOBILE MENU ANIMATION */
function initMobileMenu() {
  var isOpen = false

  var entrance = gsap.fromTo(
    '.nav_mobile',
    {
      x: 0,
      y: '100vh',
    },
    {
      duration: 2,
      ease: 'elastic.out(1, 0.3)',
      x: 0,
      y: 0,
      autoAlpha: 1,
      paused: true,
    },
  )

  var exit = gsap.to('.nav_mobile', {
    duration: 0.8,
    ease: 'power4.in',
    x: '100vw',
    autoAlpha: 0,
    paused: true,
  })

  document.querySelector('#open_menu').addEventListener('click', function () {
    isOpen = true
    console.log('open')
    entrance.restart()

    gsap.fromTo(
      '.nav_mobile nav a',
      {
        xPercent: -100,
        opacity: 0,
      },
      {
        duration: 2,
        opacity: 1,
        xPercent: 0,
        stagger: 0.1,
        ease: 'elastic.out(1, 0.3)',
      },
    )
  })

  document.querySelector('#close_menu').addEventListener('click', function () {
    isOpen = false
    console.log('close')
    exit.restart()
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initPackagesPinning()

  /*  initSmoothScroll(); */

  initHeaderAnimations()
  initHomeAnimations()
  initFooterAnimations()

  initBackToTop()
  initMobileMenu()
  initNavScrollSpy()
})

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0)
})

window.addEventListener('load', () => {
  ScrollTrigger.refresh()
  window.scrollTo(0, 0)
})
