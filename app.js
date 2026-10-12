(function () {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const list = document.querySelector("#project-list");
  const dialog = document.querySelector(".project-dialog");
  const dialogBody = dialog.querySelector(".dialog-body");

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

  function projectCard(project, index) {
    const reversed = index % 2 === 1 ? " project-reversed" : "";
    const action = project.url
      ? `<a class="project-action" href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.action)} <span aria-hidden="true">↗</span></a>`
      : `<span class="project-action project-action-muted">${escapeHtml(project.linkStatus)} <span aria-hidden="true">↗</span></span>`;
    return `<article class="project-card reveal${reversed}" data-project="${escapeHtml(project.number)}">
      <button class="project-visual visual-${escapeHtml(project.statusType)}" type="button" data-project-details="${escapeHtml(project.number)}" aria-label="Open ${escapeHtml(project.name)} project details">
        <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.imageAlt)}" width="1200" height="760" loading="lazy" />
        <span class="visual-overline mono">Original project illustration</span>
        <span class="visual-open" aria-hidden="true">↗</span>
      </button>
      <div class="project-info">
        <div class="project-meta mono"><span>PROJECT ${escapeHtml(project.number)}</span><span class="project-status ${escapeHtml(project.statusType)}"><i></i>${escapeHtml(project.status)}</span></div>
        <p class="project-category mono">${escapeHtml(project.category)}</p>
        <h3>${escapeHtml(project.name)}</h3>
        <p class="project-description">${escapeHtml(project.description)}</p>
        <div class="project-links">${action}<button class="details-link" type="button" data-project-details="${escapeHtml(project.number)}">Project notes <span aria-hidden="true">＋</span></button></div>
      </div>
    </article>`;
  }

  list.innerHTML = projects.map(projectCard).join("");

  function openDetails(number) {
    const project = projects.find((item) => item.number === number);
    if (!project) return;
    const detailRows = project.details.map(([label, copy]) => `<section class="detail-row"><h3>${escapeHtml(label)}</h3><p>${escapeHtml(copy)}</p></section>`).join("");
    const external = project.url ? `<a class="button button-lime dialog-action" href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.action)} <span aria-hidden="true">↗</span></a>` : "";
    dialogBody.innerHTML = `<div class="dialog-heading"><p class="eyebrow mono">PROJECT ${escapeHtml(project.number)} · ${escapeHtml(project.category)}</p><h2 id="dialog-title">${escapeHtml(project.name)}</h2><p class="dialog-summary">${escapeHtml(project.description)}</p><span class="dialog-status ${escapeHtml(project.statusType)}"><i></i>${escapeHtml(project.status)}</span></div>
      <div class="detail-list">${detailRows}</div><p class="dialog-outcome mono">${escapeHtml(project.outcome)}</p>${external}`;
    dialog.showModal();
  }

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-project-details]");
    if (button) openDetails(button.dataset.projectDetails);
  });
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dialog.open) dialog.close();
  });

  const menuButton = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  function setMenu(open) {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileMenu.inert = !open;
    document.body.classList.toggle("menu-is-open", open);
  }
  menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  mobileMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) setMenu(false);
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
  document.documentElement.classList.add("js-motion");

  document.querySelector("#year").textContent = new Date().getFullYear();
}());
