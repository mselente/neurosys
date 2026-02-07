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

const I18N_STRINGS = {
  no: {
    "Skip to content": "Hopp til innhold",
    "NeuroSYS home": "NeuroSYS forside",
    Primary: "Hovedmeny",
    Applications: "Applikasjoner",
    "AI Process Automation": "AI-prosessautomatisering",
    Services: "Tjenester",
    "Our work": "Vårt arbeid",
    About: "Om oss",
    News: "Nyheter",
    Contact: "Kontakt",
    "Get in touch": "Ta kontakt",
    Menu: "Meny",
    Discover: "Utforsk",
    Office: "Kontor",
    Email: "E-post",
    Phone: "Telefon",
    "Read more →": "Les mer →",
    "See what we offer →": "Se hva vi tilbyr →",
    "Get workshop details →": "Få workshop-detaljer →",
    "Book a session →": "Book en sesjon →",
    "Shall we grab a coffee?": "Skal vi ta en kaffe?",
    "A short conversation to assess where agentic AI makes sense, and where it doesn’t.":
      "En kort prat for å vurdere hvor agentisk AI gir mening, og hvor det ikke gjør det.",
    "Head of Sales & Partnerships": "Leder for salg og partnerskap",
    Employees: "Ansatte",
    "Years in the market": "År i markedet",
    Certified: "Sertifisert",
    "AWS Partner": "AWS-partner",
    "Microsoft Partner": "Microsoft-partner",
    "AI that actually works in your business":
      "AI som faktisk fungerer i virksomheten din",
    "We help organizations reduce cost, speed up work, and scale operations with agentic workflows - across customer interaction, internal processes, and digital products.":
      "Vi hjelper virksomheter å redusere kostnader, jobbe raskere og skalere drift med agentiske arbeidsflyter - på tvers av kundedialog, interne prosesser og digitale produkter.",
    "Where we apply agentic workflows":
      "Hvor vi bruker agentiske arbeidsflyter",
    "Three business domains where we repeatedly deliver measurable impact.":
      "Tre forretningsområder der vi gjentatte ganger leverer målbar effekt.",
    "Customer & employee interaction": "Kunde- og medarbeiderdialog",
    "Communication agents": "Kommunikasjonsagenter",
    "Reduce support load and resolve work across channels by connecting to your systems and data.":
      "Reduser supportbelastning og løs oppgaver på tvers av kanaler ved å koble til systemer og data.",
    "Operational processes": "Operasjonelle prosesser",
    "AI process optimization": "AI-prosessoptimalisering",
    "Automate decision-heavy workflows and remove bottlenecks across operations.":
      "Automatiser beslutningstunge arbeidsflyter og fjern flaskehalser i driften.",
    "Digital products": "Digitale produkter",
    "AI-enabled products": "AI-aktiverte produkter",
    "Embed AI into your software to create new value, features, and revenue streams.":
      "Bygg AI inn i programvaren for å skape ny verdi, funksjoner og inntektsstrømmer.",
    "GenAI Training & Workshops": "GenAI-opplæring og workshops",
    "Practical, hands-on AI enablement":
      "Praktisk, hands-on AI-innføring",
    "Practical introduction to Generative AI combined with workshops focused on your own processes, products and operations.":
      "Praktisk introduksjon til generativ AI kombinert med workshops med fokus på egne prosesser, produkter og drift.",
    "Outcome: shared understanding, concrete ideas, and clear next steps.":
      "Resultat: felles forståelse, konkrete ideer og tydelige neste steg.",
    "Operationalizing agentic AI with Dify":
      "Operasjonalisering av agentisk AI med Dify",
    "Together with Dify, we gathered enterprise decision-makers in Oslo to discuss what it actually takes to move AI from pilots into production. With most organizations still struggling to scale beyond experimentation, the focus was on reusable workflows, shared knowledge, and controlled autonomy across teams.":
      "Sammen med Dify samlet vi beslutningstakere i Oslo for å diskutere hva som faktisk kreves for å ta AI fra pilot til produksjon. Når de fleste virksomheter fortsatt sliter med å skalere utover eksperimentering, var fokuset på gjenbrukbare arbeidsflyter, delt kunnskap og kontrollert autonomi på tvers av team.",
    "Identifying AI opportunities in industrial operations":
      "Identifisering av AI-muligheter i industriell drift",
    "We work closely with industrial and infrastructure companies to map value streams, data flows, and operational bottlenecks. Through on-site visits and collaborative analysis, we help organizations uncover concrete optimization opportunities across production, planning, quality, and energy use.":
      "Vi jobber tett med industriselskaper og infrastrukturselskaper for å kartlegge verdistrømmer, dataflyt og driftsmessige flaskehalser. Gjennom besøk på stedet og samarbeidende analyse hjelper vi virksomheter å avdekke konkrete optimaliseringsmuligheter innen produksjon, planlegging, kvalitet og energibruk.",
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
      "Arbeidsflate-native kommunikasjonsagenter",
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
    "From pilot to production — AI that fits into how your organization actually works.":
      "Fra pilot til produksjon - AI som passer inn i måten organisasjonen din faktisk jobber på.",
    "The agentic platform removes up to 80% of repetitive tasks, freeing capacity for value creation.":
      "Plattformen fjerner opptil 80 % av repetitive oppgaver og frigjør kapasitet til verdiskaping.",
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
    "What makes us different": "Det som gjør oss annerledes",
    "We don't just advise on AI — we build, deploy and operate production-grade systems.":
      "Vi gir ikke bare råd om AI - vi bygger, drifter og kjører produksjonsklare systemer.",
    "We focus on AI that runs in daily business operations — communication agents, workflow automation and embedded product intelligence. Not research projects or disconnected proofs of concept.":
      "Vi fokuserer på AI som kjører i daglig drift - kommunikasjonsagenter, arbeidsflytautomasjon og innebygd produktintelligens. Ikke forskningsprosjekter eller løsrevne konseptbevis.",
    "Our teams have hands-on experience with LLM orchestration, retrieval-augmented generation, tool calling and multi-step reasoning across complex enterprise data environments.":
      "Teamene våre har praktisk erfaring med LLM-orkestrering, RAG, verktøykall og flerstegs resonnering i komplekse datamiljøer.",
    "100+ engineers across AI, data & full-stack":
      "100+ ingeniører innen AI, data og fullstack",
    "A multidisciplinary team that covers the full stack — from model tuning and data pipelines to production infrastructure and front-end interfaces.":
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
    "Frequently asked questions": "Ofte stilte sporsmal",
    "What does NeuroSYS do?": "Hva gjor NeuroSYS?",
    "NeuroSYS designs, builds and operates production-grade AI systems for Nordic enterprises. We specialize in agentic AI - communication agents, process optimization and AI-enabled products - combining advisory, solution design, implementation and long-term support in one engagement.":
      "NeuroSYS designer, bygger og drifter produksjonsklare AI-systemer for nordiske virksomheter. Vi spesialiserer oss pa agentisk AI - kommunikasjonsagenter, prosessoptimalisering og AI-aktiverte produkter - og kombinerer radgivning, loesningsdesign, implementering og langsiktig stoette i ett oppdrag.",
    "What is an agentic AI workflow?": "Hva er en agentisk AI-arbeidsflyt?",
    "An agentic AI workflow is an AI system that can reason, make decisions and take actions across multiple tools and data sources. Unlike simple chatbots, agentic workflows connect to your existing systems (ERP, CRM, documents), follow multi-step logic and escalate to humans when needed.":
      "En agentisk AI-arbeidsflyt er et AI-system som kan resonnere, ta beslutninger og handle pa tvers av flere verktoy og datakilder. I motsetning til enkle chatboter kobler agentiske arbeidsflyter seg til eksisterende systemer (ERP, CRM, dokumenter), folger flertrinnslogikk og eskalerer til mennesker ved behov.",
    "How long does a typical AI project take?": "Hvor lang tid tar et typisk AI-prosjekt?",
    "A focused pilot typically takes 4-8 weeks, covering scope definition, integration, testing and evaluation. Production deployments follow in subsequent phases. We build pilots that are production-ready from day one, so you don't need to rebuild when scaling.":
      "En fokusert pilot tar vanligvis 4-8 uker, inkludert omfangsdefinisjon, integrasjon, testing og evaluering. Produksjonsinnfoering folger i pafolgende faser. Vi bygger piloter som er produksjonsklare fra dag en, sa dere slipper a bygge pa nytt ved skalering.",
    "Do I need to have AI expertise in my organization?": "Ma jeg ha AI-kompetanse i organisasjonen min?",
    "No. We provide training and workshops to build shared understanding across your teams. Our engagement model covers everything from strategy and design to implementation and operations, so your team can focus on the business outcomes.":
      "Nei. Vi tilbyr opplaering og workshops for a bygge felles forstaelse pa tvers av teamene. Var leveransemodell dekker alt fra strategi og design til implementering og drift, slik at teamet ditt kan fokusere pa forretningsresultatene.",
    "Which platforms and technologies do you use?": "Hvilke plattformer og teknologier bruker dere?",
    "We work with Dify for agentic workflow orchestration, LangChain for custom AI logic, Hugging Face for model customization, and Microsoft Azure AI for enterprise integration. Platform selection depends on your use case, security requirements and integration needs.":
      "Vi bruker Dify for agentisk arbeidsflytorkestrering, LangChain for tilpasset AI-logikk, Hugging Face for modelltilpasning og Microsoft Azure AI for bedriftsintegrasjon. Plattformvalg avhenger av brukstilfellet, sikkerhetskrav og integrasjonsbehov.",
    "What is a communication agent?": "Hva er en kommunikasjonsagent?",
    "A communication agent is an AI system that handles customer and employee interactions across channels like chat, email and phone. Unlike traditional chatbots, it connects to your business systems, looks up data, completes tasks and involves humans only when needed.":
      "En kommunikasjonsagent er et AI-system som handterer kunde- og ansattinteraksjoner pa tvers av kanaler som chat, e-post og telefon. I motsetning til tradisjonelle chatboter kobler den seg til forretningssystemene, slar opp data, fullforer oppgaver og involverer mennesker kun ved behov.",
    "How is this different from a chatbot?": "Hvordan er dette forskjellig fra en chatbot?",
    "A chatbot follows scripted flows and answers predefined questions. A communication agent reasons over live data, calls tools, resolves multi-step requests and learns from context. It works across systems rather than within a single interface.":
      "En chatbot folger skriptede flyter og svarer pa forhåndsdefinerte sporsmal. En kommunikasjonsagent resonnerer over sanntidsdata, kaller verktoy, loser flertrinnsforesprorsler og laerer av kontekst. Den jobber pa tvers av systemer i stedet for innenfor ett enkelt grensesnitt.",
    "What channels can a communication agent handle?": "Hvilke kanaler kan en kommunikasjonsagent handtere?",
    "Communication agents work across web chat, email, phone, internal tools and messaging platforms. They use one shared knowledge base and logic layer, so customers and employees get consistent answers regardless of channel.":
      "Kommunikasjonsagenter fungerer pa tvers av nettprat, e-post, telefon, interne verktoy og meldingsplattformer. De bruker en felles kunnskapsbase og logikklag, slik at kunder og ansatte far konsistente svar uansett kanal.",
    "How do you measure the value of a communication agent?": "Hvordan maler dere verdien av en kommunikasjonsagent?",
    "We measure resolution rate (how many requests the agent completes without human help), response time, customer satisfaction and support cost reduction. In pilot projects, we typically see 40-60% of meaningful conversations resolved autonomously.":
      "Vi maler loesningsgrad (hvor mange henvendelser agenten fullforer uten menneskelig hjelp), svartid, kundetilfredshet og kostnadsreduksjon for support. I pilotprosjekter ser vi typisk at 40-60 % av meningsfulle samtaler loses autonomt.",
    "What is AI process optimization?": "Hva er AI-prosessoptimalisering?",
    "AI process optimization uses agentic AI workflows to automate decision-heavy tasks across operations, back-office and production. The AI connects to your existing systems, reasons over data and takes action - with human approval where it matters.":
      "AI-prosessoptimalisering bruker agentiske AI-arbeidsflyter til a automatisere beslutningstunge oppgaver pa tvers av drift, back-office og produksjon. AI-en kobler seg til eksisterende systemer, resonnerer over data og handler - med menneskelig godkjenning der det betyr noe.",
    "What types of processes can be optimized?": "Hvilke typer prosesser kan optimaliseres?",
    "Common use cases include incident triage, supply chain exception handling, finance and case routing, quality control, production support and back-office automation. Any process with repetitive decisions across multiple systems is a candidate.":
      "Vanlige brukstilfeller inkluderer hendelsestriage, unntakshåndtering i forsyningskjeden, finans- og sakshåndtering, kvalitetskontroll, produksjonssto tte og back-office-automatisering. Enhver prosess med repetitive beslutninger pa tvers av flere systemer er en kandidat.",
    "How much can AI process optimization reduce manual work?": "Hvor mye kan AI-prosessoptimalisering redusere manuelt arbeid?",
    "Our agentic platform removes up to 80% of repetitive tasks. The actual reduction depends on the process complexity and the level of system integration, but most organizations see significant capacity freed for value creation within the first deployment.":
      "Var agentiske plattform fjerner opptil 80 % av repetitive oppgaver. Den faktiske reduksjonen avhenger av prosessens kompleksitet og graden av systemintegrasjon, men de fleste organisasjoner ser betydelig kapasitet frigjort til verdiskaping innen forste utrulling.",
    "Does the AI replace people?": "Erstatter AI-en mennesker?",
    "No. The AI handles routine, repetitive parts of workflows so people can focus on decisions that require judgment, creativity and relationships. Humans stay in the loop for exceptions and high-stakes decisions.":
      "Nei. AI-en handterer rutinepregede, repetitive deler av arbeidsflyter slik at mennesker kan fokusere pa beslutninger som krever skjonn, kreativitet og relasjoner. Mennesker forblir i loopen for unntak og viktige beslutninger.",
    "Who is the GenAI training for?": "Hvem er GenAI-opplaeringen for?",
    "The training is for leadership teams, product owners, developers and operational staff who want to understand how generative AI applies to their work. No prior AI experience is required.":
      "Opplaeringen er for ledergrupper, produkteiere, utviklere og driftspersonell som vil forsta hvordan generativ AI gjelder for arbeidet deres. Ingen tidligere AI-erfaring er nodvendig.",
    "What do participants learn?": "Hva laerer deltakerne?",
    "Participants learn how large language models work, what agentic AI can and cannot do, how to identify real use cases in their organization, and how to evaluate AI readiness. The workshops include hands-on exercises with real tools.":
      "Deltakerne laerer hvordan store sprakmodeller fungerer, hva agentisk AI kan og ikke kan gjore, hvordan de identifiserer reelle brukstilfeller i organisasjonen, og hvordan de vurderer AI-modenhet. Workshopene inkluderer praktiske ovelser med reelle verktoy.",
    "How long is a typical workshop?": "Hvor lang er en typisk workshop?",
    "A standard workshop runs one full day. We also offer half-day executive briefings and multi-day deep-dive programs depending on your team's needs and technical level.":
      "En standard workshop varer en hel dag. Vi tilbyr ogsa halvdags lederbriefer og flerdagers dybdeprogrammer avhengig av teamets behov og teknisk niva.",
    "Can the training be customized for our industry?": "Kan opplaeringen tilpasses var bransje?",
    "Yes. We tailor content to your industry, systems and operational context. This includes using your own data examples and mapping AI opportunities specific to your value chain.":
      "Ja. Vi tilpasser innholdet til bransjen, systemene og den operasjonelle konteksten. Dette inkluderer bruk av egne dataeksempler og kartlegging av AI-muligheter spesifikt for verdikjeden.",
    "What customers say": "Det kundene sier",
    "Head of Productivity": "Leder for produktivitet",
    "Commercial Director": "Kommersiell direktør",
    "NeuroSYS Services": "NeuroSYS tjenester",
    "AI advisory, design & implementation":
      "AI-rådgivning, design og implementering",
    "We help organizations move from scattered AI experiments to production-ready agents, workflows and AI-enabled products.":
      "Vi hjelper virksomheter å gå fra spredte AI-eksperimenter til produksjonsklare agenter, arbeidsflyter og AI-aktiverte produkter.",
    "What we help you with": "Dette hjelper vi deg med",
    "Decide where AI truly matters":
      "Bestem hvor AI virkelig betyr noe",
    "Strategy, governance and prioritization - so agents and automation solve real problems, not interesting ones.":
      "Strategi, governance og prioritering - slik at agenter og automatisering løser reelle problemer, ikke bare interessante.",
    "Turn priorities into working systems":
      "Gjør prioriteringer til fungerende systemer",
    "We design and build communication agents, workflows and AI-enabled products that fit your environment.":
      "Vi designer og bygger kommunikasjonsagenter, arbeidsflyter og AI-aktiverte produkter som passer ditt miljø.",
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
    "AI systems that work in real businesses":
      "AI-systemer som fungerer i ekte virksomheter",
    "We are a technology company with 100+ specialists, helping organizations turn AI into measurable impact across operations, customer experience and digital products.":
      "Vi er et teknologiselskap med 100+ spesialister som hjelper virksomheter å gjøre AI om til målbar effekt på tvers av drift, kundeopplevelse og digitale produkter.",
    "What we stand for": "Det vi står for",
    "Business impact": "Forretningsmessig effekt",
    "We measure success by outcomes: reduced effort, faster decisions and better experiences.":
      "Vi måler suksess i resultater: mindre innsats, raskere beslutninger og bedre opplevelser.",
    "System thinking": "Systemtenkning",
    "We build AI as part of your stack - integrated, reliable and ready to evolve.":
      "Vi bygger AI som en del av stacken din - integrert, pålitelig og klar til å utvikle seg.",
    "Responsible delivery": "Ansvarlig leveranse",
    "We take security, governance and operational quality seriously, from day one.":
      "Vi tar sikkerhet, governance og operasjonell kvalitet på alvor fra dag én.",
    "Leadership & team": "Ledelse og team",
    "A multidisciplinary team across AI, software, data and delivery.":
      "Et tverrfaglig team på tvers av AI, programvare, data og leveranse.",
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
    Norway: "Norge",
    Poland: "Polen",
    Germany: "Tyskland",
    Contact: "Kontakt",
    "Let’s discuss your next step": "La oss snakke om neste steg",
    "We help organizations apply agentic AI with clarity and control. Share a bit about your context, and we’ll suggest a realistic way forward.":
      "Vi hjelper virksomheter å bruke agentisk AI med klarhet og kontroll. Del litt om konteksten din, så foreslår vi en realistisk vei videre.",
    "Contact - NeuroSYS": "Kontakt - NeuroSYS",
    "0191 Oslo, Norway": "0191 Oslo, Norge",
    "NeuroSYS Services": "NeuroSYS tjenester",
    "GenAI Training & Workshops - NeuroSYS":
      "GenAI-opplæring og workshops - NeuroSYS",
    "Practical, hands-on AI enablement that builds shared understanding, surfaces real opportunities, and prepares your teams to work with agentic AI in practice.":
      "Praktisk, hands-on AI-innføring som skaper felles forståelse, avdekker reelle muligheter og forbereder teamene på å jobbe med agentisk AI i praksis.",
    "1 day": "1 dag",
    "to align on GenAI & opportunities":
      "for å samkjøre om GenAI og muligheter",
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
    "Consumer goods & health": "Forbruksvarer og helse",
    "Introduced GenAI and agentic workflows to key stakeholders.":
      "Introduserte GenAI og agentiske arbeidsflyter for nøkkelinteressenter.",
    "Mapped concrete opportunities in communication and operations.":
      "Kartla konkrete muligheter innen kommunikasjon og drift.",
    "Created a shared view on where to start.":
      "Skapte en felles forståelse av hvor man bør starte.",
    "Business & academic environment":
      "Forretnings- og akademisk miljø",
    "Explored GenAI impact on education and internal processes.":
      "Utforsket GenAI-effekt på utdanning og interne prosesser.",
    "Discussed governance, quality and responsible use.":
      "Drøftet governance, kvalitet og ansvarlig bruk.",
    "Identified areas where AI can support staff and students.":
      "Identifiserte områder der AI kan støtte ansatte og studenter.",
    "Advocacy & member organization":
      "Interesse- og medlemsorganisasjon",
    "Connected GenAI to real communication challenges.":
      "Koblet GenAI til reelle kommunikasjonsutfordringer.",
    "Explored media monitoring, assistant use and automation.":
      "Utforsket medieovervåking, bruk av assistenter og automatisering.",
    "Prioritized next steps for responsible experimentation.":
      "Prioriterte neste steg for ansvarlig eksperimentering.",
    "What a typical day looks like": "Hvordan en typisk dag ser ut",
    Morning: "Morgen",
    "Late morning": "Sen morgen",
    Afternoon: "Ettermiddag",
    "Wrap-up": "Oppsummering",
    "Shared understanding and realistic expectations for GenAI.":
      "Felles forståelse og realistiske forventninger til GenAI.",
    "Your context, constraints, and opportunities.":
      "Deres kontekst, rammer og muligheter.",
    "Concrete use cases shaped and prioritized.":
      "Konkrete brukstilfeller formet og prioritert.",
    "Clear ownership, next decisions and how to move forward.":
      "Klart eierskap, neste beslutninger og hvordan vi går videre.",
    "How engagement typically unfolds":
      "Slik et samarbeid vanligvis utvikler seg",
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
    "What we learned from the Jernia pilot":
      "Hva vi lærte av Jernia-piloten",
    "What we learned from the Jernia pilot - NeuroSYS":
      "Hva vi lærte av Jernia-piloten - NeuroSYS",
    "Key insights from a real communication agent pilot and what it revealed about Phase 2 value.":
      "Viktige innsikter fra en reell pilot med kommunikasjonsagent og hva den avslørte om verdien i fase 2.",
    "A concise look at how real customer conversations reveal where communication agents create value - and what the next phase should focus on.":
      "En kort oppsummering av hvordan ekte kundesamtaler viser hvor kommunikasjonsagenter skaper verdi - og hva neste fase bør fokusere på.",
    "← Back to news": "← Tilbake til nyheter",
    "The pilot confirmed that communication agents are already resolving real work - and showed exactly where Phase 2 should focus to unlock more value.":
      "Piloten bekreftet at kommunikasjonsagenter allerede løser reelt arbeid - og viste nøyaktig hvor fase 2 bør fokusere for å frigjøre mer verdi.",
    "We measured how people actually used the agent, filtered noise from real conversations, and reviewed which interactions were resolved, escalated, or left hanging. That gives a concrete view of what the agent already handles well - and where the next improvements will create the biggest impact.":
      "Vi målte hvordan folk faktisk brukte agenten, filtrerte støy fra reelle samtaler og vurderte hvilke interaksjoner som ble løst, eskalert eller stående. Det gir et konkret bilde av hva agenten allerede håndterer godt - og hvor neste forbedringer vil gi størst effekt.",
    "The strongest signal was product and order-related questions. That points directly to Phase 2: deeper product knowledge, order access and tighter system integration so the agent can resolve more cases end-to-end.":
      "Det sterkeste signalet var spørsmål om produkter og ordre. Det peker direkte mot fase 2: dypere produktkunnskap, ordretilgang og tettere systemintegrasjon slik at agenten kan løse flere saker ende-til-ende.",
    "The takeaway is simple: communication agents are already valuable in real operations, and a focused second phase turns that value into measurable improvements in resolution rate, customer experience and operational efficiency.":
      "Oppsummeringen er enkel: kommunikasjonsagenter er allerede verdifulle i reell drift, og en fokusert fase 2 gjør den verdien om til målbare forbedringer i løsningsgrad, kundeopplevelse og operasjonell effektivitet.",
    "Operationalizing agentic AI with Dify":
      "Operasjonalisering av agentisk AI med Dify",
    "Operationalizing agentic AI with Dify - NeuroSYS":
      "Operasjonalisering av agentisk AI med Dify - NeuroSYS",
    "A Nordic meetup in Oslo focused on moving agentic AI from pilots into production.":
      "Et nordisk meetup i Oslo med fokus på å ta agentisk AI fra pilot til produksjon.",
    "Together with Dify, we hosted a Nordic meetup in Oslo focused on what it actually takes to move AI from pilots into production.":
      "Sammen med Dify arrangerte vi et nordisk meetup i Oslo med fokus på hva som faktisk skal til for å ta AI fra pilot til produksjon.",
    "We gathered enterprise decision-makers to discuss the reality of AI adoption. With most organizations still in the pilot phase, the conversation centered on building reusable workflows, structuring knowledge, and creating controlled autonomy across teams.":
      "Vi samlet beslutningstakere for å diskutere realiteten ved AI-adopsjon. Når de fleste virksomheter fortsatt er i pilotfasen, handlet samtalen om å bygge gjenbrukbare arbeidsflyter, strukturere kunnskap og skape kontrollert autonomi på tvers av team.",
    "We explored what works in practice: democratizing building so teams can experiment safely, reusing proven workflows instead of reinventing in every department, and ensuring insights stay centralized rather than disappearing into isolated tools.":
      "Vi utforsket hva som fungerer i praksis: å demokratisere bygging slik at team kan eksperimentere trygt, gjenbruke utprøvde arbeidsflyter i stedet for å finne opp alt på nytt i hver avdeling, og sørge for at innsikt forblir sentralisert i stedet for å forsvinne i isolerte verktøy.",
    "The key takeaway was clear: enterprises must take control of their knowledge, tasks, and processes - and use agentic workflows to push that intelligence out to teams, not the other way around.":
      "Hovedpoenget var tydelig: virksomheter må ta kontroll over kunnskap, oppgaver og prosesser - og bruke agentiske arbeidsflyter til å distribuere den intelligensen ut til teamene, ikke omvendt.",
    "Identifying AI opportunities in industrial operations":
      "Identifisering av AI-muligheter i industriell drift",
    "Identifying AI opportunities in industrial operations - NeuroSYS":
      "Identifisering av AI-muligheter i industriell drift - NeuroSYS",
    "On-site visits and value stream mapping to uncover AI optimization opportunities.":
      "Besøk på stedet og verdistrømskartlegging for å avdekke AI-optimaliseringsmuligheter.",
    "We visit industrial sites to map value streams and surface concrete AI opportunities across production, planning, and quality.":
      "Vi besøker industristeder for å kartlegge verdistrømmer og avdekke konkrete AI-muligheter på tvers av produksjon, planlegging og kvalitet.",
    "We work closely with industrial and infrastructure companies to map value streams, data flows, and operational bottlenecks. The goal is always practical: identify where AI can remove friction and improve decision quality without disrupting day-to-day work.":
      "Vi jobber tett med industri- og infrastrukturselskaper for å kartlegge verdistrømmer, dataflyt og operasjonelle flaskehalser. Målet er alltid praktisk: identifisere hvor AI kan fjerne friksjon og forbedre beslutningskvalitet uten å forstyrre daglig drift.",
    "On-site visits help uncover concrete opportunities across production, capacity planning, quality control, and energy use. We also look at how to connect existing systems and data so that insights are actionable across teams.":
      "Besøk på stedet avdekker konkrete muligheter innen produksjon, kapasitetsplanlegging, kvalitetskontroll og energibruk. Vi ser også på hvordan vi kan koble sammen eksisterende systemer og data slik at innsikt blir handlingsbar på tvers av team.",
    "The result is a shared, realistic view of what can be optimized first - and which AI capabilities should be prioritized for measurable impact.":
      "Resultatet er et felles, realistisk bilde av hva som kan optimaliseres først - og hvilke AI-kapabiliteter som bør prioriteres for målbar effekt.",
    "Communication Agents - NeuroSYS Applications":
      "Kommunikasjonsagenter - NeuroSYS applikasjoner",
    "Agentic communication agents that resolve work across channels for employees and customers.":
      "Agentiske kommunikasjonsagenter som løser arbeid på tvers av kanaler for ansatte og kunder.",
    "AI Process Optimization - NeuroSYS Applications":
      "AI-prosessoptimalisering - NeuroSYS applikasjoner",
    "AI Process Optimization - agentic workflows for operational work.":
      "AI-prosessoptimalisering - agentiske arbeidsflyter for operasjonelt arbeid.",
    "AI-Enabled Products - NeuroSYS Applications":
      "AI-aktiverte produkter - NeuroSYS applikasjoner",
    "AI-Enabled Products - part of the NeuroSYS AI System.":
      "AI-aktiverte produkter - en del av NeuroSYS AI-system.",
    "Applications:": "Applikasjoner:",
    "Customer & employee interaction": "Kunde- og medarbeiderdialog",
    "Agentic communication agents for employees and customers that resolve work across channels, on top of your existing systems and data.":
      "Agentiske kommunikasjonsagenter for ansatte og kunder som løser arbeid på tvers av kanaler, oppå eksisterende systemer og data.",
    "reduction in repetitive questions*":
      "reduksjon i repeterende spørsmål*",
    "availability for employees & customers":
      "tilgjengelighet for ansatte og kunder",
    Days: "Dager",
    "from idea to working agent": "fra idé til fungerende agent",
    "*Indicative range based on pilots and similar implementations.":
      "*Indikativt spenn basert på piloter og lignende implementeringer.",
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
      "Kommunikasjonsagenter svarer ikke bare - de fullfører arbeid på tvers av systemer.",
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
    "Agentic AI workflows that connect systems, data and decisions — across operations, factories and back-office. Remove up to 80% of repetitive tasks and free capacity for value creation.":
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
      "Hvorfor AI-prosessoptimalisering",
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
    "Digital products & services":
      "Digitale produkter og tjenester",
    "Embed agentic AI directly into your SaaS or digital platform - as native product functionality, not a bolt-on chatbot.":
      "Bygg agentisk AI direkte inn i SaaS eller digitale plattformer - som native produktfunksjonalitet, ikke en påklistret chatbot.",
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
      "Hvorfor AI-aktiverte produkter vinner",
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
};

const applyLanguage = (lang) => {
  document.documentElement.lang = lang;
  updateLanguageSwitcher(lang);
  if (lang === "no") {
    translateHead(lang);
    translateAttributes(lang);
    translateTextNodes(lang);
  }
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

setupLanguageSwitcher();
applyLanguage(getInitialLanguage());

