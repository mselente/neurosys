# Operativ review av neurosys.no

Dette dokumentet erstatter en bred revisjonsrapport med en kort, operativ vurdering. Målet er å skille mellom:

1. verifiserte problemer i repoet
2. strukturelle forbedringer
3. strategiske forbedringer
4. antakelser som må valideres før de blir oppgaver

## Kort dom

Neurosys.no er ikke et redesign-problem. Det er et siste-20-prosent-problem.

Det sterke er allerede på plass:

- tydelig AI-posisjonering på kjerneflatene
- god kommersiell retning på `public/index.html`, `public/agent-platform.html` og `public/services.html`
- flere gode cases som bygger troverdighet

Det som svekker helheten nå er først og fremst:

- brudd i canonical kontaktidentitet på tvers av synlig innhold, schema og lenker
- to artikkeltemplates som lever side om side
- metadata og taksonomi som fortsatt viser eldre IA
- proof som kommer litt sent
- en `our-work`-side som både skal være proof-side og bred kapabilitetsportefølje

## Prioritering

### P1: Fakta og tillit

Dette er konkrete feil eller inkonsistenser som bør ryddes først.

- standardiser adresse, postkode og telefon på tvers av sider
- standardiser phone-verdi i schema, `tel:`-lenker og synlig nummer
- rett åpenbare tastefeil i adressefelt og footer

Bekreftet i repo:

- `public/contact.html` bruker postkode `0157`
- `public/index.html` bruker postkode `0191`
- `public/about.html` bruker postkode `0157`
- `public/_partials/site-footer.html` bruker `0191 Oslo, Norge`
- `public/contact.html` har mismatch mellom synlig telefonnummer og `telephone`/`tel:`-verdi
- `public/news/operationalizing-agentic-ai-with-dify.html` har `Øvre Slottsgate 276`

### P1: Template-drift og struktur

Dette er det viktigste strukturelle funnet.

Artikkelstrukturen er ikke jevnt feil. Det som faktisk skjer er at to artikkeltemplates lever side om side: en nyere template med shared partials, og en eldre hardkodet template på flere detaljsider.

Bekreftet i repo:

- hovedsidene bruker shared partials som `public/_partials/site-header.html`
- `public/news/samelane-lms-competency-intelligence.html` og `public/news/index.html` bruker shared partials
- flere eldre artikkeldetaljsider har hardkodet header/footer
- de eldre artikkelmalene bruker avvikende struktur og begreper som ikke matcher dagens hovednavigasjon fullt ut

Konsekvens:

- svakere merkevarekonsistens
- svakere IA
- unødvendig vedlikeholdsgjeld
- større risiko for feil kontaktinfo og gammel nav

Anbefalt retning:

- migrer gjenstående legacy-artikkelsider over på samme shared template som nyere sider
- fjern duplisert header/footer-markup der den ikke lenger skal være kilde til sannhet

### P2: Metadata og taksonomi

Dette er ikke bare en visuell nav-sak. Repoet viser også eldre IA i metadata, titler og sosiale previews.

Bekreftet i repo:

- applikasjonssidene bruker titler som `Communication Agents - NeuroSYS Applications`
- `public/news/index.html` bruker fortsatt `News - NeuroSYS`
- `public/our-work.html` bruker fortsatt `Customer references - NeuroSYS`

Konsekvens:

- svakere konsistens mellom synlig budskap og metadata
- eldre struktur lever videre i SERP/social previews
- vanskeligere å etablere én tydelig kommersiell IA

Anbefalt retning:

- bestem ønsket sluttaksonomi for hovedseksjonene
- oppdater `title`, `og:title`, `twitter:title` og lignende metadata i samme løp som template-oppryddingen

### P2: Proof-plassering

Dette er ikke primært et copy-problem. Det er et plasseringsproblem.

Flere sterke claims er allerede kvalifisert i siden, men proofet ligger for langt ned eller for langt unna claimet.

Bekreftet i repo:

- `public/applications/dialogagenter.html` kvalifiserer `30-60%` med note og FAQ
- `public/applications/prosessagenter.html` kvalifiserer `Up to 80%` i FAQ
- `public/services.html` forklarer `1-5 working days`, men ikke tidlig nok

Retning:

- behold de sterke tallene
- flytt scope, metode og avgrensning nærmere hero/stat-blokk
- legg inn tydelig case-lenke der relevant

### P2: Innhold som trenger presisering

Dette er ikke nødvendigvis feil, men formuleringer som bør strammes inn.

- definer `meaningful conversations` tydeligere på Jernia-caset
- forklar `EU AI Act compliant by design` mer konkret på MedieX
- vurder om plattform-claims rundt tilgang, SSO og sikkerhet bør nyanseres per edition/deployment

### P3: Posisjonering og narrativ

Dette er strategiske forbedringer, ikke bugs.

Det viktigste grepet er `public/our-work.html`.

Siden bygger troverdighet, men blander:

- agentic AI
- AI-native produkter
- on-prem AI
- IoT
- generell plattformutvikling
- vedlikehold og bred engineering

Det gjør NeuroSYS bredere, men også mindre tydelig spesialisert. I tillegg prøver siden å gjøre to jobber samtidig: være bevisside for kjøpere og bred kapabilitetsportefølje for hele selskapet.

Anbefalt retning:

1. Unngå større strukturendringer i første omgang.
2. Behold `Customer references`-siden relativt stabil.
3. Gjør det langt tydeligere hvilke referanser som faktisk er `agentic AI implemented` eller `AI in production`.
4. Fremhev spesielt `Jernia`, `Uloba` og `GE Healthcare` som tydelige agentic AI-/implementeringsreferanser.
5. La bredere engineering-referanser fortsatt stå, men sørg for at de ikke konkurrerer visuelt med de sterkeste AI-proofene.

Da beholdes bredden uten at AI-posisjoneringen vannes ut, og uten å skape unødvendig risiko ved å endre for mye på seksjonsstrukturen.

### P1: SEO og GEO-hygiene

Dette er ikke bare SEO for SEO sin skyld. Dette handler om synlighet, tydelighet og opplevd modenhet i både Google og AI-søk.

Bekreftet i repo:

- `public/robots.txt` peker til `https://www.neurosys.no/sitemap.xml`
- `public/sitemap.xml` bruker i stor grad `.html`-URL-er
- sidene selv bruker canonicals uten `.html`, som `/services`, `/agent-platform` og `/contact`
- flere viktige sider bruker fortsatt eldre metadata/titler som `NeuroSYS Applications`, `News - NeuroSYS` og `Customer references - NeuroSYS`
- flere kommersielle sider har god FAQ- eller artikkelschema, men sentrale index-/kategorisider er fortsatt tynt strukturert

Live-validering:

- fetch av live `https://www.neurosys.no/sitemap.xml` returnerte `500` under gjennomgangen
- dette bør valideres i hosting/deploy-oppsett før det behandles som endelig produksjonsfakta

Konsekvens:

- risiko for svakere indeksering og recrawl
- blandede URL-signaler mellom sitemap og canonicals
- svakere forståelse av tilbudsstruktur i søk og AI-sammendrag
- lavere sannsynlighet for at NeuroSYS beskrives tydelig og korrekt i AI-søk

Anbefalt retning:

- sørg for at sitemap publiserer samme URL-er som canonicals
- avklar og fiks live sitemap-feilen først
- oppdater metadata til å speile dagens kommersielle struktur
- legg til tydeligere struktursignaler som breadcrumb/schema på flere sentrale sider
- bruk GEO-linsen aktivt: hver viktig side bør være enkel å sitere, enkel å oppsummere og tydelig på hva NeuroSYS er, hva kunden får, og hvorfor det er troverdig

### P2: URL-struktur og lenkehygiene

Dette handler om hvor godt URL-ene faktisk beskriver innholdet, og hvor ryddig lenkelaget er over tid.

Bekreftet i repo:

- det finnes ikke tydelige interne `href`-lenker i `public/` som peker til gamle legacy-ruter som `privacy-policy`, `terms-of-service`, `services/consulting`, `services/project-delivery`, `services/team-extension` eller `ai-transformasjon`
- interne lenker i dagens HTML peker i hovedsak til eksisterende clean URLs som `/services`, `/agent-platform`, `/contact`, `/news/...` og `/applications/...`
- sitemapet publiserer fortsatt `.html`-URL-er som ikke matcher sidens canonicals
- flere URL-er og seksjonsnavn er teknisk gyldige, men semantisk svakere enn de kunne vært

Vurdering:

- dagens lenkelag ser relativt ryddig ut i repoet
- den største URL-feilen er ikke interne døde lenker, men et foreldet/inkonsistent URL-lag i sitemapet
- den største navneutfordringen er at slugs, metadata og sideetiketter ikke fullt ut følger samme språk- og navnestrategi

Anbefalte clean cuts:

- `public/training.html` / `/training`  
  Rename til `/ai-workshops`. Innholdet er kommersiell workshop- og enablement-side, ikke generell opplæring. Dagens slug er for svak og for generisk.

- `public/news/index.html` / `/news/`  
  Rename til `/insights`. Innholdet er innsikt, kundehistorier og partner-/produktfortellinger, ikke nyhetsdesk. Dette er den tydeligste rename-kandidaten.

- `public/our-work.html` / `/our-work`  
  Rename til `/customer-references`. Det matcher sidens faktiske rolle bedre og er tydeligere kommersielt enn dagens mer generiske `/our-work`.

- `public/applications/dialogagenter.html`, `public/applications/prosessagenter.html`, `public/applications/produktagenter.html`  
  Standardiser til engelske slugs. Her er språkblandingen unødvendig og ser uryddig ut i en ellers engelskspråklig kommersiell struktur.

- `public/forretningsomrader/...`  
  Rename til `/industries/...`. Dette er renere enn `forretningsomrader`, tydeligere enn `/businessareas/`, og passer bedre med resten av nettstedets engelske kommersielle struktur.

Anbefalt retning:

- gå for engelskspråklig URL-struktur på tvers av kommersielle sider
- gjør renamene samlet i én kontrollert URL-pass, ikke stykkevis
- legg inn `301` redirects for alle gamle slugs
- oppdater canonicals, sitemap, metadata og interne lenker i samme deploy

## Oppgaveliste

### Sprint 1

- velg én canonical adresse, postkode og telefon
- oppdater alle forekomster i header/footer, schema, kontaktside og `tel:`-lenker
- rett `Øvre Slottsgate 276`
- rett telefonlenker og schema-telefon som ikke matcher vist nummer
- migrer legacy-artikkelsider til samme shared template som nyere sider
- fiks sitemap slik at den matcher canonicals
- avklar hvorfor live `sitemap.xml` feiler

### Sprint 2

- oppdater metadata som fortsatt bruker eldre IA og taksonomi
- flytt proof nærmere claims på løsningssidene
- legg inn definisjon av `meaningful conversations`
- legg inn kort forklaring på `EU AI Act compliant by design`
- gå gjennom plattform-copy for for absolutte capability-claims
- legg inn sterkere schema/breadcrumb-støtte på sentrale kommersielle sider

### Sprint 3

- gjør det tydeligere hvilke `Customer references` som er faktisk agentic AI implementert
- løft `Jernia`, `Uloba` og `GE Healthcare` tydeligere som AI-proof
- vurder om `News` bør bli tydeligere innsikt/kundehistorier
- kjør en messaging audit på tvers av sentrale sider

## Messaging audit

Alle viktige sider bør svare tydelig på minst tre av disse fem:

1. Hva er NeuroSYS?
2. Hvorfor nå?
3. Hvorfor dere?
4. Hva får kunden?
5. Hva er neste steg?

Hvis en side ikke svarer godt på minst tre, bør den forbedres.

## Ikke backlogfør før validering

Følgende skal ikke automatisk bli repo-oppgaver før det er validert i produksjon, hosting eller Search Console:

- `privacy-policy`
- `terms-of-service`
- gamle indekserte URL-er
- gamle SERP-snippets
- legacy-sider som ikke finnes i dette repoet

Dette kan være reelle produksjonsproblemer, men de er ikke bekreftet i kodebasen per nå.

## Endelig anbefaling

Ikke bruk tid på en stor omskriving av hele nettstedet.

Bruk tid på:

- konsistens
- tillitssignaler
- template-opprydding
- proof-plassering
- skarpere narrativ kontroll

Det er her gevinsten er nå.