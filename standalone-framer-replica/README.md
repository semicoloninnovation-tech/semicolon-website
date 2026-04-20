# Semicolon Standalone Replica

This folder contains a standalone, editable replica of the Semicolon website built with local HTML, CSS, JavaScript, and media only.

## What is inside

- `index.html`: Homepage replica
- `about.html`: About page replica
- `portfolio.html`: Portfolio page replica
- `portfolio-admin.html`: Local admin panel for adding, editing, featuring, exporting, and resetting portfolio projects
- `contact.html`: Contact page replica
- `faq.html`, `services.html`, `careers.html`, `privacy-policy.html`, `terms-conditions.html`: Supporting pages carried into the standalone project
- `assets/css/styles.css`: Shared styling and responsive layout rules
- `assets/js/site-data.js`: Shared navigation and footer content
- `assets/js/main.js`: Header/footer rendering, FAQ toggles, basic motion, form demo behavior
- `assets/js/portfolio-manager.js`: Local portfolio storage, dynamic portfolio rendering, and admin panel behavior
- `assets/media/`: Local image assets used by the pages

## How to edit

- Change page content directly in the HTML files.
- Adjust global design in `assets/css/styles.css`.
- Update nav, footer links, office details, or footer text in `assets/js/site-data.js`.
- Update shared interactions in `assets/js/main.js`.
- Manage portfolio projects from `portfolio-admin.html`. Changes are saved in the browser's local storage, so they stay local to that browser/device unless you export the JSON and move it elsewhere.

## Running locally

Open `index.html` directly in a browser, or serve the folder with any simple static server if you want cleaner local navigation behavior.
