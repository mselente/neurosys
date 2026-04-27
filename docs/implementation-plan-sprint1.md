# Sprint 1 implementation plan

Dette dokumentet oversetter den operative reviewen til konkrete filendringer for Sprint 1.

## Mål

Rydde opp i lav-risiko problemer som påvirker tillit, konsistens og teknisk hygiene uten å gjøre større strategiske endringer.

## Scope

### 1. Canonical kontaktidentitet

Normaliser kontaktdata til én sannhet på tvers av:

- `public/contact.html`
- `public/index.html`
- `public/about.html`
- `public/_partials/site-footer.html`
- eventuelle eldre artikkelsider med hardkodet footer

Arbeidsantakelse i Sprint 1:

- bruk `Øvre Slottsgate 27, 0157 Oslo`
- bruk telefon `+47 41 01 71 26`
- bruk maskinlesbar telefon `+4741017126`

Grunnlag:

- `contact.html` og `about.html` peker allerede mot `0157`
- synlig telefonnummer er konsistent flere steder og brukes som sann kilde

### 2. Legacy artikkeltemplate -> shared partials

Migrer eldre artikkeldetaljsider med hardkodet header/footer over til shared partials:

- `public/news/jernia-agentic-pilot-insights.html`
- `public/news/identifying-ai-opportunities-in-industrial-operations.html`
- `public/news/mediex-media-intelligence-platform.html`
- `public/news/operationalizing-agentic-ai-with-dify.html`

Mål:

- samme header/footer som resten av nettstedet
- fjerne duplisert kontaktdata
- redusere vedlikeholdsgjeld

### 3. Sitemap cleanup

Oppdater `public/sitemap.xml` slik at alle `loc`-verdier matcher sidens canonicals:

- fjern `.html` i URL-ene der siden bruker clean routes
- behold `/news/` som indeks-URL hvis det fortsatt er ønsket canonical

### 4. Dokumentasjon

Ingen nye strategiske beslutninger i denne sprinten. Bare implementer det som allerede er avklart i review-dokumentet.

## Ikke i scope

- store URL-renames
- større IA-endringer
- `our-work`/`Customer references`-omstrukturering
- copy-omskriving utover hygiene og konsistens
- hosting-/serverendringer utenfor repoet

## Definisjon av ferdig

- kontaktdata er konsistente i repoet
- legacy-artikler bruker shared partials
- sitemap matcher canonicals
- ingen nye linterfeil i endrede filer
