    const { gsap, ScrollTrigger, MotionPathPlugin, SplitText, ScrambleTextPlugin, DrawSVGPlugin, ScrollToPlugin } = window
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, ScrambleTextPlugin, SplitText, DrawSVGPlugin, ScrollToPlugin)

    function initBackToTop() {
        const backToTopBtn = document.querySelector("#back_to_top");

        gsap.set(backToTopBtn, { autoAlpha: 0, scale: 0.8 });

        ScrollTrigger.create({
            trigger: '#banner',
            start: "top top",
            end: "bottom top",
            onEnter: () => gsap.to(backToTopBtn, { autoAlpha: 1, scale: 1, duration: 0.3 }),
            onLeaveBack: () => gsap.to(backToTopBtn, { autoAlpha: 0, scale: 0.8, duration: 0.3 })
        });

        backToTopBtn.addEventListener("click", () => {
            gsap.to(window, {
                duration: 1,
                scrollTo: { y: 0 },
                ease: "power2.easeInOut"
            });
        });
    }


    function initNavScrollSpy() {
        const navLinks = document.querySelectorAll(
            '#nav a[href*="#"], .nav_mobile nav a[href*="#"]'
        );

        const sections = document.querySelectorAll(
            '#banner, #middle, #about, #services, #packages, #our-works, #our-team, #testimonials, #contact-us'
        );

        if (!navLinks.length || !sections.length) return;

        const homeLink = navLinks[0];

        // ACTIVE LINK
        const setActive = (activeLink) => {
            navLinks.forEach(link => link.classList.toggle('active', link === activeLink));
        };

        setActive(homeLink);

        // SMOOTH SCROLL
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
            const hash = new URL(link.href).hash;
            const target = hash && document.querySelector(hash);

            if (!target) return;

            e.preventDefault();

                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                    y: target,
                    offsetY: 120
                    },
                    ease: 'power2.out'
                });
            });
        });

        // SCROLLSPY
        sections.forEach((section, i) => {
            const targetLink = i === 0
            ? homeLink
            : [...navLinks].find(link => new URL(link.href).hash === `#${section.id}`);

            if (!targetLink) return;

            ScrollTrigger.create({
                trigger: section,
                start: i === 0 ? 'top top' : 'top 40%',
                end: 'bottom 40%',
                onToggle: self => {
                    if (self.isActive) setActive(targetLink);
                }
            });
        });

        // RESET HOME LINK AT TOP
        ScrollTrigger.create({
            trigger: document.body,
            start: 'top -50px',
            onLeaveBack: () => setActive(homeLink)
        });
    }

    function initHeaderScroll() {
        if(window.location.pathname === '/' || window.location.pathname === '/ustbs26/') {
        const header = document.querySelector('#header')
        if (!header) return

        const showAnim = gsap.from(header, {
            yPercent: -100,
            paused: true,
            duration: 0.3,
            ease: 'power2.out',
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
                    initHeaderAnimations();
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
                y: 75,
                opacity: 0,
            })
            gsap.to(navLinks, {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.1,
                ease: 'back.out(1.7)',
            })
        }

        const compLogo = document.querySelector('.comp_logo img')
        if(compLogo) {
            gsap.to(compLogo, {
                y: 75,
                opacity: 0,
            })
            gsap.to(compLogo, {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.1,
                ease: 'back.out(1.7)',
            })
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
            trigger: '.bootcamp_card',
            start: 'top 78%',
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
            }, 1.2)
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

        mm.add('(min-width: 901px)', () => {
            const slides = gsap.utils.toArray('.package_slide')
            const navItems = gsap.utils.toArray('.package_nav_item')
            const fill = document.querySelector('.packages_fill')
            const count = slides.length

            if (count === 0) return

            gsap.set(slides[0], { autoAlpha: 1, y: 0 })
            if (fill) {
            gsap.set(fill, { scaleY: 1 / count, transformOrigin: 'top center' })
            }

            const tl = gsap.timeline({
            scrollTrigger: {
                trigger: pinSection,
                start: 'top top',
                end: () => `+=${count * 120}%`, 
                pin: true,
                scrub: 0.8,
                anticipatePin: 1
            }
            })

            if (fill) {
            tl.to(fill, {
                scaleY: 1,
                transformOrigin: 'top center',
                ease: 'none',
                duration: count
            }, 0)
            }

            slides.forEach((slide, i) => {
            if (i === 0) return 

            const prevSlide = slides[i - 1]
            const currentNav = navItems[i]
            const prevNav = navItems[i - 1]
            const stepTime = i

            tl.to(prevSlide, {
                autoAlpha: 0,
                y: -25,
                duration: 0.4,
                ease: 'power1.inOut'
            }, stepTime)

            tl.fromTo(slide, {
                autoAlpha: 0,
                y: 25
            }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.4,
                ease: 'power1.inOut'
            }, stepTime)

            tl.call(() => {
                navItems.forEach((n) => n.classList.remove('active'))
                currentNav.classList.add('active')
            }, null, stepTime)

            tl.call(() => {
                navItems.forEach((n) => n.classList.remove('active'))
                prevNav.classList.add('active')
            }, null, stepTime - 0.05)
            })

            tl.to({}, { duration: 0.4 })
        })
    }

    // Call on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        initPackagesPinning()
    })

    /* ================= 6. FOOTER ================= */
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
                xPercent: -100,
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
    initBackToTop();
    initHeaderScroll()
    initMobileMenu()
    initHomeAnimations()
    initFooterAnimations()
    initNavScrollSpy();
    initLoaderAnimation(() => {
      ScrollTrigger.refresh()
    })
  })

  window.addEventListener('load', () => {
    ScrollTrigger.refresh()
  })