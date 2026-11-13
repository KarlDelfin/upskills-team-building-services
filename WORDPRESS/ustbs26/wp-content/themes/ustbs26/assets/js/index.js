const {
  gsap,
  ScrollTrigger,
  MotionPathPlugin,
  SplitText,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  ScrollToPlugin,
} = window;
gsap.registerPlugin(
  ScrollTrigger,
  MotionPathPlugin,
  ScrambleTextPlugin,
  SplitText,
  DrawSVGPlugin,
  ScrollToPlugin,
);

let mm = gsap.matchMedia();

/* BACK TO TOP */
function initBackToTop() {
  const backToTopBtn = document.querySelector("#back_to_top");

  gsap.set(backToTopBtn, { autoAlpha: 0, scale: 0.8 });

  ScrollTrigger.create({
    trigger: "#banner",
    start: "top top",
    end: "bottom top",
    onEnter: () =>
      gsap.to(backToTopBtn, { autoAlpha: 1, scale: 1, duration: 0.3 }),
    onLeaveBack: () =>
      gsap.to(backToTopBtn, { autoAlpha: 0, scale: 0.8, duration: 0.3 }),
  });

  backToTopBtn.addEventListener("click", () => {
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: 0 },
      ease: "power2.easeInOut",
    });
  });
}
/* NAVIGATION SPY */
function initNavScrollSpy() {
  const navLinks = document.querySelectorAll(
    '#nav a[href*="#"], .nav_mobile nav a[href*="#"]',
  );

  const sections = document.querySelectorAll(
    "#banner, #middle, #about, #services, #packages, #our-works, #our-team, #testimonials, #contact-us",
  );

  if (!navLinks.length || !sections.length) return;

  const homeLink = navLinks[0];

  // ACTIVE LINK
  const setActive = (activeLink) => {
    navLinks.forEach((link) =>
      link.classList.toggle("active", link === activeLink),
    );
  };

  setActive(homeLink);

  // SMOOTH SCROLL
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const hash = new URL(link.href).hash;
      const target = hash && document.querySelector(hash);

      if (!target) return;

      e.preventDefault();

      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: target,
          offsetY: 120,
        },
        ease: "power2.out",
      });
    });
  });

  // SCROLLSPY
  sections.forEach((section, i) => {
    const targetLink =
      i === 0
        ? homeLink
        : [...navLinks].find(
            (link) => new URL(link.href).hash === `#${section.id}`,
          );

    if (!targetLink) return;

    ScrollTrigger.create({
      trigger: section,
      start: i === 0 ? "top top" : "top 40%",
      end: "bottom 40%",
      onToggle: (self) => {
        if (self.isActive) setActive(targetLink);
      },
    });
  });

  // RESET HOME LINK AT TOP
  ScrollTrigger.create({
    trigger: document.body,
    start: "top -50px",
    onLeaveBack: () => setActive(homeLink),
  });
}

/* SMOOTH SCROLL */
function initSmoothScroll() {
  let lenis = new Lenis();
  gsap.ticker.add((time) => {
    lenis.raf(time * 3000);
  });
  gsap.ticker.lagSmoothing(0);
}

/* HEADER ANIMATION */
function initHeaderAnimations() {
  const navLinks = document.querySelectorAll("#nav ul li a");
  if (navLinks.length > 0) {
    let navLinksSplit = new SplitText(navLinks, {
      type: "lines, words",
      linesClass: "line",
    });
    gsap.from(navLinksSplit.words, {
      y: 100,
      opacity: 0,
      stagger: 0.1,
      ease: "back.out",
    });
  }
}

/* ================= 4. HOMEPAGE ANIMATIONS ================= */
function initHomeAnimations() {
  // A. Hero Banner Entrance & GPU-Parallax
  if (document.querySelector("#banner")) {
    gsap.to("#banner", {
      yPercent: 5,
      backgroundPosition: "0% -50%",
      ease: "none",
      scrollTrigger: {
        trigger: "#banner",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  const bannerSplit = new SplitText(".banner_info h1", {
    type: "lines, words",
    linesClass: "line",
  });
  gsap.from(bannerSplit.words, {
    y: 200,
    ease: "back.out",
    stagger: 0.1,
  });

  if (document.querySelector(".banner_scroll")) {
    gsap.from(".banner_scroll", {
      opacity: 0,
      y: -10,
      duration: 0.8,
      delay: 0.6,
      ease: "power2.out",
    });
  }

  /* MIDDLE INFO */
  const middleHeading = document.querySelector(".middle_info h2");
  if (middleHeading) {
    gsap.from(middleHeading, {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".middle_info h2",
        start: "top 78%",
      },
    });
  }

  const middleTexts = document.querySelectorAll(".middle_info p");
  if (middleTexts) {
    gsap.from(middleTexts, {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".middle_info p",
        start: "top bottom",
      },
    });
  }

  /* MIDDLE IMAGE */
  let middleConFig = document.querySelector(".middle_con figure");
  if (middleConFig) {
    mm.add("(min-width: 1001px)", () => {
      gsap.to(middleConFig, {
        maxWidth: "25%",
        clipPath: "inset(24px)",
        scrollTrigger: {
          trigger: ".middle_con figure",
          scrub: 1,
          pin: true,
          end: "+=1000",
          start: "top center",
          end: "bottom center",
        },
      });
    });
  }

  /* WELCOME SECTION */
  const aboutSections = document.querySelectorAll(
    ".founded_info section, .foundational_guiding > div",
  );
  if (aboutSections.length > 0) {
    gsap.from(aboutSections, {
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".main_con",
        start: "top 72%",
      },
    });
  }

  if (
    document.querySelector(".pathway_line path") &&
    typeof DrawSVGPlugin !== "undefined"
  ) {
    gsap.fromTo(
      ".pathway_line path",
      { drawSVG: "0%" },
      {
        drawSVG: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: ".foundational_guiding",
          start: "top 60%",
          end: "bottom 80%",
          scrub: 0.5,
        },
      },
    );
  }

  /* SERVICES */
  if (document.querySelector(".services_head")) {
    gsap.from(".services_head > *", {
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".services_head",
        start: "top 78%",
      },
    });
  }

  /* SERVICES CARD */
  if (document.querySelector(".bootcamp_card")) {
    gsap.from(".bootcamp_card", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.1)",
      scrollTrigger: {
        trigger: ".bootcamp_card",
        start: "top 78%",
      },
    });
  }

  // E. Circular Rotating 3D Gallery
  const galleryImages = gsap.utils.toArray(".gallery_con img");
  if (galleryImages.length > 0 && document.querySelector(".gallery_con")) {
    const galleryTL = gsap.timeline({
      scrollTrigger: {
        trigger: "#our-works",
        start: "top top",
        end: "+=2500",
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
      },
    });

    const isMobile = window.innerWidth < 768;
    const radiusX = isMobile ? 260 : 580;
    const radiusY = isMobile ? 130 : 230;

    galleryImages.forEach((img, i) => {
      const angle = (i / galleryImages.length) * Math.PI * 2;
      galleryTL.to(
        img,
        {
          x: Math.cos(angle) * radiusX,
          y: Math.sin(angle) * radiusY,
          rotation: gsap.utils.random(-8, 8),
          scale: 1,
          duration: 1.5,
          ease: "expo.out",
        },
        0,
      );
    });

    if (document.querySelector(".gallery_con p")) {
      galleryTL.from(
        ".gallery_con p",
        {
          opacity: 0,
          scale: 0.6,
          duration: 1,
          ease: "power2.out",
        },
        0,
      );
    }

    const orbitTracker = { angle: 0 };
    galleryTL.to(
      orbitTracker,
      {
        angle: Math.PI * 2,
        duration: 3,
        ease: "none",
        onUpdate: () => {
          galleryImages.forEach((img, i) => {
            const currentAngle =
              (i / galleryImages.length) * Math.PI * 2 + orbitTracker.angle;
            gsap.set(img, {
              x: Math.cos(currentAngle) * radiusX,
              y: Math.sin(currentAngle) * radiusY,
              zIndex: Math.round((Math.sin(currentAngle) + 1) * 10),
            });
          });
        },
      },
      1.2,
    );
  }

  // F. Leadership Team
  if (document.querySelector(".team_head")) {
    gsap.from(".team_head", {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#our-team",
        start: "top 80%",
      },
    });
  }

  if (document.querySelector(".team_card")) {
    gsap.from(".team_card", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".team_grid",
        start: "top 80%",
      },
    });
  }
}

function initPackagesPinning() {
  const pinSection = document.querySelector(".packages_pin_section");
  if (!pinSection) return;

  mm.add("(min-width: 1001px)", () => {
    const slides = gsap.utils.toArray(".package_slide");
    const navItems = gsap.utils.toArray(".package_nav_item");
    const fill = document.querySelector(".packages_fill");
    const count = slides.length;

    if (count === 0) return;

    slides.forEach((slide, i) => {
      gsap.set(slide, {
        autoAlpha: i === 0 ? 1 : 0,
        y: i === 0 ? 0 : 30,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
      });
    });

    if (fill) {
      gsap.set(fill, { scaleY: 1 / count, transformOrigin: "top center" });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinSection,
        start: "top top",
        end: () => `+=${window.innerHeight * count * 0.8}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const activeIndex = Math.min(Math.floor(progress * count), count - 1);

          navItems.forEach((item, idx) => {
            if (idx === activeIndex) {
              item.classList.add("active");
            } else {
              item.classList.remove("active");
            }
          });

          if (fill) {
            gsap.set(fill, { scaleY: Math.max(progress, 1 / count) });
          }
        },
      },
    });

    slides.forEach((slide, i) => {
      if (i === 0) {
        tl.to(
          slide,
          {
            autoAlpha: 0,
            y: -30,
            ease: "power1.inOut",
            duration: 0.5,
          },
          0.3,
        );
      } else {
        const enterTime = i - 0.4;
        const exitTime = i + 0.4;

        tl.fromTo(
          slide,
          {
            autoAlpha: 0,
            y: 30,
          },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power1.out",
            duration: 0.5,
          },
          enterTime,
        );

        if (i < count - 1) {
          tl.to(
            slide,
            {
              autoAlpha: 0,
              y: -30,
              ease: "power1.in",
              duration: 0.5,
            },
            exitTime,
          );
        }
      }
    });
  });
}

/* FOOTER ANIMATION */
function initFooterAnimations() {
  const footerTargets = document.querySelectorAll(
    ".footer_cta h2, .footer_cta ul",
  );
  if (footerTargets.length > 0) {
    gsap.from(footerTargets, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#contact-us",
        start: "top 82%",
      },
    });
  }

  if (document.querySelector("#contact-us")) {
    gsap.to("#contact-us", {
      width: "95%",
      scrollTrigger: {
        trigger: "#contact-us",
        start: "top bottom",
        end: "bottom center",
        scrub: true,
      },
    });
  }
}

/* MOBILE MENU ANIMATION */
function initMobileMenu() {
  var isOpen = false;

  var entrance = gsap.fromTo(
    ".nav_mobile",
    {
      x: 0,
      y: "100vh",
    },
    {
      duration: 2,
      ease: "elastic.out(1, 0.3)",
      x: 0,
      y: 0,
      autoAlpha: 1,
      paused: true,
    },
  );

  var exit = gsap.to(".nav_mobile", {
    duration: 0.8,
    ease: "power4.in",
    x: "100vw",
    autoAlpha: 0,
    paused: true,
  });

  document.querySelector("#open_menu").addEventListener("click", function () {
    isOpen = true;
    console.log("open");
    entrance.restart();

    gsap.fromTo(
      ".nav_mobile nav a",
      {
        xPercent: -100,
        opacity: 0,
      },
      {
        duration: 2,
        opacity: 1,
        xPercent: 0,
        stagger: 0.1,
        ease: "elastic.out(1, 0.3)",
      },
    );
  });

  document.querySelector("#close_menu").addEventListener("click", function () {
    isOpen = false;
    console.log("close");
    exit.restart();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initPackagesPinning();

  initSmoothScroll();

  initHeaderAnimations();
  initHomeAnimations();
  initFooterAnimations();

  initBackToTop();
  initMobileMenu();
  initNavScrollSpy();
});

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});
