(function () {
  const config = window.SEMICOLON_SITE;
  const body = document.body;
  const currentPage = body.dataset.page || "home";

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

  const renderHeader = () => {
    const mount = document.querySelector("[data-site-header]");
    if (!mount || !config) return;
    const logoSrc = "assets/media/semicolon.png";

    const navLinks = config.nav
      .map((item) => {
        const active =
          item.page === currentPage &&
          (item.page !== "home" || !window.location.hash || item.href === "index.html");

        return `<a href="${item.href}" class="site-nav__link${active ? " is-active" : ""}">${item.label}</a>`;
      })
      .join("");

    const tagline = config.brand.tagline
      ? `<small>${config.brand.tagline}</small>`
      : "";

    mount.innerHTML = `
      <div class="transition-overlay" aria-hidden="true">
        <div class="transition-overlay__inner">
          <span class="brand-mark"><img src="${logoSrc}" alt=""></span>
          <span class="transition-overlay__label">${config.brand.name}</span>
        </div>
      </div>
      <header class="site-header">
        <div class="container site-header__inner">
          <a href="index.html" class="brand" aria-label="${config.brand.name}">
            <span class="brand-mark"><img src="${logoSrc}" alt=""></span>
            <span class="brand-copy">
              <strong>${config.brand.name}</strong>
              ${tagline}
            </span>
          </a>
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
    const logoSrc = "assets/media/semicolon.png";

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
              <span class="brand-copy">
                <strong>${config.brand.name}</strong>
              </span>
            </a>
            <p>${config.footerNote || ""}</p>
            <div class="footer-subscribe">Subscribe Us</div>
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
      { threshold: 0.12 }
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
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  };

  const initPageTransitions = () => {
    setTimeout(() => body.classList.add("is-ready"), 120);

    document.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || !internalHref(href) || href.startsWith("#")) return;
        if (sameDocumentLink(href)) return;
        if (link.target === "_blank" || link.hasAttribute("download")) return;

        event.preventDefault();
        body.classList.add("is-exiting");
        setTimeout(() => {
          window.location.href = href;
        }, 320);
      });
    });
  };

  const initCurrentYear = () => {
    document.querySelectorAll("[data-year]").forEach((node) => {
      node.textContent = String(new Date().getFullYear());
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
  initMobileNav();
  initReveal();
  initCounters();
  initFaq();
  initFilters();
  initForms();
  initSmoothAnchors();
  initPageTransitions();
  initCurrentYear();
  initParallax();
})();
