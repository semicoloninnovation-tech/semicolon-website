(function () {
  const config = window.SEMICOLON_SITE;
  const body = document.body;
  const currentPage = body.dataset.page || "home";
  const relatedPages = {
    jobs: "careers",
    enrollment: "services",
    "portfolio-admin": "portfolio"
  };

  const getCurrentPath = () => window.location.pathname.split("/").pop() || "index.html";

  const getHeaderOffset = () => {
    const header = document.querySelector(".site-header");
    return (header?.offsetHeight || 72) + 18;
  };

  const internalHref = (href) =>
    href &&
    !href.startsWith("http") &&
    !href.startsWith("mailto:") &&
    !href.startsWith("tel:");

  const sameDocumentLink = (href) => {
    if (!internalHref(href)) return false;
    const [path, hash] = href.split("#");
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const targetPath = path || currentPath;
    return Boolean(hash) && targetPath === currentPath;
  };

  const updateNavActiveState = () => {
    const currentPath = getCurrentPath();
    const currentHash = window.location.hash;

    document.querySelectorAll(".site-nav__link").forEach((link) => {
      const href = link.dataset.navHref || link.getAttribute("href") || "";
      const navPage = link.dataset.navPage || "";
      const [pathPart, hashPart] = href.split("#");
      const targetPath = pathPart || currentPath;
      let active = false;

      if (currentPath === "index.html" && currentHash && hashPart) {
        active = targetPath === currentPath && `#${hashPart}` === currentHash;
      } else if (href === currentPath || (currentPath === "index.html" && href === "index.html" && !currentHash)) {
        active = true;
      } else if (navPage && (navPage === currentPage || relatedPages[currentPage] === navPage)) {
        active = true;
      }

      link.classList.toggle("is-active", active);
    });
  };

  const renderHeader = () => {
    const mount = document.querySelector("[data-site-header]");
    if (!mount || !config) return;
    const logoSrc = config.brand.logo || "assets/media/semicolon.png";
    const headerLogoSrc = config.brand.headerLogo || logoSrc;

    const navLinks = config.nav
      .map(
        (item) =>
          `<a href="${item.href}" class="site-nav__link" data-nav-href="${item.href}" data-nav-page="${item.page || ""}">${item.label}</a>`
      )
      .join("");

    mount.innerHTML = `
      <div class="transition-overlay" aria-hidden="true">
        <div class="transition-overlay__inner">
          <span class="transition-overlay__brand"><img src="${headerLogoSrc}" alt=""></span>
          <span class="transition-overlay__label">${config.brand.name}</span>
        </div>
      </div>
      <header class="site-header">
        <div class="container site-header__inner">
          <a href="index.html" class="brand brand--header" aria-label="${config.brand.name}">
            <span class="brand-mark brand-mark--header"><img src="${headerLogoSrc}" alt=""></span>
          </a>
          <span class="site-header__divider" aria-hidden="true"></span>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
            <span></span>
            <span></span>
          </button>
          <nav class="site-nav" id="site-nav" aria-label="Primary navigation">
            <div class="site-nav__links">${navLinks}</div>
            <a href="contact.html" class="btn btn--small">Get In Touch</a>
          </nav>
        </div>
      </header>
    `;
  };

  const renderFooter = () => {
    const mount = document.querySelector("[data-site-footer]");
    if (!mount || !config) return;
    const logoSrc = config.brand.logo || "assets/media/semicolon.png";

    const groups = config.footerGroups
      .map(
        (group) => `
          <div class="footer-group">
            <h3>${group.title}</h3>
            ${group.links.map((link) => `<a href="${link.href}">${link.label}</a>`).join("")}
          </div>
        `
      )
      .join("");
    const office = (config.office || []).map((line) => `<span>${line}</span>`).join("");

    mount.innerHTML = `
      <footer class="site-footer">
        <div class="container site-footer__grid">
          <div class="footer-intro">
            <a href="index.html" class="brand brand--footer" aria-label="${config.brand.name}">
              <span class="brand-mark"><img src="${logoSrc}" alt=""></span>
            </a>
            <p>${config.footerNote || ""}</p>
            <form class="footer-subscribe" data-demo-form>
              <label class="sr-only" for="footer-email">Email</label>
              <input
                id="footer-email"
                name="email"
                type="email"
                placeholder="${config.footerSubscribePlaceholder || "Enter Your Email..."}"
              >
              <button class="btn btn--small" type="submit">
                ${config.footerSubscribeLabel || "Subscribe Us"}
              </button>
              <p class="form-feedback" aria-live="polite"></p>
            </form>
          </div>
          <div class="footer-columns">
            ${groups}
            <div class="footer-group footer-group--office">
              <h3>Office</h3>
              ${office}
            </div>
          </div>
        </div>
        <div class="container site-footer__bottom">
          <span>&copy; <span data-year></span> Semicolon Innovations</span>
          <span><a href="terms-conditions.html">Terms & Conditions</a></span>
          <span><a href="privacy-policy.html">Privacy Policy</a></span>
        </div>
      </footer>
    `;
  };

  const initMobileNav = () => {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  };

  const initReveal = () => {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    items.forEach((item) => revealObserver.observe(item));
  };

  const initCounters = () => {
    const counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;

    const animateCounter = (element) => {
      const goal = Number(element.dataset.counter || "0");
      const suffix = element.dataset.suffix || "";
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.round(goal * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.45 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  };

  const initFaq = () => {
    document.querySelectorAll("[data-faq-button]").forEach((button) => {
      button.addEventListener("click", () => {
        const item = button.closest(".faq-item");
        const expanded = button.getAttribute("aria-expanded") === "true";
        item?.classList.toggle("is-open", !expanded);
        button.setAttribute("aria-expanded", String(!expanded));
      });
    });
  };

  const initFilters = () => {
    const buttons = document.querySelectorAll("[data-filter]");
    const cards = document.querySelectorAll("[data-category]");
    if (!buttons.length || !cards.length) return;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        buttons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");

        cards.forEach((card) => {
          const match = filter === "all" || card.dataset.category === filter;
          card.classList.toggle("is-hidden", !match);
        });
      });
    });
  };

  const initForms = () => {
    document.querySelectorAll("form[data-demo-form]").forEach((form) => {
      const feedback = form.querySelector(".form-feedback");
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (feedback) {
          feedback.textContent = "Thanks. This local demo is wired for front-end flow only.";
          feedback.classList.add("is-visible");
        }
      });
    });
  };

  const initSmoothAnchors = () => {
    document.querySelectorAll('a[href*="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || !sameDocumentLink(href)) return;
        const targetId = href.split("#")[1];
        const target = document.getElementById(targetId);
        if (!target) return;
        event.preventDefault();
        window.history.replaceState(null, "", href);
        updateNavActiveState();
        const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
        window.scrollTo({
          top: Math.max(0, top),
          behavior: "smooth"
        });
      });
    });
  };

  const initPageTransitions = () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const enterDelay = reducedMotion ? 0 : 120;
    const exitDelay = reducedMotion ? 0 : 560;
    let isNavigating = false;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => body.classList.add("is-ready"), enterDelay);
      });
    });

    document.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (!href || !internalHref(href) || href.startsWith("#")) return;
        if (sameDocumentLink(href)) return;
        if (link.target === "_blank" || link.hasAttribute("download")) return;
        if (isNavigating) {
          event.preventDefault();
          return;
        }

        event.preventDefault();
        isNavigating = true;
        body.classList.add("is-transitioning");
        requestAnimationFrame(() => body.classList.add("is-exiting"));
        setTimeout(() => {
          window.location.href = href;
        }, exitDelay);
      });
    });
  };

  const initCursor = () => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.innerHTML = `
      <span class="custom-cursor__halo"></span>
      <span class="custom-cursor__core"></span>
    `;

    body.appendChild(cursor);
    body.classList.add("has-custom-cursor");

    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.5;
    let currentX = targetX;
    let currentY = targetY;

    const interactiveSelector =
      'a, button, [role="button"], [data-faq-button], .btn, .btn--ghost, .btn--light, .filter-button';
    const inputSelector = "input, textarea, select, option, [contenteditable='true']";

    const tick = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      window.requestAnimationFrame(tick);
    };

    const updateTargetState = (target) => {
      const input = target?.closest?.(inputSelector);
      const interactive = target?.closest?.(interactiveSelector);

      cursor.classList.toggle("is-hidden", Boolean(input));
      cursor.classList.toggle("is-active", Boolean(interactive) && !input);
    };

    window.requestAnimationFrame(tick);

    window.addEventListener(
      "pointermove",
      (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
        cursor.classList.add("is-visible");
        updateTargetState(event.target);
      },
      { passive: true }
    );

    window.addEventListener("pointerdown", () => cursor.classList.add("is-pressed"));
    window.addEventListener("pointerup", () => cursor.classList.remove("is-pressed"));
    document.addEventListener("pointerover", (event) => updateTargetState(event.target));
    window.addEventListener("mouseout", (event) => {
      if (!event.relatedTarget) cursor.classList.remove("is-visible");
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cursor.classList.remove("is-visible");
    });
  };

  const initCurrentYear = () => {
    document.querySelectorAll("[data-year]").forEach((node) => {
      node.textContent = config?.footerYear || "2025";
    });
  };

  const initParallax = () => {
    const panels = document.querySelectorAll("[data-parallax]");
    if (!panels.length) return;

    const update = () => {
      const offset = window.scrollY * 0.04;
      panels.forEach((panel, index) => {
        panel.style.setProperty("--drift", `${offset * (index + 1) * 0.2}px`);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
  };

  renderHeader();
  renderFooter();
  updateNavActiveState();
  initMobileNav();
  initReveal();
  initCounters();
  initFaq();
  initFilters();
  initForms();
  initSmoothAnchors();
  initPageTransitions();
  initCursor();
  initCurrentYear();
  initParallax();
  window.addEventListener("hashchange", updateNavActiveState);
})();
