const nav = document.querySelector(".site-nav");
const menuButton = document.querySelector(".menu-button");
const links = document.querySelectorAll("[data-tab-link]");
const panels = document.querySelectorAll("[data-tab-panel]");

function showPanel(panelName) {
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.tabPanel === panelName);
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.tabLink === panelName);
  });

  if (nav) {
    nav.classList.remove("open");
  }

  if (menuButton) {
    menuButton.setAttribute("aria-expanded", "false");
  }
}

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    const panelName = link.dataset.tabLink;

    if (!panelName) {
      return;
    }

    event.preventDefault();
    showPanel(panelName);
    history.replaceState(null, "", `#${panelName}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

const initialPanel = window.location.hash.replace("#", "");

if (initialPanel && document.querySelector(`[data-tab-panel="${initialPanel}"]`)) {
  showPanel(initialPanel);
}
