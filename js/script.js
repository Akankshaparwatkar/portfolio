/**
 * Akanksha Parwatkar — Portfolio
 * Navigation, parallax, scroll reveals, the scroll-driven swim transition,
 * and project poster interactions.
 */
(() => {
  "use strict";

  /* Always land on the hero on a fresh load/refresh — browsers otherwise
     try to restore whatever scroll position the visitor was previously at. */
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============ PRELOADER SKIP ============ */
  /* The intro hides itself on a pure CSS timer either way — this just lets
     an impatient visitor skip it early by clicking. */
  const preloader = document.getElementById("preloader");
  preloader?.addEventListener("click", () => preloader.classList.add("preloader-skip"));

  /* ============ NAVBAR: active section + theme swap ============ */
  const navbar = document.getElementById("navbar");
  const pills = document.querySelectorAll(".pill, .mobile-menu a");
  const sections = ["home", "work", "about", "contact"].map((id) => document.getElementById(id));

  function setActive(id) {
    pills.forEach((p) => p.classList.toggle("active", p.dataset.nav === id));
  }

  function updateNavTheme() {
    const workSection = document.getElementById("work");
    const contactSection = document.getElementById("contact");
    const navRect = navbar.getBoundingClientRect();
    const midY = navRect.bottom;
    const overDark =
      (workSection.getBoundingClientRect().top <= midY && workSection.getBoundingClientRect().bottom >= midY) ||
      (contactSection.getBoundingClientRect().top <= midY && contactSection.getBoundingClientRect().bottom >= midY);
    navbar.classList.toggle("nav-on-dark", overDark);
  }

  /* Navbar stays permanently fixed and visible — only its light/dark
     theme changes as it crosses over dark sections. */
  window.addEventListener("scroll", updateNavTheme, { passive: true });

  if (window.IntersectionObserver) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => s && io.observe(s));
  }
  updateNavTheme();

  /* ============ MOBILE MENU ============ */
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  menuBtn.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("is-open");
    menuBtn.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  mobileMenu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      menuBtn.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    })
  );

  /* ============ SMOOTH SCROLL for in-page links ============ */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = window.innerWidth < 1181 ? 72 : 84;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  /* ============ GSAP SCROLL ANIMATIONS ============ */
  /* Hero entrance runs on pure CSS keyframes (see style.css) rather than a JS
     autoplay timeline — content must never depend on a JS ticker to become
     visible, since a stalled/throttled rAF would leave it stuck at opacity:0. */
  if (window.gsap) {
    if (window.ScrollTrigger) {
      // Work section header + footer
      gsap.utils.toArray(".work .reveal-up, .about .reveal-up, .artworks .reveal-up, .contact .reveal-up").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      gsap.from([".note-work", ".view-all-btn"], {
        y: 20, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".work-header", start: "top 75%" },
      });

      gsap.from([".note-footer-left", ".work-footer-right"], {
        y: 20, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".work-footer", start: "top 92%" },
      });

      // Posters cascade in
      gsap.utils.toArray(".poster").forEach((poster, i) => {
        gsap.from(poster, {
          y: 90,
          opacity: 0,
          rotate: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: i * 0.06,
          scrollTrigger: { trigger: ".poster-stack", start: "top 78%" },
        });
      });

      // About scraps
      gsap.utils.toArray(".about-visual .scrap").forEach((el, i) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          rotate: 0,
          duration: 0.8,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      gsap.from(".about-copy p", {
        y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: ".about-copy", start: "top 80%" },
      });

      // Contact links
      gsap.from(".contact-link", {
        y: 24, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: ".contact-links", start: "top 85%" },
      });

      // Parallax float elements
      if (!prefersReducedMotion) {
        gsap.utils.toArray(".float-el").forEach((el) => {
          const speed = parseFloat(el.dataset.speed || "0.3");
          gsap.to(el, {
            y: () => -120 * speed,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section"),
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        });

        // Blobs drift
        gsap.utils.toArray(".blob").forEach((blob, i) => {
          gsap.to(blob, {
            y: i % 2 === 0 ? 40 : -40,
            x: i % 2 === 0 ? -20 : 20,
            duration: 6 + i,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });
      }
    }
  }

  /* ============ SCROLL-DRIVEN SWIM TRANSITION ============ */
  /* Vanilla scroll + rAF, deliberately not GSAP ScrollTrigger — a plain
     scroll listener is the most robust way to guarantee 1:1 scroll-linked
     motion with no dependency on any animation library's internal ticker. */
  const swimStrip = document.getElementById("swimStrip");
  const swimTrack = document.getElementById("swimTrack");
  const swimSwimmer = document.getElementById("swimSwimmer");

  if (swimStrip && swimTrack && swimSwimmer) {
    let targetX = 0;
    let currentX = 0;
    let ticking = false;

    function swimProgress() {
      const rect = swimStrip.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = vh + rect.height;
      let p = (vh - rect.top) / total;
      return Math.max(0, Math.min(1, p));
    }

    function computeTarget() {
      const maxX = Math.max(0, swimTrack.clientWidth - swimSwimmer.clientWidth);
      targetX = swimProgress() * maxX;
    }

    function tick() {
      currentX += (targetX - currentX) * (prefersReducedMotion ? 1 : 0.18);
      swimSwimmer.style.transform = `translate(${currentX}px, -50%)`;
      if (Math.abs(targetX - currentX) > 0.3) {
        requestAnimationFrame(tick);
      } else {
        ticking = false;
      }
    }

    function onScrollOrResize() {
      computeTarget();
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(tick);
      }
    }

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    computeTarget();
    currentX = targetX;
    swimSwimmer.style.transform = `translate(${currentX}px, -50%)`;
  }

  /* ============ ARTWORKS GALLERY — horizontal slider ============ */
  /* One category = one full-width slide inside a framed, clipped track.
     Text + cards belong to the slide and move together via translateX.
     Vertical wheel input is remapped to horizontal navigation while inside
     the frame, and passes through to normal page scroll at the first/last
     slide boundary so the page above/below still scrolls normally. */
  const galleryFrame = document.getElementById("galleryFrame");
  const galleryTrack = document.getElementById("galleryTrack");
  const galleryPrev = document.getElementById("galleryPrev");
  const galleryNext = document.getElementById("galleryNext");
  const galleryThumbsEl = document.getElementById("galleryThumbs");
  const gallerySlides = Array.from(document.querySelectorAll(".gallery-slide"));

  if (galleryFrame && galleryTrack && gallerySlides.length) {
    const slideCount = gallerySlides.length;
    let currentSlide = 0;
    const activeArtwork = gallerySlides.map(() => 0);
    let locked = false;

    function slideCards(slide) {
      return Array.from(slide.querySelectorAll(".s-card"));
    }

    function renderThumbs() {
      const slide = gallerySlides[currentSlide];
      const cards = slideCards(slide);
      galleryThumbsEl.innerHTML = "";
      cards.forEach((card, i) => {
        const img = card.querySelector("img");
        const btn = document.createElement("button");
        btn.className = "gallery-thumb" + (i === activeArtwork[currentSlide] ? " active" : "");
        btn.setAttribute("aria-label", `View artwork ${i + 1}`);
        const thumbImg = document.createElement("img");
        thumbImg.src = img.src;
        thumbImg.alt = "";
        thumbImg.loading = "lazy";
        btn.appendChild(thumbImg);
        btn.addEventListener("click", () => setActiveArtwork(i));
        galleryThumbsEl.appendChild(btn);
      });
    }

    function setActiveArtwork(idx) {
      activeArtwork[currentSlide] = idx;
      const slide = gallerySlides[currentSlide];
      slideCards(slide).forEach((card, i) => card.classList.toggle("is-featured", i === idx));
      galleryThumbsEl.querySelectorAll(".gallery-thumb").forEach((t, i) => t.classList.toggle("active", i === idx));
    }

    function goToSlide(index) {
      currentSlide = Math.max(0, Math.min(slideCount - 1, index));
      galleryTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      galleryPrev.disabled = currentSlide === 0;
      galleryNext.disabled = currentSlide === slideCount - 1;
      renderThumbs();
      setActiveArtwork(activeArtwork[currentSlide]);
    }

    function lockFor(ms) {
      locked = true;
      setTimeout(() => {
        locked = false;
      }, ms);
    }

    function step(dir) {
      if (locked) return;
      const next = currentSlide + dir;
      if (next < 0 || next > slideCount - 1) return;
      goToSlide(next);
      lockFor(prefersReducedMotion ? 50 : 750);
    }

    galleryPrev.addEventListener("click", () => step(-1));
    galleryNext.addEventListener("click", () => step(1));

    // vertical mouse-wheel or horizontal trackpad → horizontal slide nav.
    // Passes through untouched (no preventDefault) at the first/last slide
    // boundary so the surrounding page keeps scrolling normally.
    galleryFrame.addEventListener(
      "wheel",
      (e) => {
        const primary = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (Math.abs(primary) < 8) return;
        const goingNext = primary > 0;
        const atBoundary = (goingNext && currentSlide === slideCount - 1) || (!goingNext && currentSlide === 0);
        if (atBoundary) return;
        e.preventDefault();
        step(goingNext ? 1 : -1);
      },
      { passive: false }
    );

    // touch swipe with a directional threshold
    let touchStartX = 0;
    let touchStartY = 0;
    galleryFrame.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );
    galleryFrame.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
        step(dx < 0 ? 1 : -1);
      },
      { passive: true }
    );

    galleryFrame.setAttribute("tabindex", "0");
    galleryFrame.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });

    if (prefersReducedMotion) galleryTrack.style.transition = "none";

    goToSlide(0);
  }

})();
