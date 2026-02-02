const header = document.getElementById("site-header");
const nav = document.querySelector(".site-nav");
const toggle = document.querySelector(".menu-toggle");

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeMenu = () => {
  if (!nav || !toggle) return;
  nav.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

const platformTabs = document.querySelectorAll(".platform-tab");
const platformPanels = document.querySelectorAll(".platform-panel");

if (platformTabs.length && platformPanels.length) {
  const activatePlatform = (platformId) => {
    platformTabs.forEach((tab) => {
      const isActive = tab.dataset.platform === platformId;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    platformPanels.forEach((panel) => {
      const isActive = panel.dataset.platform === platformId;
      panel.classList.toggle("active", isActive);
    });
  };

  const defaultTab =
    document.querySelector(".platform-tab.active") || platformTabs[0];

  if (defaultTab) {
    activatePlatform(defaultTab.dataset.platform);
  }

  platformTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activatePlatform(tab.dataset.platform);
    });
  });
}
