    const body = document.body;
    const menu = document.getElementById("menuOverlay");
    const menuToggle = document.querySelector(".menu-toggle");
    const menuClose = document.querySelector(".menu-close");
    const homeView = document.getElementById("main");
    const caseViews = Array.from(document.querySelectorAll(".case-view[data-case-route]"));
    const footer = document.getElementById("footer");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"));
    const turntableImages = Array.from(document.querySelectorAll(".hero .turntable-img"));
    const turntableFrames = [
      "img/front.webp",
      "img/right1.webp",
      "img/right2.webp",
      "img/left2.webp",
      "img/left1.webp",
      "img/front.webp",
      "img/front.webp"
    ];
    const pointer = { x: 0, y: 0 };
    let ticking = false;
    let frameIndex = 0;
    let turntableTimer = null;

    function openMenu() {
      menu.classList.add("is-open");
      menu.setAttribute("aria-hidden", "false");
      menuToggle.setAttribute("aria-expanded", "true");
      homeView.inert = true;
      caseViews.forEach((view) => {
        view.inert = true;
      });
      footer.inert = true;
      body.classList.add("menu-open");
      menuClose.focus();
    }

    function closeMenu() {
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      menuToggle.setAttribute("aria-expanded", "false");
      homeView.inert = false;
      caseViews.forEach((view) => {
        view.inert = view.hidden;
      });
      footer.inert = false;
      body.classList.remove("menu-open");
      menuToggle.focus();
    }

    function setupReveal() {
      if (reducedMotion.matches || !("IntersectionObserver" in window)) {
        return;
      }

      body.classList.add("motion-ready");
      const revealItems = document.querySelectorAll(".section, .site-footer, .case-page");
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      revealItems.forEach((item) => {
        item.classList.add("reveal");
        observer.observe(item);
      });
    }

    function updateParallax() {
      ticking = false;

      if (reducedMotion.matches) {
        return;
      }

      const viewportCenter = window.innerHeight / 2;
      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const depth = Number(item.dataset.depth || 0.08);
        const rotate = Number(item.dataset.rotate || 0);
        const itemCenter = rect.top + rect.height / 2;
        const scrollShift = (viewportCenter - itemCenter) * depth * 0.11;
        const pointerShiftX = pointer.x * depth * 10;
        const pointerShiftY = pointer.y * depth * 6;
        const rotateShift = (pointer.x * rotate * 8) + (scrollShift * rotate * 0.08);

        item.style.setProperty("--parallax-x", `${pointerShiftX.toFixed(2)}px`);
        item.style.setProperty("--parallax-y", `${(scrollShift + pointerShiftY).toFixed(2)}px`);
        item.style.setProperty("--parallax-r", `${rotateShift.toFixed(3)}deg`);
      });
    }

    function requestParallax() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateParallax);
      }
    }

    function setupParallax() {
      if (reducedMotion.matches) {
        return;
      }

      window.addEventListener("scroll", requestParallax, { passive: true });
      window.addEventListener("resize", requestParallax);
      window.addEventListener("pointermove", (event) => {
        pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
        requestParallax();
      }, { passive: true });

      requestParallax();
    }

    function setupTurntable() {
      if (reducedMotion.matches || turntableImages.length === 0) {
        return;
      }

      const preloadFrames = () => {
        turntableFrames.forEach((src) => {
          const image = new Image();
          image.src = src;
        });
      };

      if (document.readyState === "complete") {
        preloadFrames();
      } else {
        window.addEventListener("load", preloadFrames, { once: true });
      }

      turntableTimer = window.setInterval(() => {
        frameIndex = (frameIndex + 1) % turntableFrames.length;
        const nextFrame = turntableFrames[frameIndex];
        turntableImages.forEach((image) => {
          image.src = nextFrame;
        });
      }, 620);
    }

    function renderRoute() {
      const activeCase = caseViews.find((view) => view.dataset.caseRoute === window.location.hash);
      const isCase = Boolean(activeCase);
      homeView.hidden = isCase;
      footer.hidden = isCase;
      caseViews.forEach((view) => {
        const isActive = view === activeCase;
        view.hidden = !isActive;
        view.inert = !isActive;
      });
      body.classList.toggle("case-mode", isCase);

      if (isCase) {
        window.scrollTo(0, 0);
        requestParallax();
        return;
      }

      const target = window.location.hash && document.querySelector(window.location.hash);
      if (target) {
        window.setTimeout(() => target.scrollIntoView({ block: "start" }), 0);
      }
      requestParallax();
    }

    menuToggle.addEventListener("click", openMenu);
    menuClose.addEventListener("click", closeMenu);
    menu.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (link && link.getAttribute("href").startsWith("#")) {
        closeMenu();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        closeMenu();
      }
    });
    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches && turntableTimer) {
        window.clearInterval(turntableTimer);
        turntableImages.forEach((image) => {
          image.src = "img/front.webp";
        });
      }
    });
    window.addEventListener("hashchange", renderRoute);
    setupReveal();
    setupParallax();
    setupTurntable();
    renderRoute();
