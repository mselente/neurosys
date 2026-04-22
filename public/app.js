const header = document.getElementById("site-header");
const nav = document.querySelector(".site-nav");
const toggle = document.querySelector(".menu-toggle");
const headerLogo = header?.querySelector(".logo img");
const navDetails = Array.from(document.querySelectorAll(".nav-details"));
const disclosureCloseTimers = new WeakMap();
const homePaths = new Set(["/", "/index.html"]);
const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
const isHomePage = homePaths.has(normalizedPath);
const DEFAULT_LOGO =
  "https://zarnnrxwzoxvovjhovhu.supabase.co/storage/v1/object/public/images/general/neurosys-logo.png";
const INVERTED_LOGO =
  "https://zarnnrxwzoxvovjhovhu.supabase.co/storage/v1/object/public/images/general/neurosys-logo-inverted.png";
const MENU_BREAKPOINT = 1024;
const prefersDesktopHover = window.matchMedia("(hover: hover) and (pointer: fine)");
const canonicalMenuItems = {
  "/applications/dialogagenter": {
    title: "Communication Agents",
    text: "Resolve work across channels and reduce support load.",
  },
  "/applications/prosessagenter": {
    title: "AI Process Optimization",
    text: "Decision-heavy workflows automated end to end.",
  },
  "/applications/produktagenter": {
    title: "AI-Enabled Products",
    text: "AI embedded directly into your SaaS and platforms.",
  },
};

document.body.classList.toggle("home-page", isHomePage);
document.body.classList.toggle("contact-page", normalizedPath === "/contact");

document.querySelectorAll("[data-current-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

const ensureAgentPlatformLinks = () => {
  if (nav && !nav.querySelector('a[href="/agent-platform"]')) {
    const agentPlatformLink = document.createElement("a");
    agentPlatformLink.href = "/agent-platform";
    agentPlatformLink.textContent = "Agent Platform";
    if (normalizedPath === "/agent-platform") {
      agentPlatformLink.setAttribute("aria-current", "page");
    }

    const servicesLink = nav.querySelector('a[href="/services"]');
    if (servicesLink) {
      servicesLink.insertAdjacentElement("beforebegin", agentPlatformLink);
    } else {
      nav.append(agentPlatformLink);
    }
  }

  document.querySelectorAll(".footer-links").forEach((links) => {
    if (links.querySelector('a[href="/agent-platform"]')) return;

    const agentPlatformLink = document.createElement("a");
    agentPlatformLink.href = "/agent-platform";
    agentPlatformLink.textContent = "Agent Platform";
    if (normalizedPath === "/agent-platform") {
      agentPlatformLink.setAttribute("aria-current", "page");
    }

    const servicesLink = links.querySelector('a[href="/services"]');
    if (servicesLink) {
      servicesLink.insertAdjacentElement("afterend", agentPlatformLink);
    } else {
      links.append(agentPlatformLink);
    }
  });
};

const syncHeaderHeight = () => {
  if (!header) return;
  document.documentElement.style.setProperty(
    "--header-height",
    `${header.offsetHeight}px`
  );
};

const setHeaderLogo = (useDefaultLogo) => {
  if (!headerLogo) return;
  const nextLogo = useDefaultLogo ? DEFAULT_LOGO : INVERTED_LOGO;
  if (headerLogo.getAttribute("src") !== nextLogo) {
    headerLogo.setAttribute("src", nextLogo);
  }
};

const closeDisclosure = (group) => {
  const trigger = group?.querySelector(".nav-trigger");
  const panel = group?.querySelector(".dropdown");
  if (!group || !trigger || !panel) return;
  group.classList.remove("is-open");
  trigger.setAttribute("aria-expanded", "false");
  panel.hidden = true;
};

const openDisclosure = (group) => {
  const trigger = group?.querySelector(".nav-trigger");
  const panel = group?.querySelector(".dropdown");
  if (!group || !trigger || !panel) return;
  group.classList.add("is-open");
  trigger.setAttribute("aria-expanded", "true");
  panel.hidden = false;
};

const cancelScheduledDisclosureClose = (group) => {
  const timer = disclosureCloseTimers.get(group);
  if (timer) {
    window.clearTimeout(timer);
    disclosureCloseTimers.delete(group);
  }
};

const scheduleDisclosureClose = (group, delay = 140) => {
  cancelScheduledDisclosureClose(group);
  const timer = window.setTimeout(() => {
    closeDisclosure(group);
    disclosureCloseTimers.delete(group);
  }, delay);
  disclosureCloseTimers.set(group, timer);
};

const closeAllDisclosures = (exception = null) => {
  navDetails.forEach((group) => {
    if (group === exception) return;
    cancelScheduledDisclosureClose(group);
    closeDisclosure(group);
  });
};

const setHeaderState = () => {
  if (!header) return;
  const useSolidHeader =
    !isHomePage || window.scrollY > 12 || nav?.classList.contains("is-open");
  header.classList.toggle("is-scrolled", useSolidHeader);
  setHeaderLogo(useSolidHeader);
  syncHeaderHeight();
};

const closeMenu = () => {
  if (!nav || !toggle) return;
  nav.classList.remove("is-open");
  header?.classList.remove("is-menu-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open menu");
  document.body.classList.remove("nav-open");
  closeAllDisclosures();
  setHeaderState();
};

const normalizeHeaderMenus = () => {
  document.querySelectorAll(".mega-item").forEach((item) => {
    const href = item.getAttribute("href");
    const canonical = href ? canonicalMenuItems[href] : null;
    if (!canonical) return;

    const title = item.querySelector(".mega-title");
    const text = item.querySelector(".mega-text");

    if (title) {
      title.textContent = canonical.title;
    }

    if (text) {
      text.textContent = canonical.text;
    }
  });
};

normalizeHeaderMenus();
ensureAgentPlatformLinks();

if (nav && !nav.id) {
  nav.id = "site-nav-panel";
}

navDetails.forEach((group, index) => {
  const trigger = group.querySelector(".nav-trigger");
  const panel = group.querySelector(".dropdown");
  if (!trigger || !panel) return;

  if (!panel.id) {
    panel.id = `nav-panel-${index + 1}`;
  }

  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", panel.id);
  trigger.setAttribute("aria-haspopup", "true");
  panel.hidden = true;

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    cancelScheduledDisclosureClose(group);
    const willOpen = !group.classList.contains("is-open");
    closeAllDisclosures(group);

    if (willOpen) {
      openDisclosure(group);
    } else {
      closeDisclosure(group);
    }
  });

  group.addEventListener("pointerenter", () => {
    if (window.innerWidth <= MENU_BREAKPOINT || !prefersDesktopHover.matches) {
      return;
    }
    cancelScheduledDisclosureClose(group);
    closeAllDisclosures(group);
    openDisclosure(group);
  });

  group.addEventListener("pointerleave", (event) => {
    if (window.innerWidth <= MENU_BREAKPOINT || !prefersDesktopHover.matches) {
      return;
    }
    if (panel.contains(event.relatedTarget)) {
      return;
    }
    scheduleDisclosureClose(group);
  });

  panel.addEventListener("pointerenter", () => {
    cancelScheduledDisclosureClose(group);
  });

  panel.addEventListener("pointerleave", () => {
    if (window.innerWidth <= MENU_BREAKPOINT || !prefersDesktopHover.matches) {
      return;
    }
    scheduleDisclosureClose(group, 90);
  });
});

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("load", syncHeaderHeight);

if (toggle && nav) {
  toggle.setAttribute("aria-controls", nav.id);
  toggle.setAttribute("aria-label", "Open menu");

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = nav.classList.toggle("is-open");
    header?.classList.toggle("is-menu-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    if (!isOpen) {
      closeAllDisclosures();
    }
    setHeaderState();
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    syncHeaderHeight();
    if (window.innerWidth > MENU_BREAKPOINT) {
      closeMenu();
    } else {
      setHeaderState();
    }
  });
}

document.addEventListener("click", (event) => {
  if (!header?.contains(event.target)) {
    closeAllDisclosures();
    if (nav?.classList.contains("is-open")) {
      closeMenu();
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  const activeDisclosure = navDetails.find((group) =>
    group.classList.contains("is-open")
  );

  if (activeDisclosure) {
    closeDisclosure(activeDisclosure);
    activeDisclosure.querySelector(".nav-trigger")?.focus();
    return;
  }

  if (nav?.classList.contains("is-open")) {
    closeMenu();
    toggle?.focus();
  }
});

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

const I18N_STRINGS = {
  no: {
    "NeuroSYS home": "NeuroSYS forside",
    Primary: "Hovedmeny",
    Applications: "Applikasjoner",
    "Agent Platform": "Agentplattform",
    "Why Dify": "Hvorfor Dify",
    "AI Process Automation": "AI-prosessautomatisering",
    Services: "Tjenester",
    "Our work": "Vårt arbeid",
    About: "Om oss",
    News: "Nyheter",
    Contact: "Kontakt",
    "Get in touch": "Ta kontakt",
    "Why Dify →": "Hvorfor Dify →",
    Menu: "Meny",
    Discover: "Utforsk",
    Office: "Kontor",
    Email: "E-post",
    Phone: "Telefon",
    "Certifications and partnerships": "Sertifiseringer og partnerskap",
    Solutions: "Løsninger",
    Company: "Selskap",
    "Agent Platform": "Agentplattform",
    Training: "Opplæring",
    "How we deliver": "Slik leverer vi",
    "The foundation behind every delivery":
      "Fundamentet bak hver leveranse",
    "We standardize on Dify - an open source platform you can start on our cloud and move home to your own installation when ready. No license traps, no lock-in.":
      "Vi standardiserer på Dify - en open source plattform dere kan starte på vår sky og flytte hjem til egen installasjon når dere er klare. Ingen lisensfeller, ingen lock-in.",
    "Built on open source": "Bygget på open source",
    "One of the world's leading platforms for AI agents":
      "En av verdens ledende plattformer for AI-agenter",
    "Dify is open source with 10,000+ commits and nearly 20 updates a day from a global community. You stand on a robust, future-proof foundation from day one - and skip the years of in-house engineering it would take to build something close. Start on Neurosys Workflows (our hosted instance) and move to your own cloud or on-prem whenever you want.":
      "Dify er open source med 10 000+ commits og nærmere 20 oppdateringer hver dag fra et globalt fellesskap. Dere står på et robust og fremtidsrettet fundament fra dag én - og slipper de årene med intern utvikling det ville tatt å bygge noe i nærheten. Start på Neurosys Workflows (vår hostede instans) og flytt til egen sky eller on-prem når dere vil.",
    "Dify community proof": "Dify-fellesskapets dekning",
    "GitHub stars": "GitHub-stjerner",
    "10,000+": "10 000+",
    "~20 / day": "~20 / dag",
    "Active development": "Aktiv utvikling",
    "How we use Dify →": "Slik bruker vi Dify →",
    Implementation: "Implementering",
    "How you get started": "Slik kommer dere i gang",
    "2-3 workdays": "2-3 arbeidsdager",
    "1-2 workdays": "1-2 arbeidsdager",
    "Hours to days per use case": "Timer til dager per use case",
    "Setup and configuration of Dify": "Oppsett og konfigurering av Dify",
    "Access to Neurosys Workflows or your own instance is set up":
      "Vi gir tilgang til Neurosys Workflows eller egen instans settes opp",
    "Domain and access configured": "Domene og tilganger konfigureres",
    "API keys to LLM models and systems":
      "Konfigurering av API-nøkler til LLM-modeller og systemer",
    "Training and user onboarding": "Opplæring og onboarding av brukere",
    "Introduction to platform and methodology":
      "Introduksjon til plattform og arbeidsmetodikk",
    "How to build and adjust your own workflows":
      "Hvordan bygge og justere egne arbeidsflyter",
    "Best practice for using AI in your organization":
      "Beste praksis for bruk av AI i virksomheten",
    "Building and scaling workflows": "Bygging og skalering av arbeidsflyter",
    "Start with one concrete workflow": "Starter med én konkret arbeidsflyt",
    "Iterate and adjust based on needs":
      "Itererer og tilpasser basert på behov",
    "Scale to more processes and areas":
      "Skalerer til flere prosesser og områder",
    "From decision to first workflow in production in 1-2 weeks":
      "Fra beslutning til første arbeidsprosess i produksjon på 1-2 uker",
    "What this means": "Hva dette betyr",
    "Low risk": "Lav risiko",
    "Fast learning": "Rask læring",
    "Clear progress": "Tydelig fremdrift",
    "Read more": "Les mer",
    "Read the full story →": "Les hele historien →",
    Stories: "Historier",
    "How teams operationalize AI": "Hvordan team operasjonaliserer AI",
    "Story navigation": "Historie-navigasjon",
    "Previous story": "Forrige historie",
    "Next story": "Neste historie",
    Partnership: "Partnerskap",
    "Industrial AI": "Industriell AI",
    "From pilot fatigue to production-ready AI. One platform for agents, workflows, RAG, evaluation and monitoring.":
      "Fra pilot-trøtthet til produksjonsklar AI. Én plattform for agenter, arbeidsflyter, RAG, evaluering og overvåking.",
    "10,000+ control documents made searchable with a fully local, secure RAG solution that keeps sensitive data in-house.":
      "10 000+ kontrolldokumenter gjort søkbare med en fullt lokal, sikker RAG-løsning som holder sensitive data innenfor virksomheten.",
    "46% of meaningful conversations resolved during pilot - how Jernia automated customer service with a communication agent.":
      "46 % av meningsfulle samtaler løst i piloten - slik automatiserte Jernia kundeservice med en dialogagent.",
    "Turning unstructured media noise into structured intelligence that communication and decision-making teams can act on.":
      "Gjør ustrukturert medie-støy om til strukturert innsikt som kommunikasjons- og beslutningsteam kan handle på.",
    "Our services →": "Våre tjenester →",
    "Client projects →": "Kundeprosjekter →",
    "See our work →": "Se vårt arbeid →",
    "Contact us →": "Kontakt oss →",
    "See what we offer →": "Se hva vi tilbyr →",
    "Get workshop details →": "Få workshop-detaljer →",
    "See workshop details →": "Se workshop-detaljer →",
    "Book a session →": "Book en sesjon →",
    "Shall we grab a coffee?": "Skal vi ta en kaffe?",
    "A short conversation to assess where agentic AI makes sense, and where it doesn’t.":
      "En kort prat for å vurdere hvor agentisk AI gir mening, og hvor det ikke gjør det.",
    "Want to shape a workshop around your team?":
      "Vil dere forme en workshop rundt teamet deres?",
    "We can tailor the session to your team, technical level and operational context.":
      "Vi kan tilpasse økten til teamet deres, teknisk nivå og operative kontekst.",
    "Head of Sales & Partnerships": "Leder for salg og partnerskap",
    Employees: "Ansatte",
    "Years in the market": "År i markedet",
    Certified: "Sertifisert",
    "AWS Partner": "AWS-partner",
    "Microsoft Partner": "Microsoft-partner",
    "Platform partner for agentic AI":
      "Plattformpartner for agentisk AI",
    "Communication Agents": "Dialogagenter",
    "Resolve work across channels and reduce support load.":
      "Løs arbeid på tvers av kanaler og reduser belastningen på support.",
    "AI Process Optimization": "Prosessagenter",
    "Decision-heavy workflows automated end to end.":
      "Beslutningstunge arbeidsflyter automatisert fra start til slutt.",
    "AI-Enabled Products": "Produktagenter",
    "AI embedded directly into your SaaS and platforms.":
      "AI bygget direkte inn i SaaS-løsningene og plattformene deres.",
    "Open menu": "Åpne meny",
    "Close menu": "Lukk meny",
    "We make AI part of how you operate":
      "Vi gjør AI til en del av hvordan dere opererer",
    "Key benefits": "Nokkelfordeler",
    "Full control": "Full kontroll",
    "Predictable cost": "Forutsigbar kost",
    "Ready for production": "Klar for produksjon",
    "Full control. Predictable cost. Ready for production.":
      "Full kontroll. Forutsigbar kost. Klar for produksjon.",
    "Where you can apply agentic workflows":
      "Hvor agentiske arbeidsflyter brukes",
    "Where we apply agentic workflows":
      "Hvor agentiske arbeidsflyter brukes",
    "Across the business": "På tvers av virksomheten",
    "Where agentic workflows fit in": "Hvor agentiske arbeidsflyter passer inn",
    "From growth and service to digital products and operations - the same platform fits very different parts of the business.":
      "Fra vekst og service til digitale produkter og drift - samme plattform passer i svært ulike deler av virksomheten.",
    "Application areas": "Bruksområder",
    "Where can AI create value across the business?":
      "Hvor i virksomheten kan AI skape verdi?",
    "From marketing and sales to service, project delivery, digital touchpoints, and insight.":
      "Fra markedsføring og salg til service, prosjektleveranse, digitale flater og innsikt.",
    "From growth and service to digital products and operational decisions, the same platform logic can support very different parts of the business.":
      "Fra vekst og service til digitale produkter og operative beslutninger kan den samme plattformlogikken støtte svært ulike deler av virksomheten.",
    Growth: "Vekst",
    "Operations & service": "Operasjon og service",
    "Digital products & insight": "Digitale produkter og innsikt",
    "How the platform creates impact":
      "Hvordan plattformen skaper effekt",
    "Three business domains where we repeatedly deliver measurable impact.":
      "Tre forretningsområder der vi gjentatte ganger leverer målbar effekt.",
    "Three business domains where the platform repeatedly creates measurable impact.":
      "Tre forretningsområder der plattformen gjentatte ganger skaper målbar effekt.",
    "The future of work": "Fremtidens arbeid",
    "From testing AI to transforming the business":
      "Fra å teste AI til å transformere virksomheten",
    "An agentic platform brings leadership, IT and operations closer together, so AI becomes part of how the business actually runs.":
      "En agentisk plattform bringer ledelse, IT og operasjon tettere sammen, slik at AI blir en del av hvordan virksomheten faktisk drives.",
    "What the platform helps with": "Hva plattformen hjelper med",
    Connect: "Koble",
    "systems, data sources and work tools in one shared layer.":
      "systemer, datakilder og arbeidsverktøy i ett delt lag.",
    Orchestrate: "Orkestrere",
    "agents and workflows that can reason, act and escalate.":
      "agenter og arbeidsflyter som kan resonnere, handle og eskalere.",
    Govern: "Styre",
    "AI use with approvals, traceability and clear ownership.":
      "AI-bruk med godkjenninger, sporbarhet og tydelig eierskap.",
    Reuse: "Gjenbruke",
    "logic across channels, teams and future product decisions.":
      "logikk på tvers av kanaler, team og fremtidige produktvalg.",
    "Dify workflow builder showing agent orchestration and connected steps":
      "Dify arbeidsflytbygger som viser agentorkestrering og sammenkoblede steg",
    Assistance: "Assistanse",
    Execution: "Utførelse",
    "See how it works →":
      "Se hvordan det virker →",
    "Customer & employee interaction": "Kunde- og medarbeiderdialog",
    Marketing: "Markedsføring",
    "Automate customer dialogue, campaign workflows, and follow-up.":
      "Automatiser kundedialog, kampanjeflyter og oppfølging.",
    Sales: "Salg",
    "Free time in CRM, quoting, and pipeline work with smarter automation.":
      "Frigjør tid i CRM, tilbudsarbeid og pipeline med smartere automatisering.",
    Service: "Service",
    "Improve customer service, case handling, and field operations.":
      "Effektiviser kundeservice, saksbehandling og feltarbeid.",
    "Project delivery": "Prosjektleveranse",
    Delivery: "Leveranser",
    "Keep production, logistics and projects moving with less manual coordination.":
      "Hold produksjon, logistikk og prosjekter i bevegelse med mindre manuell koordinering.",
    "Automate progress, hours, budgets, and invoicing from one place.":
      "Automatiser fremdrift, timer, budsjett og fakturering fra ett sted.",
    "Transport & logistics": "Transport og logistikk",
    "Plan routes, absorb disruptions, and keep customers updated automatically.":
      "Planlegg ruter, absorber avvik, og hold kunden oppdatert automatisk.",
    "Engineering & production": "Prosjekt og produksjon",
    "Project & data": "Prosjekt og data",
    "Free project teams from sourcing, indexing, and validating component data.":
      "Frigjør prosjektteamene fra sourcing, indeksering og validering av komponentdata.",
    Production: "Produksjon",
    "Reduce downtime, changeovers, and manual coordination on the floor.":
      "Reduser stans, omstilling og manuell koordinering på gulvet.",
    "Communication agents": "Dialogagenter",
    "Reduce support load and resolve work across channels by connecting to your systems and data.":
      "Reduser supportbelastning og løs oppgaver på tvers av kanaler ved å koble til systemer og data.",
    "Operational processes": "Operasjonelle prosesser",
    "AI process optimization": "Prosessagenter",
    "Automate decision-heavy workflows and remove bottlenecks across operations.":
      "Automatiser beslutningstunge arbeidsflyter og fjern flaskehalser i driften.",
    "Digital products": "Digitale produkter",
    "AI-enabled products": "Produktagenter",
    "Embed AI into your software to create new value, features, and revenue streams.":
      "Bygg AI inn i programvaren for å skape ny verdi, funksjoner og inntektsstrømmer.",
    "GenAI Training & Workshops": "GenAI-opplæring og workshops",
    "Agentic AI Training & Workshops": "Agentisk AI-opplæring og workshops",
    "Agentic workshops": "Agentisk workshops",
    "Best suited for": "Best egnet for",
    Leadership: "Ledelse",
    Operations: "Operasjon",
    IT: "IT",
    "Best for organizations that need alignment before platform choice, workflow design and implementation.":
      "Best for virksomheter som trenger samkjøring før plattformvalg, arbeidsflytdesign og implementering.",
    "From AI awareness to implementation readiness":
      "Fra AI-forståelse til implementeringsklarhet",
    "Practical, hands-on AI enablement":
      "Praktisk, hands-on AI-trening",
    "Practical introduction to Generative AI combined with workshops focused on your own processes, products and operations.":
      "Praktisk introduksjon til Gen AI og Agentisk AI med fokus på egne prosesser, produkter og drift.",
    "Practical introduction to Gen AI and Agentic AI with focus on your own processes, products and operations.":
      "Praktisk introduksjon til Gen AI og Agentisk AI med fokus på egne prosesser, produkter og drift.",
    "Outcome: shared understanding, concrete ideas, and clear next steps.":
      "Resultat: felles forståelse, konkrete ideer og tydelige neste steg.",
    "Start here": "Start her",
    "Get your teams aligned on real AI use cases":
      "Få teamene samkjørt om reelle AI-bruksområder",
    "A focused workshop where leadership, IT and operations sit at the same table. We work with your real processes and use cases - not slides about what AI could be.":
      "En fokusert workshop der ledelse, IT og operasjon sitter ved samme bord. Vi jobber med deres reelle prosesser og use cases - ikke slides om hva AI kunne vært.",
    "What you walk away with": "Hva dere går derfra med",
    "Concrete use cases prioritized for your business":
      "Konkrete use cases prioritert for virksomheten deres",
    "Shared language across leadership, IT and operations":
      "Felles språk på tvers av ledelse, IT og operasjon",
    "A clear next step - not another report":
      "Et tydelig neste steg - ikke enda en rapport",
    "Book a workshop →": "Book en workshop →",
    "46 % of meaningful conversations resolved during pilot. How Norway's leading hardware retailer automated customer service with an AI communication agent - without increasing headcount.":
      "46 % av meningsfulle samtaler løst i pilotperioden. Hvordan Norges ledende jernvareforhandler automatiserte kundeservice med en AI-dialogagent - uten å øke bemanningen.",
    "10,000+ control documents made searchable with a fully local, secure RAG solution. Operators get instant answers to critical procedures without exposing sensitive data.":
      "10 000+ kontrolldokumenter gjort søkbare med en fullstendig lokal, sikker RAG-løsning. Operatører får umiddelbare svar på kritiske prosedyrer uten å eksponere sensitive data.",
    "Platforms we work with": "Plattformer vi jobber med",
    "We select platforms based on use case, security, autonomy, integration depth, and long-term fit.":
      "Vi velger plattformer basert på brukstilfelle, sikkerhet, autonomi, integrasjonsdybde og langsiktig passform.",
    "Agentic workflows - Dify": "Agentiske arbeidsflyter - Dify",
    "Custom AI logic - LangChain": "Tilpasset AI-logikk - LangChain",
    "Model customization - Hugging Face": "Modelltilpasning - Hugging Face",
    "Production-grade agentic workflows":
      "Produksjonsklare agentiske arbeidsflyter",
    "Strategic partner": "Strategisk partner",
    "Designed for end-to-end AI workflows that connect systems, data, and people in daily operations. Dify supports multi-step reasoning, tool usage, decision points, and human approval flows with strong control over data and integrations.":
      "Utviklet for ende-til-ende AI-arbeidsflyter som kobler systemer, data og mennesker i daglig drift. Dify støtter flertrinns resonnering, verktøybruk, beslutningspunkter og menneskelig godkjenning med sterk kontroll over data og integrasjoner.",
    "Well suited when you need to": "Godt egnet når du trenger å",
    "Automate workflows across multiple systems (ERP, CRM, internal tools)":
      "Automatisere arbeidsflyter på tvers av flere systemer (ERP, CRM, interne verktøy)",
    "Run agents that reason, act, and escalate":
      "Kjøre agenter som resonnerer, handler og eskalerer",
    "Keep humans in the loop where decisions matter":
      "Holde mennesker i loopen der beslutninger betyr noe",
    "Deploy AI in private cloud or regulated environments":
      "Rulle ut AI i privat sky eller regulerte miljøer",
    "Move AI from pilots into daily operations":
      "Flytte AI fra pilot til daglig drift",
    "See the full Agent Platform →":
      "Se hele agentplattformen →",
    "AI as the architecture your organization builds the future on":
      "AI som arkitekturen virksomheten bygger fremtiden på",
    "NeuroSYS combines one of the world’s leading open-source agent platforms with enterprise integration, governance, and operational delivery so AI can run across real processes, not isolated demos.":
      "NeuroSYS kombinerer en av verdens ledende open-source agentplattformer med enterprise-integrasjon, styring og operativ leveranse, slik at AI kan kjøre på tvers av reelle prosesser, ikke isolerte demoer.",
    "We deliver agentic AI on Dify - one of the world's leading open source platforms for AI agents. Start on Neurosys Workflows (our hosted instance) and move to your own cloud or on-prem when you're ready.":
      "Vi leverer agentisk AI på Dify - en av verdens ledende open source-plattformer for AI-agenter. Start på Neurosys Workflows (vår hostede instans) og flytt til egen sky eller on-prem når dere er klare.",
    "Book a platform walkthrough →": "Book en gjennomgang av plattformen →",
    "Book a meeting →": "Book et møte →",
    "Built on": "Bygget på",
    "Built on Dify": "Bygget på Dify",
    "Dify community proof": "Dify-fellesskapets dekning",
    "Who it's for": "Hvem den er for",
    "One platform, three roles working together":
      "Én plattform, tre roller som jobber sammen",
    "AI lands in the business when leadership, IT and operations stop working on it in parallel - and start working on it together.":
      "AI lander i virksomheten når ledelse, IT og operasjon slutter å jobbe med det parallelt - og begynner å jobbe med det sammen.",
    Leadership: "Ledelse",
    "A clear direction for AI": "En tydelig retning for AI",
    "You need to know where AI fits in the strategy, what it costs, what it changes, and how to scale it without losing control.":
      "Dere trenger å vite hvor AI passer i strategien, hva det koster, hva det endrer, og hvordan dere skalerer uten å miste kontrollen.",
    "IT and architects": "IT og arkitekter",
    "Governance, integration and control": "Styring, integrasjon og kontroll",
    "You need a foundation with proper access control, audit trails, and the depth to integrate with the systems already running the business.":
      "Dere trenger et fundament med riktig tilgangsstyring, sporbarhet og nok dybde til å integrere med systemene som allerede driver virksomheten.",
    "Operations and product teams": "Operasjon og produktteam",
    "AI in the work, not on the side": "AI i arbeidet, ikke ved siden av",
    "You need agents that take part in real workflows - drafting, deciding, escalating - so the team gets time back instead of more dashboards.":
      "Dere trenger agenter som tar del i reelle arbeidsflyter - skriver utkast, beslutter, eskalerer - så teamet får tid tilbake istedenfor flere dashboards.",
    "Enterprise-grade": "Enterprise-grade",
    "Built for production, security and scale":
      "Bygget for produksjon, sikkerhet og skala",
    "Dify is designed for organizations that need AI to run reliably across teams - with the deployment options, access control and governance enterprises require.":
      "Dify er designet for organisasjoner som trenger at AI kjører pålitelig på tvers av team - med deployment-alternativene, tilgangsstyringen og governance som enterprise krever.",
    "Flexible deployment": "Fleksibel deployment",
    "On-premises, private cloud or our hosted Neurosys Workflows - move between them as your needs change.":
      "On-prem, privat sky eller vår hostede Neurosys Workflows - flytt mellom dem etter hvert som behovene endrer seg.",
    "Access and identity": "Tilgang og identitet",
    "SSO, multi-tenant access control, role-based permissions and two-step verification built in.":
      "SSO, multi-tenant tilgangsstyring, rollebaserte tillatelser og to-trinns verifisering innebygd.",
    "Data security": "Datasikkerhet",
    "End-to-end encrypted transmission, strict data access control and full audit trails for every action.":
      "Ende-til-ende kryptert overføring, streng datatilgangskontroll og fullstendig sporbarhet for hver handling.",
    "High availability": "Høy oppetid",
    "Production-grade reliability with the infrastructure to handle organization-wide rollout.":
      "Produksjonsklar pålitelighet med infrastrukturen til å håndtere utrulling i hele organisasjonen.",
    "Seamless integration": "Sømløs integrasjon",
    "Connects with the systems already running the business - ERP, CRM, identity, knowledge bases and APIs.":
      "Kobler seg på systemene som allerede driver virksomheten - ERP, CRM, identitet, kunnskapsbaser og API-er.",
    "Compliance and privacy": "Compliance og personvern",
    "Privacy protection and data governance built in - so AI scales without becoming a compliance risk.":
      "Personvern og dataforvaltning innebygd - slik at AI kan skalere uten å bli en compliance-risiko.",
    "Dify workflow canvas showing agent platform orchestration":
      "Dify-arbeidsflyt som viser orkestrering i agentplattformen",
    "Why architecture matters": "Hvorfor arkitektur betyr noe",
    "AI creates the most value when it can operate across the business":
      "AI skaper mest verdi når den kan operere på tvers av virksomheten",
    "The platform determines whether AI stays as isolated pilots or becomes a shared operating layer the organization can actually rely on.":
      "Plattformen avgjør om AI blir værende som isolerte piloter eller blir et felles operativt lag virksomheten faktisk kan stole på.",
    "If AI cannot connect systems, knowledge, approvals, and workflows in one model, it creates more experiments than operational value. The right platform gives you one foundation to scale from.":
      "Hvis AI ikke kan koble sammen systemer, kunnskap, godkjenninger og arbeidsflyter i én modell, skaper den flere eksperimenter enn operativ verdi. Riktig plattform gir dere ett fundament å skalere fra.",
    "Move beyond pilots": "Kom dere videre fra piloter",
    "Reuse the same logic, integrations and governance instead of rebuilding from scratch in every new AI initiative.":
      "Gjenbruk den samme logikken, de samme integrasjonene og den samme styringen i stedet for å bygge alt på nytt i hvert nye AI-initiativ.",
    "Connect real work": "Koble til faktisk arbeid",
    "Let AI operate across business systems, tools and knowledge, not just inside one isolated assistant or interface.":
      "La AI operere på tvers av forretningssystemer, verktøy og kunnskap, ikke bare inne i én isolert assistent eller grensesnitt.",
    "Keep control as you scale": "Behold kontrollen mens dere skalerer",
    "Add approvals, traceability and clear ownership so AI can expand without losing accountability.":
      "Legg inn godkjenninger, sporbarhet og tydelig eierskap slik at AI kan utvides uten at ansvar forsvinner.",
    "Create compounding value": "Skap verdi som bygger på seg selv",
    "Every workflow, agent and improvement builds on the same foundation, so the platform gets stronger over time.":
      "Hver arbeidsflyt, agent og forbedring bygger på det samme fundamentet, slik at plattformen blir sterkere over tid.",
    "The difference between AI experiments and operational value is the platform underneath: how systems, knowledge, tools, governance, and human approvals are connected and scaled.":
      "Forskjellen mellom AI-eksperimenter og operativ verdi ligger i plattformen under: hvordan systemer, kunnskap, verktøy, styring og menneskelige godkjenninger kobles sammen og skaleres.",
    "Tasks and processes that are still handled manually can be automated, connected across systems, and continuously improved. Instead of deploying isolated assistants, you build an operating layer that links work tools, business systems, external sources, and AI models in one multi-agent architecture.":
      "Oppgaver og prosesser som fortsatt håndteres manuelt kan automatiseres, kobles på tvers av systemer og forbedres kontinuerlig. I stedet for å rulle ut isolerte assistenter bygger dere et operativt lag som knytter sammen arbeidsverktøy, forretningssystemer, eksterne kilder og AI-modeller i én multiagent-arkitektur.",
    "Workflow strategy session on a whiteboard":
      "Workshop for arbeidsflytstrategi på whiteboard",
    "What an agent platform is": "Hva en agentplattform er",
    "An agent platform is the shared operating layer that connects systems, knowledge, workflows, and governance so AI can move from pilots to real operations.":
      "En agentplattform er det felles operative laget som kobler sammen systemer, kunnskap, arbeidsflyter og styring, slik at AI kan gå fra piloter til reell drift.",
    "One shared foundation": "Ett felles fundament",
    "Reuse workflows, agents, and automations in one platform instead of rebuilding them in separate tools and pilots.":
      "Gjenbruk arbeidsflyter, agenter og automasjoner i én plattform i stedet for å bygge dem opp på nytt i separate verktøy og piloter.",
    "Connected context": "Tilkoblet kontekst",
    "Let AI work across ERP, CRM, documents, APIs, and internal knowledge in one governed operating model.":
      "La AI jobbe på tvers av ERP, CRM, dokumenter, API-er og intern kunnskap i én styrt operativ modell.",
    "Governance built in": "Styring bygget inn",
    "Add approvals, traceability, and ownership in the same foundation you use to scale new use cases.":
      "Legg inn godkjenninger, sporbarhet og eierskap i det samme fundamentet dere bruker for å skalere nye bruksområder.",
    "Dify workflow canvas showing multi-step orchestration":
      "Dify-arbeidsflyt som viser orkestrering i flere steg",
    "How it works": "Hvordan det fungerer",
    "How it works, step by step": "Hvordan det fungerer, steg for steg",
    "A practical path from fragmented AI ideas to an operational platform.":
      "En praktisk vei fra fragmenterte AI-idéer til en operativ plattform.",
    "Connect systems and knowledge": "Koble sammen systemer og kunnskap",
    "Link the work environment to ERP, CRM, documents, APIs, and other core data sources so agents operate with the right context.":
      "Koble arbeidsmiljøet til ERP, CRM, dokumenter, API-er og andre sentrale datakilder slik at agentene opererer med riktig kontekst.",
    "Orchestrate workflows and agents": "Orkestrer arbeidsflyter og agenter",
    "Build AI-driven processes that can reason, act, call tools, coordinate multiple steps, and hand off across teams or systems.":
      "Bygg AI-drevne prosesser som kan resonnere, handle, bruke verktøy, koordinere flere steg og overføre arbeid på tvers av team eller systemer.",
    "Keep humans where judgment matters":
      "Behold mennesker der vurderingsevne betyr noe",
    "Add approval points, role-based controls, and clear escalation paths so AI supports operations without losing accountability.":
      "Legg inn godkjenningspunkter, rollebaserte kontroller og tydelige eskaleringsløp slik at AI støtter driften uten at ansvar forsvinner.",
    "Monitor, govern, and scale": "Overvåk, styr og skaler",
    "Track usage, outcomes, drift, and quality over time so the platform becomes a continuously improving operational layer.":
      "Følg bruk, resultater, drift og kvalitet over tid slik at plattformen blir et operativt lag som forbedres kontinuerlig.",
    "Dify observability dashboard with usage and performance graphs":
      "Dify observability-dashboard med bruks- og ytelsesgrafer",
    "Why this model works": "Hvorfor denne modellen fungerer",
    "Dify provides the foundation. NeuroSYS makes it work in practice.":
      "Dify gir fundamentet. NeuroSYS får det til å fungere i praksis.",
    "Dify gives the core platform. NeuroSYS helps you connect it to real workflows, systems, and governance - so you can move from pilots to production without rebuilding the foundation for every new use case.":
      "Dify gir kjerneplattformen. NeuroSYS hjelper dere med å koble den til reelle arbeidsflyter, systemer og styring - så dere kan gå fra pilot til produksjon uten å bygge fundamentet på nytt for hvert nye bruksområde.",
    "Together, that makes it easier to move from pilots to production without rebuilding the foundation for every new use case.":
      "Sammen gjør det det enklere å gå fra piloter til produksjon uten å bygge fundamentet på nytt for hvert nye bruksområde.",
    "Open foundation": "Åpent fundament",
    "An open foundation without forced vendor lock-in.":
      "Et åpent fundament uten tvungen vendor lock-in.",
    "Operational rollout": "Operativ utrulling",
    "Strategy, integrations, approvals, and rollout connected in one model.":
      "Strategi, integrasjoner, godkjenninger og utrulling koblet sammen i én modell.",
    "Continuous improvement": "Kontinuerlig forbedring",
    "Improve quality and scale use cases over time as the business evolves.":
      "Forbedre kvalitet og skaler bruksområder over tid i takt med at virksomheten utvikler seg.",
    "Read the Dify partnership story →":
      "Les historien om Dify-partnerskapet →",
    "Workflow strategy planning on a whiteboard":
      "Planlegging av arbeidsflytstrategi på whiteboard",
    "Where the platform creates impact":
      "Hvor plattformen skaper effekt",
    "From customer-facing communication to internal operations and AI-driven products - three areas where the platform turns AI into operational value.":
      "Fra kundedialog til interne operasjoner og AI-drevne produkter - tre områder der plattformen gjør AI til operasjonell verdi.",
    Communication: "Kommunikasjon",
    Operations: "Operasjoner",
    Products: "Produkter",
    "Resolve work across channels with agents grounded in knowledge, policies, and enterprise systems.":
      "Løs arbeid på tvers av kanaler med agenter som er forankret i kunnskap, retningslinjer og enterprise-systemer.",
    "Automate multi-step operational processes that currently move between people, systems, and spreadsheets.":
      "Automatiser operasjonelle prosesser i flere steg som i dag flyter mellom mennesker, systemer og regneark.",
    "Embed the platform logic into customer-facing or internal products that need AI to act, not just answer.":
      "Bygg plattformlogikken inn i kundevendte eller interne produkter som trenger AI som handler, ikke bare svarer.",
    "See the application →": "Se applikasjonen →",
    "Want to see what this looks like in your organization?":
      "Vil dere se hvordan dette kan se ut i virksomheten deres?",
    "We can map the workflows, systems, and governance needs that matter first, then define what the right platform architecture should be.":
      "Vi kan kartlegge arbeidsflytene, systemene og styringsbehovene som betyr mest først, og deretter definere hvordan riktig plattformarkitektur bør se ut.",
    "Composable AI logic & orchestration":
      "Komponerbar AI-logikk og orkestrering",
    "Built for highly customized AI logic and orchestration. LangChain is used when AI must be deeply embedded into existing systems or when full control over logic and execution is required.":
      "Bygget for høyt tilpasset AI-logikk og orkestrering. LangChain brukes når AI må bygges dypt inn i eksisterende systemer eller når full kontroll over logikk og kjøring er nødvendig.",
    "Design custom agent architectures": "Designe tilpassede agentarkitekturer",
    "Embed AI directly into software products":
      "Bygge AI direkte inn i programvareprodukter",
    "Implement advanced or experimental reasoning patterns":
      "Implementere avanserte eller eksperimentelle resonneringsmønstre",
    "Integrate tightly with proprietary systems":
      "Integrere tett med proprietære systemer",
    "Model customization & experimentation": "Modelltilpasning og eksperimentering",
    "Focused on models rather than workflows. Hugging Face supports experimenting with, evaluating, and fine-tuning language models for research-driven or domain-specific initiatives.":
      "Fokusert på modeller fremfor arbeidsflyter. Hugging Face støtter eksperimentering, evaluering og finjustering av språkmodeller for forskningsdrevne eller domenespesifikke initiativer.",
    "Fine-tune or evaluate AI models": "Finjustere eller evaluere AI-modeller",
    "Work with open or domain-specific models":
      "Jobbe med åpne eller domenespesifikke modeller",
    "Build internal model benchmarks": "Bygge interne modellbenchmarker",
    "Retain control at the model level":
      "Beholde kontroll på modellnivå",
    "Workspace-native Communication Agents":
      "Arbeidsflate-native dialogagenter",
    "AI assistance directly inside Docs, Sheets, Gmail, Meet, and Drive. Best for quick productivity gains with minimal setup in Google-centric workflows.":
      "AI-hjelp direkte i Docs, Sheets, Gmail, Meet og Drive. Best for raske produktivitetsgevinster med minimal oppsett i Google-sentrerte arbeidsflyter.",
    "Assist with writing, summarizing, and analysis":
      "Hjelpe med skriving, oppsummering og analyse",
    "Support meetings and documentation":
      "Støtte møter og dokumentasjon",
    "Add AI without changing core workflows":
      "Legge til AI uten å endre kjernearbeidsflyter",
    "Enable fast adoption across teams":
      "Muliggjøre rask adopsjon på tvers av team",
    "Microsoft 365-native copilots":
      "Microsoft 365-native copiloter",
    "Google Workspace Studio": "Google Workspace Studio",
    "Microsoft Copilot Studio": "Microsoft Copilot Studio",
    "Copilots embedded in Microsoft 365. Copilot Studio enables assistants that operate inside Teams, Outlook, SharePoint, and other Microsoft 365 applications.":
      "Copiloter innebygd i Microsoft 365. Copilot Studio muliggjør assistenter som jobber inne i Teams, Outlook, SharePoint og andre Microsoft 365-applikasjoner.",
    "Build assistants grounded in Microsoft 365 data":
      "Bygge assistenter forankret i Microsoft 365-data",
    "Support Teams-based workflows":
      "Støtte Teams-baserte arbeidsflyter",
    "Extend AI using low-code tools":
      "Utvide AI med low-code-verktøy",
    "Keep AI fully within the Microsoft ecosystem":
      "Holde AI fullt ut innenfor Microsoft-økosystemet",
    "AI Business Partner for Nordic Enterprises":
      "AI-partner for nordiske virksomheter",
    "Built for real operations": "Bygget for reell drift",
    "From pilot to production - AI that fits into how your organization actually works.":
      "Fra pilot til produksjon - AI som passer inn i måten organisasjonen din faktisk jobber på.",
    "From pilot to production - AI that fits into how your organization actually works.":
      "Fra pilot til produksjon - AI som passer inn i måten organisasjonen din faktisk jobber på.",
    "The agentic platform removes up to 80% of repetitive tasks, freeing capacity for value creation.":
      "Plattformen fjerner opptil 80 % av repetitive oppgaver og frigjør kapasitet til verdiskaping.",
    "NeuroSYS combines advisory, implementation and long-term operational ownership so AI becomes part of how the business runs, not just something you test on the side.":
      "NeuroSYS kombinerer rådgivning, implementering og langsiktig operativt eierskap, slik at AI blir en del av hvordan virksomheten faktisk drives, ikke bare noe dere tester på siden.",
    "Proof points": "Bevispunkter",
    "potential reduction in repetitive work for the right workflows.":
      "potensiell reduksjon i repetitivt arbeid for de riktige arbeidsflytene.",
    "engineers across AI, data engineering and full-stack delivery.":
      "ingeniører på tvers av AI, data engineering og fullstack-leveranse.",
    "years delivering enterprise-grade software with ISO, AWS and Microsoft partnerships.":
      "år med leveranse av programvare for store virksomheter, med ISO-sertifisering og AWS- og Microsoft-partnerskap.",
    Enterprise: "Enterprise",
    "ISO-certified delivery with AWS and Microsoft partnership depth.":
      "ISO-sertifisert leveranse med sterk AWS- og Microsoft-partnerdybde.",
    "One model": "Én modell",
    "advisory, design, implementation and maintenance in one flow.":
      "rådgivning, design, implementering og vedlikehold i ett samlet løp.",
    "Specialized in operational AI":
      "Spesialisert på operativ AI",
    "We build AI systems that run in daily operations, not just demos and dashboards.":
      "Vi bygger AI-systemer som fungerer i daglig drift, ikke bare demoer og dashbord.",
    "Deep LLM & RAG expertise": "Dyp LLM- og RAG-kompetanse",
    "Orchestration, retrieval, tool calling and multi-step reasoning across enterprise data.":
      "Orkestrering, gjenfinning, verktøykall og flerstegs resonnering på tvers av virksomhetsdata.",
    "100+ engineers": "100+ ingeniører",
    "AI, data engineering and full-stack teams ready to move from pilot to production.":
      "AI, data og fullstack-team klare til å gå fra pilot til produksjon.",
    "Enterprise-grade delivery": "Leveranse for store virksomheter",
    "ISO certified. AWS and Microsoft partner. Built for security, compliance and scale.":
      "ISO-sertifisert. AWS- og Microsoft-partner. Bygget for sikkerhet, etterlevelse og skalering.",
    "We combine advisory, design and implementation into one engagement model.":
      "Vi kombinerer rådgivning, design og implementering i én leveransemodell.",
    "See how we work →": "Se hvordan vi jobber →",
    Services: "Tjenester",
    "Your platform partner and delivery team for agentic AI":
      "Plattformpartneren og leveranseteamet ditt for agentisk AI",
    "We are a Dify partner who builds, runs and evolves agentic AI together with Nordic enterprises - and bring the team needed at every step, from first workshop to AI in production.":
      "Vi er Dify-partneren som bygger, drifter og videreutvikler agentisk AI sammen med nordiske virksomheter - og stiller med teamet som trengs hele veien, fra første workshop til AI i drift.",
    "Book a coffee →": "Ta en kaffe med oss →",
    "See what we offer ↓": "Se hva vi tilbyr ↓",
    "What we offer": "Det vi tilbyr",
    "How we work with our clients": "Slik jobber vi med kundene våre",
    "Three connected ways to engage NeuroSYS - as your agentic platform partner, as senior specialists embedded in your teams, or as a delivery team that takes a full project from idea to running production. Many clients combine them under one relationship.":
      "Tre tett koblede måter å engasjere NeuroSYS på - som agentisk plattformpartner, som seniorspesialister i teamene deres, eller som leveranseteam som tar et helt prosjekt fra idé til AI i drift. Mange kunder kombinerer dem i ett samarbeid.",
    "Strategic Dify partner · End-to-end":
      "Strategisk Dify-partner · Ende-til-ende",
    "Agentic AI": "Agentisk AI",
    "Our flagship engagement, and the heart of what we do. As your Dify partner, we put agentic AI into operation end-to-end - from advisory and platform setup to building workflows and running them long-term, alongside your team.":
      "Vår viktigste leveranse, og kjernen i det vi gjør. Som deres Dify-partner setter vi agentisk AI i drift ende-til-ende - fra rådgivning og plattformoppsett til å bygge arbeidsflyter og drifte dem langsiktig, sammen med teamet deres.",
    Advisory: "Rådgivning",
    "Strategy, governance and use case prioritization":
      "Strategi, styring og prioritering av bruksområder",
    Implementation: "Implementering",
    "Platform setup, integrations and workflows in production":
      "Plattformoppsett, integrasjoner og arbeidsflyter i produksjon",
    Operations: "Forvaltning",
    "Hosting, monitoring, updates and continuous improvement":
      "Hosting, overvåking, oppdateringer og kontinuerlig forbedring",
    "Explore the agent platform →": "Utforsk agentplattformen →",
    "See workshops & pricing ↓": "Se workshops og priser ↓",
    "See pricing & hosting ↓": "Se pris og hosting ↓",
    "~15 specialists in client teams · NO + PL":
      "~15 spesialister i kundeteam · NO + PL",
    "Embedded experts": "Eksperter i teamet deres",
    "Senior developers, architects and AI specialists who step into your team and build alongside your people - from Norway and Poland.":
      "Erfarne utviklere, arkitekter og AI-spesialister som går inn i teamet deres og bygger sammen med folkene deres - fra Norge og Polen.",
    "Developers and senior engineers":
      "Utviklere og seniorutviklere",
    "Architects and tech leads": "Arkitekter og tech leads",
    "AI and ML competence on demand":
      "AI- og ML-kompetanse på forespørsel",
    "100+ experts · A-to-Z delivery":
      "100+ eksperter · Levering fra A til Å",
    "Project deliveries": "Prosjektleveranser",
    "Complete delivery teams that take projects from first idea to running production - including custom ML, deep learning and computer vision when the use case calls for it.":
      "Komplette leveranseteam som tar prosjekter fra første idé til AI i drift - inkludert skreddersydd ML, dyp læring og datasyn når brukstilfellet krever det.",
    "Project management and delivery":
      "Prosjektledelse og leveranse",
    "Solution design and architecture":
      "Løsningsdesign og arkitektur",
    "System and product development":
      "System- og produktutvikling",
    "Talk to us →": "Snakk med oss →",
    Workshops: "Workshops",
    "Where most of our journeys begin":
      "Der de fleste reisene våre starter",
    "A workshop is the easiest way to get leadership, IT and operations aligned on what agentic AI could mean for you. Start with a free executive briefing, or go deeper with a multi-day acceleration program - both led by our seniormost team.":
      "En workshop er den enkleste måten å få ledelsen, IT og drift på linje rundt hva agentisk AI kan bety for dere. Start med en gratis lederbriefing, eller gå dypere med et flerdagers akselerasjonsprogram - begge ledet av vårt mest erfarne team.",
    Free: "Gratis",
    "NOK 19,500 / day": "19 500 NOK / dag",
    "AI Executive Workshop": "AI Executive Workshop",
    "1 day · 2 senior experts": "1 dag · 2 senior eksperter",
    "Understand agentic AI workflows":
      "Forstå agentiske AI-arbeidsflyter",
    "What it means for your organization":
      "Hva det betyr for organisasjonen",
    "Governance and structure to get started":
      "Styring og struktur for å komme i gang",
    "Book the workshop →": "Bestill workshopen →",
    "AI Platform Acceleration": "AI Platform Acceleration",
    "2-5 days · 2 senior experts": "2-5 dager · 2 senior eksperter",
    "Plan a program →": "Planlegg et program →",
    "AI roadmap and prioritization":
      "AI-roadmap og prioritering",
    "Train-the-trainer for internal teams":
      "Train-the-trainer for interne team",
    "Strategic clarifications and architecture choices":
      "Strategiske avklaringer og arkitekturvalg",
    "Agentic AI · Workshops": "Agentisk AI · Workshops",
    "Agentic AI · Hosting and pricing": "Agentisk AI · Hosting og priser",
    "Hosting and pricing": "Hosting og priser",
    "The platform runs where it suits you":
      "Plattformen kjører der det passer dere",
    "Most clients run on our managed Nordic platform - ISO 27001 certified, GDPR-aligned and operated for production from day one. When data residency, regulatory or integration requirements call for it, we install the same platform inside your own cloud or on-premise.":
      "De fleste kundene kjører på vår administrerte nordiske plattform - ISO 27001-sertifisert, GDPR-tilpasset og driftet for produksjon fra dag én. Når datalokasjon, regulatoriske eller integrasjonskrav tilsier det, installerer vi den samme plattformen i deres egen sky eller on-premise.",
    "Hosted by us · Recommended start":
      "Hostet av oss · Anbefalt start",
    "Neurosys Workflows": "Neurosys Workflows",
    "Live in minutes on a fully managed Nordic platform. Hosting, operations, monitoring, updates, backup and support included.":
      "Live på minutter på en fullt administrert nordisk plattform. Hosting, drift, overvåking, oppdateringer, backup og brukerstøtte er inkludert.",
    Starter: "Starter",
    Scale: "Scale",
    "Up to 3 workflows · 1 GB storage":
      "Inntil 3 arbeidsflyter · 1 GB lagring",
    "Up to 10 workflows · 5 GB storage":
      "Inntil 10 arbeidsflyter · 5 GB lagring",
    "Up to 20 workflows · 10 GB storage":
      "Inntil 20 arbeidsflyter · 10 GB lagring",
    "NOK 3,900 / mo": "3 900 NOK / mnd",
    "NOK 9,900 / mo": "9 900 NOK / mnd",
    "NOK 16,900 / mo": "16 900 NOK / mnd",
    "LLM/API usage billed at cost + 20% with monthly transparency.":
      "LLM/API-forbruk faktureres til kost + 20 % med månedlig rapportering.",
    "Plans assume": "Prisene forutsetter",
    "normal operations": "normal drift",
    "- typical data volumes and request rates.":
      "- typiske datamengder og forespørselsrater.",
    "Your environment · Enterprise":
      "Eget miljø · Enterprise",
    "Own installation": "Egen installasjon",
    "Run the platform inside your own perimeter when security, data residency or scale requires it.":
      "Kjør plattformen innenfor egen perimeter når sikkerhet, datalagring eller skala krever det.",
    "Neurosys Cloud": "Neurosys Cloud",
    "Dedicated cloud install in your tenant - set up and operated by us.":
      "Dedikert sky-installasjon i deres tenant - satt opp og driftet av oss.",
    "On-premise": "On-premise",
    "Inside your data center - set up by us or your team.":
      "I deres datasenter - satt opp av oss eller deres team.",
    "Pricing by agreement based on scale, support level and Dify edition (community or enterprise).":
      "Pris etter avtale basert på skala, supportnivå og Dify-utgave (community eller enterprise).",
    "Discuss your setup →": "Snakk med oss om oppsett →",
    "Workflow development": "Arbeidsflyt-utvikling",
    "First workflow live in 1-5 working days":
      "Første arbeidsflyt i produksjon på 1-5 arbeidsdager",
    "A workflow is an AI-driven business process with its own rules, logic, integrations and output.":
      "En arbeidsflyt er en AI-drevet arbeidsprosess med egne regler, logikk, integrasjoner og output.",
    "Examples:": "Eksempler:",
    "chatbot, integration, document analysis, text classification, lead qualification, text generation, data analysis.":
      "chatbot, integrasjon, dokumentanalyse, tekstklassifisering, lead-kvalifisering, tekstgenerering, dataanalyse.",
    "NOK 12,900": "12 900 NOK",
    "per workday · typical workflow 1-5 days":
      "per arbeidsdag · typisk arbeidsflyt 1-5 dager",
    "Working together": "Slik jobber vi sammen",
    "From first conversation to running production":
      "Fra første samtale til AI i drift",
    "Most engagements move through these four phases - whether you start with a single workflow or a long-term platform rollout, we walk it together with your team.":
      "De fleste samarbeid går gjennom disse fire fasene - enten dere starter med én arbeidsflyt eller en langsiktig plattform-utrulling, går vi det sammen med teamet deres.",
    Discover: "Avdekke",
    "Map current state, opportunities and constraints. Align stakeholders on what's worth building first.":
      "Kartlegg dagens situasjon, muligheter og begrensninger. Få interessentene på linje om hva som er verdt å bygge først.",
    Design: "Designe",
    "Translate ideas into concrete blueprints with scope, integrations, ROI hypothesis and success metrics.":
      "Oversett ideer til konkrete blueprints med omfang, integrasjoner, ROI-hypotese og suksessmetrikker.",
    Build: "Bygge",
    "Implementation in your environment - integrated, secure and production-ready from day one.":
      "Implementering i deres miljø - integrert, sikker og produksjonsklar fra dag én.",
    Operate: "Drifte",
    "Monitor quality, iterate based on usage and scale to more workflows over time.":
      "Overvåk kvalitet, iterer basert på bruk og skaler til flere arbeidsflyter over tid.",
    "Why NeuroSYS": "Hvorfor NeuroSYS",
    "Built to deliver AI in production - not slides":
      "Bygget for å levere AI i produksjon - ikke slides",
    "We don't just advise on AI. We build, deploy and operate production-grade systems for Nordic enterprises.":
      "Vi gir ikke bare råd om AI. Vi bygger, ruller ut og drifter produksjonsklare systemer for nordiske virksomheter.",
    "Communication agents, workflow automation and embedded product intelligence - AI that runs in daily operations, not research shelves or disconnected proofs of concept.":
      "Dialogagenter, arbeidsflytautomasjon og innebygd produktintelligens - AI som kjører i daglig drift, ikke forskningshyller eller løsrevne konseptbevis.",
    "100+ engineers across the full AI stack":
      "100+ ingeniører på tvers av hele AI-stacken",
    "LLM orchestration, RAG, ML and deep learning, full-stack engineering - one multidisciplinary team that covers model, data and product.":
      "LLM-orkestrering, RAG, ML og dyp læring, fullstack-utvikling - ett tverrfaglig team som dekker modell, data og produkt.",
    "ISO certified. AWS and Microsoft partner. We deliver and operate at enterprise scale with security, governance and compliance built in from day one.":
      "ISO-sertifisert. AWS- og Microsoft-partner. Vi leverer og drifter i enterprise-skala med sikkerhet, styring og etterlevelse fra dag én.",
    "The agent platform removes up to 80% of repetitive tasks - so teams can spend their time on the work that actually creates value.":
      "Agentplattformen fjerner opp til 80 % av repetitive oppgaver - så teamene kan bruke tiden sin på arbeidet som faktisk skaper verdi.",
    "A short conversation to figure out which engagement fits where you are - workshop, platform delivery, custom AI or operations.":
      "En kort samtale for å finne ut hvilken leveranse som passer der dere er - workshop, plattform-leveranse, skreddersydd AI eller drift.",
    "For agentic AI we deliver primarily on Dify - one of the world's leading open source platforms for AI agents. For custom AI engineering we use LangChain, Hugging Face, TensorFlow, PyTorch and the major cloud AI services (AWS, Azure). Platform selection depends on your use case, security requirements and integration needs.":
      "For agentisk AI leverer vi primært på Dify - en av verdens ledende open source-plattformer for AI-agenter. For skreddersydd AI-utvikling bruker vi LangChain, Hugging Face, TensorFlow, PyTorch og de store sky-AI-tjenestene (AWS, Azure). Valg av plattform avhenger av bruksområde, sikkerhetskrav og integrasjonsbehov.",
    "What makes us different": "Det som gjør oss annerledes",
    "We don't just advise on AI - we build, deploy and operate production-grade systems.":
      "Vi gir ikke bare råd om AI - vi bygger, drifter og kjører produksjonsklare systemer.",
    "We focus on AI that runs in daily business operations - communication agents, workflow automation and embedded product intelligence. Not research projects or disconnected proofs of concept.":
      "Vi fokuserer på AI som kjører i daglig drift - dialogagenter, arbeidsflytautomasjon og innebygd produktintelligens. Ikke forskningsprosjekter eller løsrevne konseptbevis.",
    "Our teams have hands-on experience with LLM orchestration, retrieval-augmented generation, tool calling and multi-step reasoning across complex enterprise data environments.":
      "Teamene våre har praktisk erfaring med LLM-orkestrering, RAG, verktøykall og flerstegs resonnering i komplekse datamiljøer.",
    "100+ engineers across AI, data & full-stack":
      "100+ ingeniører innen AI, data og fullstack",
    "A multidisciplinary team that covers the full stack - from model tuning and data pipelines to production infrastructure and front-end interfaces.":
      "Et tverrfaglig team som dekker hele stacken - fra modelltilpasning og datapipelines til produksjonsinfrastruktur og brukergrensesnitt.",
    "Enterprise-grade delivery & operations":
      "Leveranse og drift for store virksomheter",
    "ISO certified. AWS and Microsoft partner. We deliver and operate systems at enterprise scale with security, governance and compliance built in from day one.":
      "ISO-sertifisert. AWS- og Microsoft-partner. Vi leverer og drifter systemer i stor skala med sikkerhet, styring og etterlevelse fra dag én.",
    "The agentic platform removes up to 80% of repetitive tasks, freeing capacity for value creation across the organization.":
      "Plattformen fjerner opptil 80 % av repetitive oppgaver og frigjør kapasitet til verdiskaping i hele organisasjonen.",
    "Pilot to production, fast": "Fra pilot til produksjon, raskt",
    "We build right from the start so pilots can go into production without rebuilding. Identify, test and realize AI-driven business opportunities before committing a large investment.":
      "Vi bygger riktig fra start slik at piloter kan gå rett i produksjon. Identifiser, test og realiser AI-drevne muligheter før dere forplikter en stor investering.",
    "Frequently asked questions": "Ofte stilte spørsmål",
    FAQ: "FAQ",
    "Questions we often hear": "Spørsmål vi ofte får",
    "Short answers on engagement, pricing, security and how we work with your team.":
      "Korte svar på engasjement, pris, sikkerhet og hvordan vi jobber sammen med teamet ditt.",
    "How do we get started?": "Hvordan kommer vi i gang?",
    "Most engagements start with either a free AI Introduction workshop to align on opportunities, or a focused discovery call to scope a first workflow. From there we propose a clear plan: timeline, deliverables and pricing. No long sales process.":
      "De fleste engasjementer starter enten med en gratis AI Introduksjon-workshop for å samkjøre om muligheter, eller en fokusert oppdagelsessamtale for å skopere en første arbeidsflyt. Derfra foreslår vi en tydelig plan: tidslinje, leveranser og pris. Ingen lang salgsprosess.",
    "How do you price your work?": "Hvordan priser dere arbeidet?",
    "Workshops are fixed price (free Introduction, NOK 19,500/day for Executive and Platform Acceleration). Workflow development runs at NOK 12,900 per workday. Larger implementations and embedded expert engagements are scoped per engagement based on team size and duration.":
      "Workshops har fastpris (gratis Introduksjon, NOK 19 500/dag for Executive og Platform Acceleration). Arbeidsflyt-utvikling går for NOK 12 900 per arbeidsdag. Større implementeringer og leveranser med innleide spesialister skoperes per engasjement basert på teamstørrelse og varighet.",
    "What counts as a workflow toward my plan?":
      "Hva regnes som en arbeidsflyt mot planen min?",
    "Only workflows in active production - the ones you have published - count toward the limit in your plan. Drafts, test versions and unpublished work are free, so your team can iterate as much as they need before going live.":
      "Kun arbeidsflyter i aktiv produksjon - de dere har publisert - telles mot grensen i planen deres. Utkast, testversjoner og upublisert arbeid er gratis, så teamet deres kan jobbe så mye de vil før dere går live.",
    "What does \"normal operations\" mean for the hosted plans?":
      "Hva betyr \"normal drift\" for de hostede planene?",
    "Each Neurosys Workflows plan is priced for typical day-to-day use of the included workflows - normal request volumes, integrations and data processing. Storage is included per tier: Starter 1 GB, Growth 5 GB and Scale 10 GB, sized for production logs, knowledge bases and document handling at typical volumes. If a workflow needs unusually high request rates, very large knowledge bases or specialized infrastructure, we agree on a fair top-up before go-live so there are no surprises on the invoice.":
      "Hver Neurosys Workflows-plan er priset for typisk daglig bruk av arbeidsflytene som inngår - normalt antall forespørsler, integrasjoner og databehandling. Lagring er inkludert per nivå: Starter 1 GB, Growth 5 GB og Scale 10 GB, dimensjonert for produksjonslogger, kunnskapsbaser og dokumenthåndtering ved typiske volumer. Hvis en arbeidsflyt krever uvanlig høye forespørselsrater, svært store kunnskapsbaser eller spesialisert infrastruktur, avtaler vi et rimelig påslag før go-live - så det ikke kommer overraskelser på fakturaen.",
    "How do you handle data security and compliance?": "Hvordan håndterer dere datasikkerhet og compliance?",
    "We are ISO 27001 certified and operate Dify either in our managed Nordic cloud or fully on-premise inside your environment. Data stays within your boundaries, role-based access and audit logging are built in, and we work with you on GDPR, sector-specific requirements and internal governance from day one.":
      "Vi er ISO 27001-sertifisert og drifter Dify enten i vår administrerte nordiske sky eller fullstendig on-premise i deres miljø. Data forblir innenfor deres grenser, rollebasert tilgang og revisjonslogger er innebygget, og vi jobber med dere på GDPR, bransjespesifikke krav og intern styring fra dag én.",
    "Can you scale across multiple business areas or entities?": "Kan dere skalere på tvers av flere forretningsområder eller selskap?",
    "Yes. The platform is built for shared workflows, governance and reuse across teams, departments and entities. We typically start with one high-value workflow, then standardize patterns, knowledge bases and integrations so additional business areas can launch faster on the same foundation.":
      "Ja. Plattformen er bygget for delte arbeidsflyter, styring og gjenbruk på tvers av team, avdelinger og selskap. Vi starter typisk med én arbeidsflyt med høy verdi, og standardiserer deretter mønstre, kunnskapsbaser og integrasjoner slik at flere forretningsområder kan lanseres raskere på samme fundament.",
    "How do you measure ROI on an AI initiative?": "Hvordan måler dere ROI på et AI-initiativ?",
    "We define success metrics together up front - cycle time, manual hours saved, resolution rate, error reduction or revenue impact - and instrument the workflow to track them. Most clients see measurable results within the first deployment, with up to 80% of repetitive tasks removed over time.":
      "Vi definerer suksesskriterier sammen fra start - syklustid, sparte manuelle timer, løsningsgrad, feilreduksjon eller inntektseffekt - og instrumenterer arbeidsflyten for å måle dem. De fleste kunder ser målbare resultater innen første utrulling, med opptil 80 % av repetitive oppgaver fjernet over tid.",
    "What does NeuroSYS do?": "Hva gjør NeuroSYS?",
    "NeuroSYS designs, builds and operates production-grade AI systems for Nordic enterprises. We specialize in agentic AI - communication agents, process optimization and AI-enabled products - combining advisory, solution design, implementation and long-term support in one engagement.":
      "NeuroSYS designer, bygger og drifter produksjonsklare AI-systemer for nordiske virksomheter. Vi spesialiserer oss på agentisk AI - dialogagenter, prosessagenter og produktagenter - og kombinerer rådgivning, løsningsdesign, implementering og langsiktig støtte i ett oppdrag.",
    "What is an agentic AI workflow?": "Hva er en agentisk AI-arbeidsflyt?",
    "An agentic AI workflow is an AI system that can reason, make decisions and take actions across multiple tools and data sources. Unlike simple chatbots, agentic workflows connect to your existing systems (ERP, CRM, documents), follow multi-step logic and escalate to humans when needed.":
      "En agentisk AI-arbeidsflyt er et AI-system som kan resonnere, ta beslutninger og handle på tvers av flere verktøy og datakilder. I motsetning til enkle chatboter kobler agentiske arbeidsflyter seg til eksisterende systemer (ERP, CRM, dokumenter), følger flertrinnslogikk og eskalerer til mennesker ved behov.",
    "How long does a typical AI project take?": "Hvor lang tid tar et typisk AI-prosjekt?",
    "A focused pilot typically takes 4-8 weeks, covering scope definition, integration, testing and evaluation. Production deployments follow in subsequent phases. We build pilots that are production-ready from day one, so you don't need to rebuild when scaling.":
      "En fokusert pilot tar vanligvis 4-8 uker, inkludert omfangsdefinisjon, integrasjon, testing og evaluering. Produksjonsinnføring følger i påfølgende faser. Vi bygger piloter som er produksjonsklare fra dag én, så dere slipper å bygge på nytt ved skalering.",
    "Do I need to have AI expertise in my organization?": "Må jeg ha AI-kompetanse i organisasjonen min?",
    "No. We provide training and workshops to build shared understanding across your teams. Our engagement model covers everything from strategy and design to implementation and operations, so your team can focus on the business outcomes.":
      "Nei. Vi tilbyr opplæring og workshops for å bygge felles forståelse på tvers av teamene. Vår leveransemodell dekker alt fra strategi og design til implementering og drift, slik at teamet ditt kan fokusere på forretningsresultatene.",
    "Which platforms and technologies do you use?": "Hvilke plattformer og teknologier bruker dere?",
    "For agentic AI we deliver primarily on Dify - one of the world's leading open source platforms for AI agents. For custom AI engineering we use LangChain, Hugging Face, TensorFlow, PyTorch and the major cloud AI services (AWS, Azure). Platform selection depends on your use case, security requirements and integration needs.":
      "For agentisk AI leverer vi primært på Dify - en av verdens ledende open source-plattformer for AI-agenter. For skreddersydd AI-engineering bruker vi LangChain, Hugging Face, TensorFlow, PyTorch og de største sky-AI-tjenestene (AWS, Azure). Plattformvalget avhenger av brukstilfellet, sikkerhetskrav og integrasjonsbehov.",
    "What is a communication agent?": "Hva er en dialogagent?",
    "A communication agent is an AI system that handles customer and employee interactions across channels like chat, email and phone. Unlike traditional chatbots, it connects to your business systems, looks up data, completes tasks and involves humans only when needed.":
      "En dialogagent er et AI-system som håndterer kunde- og ansattinteraksjoner på tvers av kanaler som chat, e-post og telefon. I motsetning til tradisjonelle chatboter kobler den seg til forretningssystemene, slår opp data, fullfører oppgaver og involverer mennesker kun ved behov.",
    "How is this different from a chatbot?": "Hvordan er dette forskjellig fra en chatbot?",
    "A chatbot follows scripted flows and answers predefined questions. A communication agent reasons over live data, calls tools, resolves multi-step requests and learns from context. It works across systems rather than within a single interface.":
      "En chatbot følger skriptede flyter og svarer på forhåndsdefinerte spørsmål. En dialogagent resonnerer over sanntidsdata, kaller verktøy, løser flertrinnsforespørsler og lærer av kontekst. Den jobber på tvers av systemer i stedet for innenfor ett enkelt grensesnitt.",
    "What channels can a communication agent handle?": "Hvilke kanaler kan en dialogagent håndtere?",
    "Communication agents work across web chat, email, phone, internal tools and messaging platforms. They use one shared knowledge base and logic layer, so customers and employees get consistent answers regardless of channel.":
      "Dialogagenter fungerer på tvers av nettprat, e-post, telefon, interne verktøy og meldingsplattformer. De bruker en felles kunnskapsbase og logikklag, slik at kunder og ansatte får konsistente svar uansett kanal.",
    "How do you measure the value of a communication agent?": "Hvordan måler dere verdien av en dialogagent?",
    "We measure resolution rate (how many requests the agent completes without human help), response time, customer satisfaction and support cost reduction. In pilot projects, we typically see 40-60% of meaningful conversations resolved autonomously.":
      "Vi måler løsningsgrad (hvor mange henvendelser agenten fullfører uten menneskelig hjelp), svartid, kundetilfredshet og kostnadsreduksjon for support. I pilotprosjekter ser vi typisk at 40-60 % av meningsfulle samtaler løses autonomt.",
    "What is AI process optimization?": "Hva er prosessagenter?",
    "AI process optimization uses agentic AI workflows to automate decision-heavy tasks across operations, back-office and production. The AI connects to your existing systems, reasons over data and takes action - with human approval where it matters.":
      "Prosessagenter bruker agentiske AI-arbeidsflyter til å automatisere beslutningstunge oppgaver på tvers av drift, back-office og produksjon. Agenten kobler seg til eksisterende systemer, resonnerer over data og handler - med menneskelig godkjenning der det betyr noe.",
    "What types of processes can be optimized?": "Hvilke typer prosesser kan optimaliseres?",
    "Common use cases include incident triage, supply chain exception handling, finance and case routing, quality control, production support and back-office automation. Any process with repetitive decisions across multiple systems is a candidate.":
      "Vanlige brukstilfeller inkluderer hendelsestriage, unntakshåndtering i forsyningskjeden, finans- og sakshåndtering, kvalitetskontroll, produksjonsstøtte og back-office-automatisering. Enhver prosess med repetitive beslutninger på tvers av flere systemer er en kandidat.",
    "How much can AI process optimization reduce manual work?": "Hvor mye kan prosessagenter redusere manuelt arbeid?",
    "Our agentic platform removes up to 80% of repetitive tasks. The actual reduction depends on the process complexity and the level of system integration, but most organizations see significant capacity freed for value creation within the first deployment.":
      "Vår agentiske plattform fjerner opptil 80 % av repetitive oppgaver. Den faktiske reduksjonen avhenger av prosessens kompleksitet og graden av systemintegrasjon, men de fleste organisasjoner ser betydelig kapasitet frigjort til verdiskaping innen første utrulling.",
    "Does the AI replace people?": "Erstatter AI-en mennesker?",
    "No. The AI handles routine, repetitive parts of workflows so people can focus on decisions that require judgment, creativity and relationships. Humans stay in the loop for exceptions and high-stakes decisions.":
      "Nei. AI-en håndterer rutinepregede, repetitive deler av arbeidsflyter slik at mennesker kan fokusere på beslutninger som krever skjønn, kreativitet og relasjoner. Mennesker forblir i loopen for unntak og viktige beslutninger.",
    "Who is the GenAI training for?": "Hvem er GenAI-opplæringen for?",
    "Who is the Agentic AI training for?":
      "Hvem er den agentiske AI-opplæringen for?",
    "The training is for leadership teams, product owners, developers and operational staff who want to understand how generative AI applies to their work. No prior AI experience is required.":
      "Opplæringen er for ledergrupper, produkteiere, utviklere og driftspersonell som vil forstå hvordan generativ AI gjelder for arbeidet deres. Ingen tidligere AI-erfaring er nødvendig.",
    "The training is for leadership teams, product owners, developers and operational staff who want to understand how agentic AI applies to their work. No prior AI experience is required.":
      "Opplæringen er for ledergrupper, produkteiere, utviklere og driftspersonell som vil forstå hvordan agentisk AI gjelder for arbeidet deres. Ingen tidligere AI-erfaring er nødvendig.",
    "What do participants learn?": "Hva lærer deltakerne?",
    "Participants learn how large language models work, what agentic AI can and cannot do, how to identify real use cases in their organization, and how to evaluate AI readiness. The workshops include hands-on exercises with real tools.":
      "Deltakerne lærer hvordan store språkmodeller fungerer, hva agentisk AI kan og ikke kan gjøre, hvordan de identifiserer reelle brukstilfeller i organisasjonen, og hvordan de vurderer AI-modenhet. Workshopene inkluderer praktiske øvelser med reelle verktøy.",
    "How long is a typical workshop?": "Hvor lang er en typisk workshop?",
    "A standard workshop runs one full day. We also offer half-day executive briefings and multi-day deep-dive programs depending on your team's needs and technical level.":
      "En standard workshop varer en hel dag. Vi tilbyr også halvdags lederbriefer og flerdagers dybdeprogrammer avhengig av teamets behov og tekniske nivå.",
    "Can the training be customized for our industry?": "Kan opplæringen tilpasses vår bransje?",
    "Yes. We tailor content to your industry, systems and operational context. This includes using your own data examples and mapping AI opportunities specific to your value chain.":
      "Ja. Vi tilpasser innholdet til bransjen, systemene og den operasjonelle konteksten. Dette inkluderer bruk av egne dataeksempler og kartlegging av AI-muligheter spesifikt for verdikjeden.",
    "What customers say": "Det kundene sier",
    "Head of Productivity": "Leder for produktivitet",
    "Commercial Director": "Kommersiell direktør",
    "NeuroSYS Services": "NeuroSYS tjenester",
    "AI advisory, design & implementation":
      "AI-rådgivning, design og implementering",
    "We help organizations move from scattered AI experiments to production-ready agents, workflows and AI-enabled products.":
      "Vi hjelper virksomheter å gå fra spredte AI-eksperimenter til produksjonsklare agenter, arbeidsflyter og produktagenter.",
    "What we help you with": "Dette hjelper vi deg med",
    "Decide where AI truly matters":
      "Bestem hvor AI virkelig betyr noe",
    "Strategy, governance and prioritization - so agents and automation solve real problems, not interesting ones.":
      "Strategi, governance og prioritering - slik at agenter og automatisering løser reelle problemer, ikke bare interessante.",
    "Turn priorities into working systems":
      "Gjør prioriteringer til fungerende systemer",
    "We design and build communication agents, workflows and AI-enabled products that fit your environment.":
      "Vi designer og bygger dialogagenter, arbeidsflyter og produktagenter som passer ditt miljø.",
    "Keep AI reliable as reality changes":
      "Hold AI pålitelig når virkeligheten endrer seg",
    "Monitoring, iteration and operational ownership - so AI keeps delivering value over time.":
      "Overvåking, iterasjon og operasjonelt eierskap - slik at AI fortsetter å levere verdi over tid.",
    "Why this approach works": "Hvorfor denne tilnærmingen fungerer",
    "What we often see": "Det vi ofte ser",
    "Isolated pilots": "Isolerte piloter",
    "Tool-driven decisions": "Verktøydrevne beslutninger",
    "AI owned by IT alone": "AI eid av IT alene",
    "No clear impact metrics": "Ingen tydelige effektmål",
    "How we work": "Slik jobber vi",
    "Business-anchored priorities": "Forretningsforankrede prioriteringer",
    "Systems built around workflows":
      "Systemer bygget rundt arbeidsflyter",
    "Shared ownership": "Felles eierskap",
    "Impact measured before scaling":
      "Effekt målt før skalering",
    "How we deliver value": "Slik leverer vi verdi",
    "Six stages that can stand alone or work together.":
      "Seks steg som kan stå alene eller fungere sammen.",
    Advisory: "Rådgivning",
    "Create shared clarity before any build decisions.":
      "Skap felles klarhet før beslutninger om bygging.",
    "Executive framing and opportunity mapping":
      "Ledelsesforankring og mulighetskartlegging",
    "Data readiness, governance and risk alignment":
      "Data-beredskap, governance og risikoavklaring",
    "Prioritized roadmap with clear business outcomes":
      "Prioritert veikart med klare forretningsresultater",
    "Training and upskilling": "Opplæring og kompetanseheving",
    "Align people before tools.": "Samle mennesker før verktøy.",
    "Shared language across leadership and teams":
      "Felles språk på tvers av ledelse og team",
    "Hands-on sessions using your real cases":
      "Praktiske økter med deres faktiske case",
    "Adoption plan for tools, roles and ways of working":
      "Adopsjonsplan for verktøy, roller og arbeidsmåter",
    "Solution design": "Løsningsdesign",
    "Translate ideas into decision-ready blueprints.":
      "Oversett ideer til beslutningsklare konsepter.",
    "Value case and ROI hypothesis per use case":
      "Verdicase og ROI-hypotese per brukstilfelle",
    "Process and data mapping across teams":
      "Prosess- og datakartlegging på tvers av team",
    "Solution blueprint with scope and success metrics":
      "Løsningsskisse med omfang og suksessmål",
    Implementation: "Implementering",
    "Build systems that survive first contact with reality.":
      "Bygg systemer som tåler første møte med virkeligheten.",
    "Build, integrate and launch in your environment":
      "Bygg, integrer og lanser i deres miljø",
    "Pilots that scale into production workflows":
      "Piloter som skalerer til produksjonsflyter",
    "Security, controls and human-in-the-loop built in":
      "Sikkerhet, kontroll og menneske-i-loopen innebygd",
    "Support & Maintenance": "Support og vedlikehold",
    "Operate AI like critical infrastructure.":
      "Drift AI som kritisk infrastruktur.",
    "Monitoring quality, drift and performance":
      "Overvåking av kvalitet, drift og ytelse",
    "Continuous improvement based on usage data":
      "Kontinuerlig forbedring basert på bruksdata",
    "Operational runbooks and stakeholder support":
      "Operative runbooks og støtte til interessenter",
    "Long-term relevancy & innovation":
      "Langsiktig relevans og innovasjon",
    "Ensure today’s systems don’t become tomorrow’s debt.":
      "Sørg for at dagens systemer ikke blir morgendagens tekniske gjeld.",
    "Model and stack refresh cadence":
      "Kadens for oppdatering av modeller og stack",
    "New capabilities as the market evolves":
      "Nye kapabiliteter etter hvert som markedet utvikler seg",
    "Innovation pipeline aligned with your strategy":
      "Innovasjonspipeline i tråd med strategien",
    "About NeuroSYS": "Om NeuroSYS",
    "About NeuroSYS - Your AI implementation partner":
      "Om NeuroSYS - Din partner for AI-implementering",
    "We make AI part of how Nordic businesses actually run":
      "Vi gjør AI til en del av hvordan nordiske virksomheter faktisk opererer",
    "A Nordic-Polish team of 100+ specialists that takes organizations from AI experimentation to operational capability - as part of daily operations, not next to them.":
      "Et nordisk-polsk team med 100+ spesialister som tar virksomheter fra AI-eksperimentering til operasjonell kapasitet - som en del av daglig drift, ikke ved siden av.",
    "AI systems that work in real businesses":
      "AI-systemer som fungerer i ekte virksomheter",
    "We are a technology company with 100+ specialists, helping organizations turn AI into measurable impact across operations, customer experience and digital products.":
      "Vi er et teknologiselskap med 100+ spesialister som hjelper virksomheter å gjøre AI om til målbar effekt på tvers av drift, kundeopplevelse og digitale produkter.",
    "At a glance": "Et raskt overblikk",
    specialists: "spesialister",
    "years in market": "år i markedet",
    "European hubs": "europeiske hubber",
    "Who we are": "Hvem vi er",
    "A senior team, built to be trusted with production AI":
      "Et senior team, bygget for å håndtere AI i produksjon",
    "Founded in 2008, certified for the work we do, and partnered with the platforms that power modern AI delivery.":
      "Grunnlagt i 2008, sertifisert for arbeidet vi gjør, og partner med plattformene som driver moderne AI-leveranse.",
    "Specialists across AI, software, data and delivery":
      "Spesialister på tvers av AI, programvare, data og leveranse",
    "Years building software and AI for enterprises":
      "År med å bygge programvare og AI for bedrifter",
    "Production projects delivered to date":
      "Produksjonsprosjekter levert til dags dato",
    "European hubs - Oslo, Wrocław, Białystok, Berlin":
      "Europeiske hubber - Oslo, Wrocław, Białystok, Berlin",
    "ISO 27001": "ISO 27001",
    "Information security certified": "Sertifisert på informasjonssikkerhet",
    AWS: "AWS",
    "Consulting Partner": "Consulting Partner",
    Microsoft: "Microsoft",
    "Solutions Partner": "Solutions Partner",
    "Why we exist": "Hvorfor vi finnes",
    "Most companies don't have an AI problem - they have an implementation problem":
      "De fleste virksomheter har ikke et AI-problem - de har et implementeringsproblem",
    "Models keep getting better. The hard part has shifted to everything around them: integrations, governance, ownership, workflows in active production. That is where we live.":
      "Modellene blir stadig bedre. Det vanskelige har flyttet seg til alt rundt dem: integrasjoner, governance, eierskap, arbeidsflyter i aktiv produksjon. Det er der vi lever.",
    "Since 2008, we've built software for Nordic enterprises. Over the last years, our practice has consolidated around one promise: take AI from isolated pilots to a real operational capability - so the value shows up in daily work, not in demos.":
      "Siden 2008 har vi bygget programvare for nordiske virksomheter. De siste årene har praksisen vår samlet seg rundt ett løfte: å ta AI fra isolerte piloter til en reell operasjonell kapasitet - så verdien viser seg i daglig arbeid, ikke i demoer.",
    "That is what makes us your":
      "Det er det som gjør oss til din",
    "strategic implementation partner":
      "strategiske implementeringspartner",
    ": a senior delivery team that builds, runs and evolves agentic AI on a platform you can keep.":
      ": et senior leveranseteam som bygger, drifter og utvikler agentisk AI på en plattform dere kan beholde.",
    "Mission": "Misjon",
    "The future's capacity is built with digital colleagues.":
      "Fremtidens kapasitet bygges med digitale kollegaer.",
    "NeuroSYS - since 2008": "NeuroSYS - siden 2008",
    "Where most are with AI adoption":
      "Hvor de fleste er med AI-adopsjon",
    "From experimentation to operational capability":
      "Fra eksperimentering til operasjonell kapasitet",
    "Our view of the AI adoption journey - and where we come in. Most organizations get stuck halfway. Our job is to take you the rest of the way.":
      "Vår oversikt over AI-adopsjonsreisen - og hvor vi kommer inn. De fleste virksomheter blir hengende fast halvveis. Vår jobb er å ta dere resten av veien.",
    Experimentation: "Eksperimentering",
    Start: "Start",
    "Individual teams test AI": "Enkelte team tester AI",
    "Isolated use cases": "Isolerte use cases",
    "No shared platform": "Ingen felles plattform",
    "Reality hits": "Reality hits",
    Fragmentation: "Fragmentering",
    "Many initiatives launched": "Mange initiativer startes",
    "Little reuse across teams": "Lite gjenbruk på tvers av team",
    "Hard to govern and monitor": "Vanskelig å styre og overvåke",
    "Most organizations stop here": "De fleste stopper her",
    "Control + platform": "Kontroll + plattform",
    Structure: "Struktur",
    "Shared platform established": "Felles plattform etableres",
    "Governance and reuse": "Governance og gjenbruk",
    "AI part of the system landscape":
      "AI som del av systemlandskapet",
    "Operational capability": "Operasjonell kapasitet",
    Scaling: "Skalering",
    "Teams build workflows themselves":
      "Team bygger arbeidsflyter selv",
    "AI integrated into processes": "AI integrert i prosesser",
    "Continuous evolution": "Kontinuerlig utvikling",
    "Real business value": "Reell forretningsverdi",
    "Our job is to get you here": "Vår jobb er å få dere hit",
    "\"The value only shows up when AI becomes a real part of how the company operates.\"":
      "\"Verdien kommer først når AI blir et reelt driftselement i selskapet.\"",
    "What we stand for": "Det vi står for",
    "Three principles behind every delivery":
      "Tre prinsipper bak hver leveranse",
    "Business impact": "Forretningsmessig effekt",
    "We measure success by outcomes: reduced effort, faster decisions and better experiences - not by how many models we ship.":
      "Vi måler suksess i resultater: mindre innsats, raskere beslutninger og bedre opplevelser - ikke i hvor mange modeller vi sender ut.",
    "We measure success by outcomes: reduced effort, faster decisions and better experiences.":
      "Vi måler suksess i resultater: mindre innsats, raskere beslutninger og bedre opplevelser.",
    "System thinking": "Systemtenkning",
    "We build AI as part of your stack - integrated with the tools and data you already trust, ready to evolve as the landscape changes.":
      "Vi bygger AI som en del av stacken deres - integrert med verktøyene og dataene dere allerede stoler på, klar til å utvikle seg når landskapet endrer seg.",
    "We build AI as part of your stack - integrated, reliable and ready to evolve.":
      "Vi bygger AI som en del av stacken din - integrert, pålitelig og klar til å utvikle seg.",
    "Responsible delivery": "Ansvarlig leveranse",
    "Security, governance and operational quality are built in from day one - not patched on later. ISO 27001 certified for a reason.":
      "Sikkerhet, governance og operasjonell kvalitet er bygd inn fra dag én - ikke lappet på etterpå. ISO 27001-sertifisert av en grunn.",
    "We take security, governance and operational quality seriously, from day one.":
      "Vi tar sikkerhet, governance og operasjonell kvalitet på alvor fra dag én.",
    People: "Mennesker",
    Leadership: "Ledelse",
    "The people behind the strategy, the delivery and the team.":
      "Menneskene bak strategien, leveransen og teamet.",
    "Leads strategy and partnerships. 15+ years building technology businesses across the Nordics.":
      "Leder strategi og partnerskap. 15+ års erfaring med å bygge teknologivirksomheter i Norden.",
    "Operations, governance and how delivery actually scales - across functions and geographies.":
      "Drift, governance og hvordan leveranse faktisk skaleres - på tvers av funksjoner og geografier.",
    "Builds and runs the engineering organization. Connects Nordic clients with senior delivery talent.":
      "Bygger og driver ingeniørorganisasjonen. Kobler nordiske kunder med senior leveransetalent.",
    "Senior specialists who deliver": "Senior spesialister som leverer",
    "A multidisciplinary team across AI, software, data and delivery - working with clients every day.":
      "Et tverrfaglig team på tvers av AI, programvare, data og leveranse - som jobber med kunder hver dag.",
    "Leadership & team": "Ledelse og team",
    "A multidisciplinary team across AI, software, data and delivery.":
      "Et tverrfaglig team på tvers av AI, programvare, data og leveranse.",
    "Backed by a wider team of": "Støttet av et bredere team på",
    "100+ specialists": "100+ spesialister",
    "across our four European hubs": "på tvers av våre fire europeiske hubber",
    "CEO & Tech advisor": "CEO og teknisk rådgiver",
    "COO & Strategic advisor": "COO og strategisk rådgiver",
    "Group CEO & Resource lead": "Konsern-CEO og ressurssjef",
    "IT Project Lead": "IT-prosjektleder",
    "AI & Machine Learning": "AI og maskinlæring",
    "DevOps Specialist": "DevOps-spesialist",
    "Tech Lead & Full-stack": "Tech lead og full-stack",
    "AI Full Stack": "AI full-stack",
    "AI Data Scientist": "AI data scientist",
    "Supported by a wider team across multiple locations in Europe.":
      "Støttet av et bredere team på flere steder i Europa.",
    "Our presence": "Vår tilstedeværelse",
    "Strategically located across Europe’s technology hubs.":
      "Strategisk plassert i Europas teknologiknutepunkter.",
    "Where we are": "Hvor vi er",
    "Four European hubs, one delivery team":
      "Fire europeiske hubber, ett leveranseteam",
    "A Nordic-Polish operating model that combines client proximity with deep engineering capacity.":
      "En nordisk-polsk driftsmodell som kombinerer nærhet til kunden med dyp ingeniørkapasitet.",
    "Nordic hub": "Nordisk hub",
    "Engineering hub": "Ingeniørhub",
    "European hub": "Europeisk hub",
    "Strategy, advisory and Nordic delivery leadership.":
      "Strategi, rådgivning og nordisk leveranseledelse.",
    "AI, platform and full-stack engineering teams.":
      "AI-, plattform- og full-stack-ingeniørteam.",
    "Software, data and DevOps specialists.":
      "Programvare-, data- og DevOps-spesialister.",
    "Partnerships and European market reach.":
      "Partnerskap og europeisk markedsrekkevidde.",
    Norway: "Norge",
    Poland: "Polen",
    Germany: "Tyskland",
    Contact: "Kontakt",
    "Let's start a conversation": "La oss starte en samtale",
    "A short, no-pressure conversation to assess where agentic AI makes sense for your organization - and where it doesn't. We'll come back within one working day.":
      "En kort, uforpliktende samtale for å vurdere hvor agentisk AI gir mening for virksomheten din - og hvor det ikke gjør det. Vi svarer innen én arbeidsdag.",
    "General inquiries": "Generelle henvendelser",
    "For RFPs, partnerships, press, support and general questions about our work.":
      "For RFP-er, partnerskap, presse, support og generelle spørsmål om arbeidet vårt.",
    Email: "E-post",
    Phone: "Telefon",
    LinkedIn: "LinkedIn",
    Office: "Kontor",
    "Direct email": "Direkte e-post",
    "Direct phone": "Direkte telefon",
    "Speak directly with": "Snakk direkte med",
    "Mon-Fri, 09:00-17:00 CET": "Man-fre, 09:00-17:00 CET",
    "Coffee always on": "Kaffen står alltid klar",
    "Øvre Slottsgate 27, 0157 Oslo": "Øvre Slottsgate 27, 0157 Oslo",
    "What happens next": "Hva skjer videre",
    "From first message to a clear next step":
      "Fra første melding til et tydelig neste steg",
    "You reach out": "Du tar kontakt",
    "A short note about your context, your stack and what you'd like to explore. No formal brief required.":
      "En kort melding om konteksten din, teknologistacken og hva du vil utforske. Ingen formell brief nødvendig.",
    "30-minute intro call": "30-minutters introsamtale",
    "We listen, ask the right questions and share where agentic AI is realistic - and where it isn't - in your situation.":
      "Vi lytter, stiller de riktige spørsmålene og deler hvor agentisk AI er realistisk - og hvor det ikke er det - i din situasjon.",
    "Concrete next step": "Konkret neste steg",
    "A focused workshop, a pilot workflow or a short technical assessment - whichever moves you forward fastest.":
      "En fokusert workshop, en pilot-arbeidsflyt eller en kort teknisk vurdering - det som tar dere raskest videre.",
    "Your point of contact": "Din kontaktperson",
    "\"Send me a short message about what you're trying to solve. I'll come back within one working day with a concrete next step - even if it's just a pointer in the right direction.\"":
      "\"Send meg en kort melding om hva du prøver å løse. Jeg kommer tilbake innen én arbeidsdag med et konkret neste steg - selv om det bare er et hint i riktig retning.\"",
    "Email Mikkel": "Send e-post til Mikkel",
    "LinkedIn profile": "LinkedIn-profil",
    "Talk to NeuroSYS about agentic AI. Book a 30-minute discovery call, ask a question, or come by our Oslo office.":
      "Snakk med NeuroSYS om agentisk AI. Book en 30-minutters introsamtale, still et spørsmål, eller stikk innom Oslo-kontoret vårt.",
    "Øvre Slottsgate 27, Oslo": "Øvre Slottsgate 27, Oslo",
    "Contact - NeuroSYS": "Kontakt - NeuroSYS",
    "0191 Oslo, Norway": "0191 Oslo, Norge",
    "NeuroSYS Services": "NeuroSYS tjenester",
    "GenAI Training & Workshops - NeuroSYS":
      "GenAI-opplæring og workshops - NeuroSYS",
    "Agentic AI Training & Workshops - NeuroSYS":
      "Agentisk AI-opplæring og workshops - NeuroSYS",
    "Practical, hands-on AI enablement that builds shared understanding, surfaces real opportunities, and prepares your teams to work with agentic AI in practice.":
      "Praktisk, hands-on AI-innføring som skaper felles forståelse, avdekker reelle muligheter og forbereder teamene på å jobbe med agentisk AI i praksis.",
    "Practical Agentic AI training and workshops that build shared understanding, identify real opportunities and prepare your teams to work with AI in practice.":
      "Praktisk agentisk AI-opplæring og workshops som skaper felles forståelse, identifiserer reelle muligheter og forbereder teamene på å jobbe med AI i praksis.",
    "1 day": "1 dag",
    "to align on GenAI & opportunities":
      "for å samkjøre om GenAI og muligheter",
    "to align on Agentic AI & opportunities":
      "for å samkjøre om agentisk AI og muligheter",
    "people in a shared learning session":
      "personer i en felles læringsøkt",
    "prioritized use cases to take further":
      "prioriterte brukstilfeller å ta videre",
    "Why invest in a focused session":
      "Hvorfor investere i en fokusert økt",
    "Shared decision confidence": "Felles beslutningssikkerhet",
    "Leadership and teams align on what is realistic - and what isn’t worth pursuing.":
      "Ledelse og team samkjører om hva som er realistisk - og hva som ikke er verdt å forfølge.",
    "Credible opportunity focus": "Tydelig mulighetsfokus",
    "You get a grounded view of where AI can create measurable value in your environment.":
      "Du får et jordnært bilde av hvor AI kan skape målbar verdi i ditt miljø.",
    "Decision-ready clarity": "Beslutningsklar tydelighet",
    "You leave knowing where to act, where to wait, and why.":
      "Du går ut med klarhet på hvor dere bør handle, hvor dere bør vente og hvorfor.",
    "Risk-aware prioritization": "Risikobevisst prioritering",
    "Choices are made with governance, data, and ownership in mind.":
      "Valg tas med governance, data og eierskap i bakhodet.",
    "Impact measurement framework": "Rammeverk for effektmåling",
    "You learn a structured way to measure value in opportunities before building anything.":
      "Du lærer en strukturert måte å måle verdi i muligheter før dere bygger noe.",
    "Trusted by Nordic organizations":
      "Tillit hos nordiske organisasjoner",
    "We’ve run GenAI sessions for organizations in retail, health, education and advocacy.":
      "Vi har gjennomført GenAI-økter for organisasjoner innen retail, helse, utdanning og interesseorganisasjoner.",
    "We’ve run Agentic AI sessions for organizations in retail, health, education and advocacy.":
      "Vi har gjennomført agentiske AI-økter for organisasjoner innen retail, helse, utdanning og interesseorganisasjoner.",
    "A strong workshop gives leadership and teams a shared language for GenAI, a more grounded view of where value can appear, and clearer next decisions.":
      "En sterk workshop gir ledelse og team et felles språk for GenAI, et mer jordna syn på hvor verdi kan oppstå og tydeligere neste beslutninger.",
    "A strong workshop gives leadership and teams a shared language for Agentic AI, a more grounded view of where value can appear, and clearer next decisions.":
      "En sterk workshop gir ledelse og team et felles språk for agentisk AI, et mer jordnært syn på hvor verdi kan oppstå og tydeligere neste beslutninger.",
    "Instead of discussing AI in the abstract, we anchor the session in your operating reality, constraints, and opportunities.":
      "I stedet for å diskutere AI abstrakt, forankrer vi økten i deres operative virkelighet, rammer og muligheter.",
    "Organizations we've trained": "Organisasjoner vi har jobbet med",
    "Consumer goods & health": "Forbruksvarer og helse",
    "Introduced GenAI and agentic workflows to key stakeholders.":
      "Introduserte GenAI og agentiske arbeidsflyter for nøkkelinteressenter.",
    "Introduced Agentic AI and agentic workflows to key stakeholders.":
      "Introduserte agentisk AI og agentiske arbeidsflyter for nokkelinteressenter.",
    "Mapped concrete opportunities in communication and operations.":
      "Kartla konkrete muligheter innen kommunikasjon og drift.",
    "Created a shared view on where to start.":
      "Skapte en felles forståelse av hvor man bør starte.",
    "Introduced GenAI and agentic workflows to key stakeholders, mapped concrete opportunities in communication and operations, and created a shared view on where to start.":
      "Introduserte GenAI og agentiske arbeidsflyter for nøkkelinteressenter, kartla konkrete muligheter innen kommunikasjon og drift, og skapte en felles forståelse av hvor man bør starte.",
    "Business & academic environment":
      "Forretnings- og akademisk miljø",
    "Explored GenAI impact on education and internal processes.":
      "Utforsket GenAI-effekt på utdanning og interne prosesser.",
    "Explored Agentic AI impact on education and internal processes.":
      "Utforsket hvordan agentisk AI pavirker utdanning og interne prosesser.",
    "Discussed governance, quality and responsible use.":
      "Drøftet governance, kvalitet og ansvarlig bruk.",
    "Identified areas where AI can support staff and students.":
      "Identifiserte områder der AI kan støtte ansatte og studenter.",
    "Explored GenAI impact on education and internal processes, discussed governance, quality and responsible use, and identified areas where AI can support staff and students.":
      "Utforsket hvordan GenAI påvirker utdanning og interne prosesser, drøftet governance, kvalitet og ansvarlig bruk, og identifiserte områder der AI kan støtte ansatte og studenter.",
    "Advocacy & member organization":
      "Interesse- og medlemsorganisasjon",
    "Connected GenAI to real communication challenges.":
      "Koblet GenAI til reelle kommunikasjonsutfordringer.",
    "Connected Agentic AI to real communication challenges.":
      "Koblet agentisk AI til reelle kommunikasjonsutfordringer.",
    "Explored media monitoring, assistant use and automation.":
      "Utforsket medieovervåking, bruk av assistenter og automatisering.",
    "Prioritized next steps for responsible experimentation.":
      "Prioriterte neste steg for ansvarlig eksperimentering.",
    "Connected GenAI to real communication challenges, explored media monitoring, assistant use and automation, and prioritized next steps for responsible experimentation.":
      "Koblet GenAI til reelle kommunikasjonsutfordringer, utforsket medieovervåking, bruk av assistenter og automatisering, og prioriterte neste steg for ansvarlig eksperimentering.",
    "What a typical day looks like": "Hvordan en typisk dag ser ut",
    "The day is designed to move from orientation and shared language to practical prioritization and clear ownership.":
      "Dagen er lagt opp for å gå fra orientering og felles språk til praktisk prioritering og tydelig eierskap.",
    Morning: "Morgen",
    "Late morning": "Sen morgen",
    Afternoon: "Ettermiddag",
    "Wrap-up": "Oppsummering",
    "Shared understanding and realistic expectations for GenAI.":
      "Felles forståelse og realistiske forventninger til GenAI.",
    "Shared understanding and realistic expectations for Agentic AI.":
      "Felles forståelse og realistiske forventninger til agentisk AI.",
    "A few practical questions teams usually want answered before we plan the session.":
      "Noen praktiske spørsmål team som regel vil ha svar på før vi planlegger økten.",
    "Your context, constraints, and opportunities.":
      "Deres kontekst, rammer og muligheter.",
    "Concrete use cases shaped and prioritized.":
      "Konkrete brukstilfeller formet og prioritert.",
    "Clear ownership, next decisions and how to move forward.":
      "Klart eierskap, neste beslutninger og hvordan vi går videre.",
    "How engagement typically unfolds":
      "Slik et samarbeid vanligvis utvikler seg",
    "Some teams only need one focused session. Others use it as the starting point for opportunity shaping and pilot readiness.":
      "Noen team trenger bare én fokusert økt. Andre bruker den som startpunkt for mulighetsforming og pilotklarhet.",
    "The point is not to force a longer process, but to make the next decision clearer if you want to continue.":
      "Poenget er ikke å tvinge fram et lengre løp, men å gjøre neste beslutning tydeligere dersom dere vil fortsette.",
    "You are here": "Du er her",
    "Next session": "Neste økt",
    "Final session": "Siste økt",
    "Foundation & alignment": "Fundament og samkjøring",
    "A focused session that aligns leadership and teams on what’s realistic, what matters most, and how you’ll evaluate impact.":
      "En fokusert økt som samkjører ledelse og team om hva som er realistisk, hva som betyr mest og hvordan effekten skal måles.",
    "Outcome: shared direction, confidence, and a short list of opportunities worth validating.":
      "Resultat: felles retning, trygghet og en kort liste over muligheter verdt å validere.",
    "Opportunity shaping": "Mulighetsforming",
    "Some teams extend into a deeper session to shape opportunities, validate feasibility and prepare for pilot decisions.":
      "Noen team går videre med en dypere økt for å forme muligheter, validere gjennomførbarhet og forberede pilotbeslutninger.",
    "Outcome: prioritized use cases with decision-ready framing.":
      "Resultat: prioriterte brukstilfeller med beslutningsklart rammeverk.",
    "Pilot readiness": "Pilotklarhet",
    "Teams that want to move fast can extend into pilot preparation, ownership and implementation planning.":
      "Team som vil gå raskt kan gå videre til pilotforberedelse, eierskap og implementeringsplanlegging.",
    "Outcome: a clear, realistic plan for launching pilots with ownership and success criteria in place.":
      "Resultat: en tydelig, realistisk plan for å lansere piloter med eierskap og suksesskriterier på plass.",
    "Projects": "Prosjekter",
    "See how we help organizations digitize, streamline and transform their business with AI and large language models.":
      "Se hvordan vi hjelper virksomheter å digitalisere, effektivisere og transformere med AI og store språkmodeller.",
    "Current projects": "Pågående prosjekter",
    "A selection of ongoing AI and digitalization projects with leading organizations.":
      "Et utvalg pågående AI- og digitaliseringsprosjekter med ledende organisasjoner.",
    "In progress": "Pågår",
    "Started Q1 2025": "Startet Q1 2025",
    "Started Q1 2024": "Startet Q1 2024",
    "Started Q3 2024": "Startet Q3 2024",
    "Started Q1 2020": "Startet Q1 2020",
    "Started Q3 2023": "Startet Q3 2023",
    "Delivered Q4 2024": "Levert Q4 2024",
    "Delivered 2024": "Levert 2024",
    "Delivered 2023": "Levert 2023",
    "Delivered Q2 2026": "Levert Q2 2026",
    "From LMS to AI-native Competency Intelligence":
      "Fra LMS til AI-native Competency Intelligence",
    "Embedded Dify-powered AI inside Samelane, an enterprise LMS used by 40,000+ learners, enabling course generation, report summaries and semantic search as native product capability.":
      "Bygde Dify-drevet AI inn i Samelane, en bedrifts-LMS brukt av 40 000+ brukere - og leverer kursgenerering, rapportsammendrag og semantisk søk som native produktkapabilitet.",
    "Delivered 2022": "Levert 2022",
    "Smart customer service AI chatbot":
      "Smart kundeservice AI-chatbot",
    "Development of an advanced AI-powered customer service chatbot with LLM and tool calling to streamline customer dialogue for Norway’s leading hardware retailer.":
      "Utvikling av en avansert AI-drevet kundeservicechatbot med LLM og verktøykall for å effektivisere kundedialogen for Norges ledende jernvareforhandler.",
    LLM: "LLM",
    "Tool Calling": "Verktøykall",
    "Customer service": "Kundeservice",
    "Process and operations optimization with AI":
      "Prosess- og operasjonsoptimalisering med AI",
    "Optimization of factory processes using digitalization, Generative AI and machine learning to increase efficiency and reduce costs.":
      "Optimalisering av fabrikkprosesser med digitalisering, generativ AI og maskinlæring for å øke effektiviteten og redusere kostnader.",
    Digitalization: "Digitalisering",
    GenAI: "GenAI",
    "Machine learning": "Maskinlæring",
    "Smart AI communication agent":
      "Smart AI-kommunikasjonsagent",
    "Development of an AI-based communication agent that analyzes, interprets and generates content for better decision support, improved accessibility and clearer communication.":
      "Utvikling av en AI-basert kommunikasjonsagent som analyserer, tolker og genererer innhold for bedre beslutningsstøtte, økt tilgjengelighet og tydeligere kommunikasjon.",
    "AI agent": "AI-agent",
    "Content generation": "Innholdsgenerering",
    Accessibility: "Tilgjengelighet",
    "Automated AI integration engine":
      "Automatisert AI-integrasjonsmotor",
    "Development of an integration engine powered by intelligent AI agents for efficient data integration and automation of business processes.":
      "Utvikling av en integrasjonsmotor drevet av intelligente AI-agenter for effektiv dataintegrasjon og automatisering av forretningsprosesser.",
    "AI agents": "AI-agenter",
    Integration: "Integrasjon",
    Automation: "Automatisering",
    "IoT platform for smart homes": "IoT-plattform for smarthjem",
    "Product development, integrations and maintenance of a multi-tenant IoT platform for smart home solutions used by Homely, nimly and Länsförsäkringar.":
      "Produktutvikling, integrasjoner og vedlikehold av en multi-tenant IoT-plattform for smarthjemløsninger brukt av Homely, nimly og Länsförsäkringar.",
    IoT: "IoT",
    "Smart home": "Smarthjem",
    "Platform development": "Plattformutvikling",
    "Web development and integration":
      "Webutvikling og integrasjon",
    "Development partner for implementation and integration projects, including the Heliteam website, for Chili Group’s customers.":
      "Utviklingspartner for implementerings- og integrasjonsprosjekter, inkludert Heliteam-nettsiden, for Chili Groups kunder.",
    "Web design": "Webdesign",
    Implementation: "Implementering",
    "Success stories": "Suksesshistorier",
    "See how our AI solutions have created measurable value for organizations.":
      "Se hvordan våre AI-løsninger har skapt målbar verdi for organisasjoner.",
    "Digital locking systems for NCC":
      "Digitale låsesystemer for NCC",
    "Delivered with Enter Security: iLoq’s digital padlocks and locking systems for NCC in Q4 2024, using mobile phones as keys to reduce loss of physical keys.":
      "Levert sammen med Enter Security: iLoqs digitale hengelåser og låsesystemer for NCC i Q4 2024, med mobiltelefoner som nøkler for å redusere tap av fysiske nøkler.",
    Security: "Sikkerhet",
    "Team extension for a digital platform":
      "Teamutvidelse for en digital plattform",
    "Team extension for energy company Elekt to develop backend and app solutions for their digital platform.":
      "Teamutvidelse for energiselskapet Elekt for å utvikle backend- og app-løsninger for deres digitale plattform.",
    "Team extension": "Teamutvidelse",
    "Backend development": "Backend-utvikling",
    "App development": "App-utvikling",
    "Real estate marketplace": "Markedsplass for eiendom",
    "Development of a digital marketplace platform for real estate company Vogl with recommendations and matchmaking.":
      "Utvikling av en digital markedsplassplattform for eiendomsselskapet Vogl med anbefalinger og matching.",
    Marketplace: "Markedsplass",
    "Real estate": "Eiendom",
    Recommendations: "Anbefalinger",
    "AI platform for renovation": "AI-plattform for renovering",
    "Development of a service-provider platform and an AI-driven end-user app for Android and the App Store for renovation and home upgrades.":
      "Utvikling av en tjenesteleverandørplattform og en AI-drevet sluttbrukerapp for Android og App Store for renovering og oppussing.",
    "3D visualization": "3D-visualisering",
    "GenAI workshops for Champions":
      "GenAI-workshops for Champions",
    "Delivered GenAI workshops for Orkla Health Champions to build technology capability across Orkla Health.":
      "Leveranse av GenAI-workshops for Orkla Health Champions for å bygge teknologikompetanse på tvers av Orkla Health.",
    Workshops: "Workshops",
    "Skills development": "Kompetanseutvikling",
    "Opportunity assessment": "Mulighetsavklaring",
    "Completed an opportunity assessment and delivered a digitalization report with multiple optimization opportunities for Fishbones' business.":
      "Gjennomførte en mulighetsavklaring og leverte en digitaliseringsrapport med flere optimaliseringsmuligheter for Fishbones’ virksomhet.",
    Energy: "Energi",
    "Smart metal sorting": "Smart metallsortering",
    "Completed an opportunity assessment and delivered a digitalization report outlining projects under consideration for automated metal sorting.":
      "Gjennomførte en mulighetsavklaring og leverte en digitaliseringsrapport som beskriver prosjekter under vurdering for automatisert metallsortering.",
    Sustainability: "Bærekraft",
    "News - NeuroSYS": "Nyheter - NeuroSYS",
    "Updates and featured activities from NeuroSYS.":
      "Oppdateringer og utvalgte aktiviteter fra NeuroSYS.",
    "Selected activities and updates from our work across industries and partner ecosystems.":
      "Utvalgte aktiviteter og oppdateringer fra arbeidet vårt på tvers av bransjer og partnerøkosystemer.",
    Insight: "Innsikt",
    Product: "Produkt",
    "Case study": "Kundehistorie",
    Partnership: "Partnerskap",
    "← Back to news": "← Tilbake til nyheter",
    Featured: "Utvalgt",
    "Read article": "Les artikkelen",
    "Related stories": "Relaterte historier",
    "All news →": "Alle nyheter →",
    "More stories": "Flere historier",
    "4 stories": "4 historier",
    "Want to talk about your own AI use case?":
      "Vil du snakke om din egen AI-case?",
    "We help organizations move from pilot to production with agentic AI - and would love to hear what you're working on.":
      "Vi hjelper organisasjoner å gå fra pilot til produksjon med agentisk AI - og vil gjerne høre hva du jobber med.",
    "Follow on LinkedIn →": "Følg oss på LinkedIn →",
    "4 min read": "4 min lesetid",
    "5 min read": "5 min lesetid",
    "6 min read": "6 min lesetid",
    "January 5, 2026": "5. januar 2026",
    "January 10, 2026": "10. januar 2026",
    "January 15, 2026": "15. januar 2026",
    "February 1, 2026": "1. februar 2026",
    "April 15, 2026": "15. april 2026",

    "MedieX: From media noise to actionable insight":
      "MedieX: Fra mediestøy til styrbar beslutningsinnsikt",
    "MedieX: From media noise to actionable insight - NeuroSYS":
      "MedieX: Fra mediestøy til styrbar beslutningsinnsikt - NeuroSYS",
    "MedieX turns unstructured media noise into structured, actionable intelligence for communication and decision-making teams across Nordic enterprises.":
      "MedieX gjør ustrukturert mediestøy om til styrbar, dokumenterbar beslutningsinnsikt for kommunikasjons- og beslutningsteam.",
    "An operational AI platform for communication and decision-making teams. MedieX turns unstructured media noise into structured, documented intelligence - in seconds.":
      "En operasjonell AI-plattform for kommunikasjons- og beslutningsteam. MedieX gjør ustrukturert mediestøy om til styrbar, dokumenterbar innsikt - på sekunder.",
    "AI-powered media intelligence platform by NeuroSYS":
      "AI-drevet medieintelligensplattform fra NeuroSYS",
    "An AI-powered media intelligence platform that turns unstructured media data into structured decision support - in partnership with Schibsted, Polaris Media and Amedia.":
      "En AI-drevet medieintelligensplattform som gjør ustrukturert mediedata om til strukturert beslutningsstøtte - i partnerskap med Schibsted, Polaris Media og Amedia.",
    "Coverage of digital editorial media in Norway":
      "Dekning av digitale redaksjonelle medier i Norge",
    "Continuous monitoring and alerting":
      "Kontinuerlig overvåking og varsling",
    "Compliant by design": "Etterlevelse fra start",
    "The problem: media noise": "Problemet: mediestøy",
    "Communication teams in complex organizations deal with fragmented, unstructured news data every day. Sources vary in quality and format. Dialects, jargon, simplifications and time pressure make it hard to extract what actually matters. The result: teams spend time on volume instead of focusing on what requires real attention.":
      "Kommunikasjonsteam i komplekse organisasjoner håndterer fragmentert, ustrukturert nyhetsdata hver dag. Kilder varierer i kvalitet og format. Dialekter, sjargong, forenklinger og tidspress gjør det vanskelig å trekke ut det som faktisk betyr noe. Resultatet: team bruker tid på volum i stedet for å fokusere på det som krever reell oppmerksomhet.",
    "What MedieX does differently": "Hva MedieX gjør annerledes",
    "Where traditional media monitoring stops at alerting and keyword matching, MedieX goes further. It is an agentic platform that understands context, not just hits - and turns raw media data into decision-ready insight.":
      "Der tradisjonell medieovervåking stopper ved varsling og nøkkelordtreff, går MedieX videre. Det er en agentisk plattform som forstår kontekst, ikke bare treff - og gjør rå mediedata om til beslutningsklar innsikt.",
    "Organizes topics, cases and search across sources":
      "Organisering av temaer, saker og søk på tvers av kilder",
    "Team collaboration with comments, assignments and alerts":
      "Samhandling i team med kommentarer, ansvar og varsling",
    "AI-powered filtering for noise reduction and decision support":
      "AI-filtrering for støyreduksjon og beslutningsstøtte",
    "Contextual sentiment and risk assessment per story":
      "Kontekstuell sentiment- og risikovurdering per sak",
    "Explains why stories matter to your specific organization":
      "Forklarer hvorfor saker er viktige for din organisasjon",
    "Understands context across related articles and sources":
      "Forstår kontekst på tvers av relaterte artikler og kilder",
    "Generates draft responses and briefs":
      "Lager forslag til respons og sammendrag",
    "Create custom alerts within the platform":
      "Lag egne varslinger i plattformen",
    "Extended media monitoring": "Utvidet medieovervåking",
    "MedieX covers approximately 80 % of all digital editorial media in Norway, including analysis of articles behind paywalls. Content from Schibsted, Polaris Media, Amedia and Mediebedriftene is monitored continuously.":
      "MedieX dekker ca. 80 % av alle digitale redaksjonelle medier i Norge, inkludert analyse av artikler bak betalingsmur. Innhold fra Schibsted, Polaris Media, Amedia og Mediebedriftene overvåkes kontinuerlig.",
    "What you get": "Hva du får med MedieX",
    "Better quality in decision-making foundations":
      "Bedre kvalitet i beslutningsgrunnlag",
    "Faster and safer handling of cases across teams":
      "Raskere og tryggere håndtering av saker på tvers av team",
    "Focus on what actually demands attention in complex organizations":
      "Fokus på det som faktisk krever oppmerksomhet i komplekse organisasjoner",
    "From volume to prioritization": "Fra volum til prioritering",
    "Automation with traceability": "Automatisering med sporbarhet",
    "The bottom line": "Bunnlinjen",
    "MedieX streamlines communication work. Less operational effort, more strategic capacity. Direct OPEX impact.":
      "MedieX effektiviserer kommunikasjonsarbeidet. Mindre driftsarbeid, mer strategisk kapasitet. Direkte OPEX-effekt.",
    "In partnership with": "I partnerskap med",
    "Schibsted, Polaris Media, Amedia and Mediebedriftene.":
      "Schibsted, Polaris Media, Amedia og Mediebedriftene.",
    "AI-enabled product": "Produktagent",
    "Media intelligence": "Medieintelligens",
    "Agentic platform": "Agentisk plattform",
    "Sentiment analysis": "Sentimentanalyse",
    "Want to see how MedieX can transform your media monitoring?":
      "Vil du se hvordan MedieX kan forvandle din medieovervåking?",

    "Jernia: AI-drevet kundeservice som faktisk leverer":
      "Jernia: AI-drevet kundeservice som faktisk leverer",
    "Jernia: AI-powered customer service that delivers":
      "Jernia: AI-drevet kundeservice som faktisk leverer",
    "Jernia: AI-powered customer service that delivers - NeuroSYS":
      "Jernia: AI-drevet kundeservice som faktisk leverer - NeuroSYS",
    "46% of meaningful conversations resolved during pilot. How Jernia automated customer service with an AI communication agent.":
      "46 % av meningsfulle samtaler løst i pilotperioden. Hvordan Jernia automatiserte kundeservice med en AI-dialogagent.",
    "46 % of meaningful conversations resolved in pilot. How Norway's leading hardware retailer automated customer service with an AI communication agent.":
      "46 % av meningsfulle samtaler løst i pilot. Hvordan Norges ledende jernvareforhandler automatiserte kundeservice med en AI-dialogagent.",
    "46 % av meningsfulle samtaler ble løst i pilotperioden. Uten å øke bemanningen fikk Jernia raskere svar, færre saker til kundesenteret og en bedre kundeopplevelse.":
      "46 % av meningsfulle samtaler ble løst i pilotperioden. Uten å øke bemanningen fikk Jernia raskere svar, færre saker til kundesenteret og en bedre kundeopplevelse.",
    "Norway's leading hardware retailer": "Norges ledende jernvareforhandler",
    "Meaningful conversations resolved during pilot":
      "Meningsfulle samtaler løst i pilotperioden",
    "Availability without additional staff":
      "Tilgjengelighet uten økt bemanning",
    "Average response time": "Gjennomsnittlig responstid",
    "The challenge": "Utfordringen",
    "Jernia handles a high volume of recurring customer questions - opening hours, store locations, return policies, order status and product advice. The customer service team was spending significant time on repetitive queries that follow predictable patterns, leaving less capacity for complex cases that genuinely need human attention.":
      "Jernia håndterer et høyt volum av gjentakende kundespørsmål - åpningstider, butikklokasjoner, returvilkår, ordrestatus og produktråd. Kundeserviceteamet brukte mye tid på repeterende henvendelser med forutsigbare mønstre, noe som ga mindre kapasitet til komplekse saker som virkelig trenger menneskelig oppmerksomhet.",
    "What we built": "Hva vi bygget",
    "NeuroSYS delivered a tailored AI chat solution as a managed service. The agent answers questions based on Jernia's own knowledge base - it only responds using documents Jernia uploads, ensuring accuracy and brand control.":
      "NeuroSYS leverte en skreddersydd AI chat-løsning som tjeneste. Agenten svarer på spørsmål basert på Jernias egen kunnskapsbase - den svarer kun basert på dokumenter Jernia laster opp, noe som sikrer nøyaktighet og merkekontroll.",
    "Answers questions about opening hours, store locations, terms and returns":
      "Svarer på kundespørsmål om åpningstider, lokasjoner, vilkår og retur",
    "Retrieves live order status via nShift integration":
      "Henter ordrestatus via nShift-integrasjon",
    "Provides product tips and troubleshooting advice":
      "Gir tips og triks for produkter",
    "Runs on a dedicated instance with Jernia's own documentation":
      "Kjører på en dedikert instans med Jernias egne dokumenter",
    Results: "Resultater",
    "During the pilot period, the agent resolved 46 % of meaningful conversations without human intervention. Customers got faster answers, the support team handled fewer routine tickets, and the overall experience improved - all without increasing headcount.":
      "I løpet av pilotperioden løste agenten 46 % av meningsfulle samtaler uten menneskelig inngripen. Kundene fikk raskere svar, supportteamet håndterte færre rutinesaker, og den totale opplevelsen ble bedre - uten å øke bemanningen.",
    "What's next": "Hva er neste steg",
    "The strongest signal from the pilot was product and order-related questions. Phase 2 focuses on deeper product knowledge, expanded order access and tighter system integration - so the agent can resolve even more cases end-to-end.":
      "Det sterkeste signalet fra piloten var spørsmål om produkter og ordre. Fase 2 fokuserer på dypere produktkunnskap, utvidet ordretilgang og tettere systemintegrasjon - slik at agenten kan løse enda flere saker ende-til-ende.",
    "Future phases include integration with customer profiles, the full product catalog, and troubleshooting guides - moving from a helpful assistant to a complete self-service layer.":
      "Fremtidige faser inkluderer integrasjon med kundeprofiler, full produktkatalog og feilsøkingsguider - fra en hjelpsom assistent til et komplett selvbetjeningslag.",
    "Tool calling": "Verktøykall",
    "Customer service agent": "Kundeserviceagent",
    "nShift integration": "nShift-integrasjon",
    "Knowledge base": "Kunnskapsbase",
    "Want to explore how a communication agent could work for your customer service?":
      "Vil du utforske hvordan en dialogagent kan fungere for din kundeservice?",

    "GE Healthcare: On-prem AI for factory operations":
      "GE Healthcare: On-prem AI for fabrikkdrift",
    "GE Healthcare: On-prem AI for factory operations - NeuroSYS":
      "GE Healthcare: On-prem AI for fabrikkdrift - NeuroSYS",
    "10,000+ control documents made searchable with a secure, on-premises RAG solution. How GE Healthcare gives operators instant answers to critical procedures.":
      "10 000+ kontrolldokumenter gjort søkbare med en sikker, lokal RAG-løsning. Hvordan GE Healthcare gir operatører umiddelbare svar på kritiske prosedyrer.",
    "10,000+ control documents made searchable with a fully local, secure RAG solution. Operators get instant answers to critical procedures without exposing sensitive data.":
      "10 000+ kontrolldokumenter gjort søkbare med en fullstendig lokal, sikker RAG-løsning. Operatører får umiddelbare svar på kritiske prosedyrer uten å eksponere sensitive data.",
    "10,000+ control documents made searchable with a secure, on-premises RAG solution for factory operators.":
      "10 000+ kontrolldokumenter gjort søkbare med en sikker, lokal RAG-løsning for fabrikkoperatører.",
    "Global leader in healthcare technology":
      "Global leder innen helseteknologi",
    "Control documents indexed": "Kontrolldokumenter indeksert",
    "On-premises - no cloud dependency": "Lokal drift - ingen skyavhengighet",
    "Bilingual document support": "Tospråklig dokumentstøtte",
    "Factory operators at GE Healthcare need fast, reliable access to internal procedures, quality controls and compliance documentation. With thousands of documents spread across multiple systems, finding the right answer quickly was a bottleneck - especially when working on the production floor where time and accuracy are critical.":
      "Fabrikkoperatører hos GE Healthcare trenger rask, pålitelig tilgang til interne prosedyrer, kvalitetskontroller og compliance-dokumentasjon. Med tusenvis av dokumenter fordelt på flere systemer var det en flaskehals å finne riktig svar raskt - spesielt på produksjonsgulvet hvor tid og nøyaktighet er kritisk.",
    "NeuroSYS delivered a fully on-premises, LLM-based knowledge base and document search system. The solution runs on a dedicated AI-optimized server inside GE's local network - no internet access, no external services, no data leaving the building.":
      "NeuroSYS leverte et fullstendig lokalt, LLM-basert kunnskapsbase- og dokumentsøksystem. Løsningen kjører på en dedikert AI-optimalisert server i GEs lokale nettverk - ingen internettilgang, ingen eksterne tjenester, ingen data forlater bygningen.",
    "RAG-based search across Word, Excel, PDF, text files and email attachments":
      "RAG-basert søk på tvers av Word, Excel, PDF, tekstfiler og e-postvedlegg",
    "Answers grounded in source documents with direct references for verification":
      "Svar forankret i kildedokumenter med direkte referanser for verifisering",
    "Conversational interface - operators can ask follow-up questions within context":
      "Samtalebasert grensesnitt - operatører kan stille oppfølgingsspørsmål i kontekst",
    "Full conversation history per user for continuity across sessions":
      "Full samtalehistorikk per bruker for kontinuitet på tvers av økter",
    "Internal authentication with user accounts for selected employees":
      "Intern autentisering med brukerkontoer for utvalgte ansatte",
    "Bilingual support - documents and conversations in English and Norwegian":
      "Tospråklig støtte - dokumenter og samtaler på engelsk og norsk",
    "Operators get immediate, accurate answers to critical procedure questions without needing to know file locations or folder structures. The solution ensures information flow while meeting strict requirements for compliance, security and data governance.":
      "Operatører får umiddelbare, nøyaktige svar på kritiske prosedyrespørsmål uten å måtte kjenne filplasseringer eller mappestrukturer. Løsningen sikrer informasjonsflyt samtidig som strenge krav til etterlevelse, sikkerhet og datastyring ivaretas.",
    "Future phases will introduce integration with external data sources (shared drives, Box, Veeva, TrackWise, SAP), granular access permissions for document subsets, SSO-based authentication, and support for non-text content like images and video.":
      "Fremtidige faser vil introdusere integrasjon med eksterne datakilder (fellesområder, Box, Veeva, TrackWise, SAP), detaljerte tilgangsrettigheter for dokumentundergrupper, SSO-basert autentisering og støtte for ikke-tekstlig innhold som bilder og video.",
    "The architecture is also designed for multi-site access, with secure VPN tunnels enabling other GE locations to connect to the same knowledge base.":
      "Arkitekturen er også designet for tilgang fra flere lokasjoner, med sikre VPN-tunneler som gjør at andre GE-lokasjoner kan koble seg til samme kunnskapsbase.",
    "On-premises": "On-premises",
    "Intranet agent": "Intranett-agent",
    Compliance: "Etterlevelse",
    "Need a secure, on-premises AI solution for your operations?":
      "Trenger du en sikker, lokal AI-løsning for driften?",

    "Why NeuroSYS chose to partner with Dify":
      "Hvorfor NeuroSYS valgte å samarbeide med Dify",
    "Why NeuroSYS chose to partner with Dify - NeuroSYS":
      "Hvorfor NeuroSYS valgte å samarbeide med Dify - NeuroSYS",
    "From pilot fatigue to production-ready AI. How Dify solved the core problems slowing down enterprise AI adoption - and why we chose them as our platform partner.":
      "Fra pilottrøtthet til produksjonsklar AI. Hvordan Dify løste kjerneproblemene som bremser AI-adopsjon i virksomheter - og hvorfor vi valgte dem som plattformpartner.",
    "From pilot fatigue to production-ready AI. How Dify solved the core problems slowing down enterprise AI adoption.":
      "Fra pilottrøtthet til produksjonsklar AI. Hvordan Dify løste kjerneproblemene som bremser AI-adopsjon i virksomheter.",
    "From pilot fatigue to production-ready AI. How Dify solved the core problems slowing down enterprise AI adoption - one platform for agents, workflows, RAG, evaluation and monitoring.":
      "Fra pilot-overveldelser til produksjonsklar AI. Hvordan Dify løste kjerneproblemene som bremser AI-adopsjon - én plattform for agenter, arbeidsflyter, RAG, evaluering og overvåking.",
    "We built countless AI pilots and kept hitting the same walls. Dify solved the core problems slowing down enterprise AI adoption - one platform for agents, workflows, RAG, evaluation and monitoring.":
      "Vi bygget utallige AI-piloter og traff de samme veggene gang etter gang. Dify løste kjerneproblemene som bremser AI-adopsjon i virksomheter - én plattform for agenter, arbeidsflyter, RAG, evaluering og overvåking.",
    "Open-source LLM application development platform":
      "Open source-plattform for utvikling av LLM-applikasjoner",
    "Before Dify: pilot fatigue": "Før Dify: pilottrøtthet",
    "Every new AI project meant the same cycle: create tech and functional specs, set up a new cloud instance, make architecture decisions around LLM, storage, RAG and infrastructure. Pilots quickly became siloed, each with its own tech stack. When enterprise clients asked \"can we scale this easily?\" - the honest answer was usually \"that's a new project.\"":
      "Hvert nytt AI-prosjekt betød den samme syklusen: lage tekniske og funksjonelle spesifikasjoner, sette opp en ny skyinstans, ta arkitekturbeslutninger rundt LLM, lagring, RAG og infrastruktur. Piloter ble raskt silo-baserte, hver med sin egen tech stack. Når enterprise-kunder spurte \"kan vi skalere dette enkelt?\" - var det ærlige svaret som regel \"det er et nytt prosjekt.\"",
    "Too many architecture decisions per project":
      "For mange arkitekturbeslutninger per prosjekt",
    "Too much time spent on plumbing instead of solving business problems":
      "For mye tid brukt på infrastruktur i stedet for å løse forretningsproblemer",
    "Maintenance cost ballooned as each pilot had its own stack":
      "Vedlikeholdskostnader økte fordi hver pilot hadde sin egen tech stack",
    "Hard to ensure quality, security, consistency and compliance":
      "Vanskelig å sikre kvalitet, sikkerhet, konsistens og etterlevelse",
    "Iterating on production AI required faster, repeatable foundations":
      "Iterering på produksjons-AI krevde raskere, repeterbare grunnlag",
    "What Dify changed": "Hva Dify endret",
    "Dify gave us one unified platform for agents, workflows, RAG, evaluation and monitoring. No need to rebuild infrastructure again and again. The result: faster delivery, more predictable engineering, and an enterprise-ready foundation that is flexible, open and high-performance.":
      "Dify ga oss én samlet plattform for agenter, arbeidsflyter, RAG, evaluering og overvåking. Ikke behov for å bygge infrastruktur på nytt gang etter gang. Resultatet: raskere leveranse, mer forutsigbar utvikling, og et enterprise-klart fundament som er fleksibelt, åpent og ytelsessterkt.",
    "Scale clients from prototype to production to operations on the same platform":
      "Skaler kunder fra prototype til produksjon til drift på samme plattform",
    "Teams focus on business value, not plumbing":
      "Team fokuserer på forretningsverdi, ikke infrastruktur",
    "Enterprise-ready with built-in security, governance and compliance":
      "Enterprise-klar med innebygd sikkerhet, styring og etterlevelse",
    "Open and flexible - no vendor lock-in":
      "Åpent og fleksibelt - ingen leverandørlåsing",
    "Oslo Meetup: from pilots to production":
      "Oslo Meetup: fra piloter til produksjon",
    "Together with Dify, we gathered enterprise decision-makers in Oslo to discuss what it actually takes to operationalize agentic AI. With most organizations still stuck in the pilot phase, the conversation focused on reusable workflows, shared knowledge, and controlled autonomy across teams.":
      "Sammen med Dify samlet vi beslutningstakere i Oslo for å diskutere hva som faktisk skal til for å operasjonalisere agentisk AI. Når de fleste virksomheter fortsatt sitter fast i pilotfasen, var fokuset på gjenbrukbare arbeidsflyter, delt kunnskap og kontrollert autonomi på tvers av team.",
    "We explored what works in practice: democratizing building so teams can experiment safely, reusing proven workflows instead of reinventing in every department, and ensuring insights stay centralized rather than disappearing into isolated tools.":
      "Vi utforsket hva som fungerer i praksis: å demokratisere bygging slik at team kan eksperimentere trygt, gjenbruke utprøvde arbeidsflyter i stedet for å finne opp alt på nytt i hver avdeling, og sørge for at innsikt forblir sentralisert i stedet for å forsvinne i isolerte verktøy.",
    "The key takeaway was clear: enterprises must take control of their knowledge, tasks and processes - and use agentic workflows to push that intelligence out to teams, not the other way around.":
      "Hovedpoenget var tydelig: virksomheter må ta kontroll over kunnskap, oppgaver og prosesser - og bruke agentiske arbeidsflyter til å distribuere den intelligensen ut til teamene, ikke omvendt.",
    Workflows: "Arbeidsflyter",
    "Ready to move from pilots to production-grade AI?":
      "Klar for å gå fra piloter til produksjonsklar AI?",
    "Explore the Agent Platform →":
      "Utforsk agentplattformen →",
    "Communication Agents - NeuroSYS Applications":
      "Dialogagenter - NeuroSYS applikasjoner",
    "Agentic communication agents that resolve work across channels for employees and customers.":
      "Agentiske dialogagenter som løser arbeid på tvers av kanaler for ansatte og kunder.",
    "AI Process Optimization - NeuroSYS Applications":
      "Prosessagenter - NeuroSYS applikasjoner",
    "AI Process Optimization - agentic workflows for operational work.":
      "Prosessagenter - agentiske arbeidsflyter for operasjonelt arbeid.",
    "AI-Enabled Products - NeuroSYS Applications":
      "Produktagenter - NeuroSYS applikasjoner",
    "AI-Enabled Products - part of the NeuroSYS AI System.":
      "Produktagenter - en del av NeuroSYS AI-system.",
    "Applications:": "Applikasjoner:",
    "Customer & employee interaction": "Kunde- og medarbeiderdialog",
    "Agentic communication agents for employees and customers that resolve work across channels, on top of your existing systems and data.":
      "Agentiske dialogagenter for ansatte og kunder som løser arbeid på tvers av kanaler, oppå eksisterende systemer og data.",
    "reduction in repetitive questions*":
      "reduksjon i repeterende spørsmål*",
    "availability for employees & customers":
      "tilgjengelighet for ansatte og kunder",
    Days: "Dager",
    "from idea to working agent": "fra idé til fungerende agent",
    "*Indicative range based on pilots and similar implementations.":
      "*Indikativt spenn basert på piloter og lignende implementeringer.",
    "of repetitive questions resolved without a human*":
      "av repeterende spørsmål løst uten et menneske*",
    "availability across customer and employee channels":
      "tilgjengelighet på tvers av kunde- og medarbeiderkanaler",
    "2-4 weeks": "2-4 uker",
    "from kickoff to first agent in production":
      "fra oppstart til første agent i produksjon",
    "*Indicative range based on pilots and comparable implementations.":
      "*Indikativt spenn basert på piloter og sammenlignbare implementeringer.",
    "Book a 30-min intro": "Book et 30-min møte",
    "See how it works": "Se hvordan det fungerer",
    "Where it shows up in the business":
      "Hvor det dukker opp i virksomheten",
    "Where communication agents fit in":
      "Hvor dialogagenter passer inn",
    "The same agent platform powers different parts of the business - from customer service to marketing dialogue and sales follow-up.":
      "Den samme agentplattformen driver ulike deler av virksomheten - fra kundeservice til markedsføringsdialog og salgsoppfølging.",
    "Digital products & insight": "Digitale produkter og innsikt",
    "Engineering & data tools": "Engineering- og dataverktøy",
    "Operations & delivery": "Drift og leveranser",
    "AI-native features inside PLM, PDM and engineering tools - sourcing, indexing and document generation built in.":
      "AI-native funksjoner inne i PLM, PDM og engineering-verktøy - sourcing, indeksering og dokumentgenerering bygget inn.",
    "Digital touchpoints": "Digitale flater",
    "Embed agents in customer portals, self-service flows and mobile apps where users already are.":
      "Bygg agenter inn i kundeportaler, selvbetjeningsflyter og mobilapper der brukerne allerede er.",
    "One shared AI layer. Many interfaces.":
      "Ett felles AI-lag. Mange grensesnitt.",
    "A single intelligence layer connected to your data and systems. From that foundation, every interface can draw on the same knowledge, logic and actions - so customers and employees get the same answer, no matter where they ask.":
      "Ett intelligenslag koblet til data og systemer. Fra dette fundamentet kan hvert grensesnitt bruke samme kunnskap, logikk og handlinger - slik at kunder og ansatte får samme svar uansett hvor de spør.",
    "One shared foundation connected to your data":
      "Ett felles fundament koblet til dataene dine",
    "Interfaces reuse the same knowledge and actions":
      "Grensesnitt gjenbruker samme kunnskap og handlinger",
    "Less fragmentation, lower maintenance cost":
      "Mindre fragmentering, lavere vedlikeholdskostnad",
    "Agentic means it can reason, decide and act - not just respond.":
      "Agentisk betyr at det kan resonnerer, beslutte og handle - ikke bare svare.",
    "From request to resolution": "Fra henvendelse til løsning",
    "How a communication agent actually resolves a request":
      "Slik løser en dialogagent en henvendelse i praksis",
    "Every conversation runs through the same four steps - so you get explainable, traceable work instead of black-box answers.":
      "Hver samtale går gjennom de samme fire stegene - så du får forklarbart, sporbart arbeid i stedet for svar fra en svart boks.",
    "Understand the request": "Forstå henvendelsen",
    "Read the full message in context: the channel it came from, the customer or employee profile, and the policies that apply.":
      "Les hele meldingen i kontekst: kanalen den kom fra, kunde- eller ansattprofilen, og retningslinjene som gjelder.",
    "Call the right tools": "Kall de riktige verktøyene",
    "Look up live data in your systems - order status, returns, customer history, internal procedures - through secure tool calls.":
      "Slå opp sanntidsdata i systemene dine - ordrestatus, retur, kundehistorikk, interne prosedyrer - gjennom sikre verktøykall.",
    "Take action end-to-end": "Utfør hele handlingen",
    "Compose the answer, execute simple actions and log the outcome - in the same flow, without bouncing the user between portals.":
      "Sett sammen svaret, gjennomfør enkle handlinger og logg resultatet - i samme flyt, uten å sende brukeren rundt mellom portaler.",
    "Hand off with full context": "Send videre med full kontekst",
    "For exceptions, the agent hands over to the right person with the conversation, the data it pulled and a recommended next step already attached.":
      "For unntakene sender agenten saken videre til rett person - med samtalen, dataene den hentet og et anbefalt neste steg allerede vedlagt.",
    "Dify workflow showing a communication agent answering a user query with knowledge retrieval and LLM steps":
      "Dify-arbeidsflyt som viser en dialogagent som besvarer en brukerhenvendelse med kunnskapsinnhenting og LLM-steg",
    FAQ: "FAQ",
    "Short answers on what a communication agent is, how it differs from a chatbot, and how we measure value.":
      "Korte svar på hva en dialogagent er, hvordan den skiller seg fra en chatbot, og hvordan vi måler verdi.",
    "AGENTIC PLATFORM": "AGENTISK PLATTFORM",
    "Reason • Decide • Act": "Resonner • Bestem • Handle",
    "DATA INTEGRATION": "DATAINTEGRASJON",
    "CRM • ERP • Docs • APIs": "CRM • ERP • Dokumenter • API-er",
    "Customer chat": "Kundechat",
    "Customer support": "Kundesupport",
    "Employee intranet": "Ansatt-intranett",
    "Help pages": "Hjelpesider",
    "Product guides": "Produktguider",
    "Web automation": "Web-automatisering",
    "Some example workflows": "Eksempler på arbeidsflyter",
    "Build limitless possibilities with agentic platform, from simple tasks to complex, cross-system processes.":
      "Bygg ubegrensede muligheter med agentisk plattform, fra enkle oppgaver til komplekse prosesser på tvers av systemer.",
    "Customer support": "Kundesupport",
    "Customer service agent": "Kundeserviceagent",
    "Answers questions about opening hours, locations, return rules and warranties - and escalates to humans when needed.":
      "Svar på spørsmål om åpningstider, lokasjoner, returregler og garantier - og eskalerer til mennesker ved behov.",
    "Tool calling": "Verktøykall",
    "Order & delivery status": "Ordre- og leveringsstatus",
    "Lets customers check order and delivery status directly from systems like nShift or ERP via secure tool calls.":
      "Lar kunder sjekke ordre- og leveringsstatus direkte fra systemer som nShift eller ERP via sikre verktøykall.",
    "Internal knowledge": "Intern kunnskap",
    "Procedures & policy agent": "Prosedyre- og policyagent",
    "Answers “how do we do this?” questions using internal procedures, policies and intranet content.":
      "Svar på «hvordan gjør vi dette?» ved hjelp av interne prosedyrer, policyer og intranettinnhold.",
    "Ops & factories": "Drift og fabrikker",
    "On-prem procedure search": "On-prem prosedyresøk",
    "On-premise agent for large document sets, guiding operators to the right procedure without exposing data externally.":
      "On-prem-agent for store dokumentmengder som guider operatører til riktig prosedyre uten å eksponere data eksternt.",
    "Already in use by leading companies":
      "Allerede i bruk hos ledende selskaper",
    "Customer stories": "Kundehistorier",
    "Already running in production": "Allerede i produksjon",
    "From a national retailer's customer service to operators on the factory floor - communication agents already resolve real work for Nordic and global enterprises.":
      "Fra en nasjonal detaljists kundeservice til operatører på fabrikkgulvet - dialogagenter løser allerede reelt arbeid i nordiske og globale virksomheter.",
    "Norway's leading hardware retailer · Customer service":
      "Norges ledende jernvareforhandler · Kundeservice",
    "of meaningful customer conversations resolved by the agent during pilot - without adding headcount.":
      "av meningsfulle kundesamtaler løst av agenten i pilot - uten å øke bemanningen.",
    "The agent answers questions about opening hours, terms and returns, fetches live order status via nShift, and gives product tips - all from one shared knowledge layer connected to Jernia's systems.":
      "Agenten svarer på spørsmål om åpningstider, vilkår og retur, henter sanntids ordrestatus via nShift, og gir produkttips - alt fra ett felles kunnskapslag koblet til Jernias systemer.",
    "Web chat": "Nettprat",
    "RAG on docs": "RAG på dokumenter",
    "Global healthcare leader · On-prem operations":
      "Global helseaktør · On-prem-drift",
    "control documents made searchable for factory operators on a fully closed, on-prem RAG solution.":
      "kontrolldokumenter gjort søkbare for fabrikkoperatører på en fullt lukket, on-prem RAG-løsning.",
    "Operators get instant, correct answers to critical procedures directly from a closed environment - sensitive data never leaves the factory, compliance and security requirements are fully respected.":
      "Operatører får umiddelbare, korrekte svar på kritiske prosedyrer rett fra et lukket miljø - sensitive data forlater aldri fabrikken, og krav til compliance og sikkerhet er fullt ivaretatt.",
    "On-prem": "On-prem",
    RAG: "RAG",
    "Internal procedures": "Interne prosedyrer",
    "Compliance-first": "Compliance-first",
    "Norway’s leading hardware retailer":
      "Norges ledende jernvareforhandler",
    "Answers customer questions about opening hours, locations, terms and returns.":
      "Svar på kundespørsmål om åpningstider, lokasjoner, vilkår og retur.",
    "Fetches order status via nShift integration.":
      "Henter ordrestatus via nShift-integrasjon.",
    "Provides tips & tricks for products.":
      "Gir tips og triks for produkter.",
    "Automates customer service with documents in a dedicated instance.":
      "Automatiserer kundeservice med dokumenter i en dedikert instans.",
    "46% of meaningful conversations resolved in pilot period.":
      "46 % av meningsfulle samtaler løst i pilotperioden.",
    "Technologies: LLM, tool calling, customer service agent.":
      "Teknologi: LLM, verktøykall, kundeserviceagent.",
    "Result: faster responses, fewer tickets, and a better customer experience without adding headcount.":
      "Resultat: raskere svar, færre saker og en bedre kundeopplevelse uten å øke bemanningen.",
    "Jernia pilot insights": "Jernia pilotinnsikt",
    "Read the full story →": "Les hele historien →",
    "Global healthcare industry leader":
      "Global leder innen helsesektoren",
    "10,000+ control documents uploaded for internal use in factories.":
      "10 000+ kontroll-dokumenter lastet opp for intern bruk i fabrikker.",
    "Closed on-prem solution with RAG for fast, correct answers on internal procedures.":
      "Lukket on-prem-løsning med RAG for raske og korrekte svar om interne prosedyrer.",
    "Ensures information flow without exposing sensitive data.":
      "Sikrer informasjonsflyt uten å eksponere sensitive data.",
    "Technologies: on-prem, enterprise, intranet agent.":
      "Teknologi: on-prem, enterprise, intranett-agent.",
    "Result: operators get instant answers on critical procedures, while compliance and security requirements are fully respected.":
      "Resultat: operatører får umiddelbare svar på kritiske prosedyrer, samtidig som krav til compliance og sikkerhet ivaretas.",
    "GE Healthcare ops assistant":
      "GE Healthcare driftsassistent",
    "Why this matters": "Hvorfor dette betyr noe",
    "From answering questions to resolving work":
      "Fra å svare på spørsmål til å løse arbeid",
    "Communication agents don’t just respond - they complete work across systems.":
      "Dialogagenter svarer ikke bare - de fullfører arbeid på tvers av systemer.",
    "Shorter resolution times for common issues":
      "Kortere løsnings­tider for vanlige saker",
    "Fewer tickets and handovers between teams":
      "Færre saker og overleveringer mellom team",
    "Lower cost per case handled":
      "Lavere kostnad per håndtert sak",
    "A consistent experience across channels":
      "En konsistent opplevelse på tvers av kanaler",
    "Instead of sending people between systems, the agent looks up data, completes simple actions, and involves humans only when it matters.":
      "I stedet for å sende folk mellom systemer slår agenten opp data, gjennomfører enkle handlinger og involverer mennesker kun når det er nødvendig.",
    "Operational processes": "Operasjonelle prosesser",
    "Agentic AI workflows that connect systems, data and decisions - across operations, factories and back-office. Remove up to 80% of repetitive tasks and free capacity for value creation.":
      "Agentiske AI-arbeidsflyter som kobler systemer, data og beslutninger - på tvers av drift, fabrikker og back-office. Fjern opptil 80 % av repetitive oppgaver og frigjør kapasitet til verdiskaping.",
    Faster: "Raskere",
    Fewer: "Færre",
    More: "Mer",
    "decisions across systems": "beslutninger på tvers av systemer",
    "manual handovers and delays": "manuelle overleveringer og forsinkelser",
    "predictable operations": "forutsigbar drift",
    "Where it’s used": "Hvor det brukes",
    "Cross-department decisions where silos hide context and slow action.":
      "Tverrfunksjonelle beslutninger der siloer skjuler kontekst og bremser handling.",
    "Connect operational signals": "Koble operative signaler",
    "Factories and production lines": "Fabrikker og produksjonslinjer",
    "Quality, deviations and incidents":
      "Kvalitet, avvik og hendelser",
    "Correlate flow and constraints":
      "Knytte sammen flyt og begrensninger",
    "Supply chain and logistics": "Forsyningskjede og logistikk",
    "Cross-system operational workflows":
      "Operasjonelle arbeidsflyter på tvers av systemer",
    "Advise and coordinate actions":
      "Rådgive og koordinere handlinger",
    "Finance, HR and back-office operations":
      "Finans, HR og back-office",
    "Sales, orders and tenders":
      "Salg, ordre og anbud",
    "Where traditional automation breaks":
      "Der tradisjonell automatisering bryter sammen",
    Before: "Før",
    After: "Etter",
    System: "System",
    Rule: "Regel",
    Handover: "Overlevering",
    Spreadsheet: "Regneark",
    Delay: "Forsinkelse",
    "Decisions stall at handovers":
      "Beslutninger stopper ved overleveringer",
    "Context gets lost between systems":
      "Kontekst går tapt mellom systemer",
    "Delays compound across teams":
      "Forsinkelser forsterkes på tvers av team",
    Context: "Kontekst",
    Decision: "Beslutning",
    Action: "Handling",
    "Context is preserved end to end":
      "Kontekst bevares ende-til-ende",
    "Decisions happen where work happens":
      "Beslutninger skjer der arbeidet skjer",
    "Actions follow a single logic layer":
      "Handlinger følger ett logikklag",
    "Example operational workflows":
      "Eksempler på operasjonelle arbeidsflyter",
    "Concrete patterns you can apply to your systems and operations - and extend to your own cases.":
      "Konkrete mønstre du kan bruke i systemene og driften din - og utvide til egne case.",
    "Deviation & incident triage": "Avvik og hendelsestriage",
    "Incident triage with full context":
      "Hendelsestriage med full kontekst",
    "Classify incidents, add context and route to the right team.":
      "Klassifiser hendelser, legg til kontekst og ruter til riktig team.",
    "Production support": "Produksjonsstøtte",
    "Live operator decision support":
      "Beslutningsstøtte for operatører i sanntid",
    "Combine procedures with live context and suggest next actions.":
      "Kombiner prosedyrer med sanntidskontekst og foreslå neste handlinger.",
    "Supply chain": "Forsyningskjede",
    "Supply chain exception handling":
      "Håndtering av avvik i forsyningskjeden",
    "Detect delays, pull data and propose actions with human approval.":
      "Oppdag forsinkelser, hent data og foreslå handlinger med menneskelig godkjenning.",
    "Back-office automation": "Back-office-automatisering",
    "Finance & case triage automation":
      "Automatisering av økonomi og sakstriasje",
    "Extract key fields and route cases; humans handle exceptions.":
      "Hent ut nøkkelfelt og ruter saker; mennesker håndterer unntak.",
    "Why AI Process Optimization":
      "Hvorfor prosessagenter",
    "Context-aware": "Kontekstbevisst",
    "Decisions consider history, live context and rules - not just static thresholds.":
      "Beslutninger tar hensyn til historikk, sanntidskontekst og regler - ikke bare statiske terskler.",
    "Cross-system": "Tverrsystem",
    "Workflows follow how work actually flows across ERP, MES, CRM, ticketing and documents.":
      "Arbeidsflyter følger hvordan arbeidet faktisk flyter på tvers av ERP, MES, CRM, saksbehandling og dokumenter.",
    Evolvable: "Utviklingsbart",
    "Logic, rules and models can change without rebuilding integrations or code.":
      "Logikk, regler og modeller kan endres uten å bygge om integrasjoner eller kode.",
    "From siloed systems to value streams":
      "Fra silosystemer til verdistrømmer",
    Siloed: "Silo",
    "Value stream": "Verdistrøm",
    Signal: "Signal",
    "How we start - and how it scales":
      "Hvordan vi starter - og hvordan det skalerer",
    "Scope & prioritize": "Avgrens og prioriter",
    "Pick 1-2 workflows, define success and required data.":
      "Velg 1-2 arbeidsflyter, definer suksess og nødvendig data.",
    "Build & connect": "Bygg og koble",
    "Connect systems, implement logic, and validate outcomes with humans in the loop.":
      "Koble systemer, implementer logikk og valider resultater med mennesker i loopen.",
    "Operate & improve": "Drift og forbedre",
    "Monitor outcomes, adjust rules and models, and expand as value proves out.":
      "Overvåk resultater, juster regler og modeller, og utvid når verdien bekreftes.",
    "Data governance, hosting and human-in-the-loop controls are built into every engagement.":
      "Datagovernance, hosting og kontroller for menneske-i-loopen er bygget inn i hvert oppdrag.",
    "Agentic workflows that connect systems, data and decisions across operations - removing repetitive work, surfacing context and keeping humans in control.":
      "Agentiske arbeidsflyter som kobler sammen systemer, data og beslutninger på tvers av driften - fjerner repetitivt arbeid, løfter kontekst frem og holder mennesker i kontroll.",
    "Agentic workflows that sense signals from your systems, gather the right context, decide and act - removing repetitive work while keeping humans in control of what matters.":
      "Agentiske arbeidsflyter som fanger opp signaler fra systemene deres, henter riktig kontekst, beslutter og handler - fjerner repetitivt arbeid mens mennesker beholder kontroll på det som teller.",
    "Up to 80%": "Opptil 80 %",
    "of repetitive work removed in the workflows we automate*":
      "av repetitivt arbeid fjernet i arbeidsflytene vi automatiserer*",
    "Hours back": "Timer tilbake",
    "to teams every week, freed from coordination and lookups":
      "til teamene hver uke, frigjort fra koordinering og oppslag",
    "from kickoff to first workflow live in production":
      "fra oppstart til første arbeidsflyt i produksjon",
    "One orchestration layer. Many processes.":
      "Ett orkestreringslag. Mange prosesser.",
    "Instead of new point tools for every process, one agent platform connects to your existing systems and orchestrates the work end to end - with the same logic, governance and audit trail across every workflow.":
      "I stedet for nye punktverktøy for hver prosess kobles én agentplattform til eksisterende systemer og orkestrerer arbeidet ende til ende - med samme logikk, governance og revisjonsspor på tvers av alle arbeidsflyter.",
    "One platform connected to your operational data":
      "Én plattform koblet til operasjonelle data",
    "Workflows reuse the same context, rules and integrations":
      "Arbeidsflyter gjenbruker samme kontekst, regler og integrasjoner",
    "Human checkpoints stay where judgment matters":
      "Menneskelige kontrollpunkter beholdes der skjønn er viktig",
    "Agentic means the workflow can reason, decide and act - not just move data between systems.":
      "Agentisk betyr at arbeidsflyten kan resonnere, beslutte og handle - ikke bare flytte data mellom systemer.",
    "One orchestration platform connected to operational systems and downstream actions":
      "Én orkestreringsplattform koblet til operasjonelle systemer og nedstrøms handlinger",
    "ORCHESTRATION LAYER": "ORKESTRERINGSLAG",
    "Sense · Decide · Act": "Fangst · Beslutt · Handle",
    "Production lines": "Produksjonslinjer",
    "Quality & deviations": "Kvalitet og avvik",
    "Finance ops": "Finansdrift",
    "Tickets & cases": "Saker",
    Approvals: "Godkjenninger",
    "Where AI process optimization fits in":
      "Hvor prosessagenter passer inn",
    "From service desks and back-office to factory floor and project delivery - the same orchestration layer fits very different parts of the business.":
      "Fra servicedesk og back-office til fabrikkgulv og prosjektleveranse - det samme orkestreringslaget passer i svært ulike deler av virksomheten.",
    "From signal to action": "Fra signal til handling",
    "How an agent workflow actually runs a process":
      "Slik kjører en agent-arbeidsflyt en prosess i praksis",
    "Every workflow goes through the same four steps - so the work is explainable, traceable and easy to extend, instead of a black box bolted onto your systems.":
      "Hver arbeidsflyt går gjennom de samme fire stegene - så arbeidet blir forklarbart, sporbart og lett å utvide, i stedet for en svart boks bolted på systemene deres.",
    "Sense the signal": "Fang opp signalet",
    "Pick up a trigger from your systems - a stuck order, a deviation on the line, a high-priority ticket, a SLA at risk - and start the right workflow.":
      "Plukk opp en trigger fra systemene - en ordre som har stoppet, et avvik på linjen, en høy-prioritert sak, en SLA i fare - og start riktig arbeidsflyt.",
    "Gather the context": "Hent inn konteksten",
    "Pull live data from ERP, MES, CRM, ticketing and procedures - through secure tool calls - so the decision is grounded in real operational reality.":
      "Hent sanntidsdata fra ERP, MES, CRM, saksbehandling og prosedyrer - gjennom sikre verktøykall - så beslutningen forankres i faktisk operativ virkelighet.",
    "Decide and act": "Beslutt og handle",
    "Apply rules, models and reasoning, then execute the action: reroute, notify, update a record or open a case - in the same flow, with full audit log.":
      "Bruk regler, modeller og resonnering, og utfør deretter handlingen: omdiriger, varsle, oppdater en post eller opprett en sak - i samme flyt, med fullt revisjonsspor.",
    "Escalate with full context": "Eskaler med full kontekst",
    "For exceptions or high-stakes calls, the workflow hands over to the right person with the data it pulled and a recommended next step already attached.":
      "Ved unntak eller viktige beslutninger sender arbeidsflyten saken videre til rett person - med dataene den hentet og et anbefalt neste steg allerede vedlagt.",
    "Dify workflow builder showing an operational agent workflow with branching logic, tool calls and human checkpoints":
      "Dify arbeidsflytbygger som viser en operativ agent-arbeidsflyt med forgreningslogikk, verktøykall og menneskelige kontrollpunkter",
    "From industrial operators on the factory floor to media intelligence teams - agent workflows already remove repetitive work for Nordic and global enterprises.":
      "Fra industrielle operatører på fabrikkgulvet til media intelligence-team - agent-arbeidsflyter fjerner allerede repetitivt arbeid for nordiske og globale virksomheter.",
    "Global healthcare leader · Industrial operations":
      "Global helsetech-leder · Industriell drift",
    "control documents made instantly searchable for factory operators - on a fully closed, on-prem RAG solution.":
      "kontrolldokumenter gjort umiddelbart søkbare for fabrikkoperatører - på en fullstendig lukket, on-prem RAG-løsning.",
    "Operators get correct answers to critical procedures in seconds - directly inside their tools - while sensitive data stays inside the factory and compliance requirements are fully respected.":
      "Operatører får riktige svar på kritiske prosedyrer på sekunder - direkte i verktøyene sine - mens sensitive data forblir inne i fabrikken og compliance-krav fullt ut respekteres.",
    "GE Healthcare industrial operations":
      "GE Healthcare industriell drift",
    "Identifying AI opportunities in industrial operations":
      "Identifisering av AI-muligheter i industriell drift",
    "Media intelligence platform · Editorial operations":
      "Media intelligence-plattform · Redaksjonell drift",
    "Hours → minutes": "Timer → minutter",
    Hours: "Timer",
    Minutes: "Minutter",
    "for analysts to go from raw media signals to structured, ready-to-use intelligence.":
      "for at analytikere skal gå fra rå mediesignaler til strukturert, klar-til-bruk innsikt.",
    "Agent workflows ingest, classify, summarize and route media signals across sources - so the team spends time on insight and decisions instead of moving data between tools.":
      "Agent-arbeidsflyter henter inn, klassifiserer, oppsummerer og ruter mediesignaler på tvers av kilder - så teamet bruker tid på innsikt og beslutninger i stedet for å flytte data mellom verktøy.",
    "Multi-source ingestion": "Flerkildeinnhenting",
    Classification: "Klassifisering",
    Summarization: "Oppsummering",
    "Mediex media intelligence platform":
      "Mediex media intelligence-plattform",
    "Short answers on what process optimization really means with agentic AI, where it fits, and how we keep humans in control.":
      "Korte svar på hva prosessagenter faktisk er, hvor de passer og hvordan vi holder mennesker i kontroll.",
    "AI process optimization uses agentic workflows to automate decision-heavy work across operations, back-office and production. The agent connects to your existing systems, gathers context, decides and acts - and only escalates to people when it should.":
      "Prosessagenter bruker agentiske arbeidsflyter for å automatisere beslutningstungt arbeid på tvers av drift, back-office og produksjon. Agenten kobles til eksisterende systemer, henter kontekst, beslutter og handler - og eskalerer kun til mennesker når den bør.",
    "Which processes are a good fit?":
      "Hvilke prosesser passer godt?",
    "Any process with repetitive decisions across multiple systems is a candidate: incident triage, supply chain exception handling, finance and case routing, quality and deviations, production support and back-office automation.":
      "Enhver prosess med repetitive beslutninger på tvers av flere systemer er en kandidat: hendelsestriage, håndtering av avvik i forsyningskjeden, finans- og saksruting, kvalitet og avvik, produksjonsstøtte og back-office-automatisering.",
    "How much manual work can it remove?":
      "Hvor mye manuelt arbeid kan den fjerne?",
    "Up to 80% of repetitive tasks in a given workflow. The exact reduction depends on process complexity and how integrated your systems are - most teams see meaningful capacity freed up after the first deployment.":
      "Opptil 80 % av repetitive oppgaver i en gitt arbeidsflyt. Den faktiske reduksjonen avhenger av prosesskompleksitet og hvor integrerte systemene er - de fleste team ser meningsfull kapasitet frigjort etter første utrulling.",
    "Does the agent replace people?":
      "Erstatter agenten mennesker?",
    "No. The agent handles the routine parts of the workflow so people focus on decisions that need judgment, accountability and relationships. Humans stay in the loop for exceptions and high-stakes decisions.":
      "Nei. Agenten håndterer rutinedelene av arbeidsflyten så mennesker kan fokusere på beslutninger som krever skjønn, ansvar og relasjoner. Mennesker forblir i loopen for unntak og viktige beslutninger.",
    "How does it connect to our existing systems?":
      "Hvordan kobles den mot systemene vi allerede har?",
    "Through standard APIs, databases and tool calls. The platform talks to ERP, MES, CRM, ticketing, document stores, data warehouses and custom systems - so we extend what you already have instead of replacing it.":
      "Gjennom standard API-er, databaser og tool calls. Plattformen snakker med ERP, MES, CRM, sakssystemer, dokumentlagre, datavarehus og egne systemer - så vi utvider det dere allerede har i stedet for å erstatte det.",
    "Where does our data live, and is it secure?":
      "Hvor ligger dataene våre, og er det sikkert?",
    "By default the platform runs on our managed Nordic environment with full audit trail, role-based access and EU data residency. When security, scale or data classification requires it, we deploy the same platform inside your own cloud or on-premise.":
      "Som standard kjører plattformen i vårt forvaltede nordiske miljø med full revisjonslogg, rollebasert tilgang og EU-datalagring. Når sikkerhet, skala eller dataklassifisering krever det, ruller vi ut samme plattform i deres egen sky eller on-premise.",
    "What does a typical implementation look like?":
      "Hvordan ser en typisk implementering ut?",
    "We pick one high-value workflow, get it live in 2-4 weeks with you, and then expand. Your team owns the workflows from day one - we run the platform and add new workflows as priorities open up.":
      "Vi velger én arbeidsflyt med høy verdi, får den i produksjon på 2-4 uker sammen med dere, og utvider derfra. Teamet deres eier arbeidsflytene fra dag én - vi drifter plattformen og legger til nye arbeidsflyter etter hvert som prioriteringene åpner seg.",
    "MedieX: From media noise to actionable insight":
      "MedieX: Fra mediestøy til handlingsrettet innsikt",
    "Digital products & services":
      "Digitale produkter og tjenester",
    "Embed agentic AI directly into your SaaS or digital platform - as native product functionality, not a bolt-on chatbot.":
      "Bygg agentisk AI direkte inn i SaaS eller digitale plattformer - som native produktfunksjonalitet, ikke en påklistret chatbot.",
    "Digital products & platforms":
      "Digitale produkter og plattformer",
    "Make agentic AI a native part of your product - inline guidance, copilots and suggested actions that share one intelligence layer, not bolt-on chatbots beside it.":
      "Gjør agentisk AI til en native del av produktet - inline veiledning, copiloter og foreslåtte handlinger som deler ett intelligenslag, ikke påklistrede chatboter ved siden av.",
    Native: "Native",
    "AI moments inside the product, not a chatbot beside it":
      "AI-øyeblikk inne i produktet, ikke en chatbot ved siden av",
    "One layer": "Ett lag",
    "shared intelligence many product features can reuse":
      "delt intelligens som mange produktfunksjoner kan gjenbruke",
    "2-6 weeks":
      "2-6 uker",
    "from kickoff to the first AI feature live in production":
      "fra oppstart til første AI-funksjon i produksjon",
    "One product intelligence layer. Many AI moments.":
      "Ett produktintelligenslag. Mange AI-øyeblikk.",
    "Instead of stitching point AI features into different parts of the product, one shared layer powers every moment - search, guidance, copilots, actions and insight - using the same data, rules and design language your product already has.":
      "I stedet for å sy enkeltstående AI-funksjoner inn i ulike deler av produktet, driver ett felles lag hvert øyeblikk - søk, veiledning, copiloter, handlinger og innsikt - med samme data, regler og designspråk som produktet allerede har.",
    "One AI layer connected to your product data and APIs":
      "Ett AI-lag koblet til produktdata og APIer",
    "Features reuse the same prompts, tools and guardrails":
      "Funksjoner gjenbruker samme prompts, verktøy og guardrails",
    "Shipped like any other product feature - your team owns it":
      "Sendes ut som hvilken som helst produktfunksjon - teamet deres eier den",
    "Native means it lives in the flows users already know - not in a separate window they have to remember to open.":
      "Native betyr at det bor i flytene brukerne allerede kjenner - ikke i et eget vindu de må huske å åpne.",
    "One product intelligence layer connected to AI moments inside the product surface":
      "Ett produktintelligenslag koblet til AI-øyeblikk inne i produktflaten",
    "PRODUCT INTELLIGENCE": "PRODUKTINTELLIGENS",
    "Reason · Suggest · Act": "Resonner · Foreslå · Handle",
    "PRODUCT DATA & APIs": "PRODUKTDATA OG APIer",
    "Inline guidance": "Inline veiledning",
    "Domain copilots": "Domene-copiloter",
    "Smart search": "Smart søk",
    "Insight summaries": "Innsiktssammendrag",
    "Suggested actions": "Foreslåtte handlinger",
    "Workflow actions": "Arbeidsflythandlinger",
    "Where AI-native features live in your product":
      "Hvor AI-native funksjoner bor i produktet deres",
    "From customer-facing surfaces to internal tools and analytics - the same intelligence layer powers AI moments wherever your users already work.":
      "Fra kundevendte flater til interne verktøy og analyse - samme intelligenslag driver AI-øyeblikk der brukerne allerede jobber.",
    "Digital surfaces": "Digitale flater",
    "Expose AI in customer portals, self-service, mobile apps and embedded UIs.":
      "Eksponer AI i kundeportaler, selvbetjening, mobilapper og innebygde grensesnitt.",
    "AI summaries, copilots and explanations inside dashboards and analytics.":
      "AI-sammendrag, copiloter og forklaringer inne i dashbord og analyse.",
    "Self-service product surfaces and internal tools that take over from manual handling.":
      "Selvbetjeningsflater og interne verktøy som tar over fra manuell håndtering.",
    "From product moment to live feature":
      "Fra produktøyeblikk til levende funksjon",
    "How an AI feature actually lands in your product":
      "Hvordan en AI-funksjon faktisk lander i produktet",
    "Each AI feature follows the same four steps - so it ships like any other product capability, with metrics, ownership and a roadmap, not a one-off experiment.":
      "Hver AI-funksjon følger de samme fire stegene - så den sendes ut som hvilken som helst produktkapabilitet, med målinger, eierskap og veikart, ikke som et engangs eksperiment.",
    "Pick the moment": "Velg øyeblikket",
    "Find one product moment with the highest leverage - where users get stuck, repeat work or wait for someone - and define what success looks like.":
      "Finn ett produktøyeblikk med høyest løftekraft - der brukere setter seg fast, gjentar arbeid eller venter på noen - og definer hva suksess ser ut som.",
    "Design it native": "Design det native",
    "Design the AI moment inside the existing flow - same data, same UI patterns, same auth - so it feels like a feature, not a bolt-on chatbot.":
      "Design AI-øyeblikket inne i eksisterende flyt - samme data, samme UI-mønstre, samme auth - så det føles som en funksjon, ikke en påklistret chatbot.",
    "Build on the platform": "Bygg på plattformen",
    "Build the workflow on the agentic platform: prompts, tools, retrieval and guardrails - reusable across other moments, not stitched into the product code.":
      "Bygg arbeidsflyten på den agentiske plattformen: prompts, verktøy, gjenfinning og guardrails - gjenbrukbart på tvers av andre øyeblikk, ikke sydd inn i produktkoden.",
    "Ship, measure, expand": "Send, mål, utvid",
    "Release to a slice of users, instrument adoption and quality, iterate, then reuse the same building blocks for the next AI moment.":
      "Slipp til en del av brukerne, mål adopsjon og kvalitet, iterer, og gjenbruk de samme byggeklossene til neste AI-øyeblikk.",
    "Dify workflow builder configuring an AI feature for a product surface, with prompts, tools and guardrails":
      "Dify workflow builder som konfigurerer en AI-funksjon for en produktflate, med prompts, verktøy og guardrails",
    "An agentic product platform built and operated for a Nordic media intelligence team - serving editorial and communication users every day.":
      "En agentisk produktplattform bygget og driftet for et nordisk medieintelligensteam - som betjener redaksjonelle og kommunikasjonsbrukere hver dag.",
    "From a Nordic media intelligence platform to an enterprise LMS used by 40,000+ learners worldwide - agentic AI shipped as native product capability.":
      "Fra en nordisk medieintelligensplattform til en bedrifts-LMS brukt av 40 000+ brukere over hele verden - agentisk AI levert som native produktkapabilitet.",
    "Media intelligence platform · Editorial product":
      "Medieintelligensplattform · Redaksjonelt produkt",
    "Enterprise LMS · Competency Intelligence":
      "Bedrifts-LMS · Competency Intelligence",
    "learners on an LMS that ships Dify-powered course generation, report summaries and semantic search as native product capability.":
      "brukere på en LMS som leverer Dify-drevet kursgenerering, rapportsammendrag og semantisk søk som native produktkapabilitet.",
    "Used by Comcast, Grupa Azoty, Science Pharma, Medivet and more. AI lives inside the product flows trainers and learners already use - the natural step from LMS to Competency Intelligence.":
      "Brukt av Comcast, Grupa Azoty, Science Pharma, Medivet med flere. AI bor inne i produktflyten som trenere og brukere allerede bruker - det naturlige steget fra LMS til Competency Intelligence.",
    "AI in product": "AI i produktet",
    "Course generation": "Kursgenerering",
    "Semantic search": "Semantisk søk",
    "L&D": "L&D",
    "Samelane: From LMS to AI-native Competency Intelligence":
      "Samelane: Fra LMS til AI-native Competency Intelligence",
    "Samelane learning platform": "Samelane læringsplattform",
    "of all digital editorial media in Norway covered by an agentic product that turns noise into structured intelligence.":
      "av all digital redaksjonell media i Norge dekket av et agentisk produkt som gjør støy om til strukturert innsikt.",
    "AI is built into the product itself - ingestion, contextual sentiment, risk assessment and summaries are native features of MedieX, not a separate chatbot. EU AI Act compliant by design.":
      "AI er bygget inn i selve produktet - innhenting, kontekstuell sentiment, risikovurdering og sammendrag er native funksjoner i MedieX, ikke en separat chatbot. EU AI Act compliant by design.",
    "Agentic product": "Agentisk produkt",
    Sentiment: "Sentiment",
    "EU AI Act": "EU AI Act",
    "Short answers on what it means to make AI a native part of your product, where to start, and how it ships alongside your team.":
      "Korte svar på hva det vil si å gjøre AI til en native del av produktet, hvor man starter, og hvordan det sendes ut sammen med teamet deres.",
    "What is an AI-enabled product?":
      "Hva er en produktagent?",
    "An AI-enabled product has agentic AI built into the product itself - as inline guidance, copilots, suggested actions and insight - instead of as a separate chatbot bolted on the side. The AI shares the product's data, logic and design system, so it feels like a native feature.":
      "En produktagent er agentisk AI bygget inn i selve produktet - som inline veiledning, copiloter, foreslåtte handlinger og innsikt - i stedet for som en separat chatbot på siden. AI-en deler produktets data, logikk og designsystem, så det føles som en native funksjon.",
    "How is this different from adding a chatbot?":
      "Hva er forskjellen fra å legge til en chatbot?",
    "A chatbot lives next to the product. AI-enabled features live inside it: a suggestion in the form your user is filling, a summary at the top of the dashboard, an action they can apply with one click. They reuse the product's auth, data and UI, and are shipped like any other product feature.":
      "En chatbot bor ved siden av produktet. Produktagenter bor inni det: et forslag i skjemaet brukeren fyller ut, et sammendrag øverst i dashbordet, en handling de kan utføre med ett klikk. De gjenbruker produktets auth, data og UI, og sendes ut som hvilken som helst produktfunksjon.",
    "Where does AI usually show up first inside a product?":
      "Hvor dukker AI vanligvis opp først inne i et produkt?",
    "Usually in the moments where users get stuck or repeat the same work: onboarding, search, configuring something, summarising activity, drafting a response. Those are the highest-impact spots to start - small AI moments that change how the product feels.":
      "Vanligvis i øyeblikkene der brukere setter seg fast eller gjentar samme arbeid: onboarding, søk, konfigurering, oppsummering av aktivitet, utforming av svar. Det er stedene med størst effekt å starte - små AI-øyeblikk som endrer hvordan produktet føles.",
    "Do we need to rebuild our product?":
      "Må vi bygge om produktet vårt?",
    "No. We add AI features alongside what you already have using your existing APIs, data and design system. The AI layer can grow inside your product over time - one feature at a time - without a rewrite.":
      "Nei. Vi legger til AI-funksjoner sammen med det dere allerede har, ved å bruke eksisterende API-er, data og designsystem. AI-laget kan vokse inne i produktet over tid - én funksjon om gangen - uten en omskrivning.",
    "Who owns the product features we ship together?":
      "Hvem eier produktfunksjonene vi sender ut sammen?",
    "You do. We work alongside your product, design and engineering teams - the AI features land in your codebase or your platform, follow your release process, and your team owns the roadmap.":
      "Det gjør dere. Vi jobber sammen med produkt-, design- og ingeniørteamene - AI-funksjonene lander i kodebasen eller plattformen deres, følger deres releaseprosess, og teamet deres eier veikartet.",
    "How do you handle data, privacy and model choice?":
      "Hvordan håndterer dere data, personvern og modellvalg?",
    "All AI features run on the agentic platform with full audit trail, role-based access and EU data residency by default. We choose models per use case (open or proprietary) and can deploy in our managed Nordic environment, your own cloud or on-premise if security requires it.":
      "Alle AI-funksjoner kjører på den agentiske plattformen med full revisjonslogg, rollebasert tilgang og EU-datalagring som standard. Vi velger modeller per bruksområde (åpne eller proprietære) og kan rulle ut i vårt forvaltede nordiske miljø, deres egen sky eller on-premise hvis sikkerheten krever det.",
    "How long until the first AI feature is live?":
      "Hvor lenge til første AI-funksjon er live?",
    "Typically 2-6 weeks from kickoff to first AI moment in production - scoped to one high-value feature, with metrics in place to measure adoption and impact before expanding.":
      "Typisk 2-6 uker fra oppstart til første AI-øyeblikk i produksjon - avgrenset til én funksjon med høy verdi, med målinger på plass for å måle adopsjon og effekt før utvidelse.",
    "A short conversation to find the first AI moment that's worth shipping inside your product.":
      "En kort samtale for å finne det første AI-øyeblikket som er verdt å sende ut inne i produktet deres.",
    "Embed agentic AI as native product capability - inline guidance, copilots, suggested actions and insight - sharing one intelligence layer across every surface.":
      "Bygg agentisk AI inn som native produktkapabilitet - inline veiledning, copiloter, foreslåtte handlinger og innsikt - som deler ett intelligenslag på tvers av alle flater.",
    Smoother: "Smidigere",
    Smarter: "Smartere",
    Lean: "Slank",
    "user journeys and guidance":
      "brukerreiser og veiledning",
    "AI-powered product experiences":
      "AI-drevne produktopplevelser",
    "operations through automation":
      "drift gjennom automatisering",
    "Built for digital products and platforms":
      "Bygget for digitale produkter og plattformer",
    "For product and engineering teams building SaaS, industry platforms or internal tools.":
      "For produkt- og ingeniørteam som bygger SaaS, bransjeplattformer eller interne verktøy.",
    "SaaS platforms": "SaaS-plattformer",
    "Industry-specific software": "Bransjespesifikk programvare",
    "Internal digital platforms": "Interne digitale plattformer",
    "Customer and partner portals": "Kunde- og partnerportaler",
    "How AI shows up inside products":
      "Hvordan AI vises i produkter",
    "Product capabilities that feel native, not bolted on.":
      "Produktkapabiliteter som føles native, ikke påklistret.",
    "Product guidance": "Produktveiledning",
    "AI guides users through complex choices, learns from product data and rules, and is embedded directly in UI flows.":
      "AI veileder brukere gjennom komplekse valg, lærer av produktdata og regler, og er innebygd direkte i UI-flyt.",
    Copilots: "Copiloter",
    "Domain-specific copilots": "Domene-spesifikke copiloter",
    "Copilots scoped to your product domain that understand terminology, rules and context.":
      "Copiloter avgrenset til produktdomenet som forstår terminologi, regler og kontekst.",
    Workflows: "Arbeidsflyter",
    "Workflow automation inside the product":
      "Automatisering av arbeidsflyt i produktet",
    "AI triggers actions based on user input or events, automating steps across internal services.":
      "AI trigges av brukerinput eller hendelser og automatiserer steg på tvers av interne tjenester.",
    Insights: "Innsikt",
    "Insight & summarization features":
      "Innsikt- og oppsummeringsfunksjoner",
    "AI summarizes activity or cases, turning raw data into understandable insights inside dashboards.":
      "AI oppsummerer aktivitet eller saker og gjør rådata til forståelig innsikt i dashbord.",
    "Why AI-enabled products win":
      "Hvorfor produktagenter vinner",
    Experience: "Opplevelse",
    "AI removes friction inside the product, so users complete tasks faster and with fewer steps.":
      "AI fjerner friksjon i produktet slik at brukere fullfører oppgaver raskere og med færre steg.",
    Innovation: "Innovasjon",
    "New AI-native capabilities create differentiated offerings and unlock new revenue paths.":
      "Nye AI-native kapabiliteter skaper differensierte tilbud og åpner nye inntektsmuligheter.",
    Efficiency: "Effektivitet",
    "Automated flows reduce manual work and keep service quality high as usage grows.":
      "Automatiserte flyter reduserer manuelt arbeid og holder servicekvaliteten høy når bruken øker.",
    "From AI features to intelligent platforms":
      "Fra AI-funksjoner til intelligente plattformer",
    "Move from one-off experiments to shared intelligence that many features can reuse.":
      "Gå fra engangseksperimenter til delt intelligens som mange funksjoner kan gjenbruke.",
    "Isolated features": "Isolerte funksjoner",
    "Single feature": "Enkeltfunksjon",
    "Separate logic": "Separat logikk",
    "Manual upkeep": "Manuelt vedlikehold",
    "Platform intelligence": "Plattformintelligens",
    "Shared context": "Delt kontekst",
    "Reusable logic": "Gjenbrukbar logikk",
    "Continuous value": "Kontinuerlig verdi",
    "AI-powered media intelligence platform":
      "AI-drevet medieintelligensplattform",
    "Turns unstructured media noise into structured, actionable intelligence - in seconds.":
      "Gjør ustrukturert mediestøy om til strukturert, handlingsbar innsikt - på sekunder.",
    "Agentic platform that understands context, not just keyword hits.":
      "Agentisk plattform som forstår kontekst, ikke bare nøkkelordtreff.",
    "Contextual sentiment and risk assessment per story.":
      "Kontekstuell sentiment- og risikovurdering per sak.",
    "Covers ~80% of all digital editorial media in Norway.":
      "Dekker ca. 80 % av alle digitale redaksjonelle medier i Norge.",
    "EU AI Act - compliant by design.":
      "EU AI Act - etterlevelse fra start.",
    "Technologies: agentic AI, sentiment analysis, RAG, NLP.":
      "Teknologi: agentisk AI, sentimentanalyse, RAG, NLP.",
    "Result: less operational effort, more strategic capacity. Direct OPEX impact for communication teams.":
      "Resultat: mindre driftsarbeid, mer strategisk kapasitet. Direkte OPEX-effekt for kommunikasjonsteam.",
    "MedieX: From media noise to actionable insight":
      "MedieX: Fra mediestøy til styrbar beslutningsinnsikt",
    "One system - different entry points":
      "Ett system - ulike inngangspunkter",
    "Front-end interaction": "Front-end-interaksjon",
    "Guidance and support": "Veiledning og støtte",
    "Execution and workflows": "Utførelse og arbeidsflyter",
    "Decisions and actions": "Beslutninger og handlinger",
    "Embedded functionality": "Innebygd funksjonalitet",
    "Differentiation and value creation":
      "Differensiering og verdiskaping",
    "Identify the highest-impact product areas and success metrics.":
      "Identifiser produktområder med størst effekt og suksessmåling.",
    "Build & integrate": "Bygg og integrer",
    "Design AI features into UX and connect to your data and services.":
      "Design AI-funksjoner inn i UX og koble til data og tjenester.",
    "Operate & evolve": "Drift og utvikle",
    "Monitor usage and quality, improve logic and models, and expand capabilities over time.":
      "Overvåk bruk og kvalitet, forbedre logikk og modeller og utvid kapabiliteter over tid.",
    "Governance, hosting and human-in-the-loop controls are built in - and we work alongside your product and engineering teams.":
      "Governance, hosting og kontroller for menneske-i-loopen er innebygd - og vi jobber sammen med produkt- og ingeniørteamene dine.",
    "Get in touch →": "Ta kontakt →",
    "AI Chatbots & Assistants": "AI-chatbots og assistenter",
    "Assistants connected to your systems and knowledge.":
      "Assistenter koblet til systemene og kunnskapen din.",
    "Trusted by": "Betrodd av",
    "Company credentials": "Selskapsfakta",
    "Agentic platform tree": "Agentisk plattformtre",
    Platforms: "Plattformer",
    "NeuroSYS helped us uncover process improvements and cost savings we had not identified ourselves. Their insight has been essential in increasing productivity and reducing costs.":
      "NeuroSYS hjalp oss å avdekke prosessforbedringer og kostnadsbesparelser vi ikke hadde identifisert selv. Deres innsikt har vært avgjørende for å øke produktiviteten og redusere kostnader.",
    "Working with NeuroSYS has been a great experience. What I appreciated most was their systematic workflow, which ensures projects are delivered on time. We engaged them to build a responsive IoT server architecture, and we couldn’t have chosen a better partner.":
      "Å jobbe med NeuroSYS har vært en svært god opplevelse. Det jeg satte mest pris på var deres systematiske arbeidsflyt, som sikrer at prosjekter leveres i tide. Vi engasjerte dem for å bygge en responsiv IoT-serverarkitektur, og vi kunne ikke valgt en bedre partner.",
    "I was positively surprised by how thorough and precise the report was. Through the systematic opportunity assessment and digitalization report, we not only gained an overview of several relevant projects for automated metal sorting, but also concrete improvement opportunities-something I didn’t expect.":
      "Jeg ble positivt overrasket over hvor grundig og presis rapporten var. Gjennom den systematiske mulighetsavklaringen og digitaliseringsrapporten fikk vi ikke bare en oversikt over flere relevante prosjekter for automatisert metallsortering, men også konkrete forbedringsmuligheter - noe jeg ikke forventet.",
    "Jernia customer service pilot":
      "Jernia kundeservicepilot",
    "Dify agentic workflow meetup in Oslo":
      "Dify agentisk arbeidsflyt-meetup i Oslo",
    "Industry visit at an operations site":
      "Industribesøk ved et driftssted",
    "Jernia pilot insight": "Jernia pilotinnsikt",
    "GE Healthcare operations assistant":
      "GE Healthcare driftsassistent",
    "Smart kundesenter AI Chat bot":
      "Smart kundesenter AI-chatbot",
    "Prosess- og operasjonsoptimalisering med AI":
      "Prosess- og operasjonsoptimalisering med AI",
    "Smart AI-kommunikasjonsagent":
      "Smart AI-kommunikasjonsagent",
    "Automatisk AI-integrasjonsmotor":
      "Automatisk AI-integrasjonsmotor",
    "IoT-plattform for smarthjem": "IoT-plattform for smarthjem",
    "Webutvikling og integrasjon": "Webutvikling og integrasjon",
    "Digitale låsesystemer for NCC":
      "Digitale låsesystemer for NCC",
    "Teamutvidelse for digital plattform":
      "Teamutvidelse for digital plattform",
    "Markedsplass for eiendom": "Markedsplass for eiendom",
    "AI-plattform for renovering":
      "AI-plattform for renovering",
    "Mulighetsavklaring": "Mulighetsavklaring",
    "Smart metallsortering": "Smart metallsortering",
    "Oslo, Norway": "Oslo, Norge",
    "Wrocław, Poland": "Wrocław, Polen",
    "Białystok, Poland": "Białystok, Polen",
    "Berlin, Germany": "Berlin, Tyskland",
    "NeuroSYS - AI that actually works in your business":
      "NeuroSYS - AI som faktisk fungerer i virksomheten din",
    "NeuroSYS designs and delivers AI solutions that automate processes, support people, and power digital products.":
      "NeuroSYS utvikler og leverer AI-løsninger som automatiserer prosesser, støtter mennesker og driver digitale produkter.",
    "Contact - NeuroSYS": "Kontakt - NeuroSYS",
    "Get in touch with NeuroSYS to discuss AI opportunities and next steps.":
      "Ta kontakt med NeuroSYS for å diskutere AI-muligheter og neste steg.",
    "About NeuroSYS": "Om NeuroSYS",
    "NeuroSYS builds AI systems that deliver measurable impact across operations, customer experience and digital products.":
      "NeuroSYS bygger AI-systemer som gir målbar effekt på tvers av drift, kundeopplevelse og digitale produkter.",
    "Agentic AI for real operations, products, and workflows.":
      "Agentisk AI for reell drift, produkter og arbeidsflyter.",
    "Built for organizations that want AI to work across real processes, products, and teams.":
      "Bygget for virksomheter som vil at AI skal fungere på tvers av reelle prosesser, produkter og team.",
    "Explore": "Utforsk",
    "Oslo, Norway": "Oslo, Norge",
    "Services - NeuroSYS": "Tjenester - NeuroSYS",
    "Advisory, training, solution design, implementation, and long-term AI upkeep.":
      "Rådgivning, opplæring, løsningsdesign, implementering og langsiktig AI-forvaltning.",
    "Our work - NeuroSYS": "Vårt arbeid - NeuroSYS",
    "See how we help organizations digitize, streamline and transform through AI.":
      "Se hvordan vi hjelper virksomheter å digitalisere, effektivisere og transformere med AI.",
    "GenAI Training & Workshops - NeuroSYS":
      "GenAI-opplæring og workshops - NeuroSYS",
    "Practical GenAI training and workshops that build shared understanding, identify real opportunities and prepare your teams to work with AI in practice.":
      "Praktisk GenAI-opplæring og workshops som skaper felles forståelse, identifiserer reelle muligheter og forbereder teamene på å jobbe med AI i praksis.",
  },
};

const normalizeText = (value) => value.replace(/\s+/g, " ").trim();

const ARROW_ICON_SVG = `
  <svg viewBox="0 0 20 20" role="presentation" focusable="false" aria-hidden="true">
    <path d="M4.5 10h10" />
    <path d="M10.5 4.5 16 10l-5.5 5.5" />
  </svg>
`;

const arrowIconTargets = [
  ".button",
  ".text-link",
  ".segment-link",
  ".card-link",
  ".reference-story-link",
  ".topic-item-title",
  ".mega-arrow",
].join(", ");

const createArrowIcon = () => {
  const icon = document.createElement("span");
  icon.className = "icon-arrow";
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = ARROW_ICON_SVG.trim();
  return icon;
};

const enhanceArrowIcon = (element) => {
  if (!element || element.querySelector(".icon-arrow")) return;

  if (element.classList.contains("mega-arrow")) {
    element.textContent = "";
    element.append(createArrowIcon());
    return;
  }

  if (element.classList.contains("topic-item-title")) {
    element.classList.add("has-icon-arrow");
    element.append(createArrowIcon());
    return;
  }

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  const trailingNode = [...textNodes]
    .reverse()
    .find((node) => /→\s*$/.test(node.nodeValue || ""));

  if (!trailingNode) return;

  trailingNode.nodeValue = trailingNode.nodeValue.replace(/\s*→\s*$/, "");
  element.classList.add("has-icon-arrow");
  element.append(createArrowIcon());
};

const enhanceArrowIcons = () => {
  document.querySelectorAll(arrowIconTargets).forEach(enhanceArrowIcon);
};

const translateTextNodes = (lang) => {
  const dictionary = I18N_STRINGS[lang];
  if (!dictionary) return;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        if (
          node.parentElement &&
          node.parentElement.closest("[data-i18n-ignore]")
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    const raw = node.nodeValue;
    const normalized = normalizeText(raw);
    const translated = dictionary[normalized];
    if (!translated) return;

    const leadingWhitespace = raw.match(/^\s*/)?.[0] ?? "";
    const trailingWhitespace = raw.match(/\s*$/)?.[0] ?? "";
    node.nodeValue = `${leadingWhitespace}${translated}${trailingWhitespace}`;
  });
};

const translateAttributes = (lang) => {
  const dictionary = I18N_STRINGS[lang];
  if (!dictionary) return;

  const attrs = ["placeholder", "aria-label", "title", "alt"];
  attrs.forEach((attr) => {
    document.querySelectorAll(`[${attr}]`).forEach((element) => {
      if (element.closest("[data-i18n-ignore]")) return;
      const raw = element.getAttribute(attr);
      if (!raw) return;
      const normalized = normalizeText(raw);
      const translated = dictionary[normalized];
      if (!translated) return;
      element.setAttribute(attr, translated);
    });
  });
};

const translateHead = (lang) => {
  const dictionary = I18N_STRINGS[lang];
  if (!dictionary) return;

  if (document.title) {
    const normalizedTitle = normalizeText(document.title);
    const translatedTitle = dictionary[normalizedTitle];
    if (translatedTitle) {
      document.title = translatedTitle;
    }
  }

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    const raw = description.getAttribute("content") || "";
    const normalized = normalizeText(raw);
    const translated = dictionary[normalized];
    if (translated) {
      description.setAttribute("content", translated);
    }
  }
};

const updateLanguageSwitcher = (lang) => {
  document.querySelectorAll("[data-lang-label]").forEach((label) => {
    label.textContent = lang.toUpperCase();
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    const isActive = button.getAttribute("data-lang") === lang;
    button.classList.toggle("is-active", isActive);
    if (isActive) {
      button.setAttribute("aria-current", "true");
    } else {
      button.removeAttribute("aria-current");
    }
  });
};

const enhanceFooter = () => {
  document.querySelectorAll(".site-footer").forEach((footer) => {
    const brand = footer.querySelector(".footer-brand");
    const links = footer.querySelector(".footer-links");
    const meta = footer.querySelector(".footer-meta");
    if (!brand || !links || !meta) return;

    const footerLogo = brand.querySelector(".logo img");
    if (footerLogo && footerLogo.getAttribute("src") !== INVERTED_LOGO) {
      footerLogo.setAttribute("src", INVERTED_LOGO);
    }

    if (
      !brand.querySelector(".footer-brand-copy") &&
      !brand.querySelector(".footer-brand-note")
    ) {
      const copy = document.createElement("p");
      copy.className = "footer-brand-copy";
      copy.textContent =
        "Agentic AI for real operations, products, and workflows.";

      const note = document.createElement("p");
      note.className = "footer-brand-note";
      note.textContent =
        "Built for organizations that want AI to work across real processes, products, and teams.";

      const actions = document.createElement("div");
      actions.className = "footer-brand-actions";

      const social = brand.querySelector(".footer-social");
      if (social) {
        social.remove();
        actions.append(social);
      }

      const logo = brand.querySelector(".logo");
      if (logo) {
        logo.insertAdjacentElement("afterend", copy);
        copy.insertAdjacentElement("afterend", note);
        note.insertAdjacentElement("afterend", actions);
      } else {
        brand.prepend(copy);
        copy.insertAdjacentElement("afterend", note);
        note.insertAdjacentElement("afterend", actions);
      }
    }

    if (!footer.querySelector(".footer-bottom")) {
      const bottom = document.createElement("div");
      bottom.className = "footer-bottom";
      bottom.innerHTML =
        '<div class="container footer-bottom-inner"><div>NeuroSYS AS</div><div>Oslo, Norway</div></div>';
      footer.append(bottom);
    }
  });
};

const applyLanguage = (lang) => {
  document.documentElement.lang = lang;
  updateLanguageSwitcher(lang);
  if (lang === "no") {
    translateHead(lang);
    translateAttributes(lang);
    translateTextNodes(lang);
  }
  enhanceArrowIcons();
};

const getInitialLanguage = () => {
  const stored = localStorage.getItem("neurosys-lang");
  if (stored) return stored;
  const browserLang = navigator.language?.toLowerCase() || "";
  if (browserLang.startsWith("no")) return "no";
  return "en";
};

const setupLanguageSwitcher = () => {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.getAttribute("data-lang");
      if (!lang) return;
      localStorage.setItem("neurosys-lang", lang);
      window.location.reload();
    });
  });
};

const initStoryShelves = () => {
  const shelves = document.querySelectorAll("[data-story-shelf]");
  if (!shelves.length) return;

  shelves.forEach((shelf) => {
    const track = shelf.querySelector("[data-shelf-track]");
    if (!track) return;
    const prev = shelf.querySelector("[data-shelf-prev]");
    const next = shelf.querySelector("[data-shelf-next]");

    const getStep = () => {
      const card = track.firstElementChild;
      if (!card) return track.clientWidth;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
      return card.getBoundingClientRect().width + gap;
    };

    const updateButtons = () => {
      if (!prev || !next) return;
      const max = track.scrollWidth - track.clientWidth - 4;
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= max;
    };

    const scrollByStep = (direction) => {
      const step = getStep();
      const max = track.scrollWidth - track.clientWidth;
      let target = track.scrollLeft + direction * step;
      if (direction > 0 && track.scrollLeft >= max - 4) target = 0;
      if (direction < 0 && track.scrollLeft <= 4) target = max;
      track.scrollTo({ left: target, behavior: "smooth" });
    };

    if (prev) prev.addEventListener("click", () => scrollByStep(-1));
    if (next) next.addEventListener("click", () => scrollByStep(1));

    let scrollFrame = null;
    track.addEventListener("scroll", () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = null;
        updateButtons();
      });
    });
    window.addEventListener("resize", updateButtons);
    updateButtons();

    const autoplay = parseInt(shelf.dataset.autoplay || "0", 10);
    if (!autoplay) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let timer = null;
    let paused = false;
    const start = () => {
      if (timer || paused) return;
      timer = setInterval(() => scrollByStep(1), autoplay);
    };
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    shelf.addEventListener("mouseenter", () => {
      paused = true;
      stop();
    });
    shelf.addEventListener("mouseleave", () => {
      paused = false;
      start();
    });
    shelf.addEventListener("focusin", () => {
      paused = true;
      stop();
    });
    shelf.addEventListener("focusout", () => {
      paused = false;
      start();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    start();
  });
};

enhanceFooter();
setupLanguageSwitcher();
applyLanguage(getInitialLanguage());
initStoryShelves();

