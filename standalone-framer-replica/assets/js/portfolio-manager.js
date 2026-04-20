(function () {
  const STORAGE_KEY = "semicolon.portfolio.projects.v1";

  const DEFAULT_PROJECTS = [
    {
      id: "telemed-healthcare",
      title: "Telemed Healthcare",
      client: "Telemed",
      category: "Healthcare",
      year: "2025",
      summary: "A connected care platform for virtual appointments, digital patient intake, and doctor coordination.",
      description:
        "Built as a modern telemedicine experience with patient onboarding, appointment management, doctor dashboards, and secure care follow-up across devices.",
      tags: ["Telemedicine", "Patient Portal", "Appointments", "Doctor Dashboard"],
      outcomes: [
        "Remote booking flow simplified for patients",
        "Doctor-side scheduling became faster to manage",
        "Care teams gained a clearer digital follow-up process"
      ],
      ctaLabel: "Discuss Similar Project",
      ctaHref: "contact.html",
      featured: true,
      tone: "healthcare"
    },
    {
      id: "dream-nest-properties",
      title: "Dream Nest Properties",
      client: "Dream Nest",
      category: "Real Estate",
      year: "2025",
      summary: "A polished real estate platform for listings, lead capture, property showcases, and buyer engagement.",
      description:
        "Designed to help property teams showcase developments, manage inbound leads, and present a premium brand experience across desktop and mobile.",
      tags: ["Listings", "Lead Generation", "Brochure Pages", "Responsive UI"],
      outcomes: [
        "Property discovery became easier to browse",
        "Sales teams received cleaner qualified inquiries",
        "The brand gained a more premium digital presentation"
      ],
      ctaLabel: "Start a Real Estate Project",
      ctaHref: "contact.html",
      image: "assets/media/dream-nest-portfolio.png",
      tone: "real-estate"
    },
    {
      id: "skill-lift-academy",
      title: "Skill Lift Academy",
      client: "Skill Lift",
      category: "Education",
      year: "2024",
      summary: "An education product focused on program discovery, enrollment journeys, and student-first communication.",
      description:
        "Created to support training operations with clearer program information, stronger conversion paths, and a better learner onboarding experience.",
      tags: ["EdTech", "Admissions", "Landing Pages", "Student Flow"],
      outcomes: [
        "Program information became easier to understand",
        "Enrollment journeys became more structured",
        "Students received a smoother digital first impression"
      ],
      ctaLabel: "Plan an Education Product",
      ctaHref: "contact.html",
      tone: "education"
    }
  ];

  let memoryProjects = cloneProjects(DEFAULT_PROJECTS);

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      return map[char];
    });
  }

  function slugify(value) {
    return String(value ?? "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function splitList(value, pattern) {
    if (Array.isArray(value)) {
      return value
        .map((item) => String(item).trim())
        .filter(Boolean);
    }

    return String(value ?? "")
      .split(pattern)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function sanitizeHref(value) {
    const href = String(value ?? "").trim();
    if (!href) return "contact.html";

    if (/^(https?:|mailto:|tel:|#)/i.test(href)) return href;
    if (/^\.{0,2}\//.test(href)) return href;
    if (/^[a-z0-9][a-z0-9-_/]*\.html(?:#.*)?$/i.test(href)) return href;
    return "contact.html";
  }

  function getTone(value) {
    const key = slugify(value);
    if (key.includes("health")) return "healthcare";
    if (key.includes("real") || key.includes("property")) return "real-estate";
    if (key.includes("educ") || key.includes("train") || key.includes("learn")) return "education";
    if (key.includes("fin") || key.includes("bank")) return "fintech";
    if (key.includes("shop") || key.includes("commerce") || key.includes("retail")) return "commerce";
    return "default";
  }

  function getInitials(value) {
    return String(value ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((chunk) => chunk[0].toUpperCase())
      .join("");
  }

  function normalizeProject(project, index) {
    const title = String(project?.title || project?.name || `Project ${index + 1}`).trim();
    const category = String(project?.category || "Digital Product").trim();
    const tags = splitList(project?.tags || project?.stack || "", /,|\n/).slice(0, 6);
    const outcomes = splitList(project?.outcomes || project?.highlights || "", /\n|,/).slice(0, 4);

    return {
      id: slugify(project?.id || title || `project-${index + 1}`) || `project-${index + 1}`,
      title,
      client: String(project?.client || title).trim(),
      category,
      categoryKey: slugify(category) || "digital-product",
      year: String(project?.year || "2025").trim(),
      summary: String(
        project?.summary || "A custom digital solution crafted to align product goals, user experience, and delivery."
      ).trim(),
      description: String(
        project?.description ||
          "This project blends thoughtful UX, business-first planning, and a modern implementation approach."
      ).trim(),
      tags: tags.length ? tags : ["UI/UX", "Frontend", "Delivery"],
      outcomes: outcomes.length ? outcomes : ["Built to support a cleaner and more effective delivery flow"],
      ctaLabel: String(project?.ctaLabel || "Discuss Similar Project").trim(),
      ctaHref: sanitizeHref(project?.ctaHref),
      image: String(project?.image || "").trim(),
      featured: Boolean(project?.featured),
      tone: getTone(project?.tone || category),
      updatedAt: String(project?.updatedAt || new Date().toISOString())
    };
  }

  function ensureFeatured(projects) {
    const normalized = projects.map((project, index) => normalizeProject(project, index));
    let featuredSeen = false;

    normalized.forEach((project) => {
      if (project.featured && !featuredSeen) {
        featuredSeen = true;
        return;
      }

      project.featured = false;
    });

    if (!featuredSeen && normalized[0]) normalized[0].featured = true;
    return normalized;
  }

  function cloneProjects(projects) {
    return ensureFeatured(projects.map((project) => ({ ...project })));
  }

  function readProjects() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return cloneProjects(memoryProjects);
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.length) return cloneProjects(memoryProjects);
      return ensureFeatured(parsed);
    } catch (error) {
      return cloneProjects(memoryProjects);
    }
  }

  function writeProjects(projects) {
    memoryProjects = ensureFeatured(projects);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryProjects));
    } catch (error) {
      memoryProjects = ensureFeatured(projects);
    }

    window.dispatchEvent(
      new CustomEvent("semicolon:portfolio-updated", {
        detail: { projects: cloneProjects(memoryProjects) }
      })
    );

    return cloneProjects(memoryProjects);
  }

  function resetProjects() {
    return writeProjects(DEFAULT_PROJECTS);
  }

  function exportProjects() {
    return JSON.stringify(readProjects(), null, 2);
  }

  function renderMedia(project, featured) {
    const toneClass = `project-cover--${project.tone || "default"}`;
    const featuredClass = featured ? " project-cover--featured" : "";
    const label = featured ? "Featured Project" : project.category;

    if (project.image) {
      return `
        <div class="project-cover ${toneClass}${featuredClass}">
          <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} preview">
          <span class="project-cover__pill">${escapeHtml(label)}</span>
          <span class="project-cover__ghost">${escapeHtml(project.client)}</span>
        </div>
      `;
    }

    return `
      <div class="project-cover ${toneClass}${featuredClass}">
        <span class="project-cover__pill">${escapeHtml(label)}</span>
        <span class="project-cover__mark">${escapeHtml(getInitials(project.title) || "SP")}</span>
        <span class="project-cover__ghost">${escapeHtml(project.client)}</span>
      </div>
    `;
  }

  function renderTagRow(tags) {
    return tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
  }

  function renderOutcomeList(items) {
    return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  }

  function renderFeaturedProject(project) {
    const mount = document.querySelector("[data-portfolio-featured]");
    if (!mount || !project) return;

    const visual = project.image
      ? `
        <div class="project-browser project-browser--image">
          <div class="project-browser__screen project-browser__screen--image">
            <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} showcase">
          </div>
          <div class="project-browser__footer">
            <strong>${escapeHtml(project.title)}</strong>
            <span class="project-browser__year">${escapeHtml(project.year)}</span>
          </div>
        </div>
      `
      : `
        <div class="project-browser">
          <div class="project-browser__screen">
            <div class="project-browser__pulse"></div>
            <div class="project-browser__doctor"></div>
            <div class="project-browser__laptop"></div>
          </div>
          <div class="project-browser__footer">
            <strong>${escapeHtml(project.title)}</strong>
            <span class="project-browser__year">${escapeHtml(project.year)}</span>
          </div>
        </div>
      `;

    mount.innerHTML = `
      <article class="surface portfolio-stage__card portfolio-stage__card--dynamic">
        <div class="portfolio-stage__showcase">
          ${visual}
        </div>
      </article>
    `;
  }

  function renderProjectGrid(projects, activeFilter) {
    const grid = document.querySelector("[data-portfolio-grid]");
    const empty = document.querySelector("[data-portfolio-empty]");
    if (!grid) return;

    const visibleProjects =
      activeFilter === "all"
        ? projects
        : projects.filter((project) => project.categoryKey === activeFilter);

    if (!visibleProjects.length) {
      grid.innerHTML = "";
      if (empty) empty.classList.remove("is-hidden");
      return;
    }

    if (empty) empty.classList.add("is-hidden");

    grid.innerHTML = visibleProjects
      .map(
        (project) => `
          <article class="surface dynamic-project-card" data-category="${escapeHtml(project.categoryKey)}">
            <div class="dynamic-project-card__media">
              ${renderMedia(project, false)}
            </div>
            <div class="dynamic-project-card__body">
              <div class="dynamic-project-card__head">
                <div>
                  <span class="dynamic-project-card__eyebrow">${escapeHtml(project.category)} | ${escapeHtml(project.year)}</span>
                  <strong>${escapeHtml(project.title)}</strong>
                </div>
                ${project.featured ? '<span class="chip">Featured</span>' : ""}
              </div>
              <p>${escapeHtml(project.summary)}</p>
              <ul class="project-outcome-list project-outcome-list--compact">
                ${renderOutcomeList(project.outcomes.slice(0, 3))}
              </ul>
              <div class="tag-row">
                ${renderTagRow(project.tags)}
              </div>
              <div class="dynamic-project-card__footer">
                <span class="dynamic-project-card__client">${escapeHtml(project.client)}</span>
                <a class="btn btn--small" href="${escapeHtml(project.ctaHref)}">${escapeHtml(project.ctaLabel)}</a>
              </div>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderFilters(projects, activeFilter) {
    const mount = document.querySelector("[data-portfolio-filters]");
    if (!mount) return;

    const categories = projects.reduce((accumulator, project) => {
      if (!accumulator.some((item) => item.key === project.categoryKey)) {
        accumulator.push({ key: project.categoryKey, label: project.category });
      }
      return accumulator;
    }, []);

    const buttons = [{ key: "all", label: "All Projects" }, ...categories];

    mount.innerHTML = buttons
      .map(
        (button) => `
          <button
            class="filter-button${button.key === activeFilter ? " is-active" : ""}"
            type="button"
            data-portfolio-filter="${escapeHtml(button.key)}"
          >
            ${escapeHtml(button.label)}
          </button>
        `
      )
      .join("");
  }

  function initPortfolioPage() {
    const projects = readProjects();
    const featured = projects.find((project) => project.featured) || projects[0];
    let activeFilter = "all";

    renderFeaturedProject(featured);
    renderFilters(projects, activeFilter);
    renderProjectGrid(projects, activeFilter);

    const filtersMount = document.querySelector("[data-portfolio-filters]");
    if (!filtersMount || filtersMount.dataset.bound === "true") return;

    filtersMount.dataset.bound = "true";
    filtersMount.addEventListener("click", (event) => {
      const button = event.target.closest("[data-portfolio-filter]");
      if (!button) return;

      activeFilter = button.dataset.portfolioFilter || "all";
      renderFilters(readProjects(), activeFilter);
      renderProjectGrid(readProjects(), activeFilter);
    });
  }

  function createStatMarkup(label, value) {
    return `
      <article class="surface admin-stat-card">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </article>
    `;
  }

  function downloadText(filename, content) {
    const blob = new Blob([content], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function initAdminPage() {
    const form = document.querySelector("[data-portfolio-form]");
    const list = document.querySelector("[data-admin-project-list]");
    const empty = document.querySelector("[data-admin-empty]");
    const stats = document.querySelector("[data-admin-stats]");
    const preview = document.querySelector("[data-admin-preview]");
    const feedback = document.querySelector("[data-admin-feedback]");

    if (!form || !list || !stats || !preview) return;

    const fields = {
      id: form.querySelector('[name="projectId"]'),
      title: form.querySelector('[name="title"]'),
      client: form.querySelector('[name="client"]'),
      category: form.querySelector('[name="category"]'),
      year: form.querySelector('[name="year"]'),
      summary: form.querySelector('[name="summary"]'),
      description: form.querySelector('[name="description"]'),
      tags: form.querySelector('[name="tags"]'),
      outcomes: form.querySelector('[name="outcomes"]'),
      image: form.querySelector('[name="image"]'),
      imageUpload: form.querySelector('[name="imageUpload"]'),
      uploadedImageData: form.querySelector('[name="uploadedImageData"]'),
      existingImage: form.querySelector('[name="existingImage"]'),
      ctaLabel: form.querySelector('[name="ctaLabel"]'),
      ctaHref: form.querySelector('[name="ctaHref"]'),
      featured: form.querySelector('[name="featured"]')
    };

    function setFeedback(message) {
      if (!feedback) return;
      feedback.textContent = message;
      feedback.classList.toggle("is-visible", Boolean(message));
    }

    function readFormProject() {
      return normalizeProject(
        {
          id: fields.id?.value.trim(),
          title: fields.title?.value.trim(),
          client: fields.client?.value.trim(),
          category: fields.category?.value.trim(),
          year: fields.year?.value.trim(),
          summary: fields.summary?.value.trim(),
          description: fields.description?.value.trim(),
          tags: fields.tags?.value.trim(),
          outcomes: fields.outcomes?.value.trim(),
          image:
            fields.image?.value.trim() ||
            fields.uploadedImageData?.value.trim() ||
            fields.existingImage?.value.trim(),
          ctaLabel: fields.ctaLabel?.value.trim(),
          ctaHref: fields.ctaHref?.value.trim(),
          featured: Boolean(fields.featured?.checked)
        },
        0
      );
    }

    function updatePreview() {
      const project = readFormProject();

      preview.innerHTML = `
        <div class="admin-preview-card">
          <div class="admin-preview-card__media">
            ${renderMedia(project, false)}
          </div>
          <div class="admin-preview-card__body">
            <span>${escapeHtml(project.category)} | ${escapeHtml(project.year)}</span>
            <strong>${escapeHtml(project.title)}</strong>
            <p>${escapeHtml(project.summary)}</p>
          </div>
        </div>
      `;
    }

    function resetForm() {
      form.reset();
      if (fields.id) fields.id.value = "";
      if (fields.uploadedImageData) fields.uploadedImageData.value = "";
      if (fields.existingImage) fields.existingImage.value = "";
      if (fields.year) fields.year.value = "2025";
      if (fields.ctaLabel) fields.ctaLabel.value = "Discuss Similar Project";
      if (fields.ctaHref) fields.ctaHref.value = "contact.html";
      if (fields.featured) fields.featured.checked = false;
      setFeedback("");
      updatePreview();
    }

    function fillForm(project) {
      if (fields.id) fields.id.value = project.id;
      if (fields.title) fields.title.value = project.title;
      if (fields.client) fields.client.value = project.client;
      if (fields.category) fields.category.value = project.category;
      if (fields.year) fields.year.value = project.year;
      if (fields.summary) fields.summary.value = project.summary;
      if (fields.description) fields.description.value = project.description;
      if (fields.tags) fields.tags.value = project.tags.join(", ");
      if (fields.outcomes) fields.outcomes.value = project.outcomes.join("\n");
      if (fields.image) fields.image.value = project.image;
      if (fields.uploadedImageData) fields.uploadedImageData.value = "";
      if (fields.existingImage) fields.existingImage.value = project.image;
      if (fields.ctaLabel) fields.ctaLabel.value = project.ctaLabel;
      if (fields.ctaHref) fields.ctaHref.value = project.ctaHref;
      if (fields.featured) fields.featured.checked = project.featured;
      setFeedback(`Editing "${project.title}". Save to update the portfolio.`);
      updatePreview();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function renderStats(projects) {
      const featured = projects.find((project) => project.featured) || projects[0];
      const categoryCount = new Set(projects.map((project) => project.categoryKey)).size;

      stats.innerHTML = [
        createStatMarkup("Total Projects", String(projects.length)),
        createStatMarkup("Categories", String(categoryCount)),
        createStatMarkup("Featured", featured ? featured.title : "None")
      ].join("");
    }

    function renderList() {
      const projects = readProjects();
      renderStats(projects);

      if (!projects.length) {
        list.innerHTML = "";
        empty?.classList.remove("is-hidden");
        return;
      }

      empty?.classList.add("is-hidden");

      list.innerHTML = projects
        .map(
          (project) => `
            <article class="surface admin-project-item" data-project-id="${escapeHtml(project.id)}">
              <div class="admin-project-item__media">
                ${renderMedia(project, false)}
              </div>
              <div class="admin-project-item__body">
                <div class="admin-project-item__meta">
                  <span class="chip">${escapeHtml(project.category)}</span>
                  <span class="chip">${escapeHtml(project.year)}</span>
                  ${project.featured ? '<span class="chip">Featured</span>' : ""}
                </div>
                <div>
                  <strong>${escapeHtml(project.title)}</strong>
                  <p>${escapeHtml(project.description)}</p>
                </div>
                <div class="tag-row">
                  ${renderTagRow(project.tags)}
                </div>
                <div class="admin-project-item__actions">
                  <button type="button" class="admin-ghost" data-admin-action="edit">Edit</button>
                  <button type="button" class="admin-ghost" data-admin-action="feature">Set Featured</button>
                  <button type="button" class="admin-ghost admin-danger" data-admin-action="delete">Delete</button>
                </div>
              </div>
            </article>
          `
        )
        .join("");
    }

    form.addEventListener("input", updatePreview);
    form.addEventListener("change", updatePreview);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const nextProject = readFormProject();
      const projects = readProjects();
      const existingIndex = projects.findIndex((project) => project.id === nextProject.id);

      if (existingIndex >= 0) {
        projects[existingIndex] = nextProject;
      } else {
        projects.unshift(nextProject);
      }

      writeProjects(projects);
      renderList();
      resetForm();
      setFeedback(`Saved "${nextProject.title}" to the portfolio.`);
    });

    fields.imageUpload?.addEventListener("change", () => {
      const file = fields.imageUpload.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        if (fields.uploadedImageData) fields.uploadedImageData.value = String(reader.result || "");
        if (fields.image) fields.image.value = "";
        updatePreview();
      };
      reader.readAsDataURL(file);
    });

    list.addEventListener("click", (event) => {
      const button = event.target.closest("[data-admin-action]");
      const item = event.target.closest("[data-project-id]");
      if (!button || !item) return;

      const projects = readProjects();
      const project = projects.find((entry) => entry.id === item.dataset.projectId);
      if (!project) return;

      const action = button.dataset.adminAction;

      if (action === "edit") {
        fillForm(project);
        return;
      }

      if (action === "feature") {
        writeProjects(projects.map((entry) => ({ ...entry, featured: entry.id === project.id })));
        renderList();
        setFeedback(`"${project.title}" is now the featured portfolio case.`);
        return;
      }

      if (action === "delete") {
        const approved = window.confirm(`Delete "${project.title}" from the portfolio?`);
        if (!approved) return;

        writeProjects(projects.filter((entry) => entry.id !== project.id));
        renderList();
        if (fields.id?.value === project.id) resetForm();
        setFeedback(`Removed "${project.title}" from the portfolio.`);
      }
    });

    document.querySelector("[data-admin-clear]")?.addEventListener("click", () => {
      resetForm();
    });

    document.querySelector("[data-admin-export]")?.addEventListener("click", () => {
      downloadText("semicolon-portfolio.json", exportProjects());
      setFeedback("Exported the current portfolio data as JSON.");
    });

    document.querySelector("[data-admin-reset]")?.addEventListener("click", () => {
      const approved = window.confirm("Restore the default portfolio projects?");
      if (!approved) return;

      resetProjects();
      renderList();
      resetForm();
      setFeedback("Restored the default portfolio projects.");
    });

    renderList();
    resetForm();
  }

  window.SEMICOLON_PORTFOLIO = {
    storageKey: STORAGE_KEY,
    getProjects: readProjects,
    saveProjects: writeProjects,
    resetProjects,
    exportProjects
  };

  if (document.body.dataset.page === "portfolio") {
    initPortfolioPage();
  }

  if (document.body.dataset.page === "portfolio-admin") {
    initAdminPage();
  }

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;

    if (document.body.dataset.page === "portfolio") {
      initPortfolioPage();
    }
  });

  window.addEventListener("semicolon:portfolio-updated", () => {
    if (document.body.dataset.page === "portfolio") {
      initPortfolioPage();
    }
  });
})();
