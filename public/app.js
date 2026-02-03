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
const platformList = document.querySelector(".platforms-list");

if (platformTabs.length && platformPanels.length) {
  const activatePlatform = (platformId, focusTab = false) => {
    platformTabs.forEach((tab) => {
      const isActive = tab.dataset.platform === platformId;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.setAttribute("tabindex", isActive ? "0" : "-1");

      if (isActive && focusTab) {
        tab.focus();
      }
    });

    platformPanels.forEach((panel) => {
      const isActive = panel.dataset.platform === platformId;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
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

  if (platformList) {
    platformList.addEventListener("keydown", (event) => {
      const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (!keys.includes(event.key)) return;

      event.preventDefault();
      const tabs = Array.from(platformTabs);
      const currentIndex = tabs.findIndex(
        (tab) => tab.getAttribute("aria-selected") === "true"
      );
      let nextIndex = currentIndex;

      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      }

      const nextTab = tabs[nextIndex];
      if (nextTab) {
        activatePlatform(nextTab.dataset.platform, true);
      }
    });
  }
}

