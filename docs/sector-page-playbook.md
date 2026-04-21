# Sector Page Playbook

How to write the six business-area pages under `/forretningsomrader/`
in a way that holds together as one editorial product, without each
page bleeding into the others.

Canonical reference: [`public/forretningsomrader/markedsforing.html`](../public/forretningsomrader/markedsforing.html).
When in doubt, look at how that page solves it.

---

## The six pages

| Slug | Title | Homepage card promise | Kjernefriksjon (the one frame the page must own) |
|---|---|---|---|
| `markedsforing` | Markedsføring | Automatiser kundedialog, kampanjeflyter og oppfølging | Friksjon mellom *idé* og *handling i kanal* |
| `salg` | Salg | Frigjør tid i CRM, tilbudsarbeid og pipeline med smartere automatisering | Friksjon mellom hver fase i salgs-syklusen — momentum som mistes mens noe venter på neste interne steg |
| `service` | Service | Effektiviser kundeservice, saksbehandling og feltarbeid | Friksjon mellom *henvendelse* og *løst sak* |
| `prosjekt-og-data` | Prosjekt og data | Frigjør prosjektteamene fra sourcing, indeksering og validering av komponentdata | Friksjon mellom *prosjektarbeidet* og *dataarbeidet som spiser opp dagen* (punching, indeksering, sourcing, kryssjekking) |
| `transport-og-logistikk` | Transport og logistikk | Planlegg ruter, absorber avvik, og hold kunden oppdatert automatisk | Friksjon mellom *plan* og *det som faktisk skjer på veien* |
| `produksjon` | Produksjon | Reduser stans, omstilling og manuell koordinering på gulvet | Friksjon mellom *plan* og *virkelighet* — kapasitet som lekker mellom skiftene, mellom maskin og menneske |

### IA-historikk (oppdatert 2026-04)

Tre opprinnelige forretningsområder ble omstrukturert i denne runden:

- **Leveranser** ble strøket fordi den dekket tre forskjellige lesere (ops-direktør + supply chain + prosjektdirektør) og dermed aldri kunne snakke dypt til noen. Splittet i `prosjekt-og-data` (komponenttunge, datadrevne prosjekter) og `transport-og-logistikk` (planlegging og koordinering av fysisk bevegelse).
- **Digitale flater** ble strøket fordi den ikke var en *funksjon* men en *flate-/kanaltype*, og dermed strukturelt overlappet med `/applications/produktagenter` ("AI-Enabled Products"). Den historien eies nå av Applications-laget, ikke av forretningsområde-laget.
- **Innsikt og analyse** ble strøket fordi den var horisontal og diffus — analytics-tråden lever allerede i hver av de andre fem sidene (intent-data i Salg, mønsterdeteksjon i Service, data-til-artefakter i Prosjekt og data, telemetri i Produksjon). En egen side ville blitt "og forresten, analytics". Erstattet av `produksjon` — vertikalt, konkret, sterkt agentisk-AI-passform, og bedre fit for norsk SMB/Enterprise-ICP (industri, prosess, energi, marin).

Læringen: forretningsområde-laget skal alltid svare på "hvilken funksjon i organisasjonen har friksjonen". Hvis svaret er en kanal, et verktøy, en agent-pattern eller en horisontal kapabilitet (som analytics), hører den hjemme et annet sted.

The kjernefriksjon is the one frame the page must own. Every domain-specific
section has to deliver on it. If a friction example doesn't tie back to the
kjernefriksjon, it belongs on another sector page — not this one.

## Tidsaksen — hver side bør spenne hele funksjonens livsløp

For at en sektor-side skal beskrive funksjonen *helhetlig* (ikke bare det
mest synlige øyeblikket), bør de fire H3-ene under "Verdien som flyr forbi"
distribueres over funksjonens fase-akse der det er naturlig.

| Side | Tidsakse-faser | Eksempel-distribusjon av 4 H3-er |
|---|---|---|
| Markedsføring | (kontinuerlig) | Ingen fasing nødvendig — friksjonen er løpende i markedsarbeidet |
| Salg | Pre / Under / Etter | Onboarding av ny kunde · Tilbudshastighet · Pipeline-vedlikehold · Renewal/cross-sell |
| Service | Henvendelse / Løsning / Forebygging | Mottak og kvalifisering · Saksflyt og kunnskap · Lukking og varsling · Mønstre som forhindrer neste sak |
| Prosjekt og data | (kontinuerlig dataarbeid gjennom prosjektet) | Sourcing og strukturering · Kategorisering av ustrukturert data · Validering mot krav · Generering av leveransedokumenter |
| Transport og logistikk | Plan / Eksekvering / Avvik | Ruteplan som planlegger seg selv · Avvik som omplanlegger seg selv · Kunden vet ETA før de spør · Sjåføren med kontekst før motoren starter |
| Produksjon | Plan / Drift / Skiftbytte / Avvik | Plan som følger virkeligheten · Kvalitet som oppdages før utskudd · Vedlikehold som forutser stans · Skiftbytter uten kontekst-tap · Ordre-til-leveranse uten manuelle mellommenn |

Du trenger ikke følge fasene mekanisk — av og til vil to H3-er ligge i
samme fase fordi det er der friksjonen er størst. Men sjekk alltid om en
H3 mangler for et stort fase-område som ikke er dekket. Hvis pre-salg ikke
er nevnt, mangler siden noe.

---

## The 15 rules

1. **Stemmen er artikkel, ikke pitch og ikke blogg.** Ingen produktinnramming, ingen "skrevet av X". Observerende, ikke pålegg.
2. **Layout matcher stemmen.** Smal prose-spalte (`prose-page`), ingen kortgrid, ingen SVG, ingen knapper som hovedinnhold.
3. **Domenefokus er hellig.** Markedsføring-siden løser aldri Salg-, Service- eller Leveranseproblemer. Eksempler må peke entydig på sitt eget fagområde.
4. **Bygg på homepage-løftet, ikke rewrite det.** Subtittel skal levere på akkurat det homepage-kortet lover. Endre aldri homepage-kortet for å passe subsidiens.
5. **Gjenkjennelse før innsikt.** Konkrete tap leseren kjenner fra egen uke kommer før det arkitektoniske "derfor".
6. **Verdi-først H3-er.** *"Kampanjer som lanseres på dager, ikke uker"* slår *"Raskere kampanjeproduksjon"*. Navngi utfallet, ikke temaet.
7. **Konkrete eksempler slår abstrakte påstander.** "En kunde som chatter inn klokken 23" slår "real-time kundeengasjement".
8. **Ingen oppfunne tall, ingen tredjepartssitater som autoritet.** Snakk i størrelsesordener (sekunder vs. timer, dager vs. uker, "større enn de fleste forventer"), ikke prosenter.
9. **Inkluderende språk.** Ikke "markedsorganisasjoner", "enterprises", bransjeavgrensninger. Bruk "virksomheter", "markedsavdelingen", funksjonsbaserte begreper.
10. **Trim brutalt der to ting sier det samme.** Subtittel/lede-overlapp. Intro som previewer H3-er. Parallelle "ikke X, men Y"-rammer. Selv-refererende fraser ("det er disse vi prioriterer").
11. **Spenn hele tidsaksen til funksjonen, ikke bare det mest synlige øyeblikket.** Hver fagfunksjon har et før/under/etter (eller tilsvarende fasing). Markedsføring-siden trenger ikke speile dette eksplisitt fordi friksjonen i markedsarbeidet er mer kontinuerlig, men alle de andre fem har naturlige faser - se tidsakse-tabellen under.
12. **Hvert avsnitt under en H3 = friksjon → mekanisme → resultat. Maks tre setninger.** Det disiplinerer prosaen ned til 4-5 linjer og fjerner consequence-padding. Hvis du må forklare *konsekvensen* etter mekanismen, har du sannsynligvis ikke navngitt resultatet sterkt nok i H3-tittelen.
13. **Én side, én leser.** Hver side skal kunne navngi *én* rolle som leser og nikker dypt — ikke tre roller som nikker overflatisk. Hvis siden må snakke til både ops-direktøren og prosjektdirektøren samtidig, ender den med å snakke til ingen av dem på dybden. Test: kan du si i én setning hvem som er målgruppen? Hvis svaret er "alle som har med leveranser å gjøre", er siden for bred — splitt den.
14. **H3-ene må peke på nye agentiske capabilities, ikke bare plattform-effekter.** "Plattform binder data sammen" hører hjemme i Seksjon 3 (Hva vi ser etter). H3-ene under "Verdien som flyr forbi" skal handle om *hva agentene faktisk gjør* som tradisjonelle workflow-/automation-/RPA-verktøy ikke har klart: lese og forstå innkommende meldinger, foreslå løsning basert på lignende saker, predikere årsak, gruppere mønstre på tvers av tusenvis av hendelser, lære av hver iterasjon. Test for hver H3: kunne en RPA-bot fra 2018 levert dette? Hvis ja, omformuler.
15. **Cases er drivstoff, ikke pensum.** Konkrete kunde-eksempler (ved navn, bransje, antall sjåfører, antall komponenter, prosent av tiden) er gull for å *forstå* friksjonen, men hører IKKE inn på siden. Løft 3-4 nivåer høyere før publisering: en spesifikk pumpesystem-leverandør blir til "et komplekst anlegg", en helsetransport-operatør blir til "daglig logistikk", "80-90 % av tiden" blir til "mer av tiden enn noen liker å innrømme", "1500 SKU-er" blir til "tusenvis av elementer", "sykmelding klokken 06" blir til "en ressurs som faller fra". Test: ville en leser i en helt annen bransje stoppet ved et eksempel og tenkt "dette gjelder ikke meg"? Hvis ja, løft mer. Bonus-test: hvis du fjerner casenavnet, henger setningen fortsatt sammen — det er hvor abstrakt formuleringen burde vært fra start.
16. **Posisjoner på frihet og demokratisering, ikke mot copiloter.** Aldri argumenter direkte mot HubSpot/Salesforce/Microsoft sine native AI-tilbud — det blir lett kooptert ("ja, derfor har vi konsolidert") og virker defensivt. Bruk i stedet positive rammer: hvor mye av logikken eier dere selv, hvor lett er plattformen å bytte, hvordan skalerer kostnaden, hva slags data slipper dere å tvinge inn i et skjema. Frihets- og eierskapsspråk treffer C-level uten å virke som vi spiller en sammenligningskamp. Gjelder hele siden — også lede, H3-er og spørsmål.
17. **NeuroSYS bygger agenter, ikke plattformen.** Vi bygger på Dify (open-source). Vi designer ikke den underliggende plattformen — vi bygger, drifter og videreutvikler agentene som kjører på den. Skriv aldri "vi designer plattformen" eller noe som overclaimer. Riktig formulering: *"Vi bygger agentene, drifter dem i produksjon, og utvikler dem videre — på et åpent fundament dere selv eier."*
18. **Bro fra Seksjon 2 til Seksjon 3 må være eksplisitt.** Når Seksjon 2 har levert friksjon → endring, må Seksjon 3 åpne med en setning som forklarer *hvorfor leseren plutselig snakker om plattform*. Mal: *"Alt over forutsetter at agentene har et sted å bo. Plattformen er det laget. Spørsmålet er ikke om dere trenger en — men om den er bygget slik at verdien blir værende hos dere over tid."* Uten denne broen virker Seksjon 3-kriteriene som de kommer ut av intet.
19. **Sluttseksjonen skal lande på sitatet, ikke på credentials.** Cross-area + hvem-bygger + setup-setning + sitat. Ingen "Siden 2008..." eller historikk på sektor-siden — det hører hjemme på en om-oss-side. Sitatet *"Fremtidens kapasitet bygges med digitale kollegaer"* er den siste tanken leseren tar med seg. Setup-setningen *"Det vi bygger er enklere å forstå hvis man slutter å tenke på det som verktøy"* er hengselet som gir sitatet betydning.

---

## The page structure (alle 6 sider)

| # | Seksjon | Status | Hva varierer per side |
|---|---|---|---|
| 1 | **Hero** (subtittel + lede) | Domene-spesifikk | Subtittel speiler homepage-kortets løfte. Lede er gjenbrukbar (handle-frasen) |
| 2 | **"Verdien som flyr forbi i dag - og hva som endrer seg"** — 4-5 friksjon → verdi-cases | Domene-spesifikk | Hele innholdet. Skal være ord fagsjefen selv ville sagt |
| 3 | **"Hvorfor en agentisk plattform"** — bro + 4 eierskap-/frihetskriterier | Gjenbrukbar 100 % | Bare små fagvokabular-justeringer i kriterium 2 og 3 (MES vs CRM vs ERP) |
| 4 | **"Spørsmål som er nyttige å sitte med"** — 3-4 spørsmål | Domene-fargelagt | Strukturen er gjenbrukbar, ordlyden må bytte fagvokabular |
| 5 | **"Bygget én gang - sammen med dere"** — cross-area + hvem-bygger + sitat som lukke | Gjenbrukbar struktur | Bytt åpningsord ("Byggesteinene gjelder ikke bare X") og hvilke 5 andre områder som listes opp |
| 6 | **"Hvor er det praktisk å begynne?"** — CTA | Gjenbrukbar 100 % | Uendret |

Den gamle copilot-stanzaen (`AI i CRM-en kjenner CRM-data...`) som åpnet
Seksjon 3 er **strøket**. Den ble for lett koopterbar av suite-leverandører
(HubSpot, Salesforce: "ja, derfor har vi konsolidert"). Erstattet av en
bro fra Seksjon 2 + en positiv ramme om eierskap/frihet/demokratisering —
se Seksjon 3-skriveregler under for full mal.

---

## Skriveregler per seksjonstype

### Hero (subtittel + lede)

- **Subtittel**: én setning. Speil homepage-kortets verb og objekter direkte. Ikke gjenta hele setningen — finn den underliggende lovnaden og oversett den til "noe bundet sammen av et agentisk lag - så X handler raskere/mer presist". Bruk **"lag"**, ikke **"plattform"** (se Seksjon 5-regelen).
- **Lede** (gjenbrukbar nesten ord-for-ord på alle sider): to korte setninger.
  > AI som svarer er rikelig. AI som kan *handle* på vegne av virksomheten - på deres logikk, deres data, deres premisser - er det få som har bygget.
- Ikke remse opp konkrete gevinster i ledeen — la Seksjon 2 levere dem.
- Den gamle "AI inni vs på tvers"-formuleringen er strøket — den lente på copilot-vs-agent-distinksjonen som hele Seksjon 3-reframingen ble laget for å unngå.

### Seksjon 2: "Verdien som flyr forbi"

Tittel skal være lik på alle 6 sider: *"Verdien som flyr forbi i dag - og hva som endrer seg"*.

Intro (ett kort avsnitt):
- Setning 1: hvor avdelingen *ikke* har problem (ideer, kompetanse, vilje).
- Setning 2: hva som koster mest — friksjonen mellom *idé/signal/henvendelse/plan/...* og *handling*.
- Lukk: "Fire steder det slår tydeligst ut for [fagområdet]:"

Fire H3-er som default:
- 4-5 linjer prose hver.
- Hver H3 må peke entydig på dette fagområdets friksjon. Test: hvis H3-en kunne stått på en av de andre 5 sidene uten endring, hører den hjemme der i stedet.
- Verdi-først ordlyd. Ikke "Raskere kampanjeproduksjon" → "Kampanjer som lanseres på dager, ikke uker".
- Konkrete tids- og handlingsbilder ("klokken 23", "to-tre uker", "to uker etter signalet"), ikke prosenter.

**Når 5 H3-er er riktig:** Hvis fagområdet dekker tydelig adskilte under-domener — f.eks. Salg (lead → oppfølging → tilbud → pipeline → renewal), eller Produksjon (plan → kvalitet → vedlikehold → skiftbytte → ordre-til-leveranse) — kan du ekspandere til 5 H3-er for å gi hvert under-domene plass. Da skal hver H3 være enda strammere - 3-4 linjer, maks 3 setninger - ikke lengre. Bredde rettferdiggjør antall, ikke ordmengde.

Avslutning (ett avsnitt):
- Lån rytmen fra markedssidens *"slutte å la verdien fly forbi"*.
- Domene-spesifikk versjon. Ikke gjenta ordrett.
- Skal lande den ene følelsen siden vil sitte igjen med.

### Seksjon 3: "Hvorfor en agentisk plattform"

Bro fra Seksjon 2 + intro + fire eierskap-/frihetskriterier. Hele
seksjonen er gjenbrukbar nesten ord-for-ord på tvers av sektorsider —
det eneste som må fagjusteres er *hvilke systemer* som nevnes i
kriterium 2 og 3.

**Bro-avsnittet** (rett under H2):
> Alt over forutsetter at agentene har et sted å bo. Plattformen er det
> laget. Spørsmålet er ikke om dere trenger en — men om den er bygget
> slik at verdien blir værende hos dere over tid.

**Intro-avsnittet** (etter broen, før kriteriene):
> Plattformen burde være det enkleste å bytte ut i hele oppsettet.
> Verdien skal bo i logikken og dataene deres — ikke i en leverandørs
> roadmap eller prismodell. Fire egenskaper avgjør i praksis om dere
> faktisk eier det dere bygger.

**De fire kriteriene** — to demokratiserende, to frihetsorienterte:

1. **Logikken er deres - ikke en leverandørs datamodell** *(demokratisering)*. Bedriftens egen kunnskap, tone og unntak styrer hva agenten gjør, i stedet for å bli kvistet ned til standardfelter.
2. **Data dere slipper å tvinge inn i et skjema** *(demokratisering)*. Agenter bruker ustrukturert/eksternt/situasjonsbestemt data som det er. **Bytt eksempel-systemene per side**: CRM-felter (Salg/Markedsføring/Service), MES-felter (Produksjon), prosjekt-/dokumentsystemer (Prosjekt og data), TMS/dispatch-felter (Transport og logistikk).
3. **Plattformen er den enkleste å bytte** *(frihet, CIO-vinkel)*. Open-source dere kan kjøre selv. Logikken og dataene bor hos dere. **Bytt eksempel-systemene per side**: CRM/e-postverktøy (Salg/Markedsføring), saksbehandlingssystem (Service), ERP/MES (Produksjon), TMS (Transport).
4. **Kostnaden følger infrastrukturen - ikke handlingen** *(frihet, CFO-vinkel)*. Per-handling-prising biter på skala når dere lykkes; åpen infrastruktur skalerer med ressursbruk.

**Hvorfor denne reframingen** (lessons fra `salg2.html`-iterasjonen):
- Den gamle copilot-stanzaen kunne enkelt kooptes av HubSpot/Salesforce-selgere ("ja, derfor er Smart CRM/Customer 360 svaret"). Den nye rammen kan ikke kooptes — open-source-eierskap, byttbarhet og infrastruktur-prising er strukturelle forskjeller suite-leverandører ikke kan matche.
- Frihets-/eierskapsspråk treffer CFO/CIO uten å virke som vi spiller en sammenligningskamp.
- Demokratiserings-språk treffer fagsjefen som vet at standardverktøy aldri har passet helt.

### Seksjon 4: "Spørsmål som er nyttige å sitte med"

- 3 til 4 spørsmål. Ikke flere.
- Ingen ja/nei.
- Hver må kunne sitte og se på *uten* å snakke med oss først.
- Unngå spørsmål som er omformuleringer av påstander vi allerede har slått fast på siden.
- Minst ett spørsmål bør treffe eierskap/frihet-vinkelen fra Seksjon 3 (f.eks. *"Hvor mye av [fag]-logikken bor i et oppsett dere selv eier - og hvor mye i en leverandørs konto?"*).
- Bytt fagvokabularet:
  - "markedsarbeidet" → "salgsarbeidet" / "saksbehandlingen" / "leveransekoordineringen" / "produksjonsplanleggingen" / "rapporteringen"
  - "kampanje" / "automasjon" → tilsvarende fagspråk
  - "kundereisen" → "salgs-pipelinen" / "saksflyten" / "ordreflyten" / "skiftet" / osv.

### Seksjon 5: "Bygget én gang - sammen med dere"

Slått sammen fra to tidligere seksjoner (cross-area + hvem-bygger).
Sitatet sitter som lukke. Fire elementer i fast rekkefølge:

1. **Cross-area** — én setning: *"Byggesteinene gjelder ikke bare [denne sidens fagområde]."* + én setning som lister de fem andre i naturlig rekkefølge: *"Samme agentiske lag driver også [...] - med ulike agenter på toppen. Kapasiteten bygges én gang og brukes mange steder."*
2. **Hvem vi er** — *"Vi er de som bygger dem med dere. Ikke en konsulentpraksis eller et byrå - vi bygger agentene, drifter dem i produksjon, og utvikler dem videre når dere finner neste sted de bør ta over arbeid, på et åpent fundament dere selv eier."*
3. **Setup-setning til sitatet** — *"Det vi bygger er enklere å forstå hvis man slutter å tenke på det som verktøy."*
4. **Sitatet** (`prose-stanza`) — *"Fremtidens kapasitet bygges med digitale kollegaer."*

Bruk ordet **"lag"**, ikke **"plattform"**, i cross-area-setningen.
"Plattform" eies av Seksjon 3-diskusjonen om byttbarhet — å si "samme
plattform driver alt" skaper et lite spenn med "plattformen er den
enkleste å bytte". "Lag" er mer nøytralt og kompatibelt.

### Seksjon 6: CTA-footer

Uendret på alle 6 sider:

```
<h2 class="prose-footer-title">Hvor er det praktisk å begynne?</h2>
<p>
  Vi tar gjerne en uforpliktende samtale om hvor en agentisk
  plattform faktisk kunne tatt over manuelt arbeid hos dere - og
  hva som gir mest verdi å starte med. Ikke et pitch, bare en titt
  sammen.
</p>
```

---

## Pre-flight checklist før publisering av hver side

Gå gjennom hele listen før siden anses ferdig:

- [ ] Subtittelen leverer på akkurat det homepage-kortet lover
- [ ] Subtittelen bruker "lag", ikke "plattform" (regel som setter opp Seksjon 5)
- [ ] Lede-en er to setninger og bruker "handle på vegne av virksomheten"-formuleringen
- [ ] Ingen av friksjonscasene i Seksjon 2 (4-5 stk) kunne stått på en annen forretningsområde-side uten endring
- [ ] Hver H3 i Seksjon 2 består av maks tre setninger og følger friksjon → mekanisme → resultat (regel 12)
- [ ] Hver H3 peker på en agentisk capability, ikke bare en plattform-effekt — kunne en RPA-bot fra 2018 levert dette? (regel 14)
- [ ] Seksjon 3 åpner med eksplisitt bro fra Seksjon 2 — ikke rett inn i kriteriene (regel 18)
- [ ] Seksjon 3 har fire eierskap-/frihetskriterier — ingen direkte sammenligning med copiloter eller suite-AI (regel 16)
- [ ] Seksjon 3 sier "Vi bygger agentene", ikke "vi designer plattformen" (regel 17)
- [ ] Minst ett spørsmål i Seksjon 4 treffer eierskap/frihet-vinkelen
- [ ] Spørsmåls-intro i Seksjon 4 er én linje, ikke et avsnitt
- [ ] Spørsmålene i Seksjon 4 er ikke omskrivinger av påstander tidligere på siden
- [ ] Sluttseksjonen ("Bygget én gang - sammen med dere") lander på sitatet, ikke på historikk/credentials (regel 19)
- [ ] Cross-area-setningen i Seksjon 5 bruker "lag", ikke "plattform"
- [ ] Cross-area-setningen lister de fem andre fagområdene, ikke seg selv
- [ ] Ingen oppfunne tall, ingen tredjepartssitater
- [ ] Ingen "leder bør" / "dere må" / "vi anbefaler"
- [ ] Ingen "markedsorganisasjoner" / "enterprises" / bransjeavgrensninger
- [ ] Side bruker `prose-*` klasser, ikke `sector-*` eller card-grids
- [ ] Hvis funksjonen har naturlige faser (pre/under/etter eller tilsvarende): er fasene rimelig dekket, eller mangler et stort fase-område?
- [ ] Homepage-kortets href peker på `/forretningsomrader/[slug]` (ikke gammel `/applications/...`-rute)

---

## Tekniske detaljer

- Fil: `public/forretningsomrader/[slug].html`
- Body class: `sector-page sector-page-prose`
- CSS: alle nødvendige klasser ligger i `public/styles.css` under `.prose-*`
- Cache-busting: bruk `?v=__CSS_VERSION__` og `?v=__JS_VERSION__` i `<link>` og `<script>` tags — `server.js` setter inn rett versjon automatisk
- Header/footer: bruk SSI partials
  - `<!--#include virtual="/_partials/site-header.html" -->`
  - `<!--#include virtual="/_partials/site-footer.html" -->`
- SEO: husk å oppdatere `<title>`, `meta name="description"`, og hele `og:`/`twitter:`/JSON-LD-blokken til å reflektere den aktuelle siden
- Canonical URL: `https://www.neurosys.no/forretningsomrader/[slug]`

---

## Hva som kommer senere (ikke nå)

- En seksjon på hver side om *hvilke Dify-features/-noder* som faktisk brukes for å bygge dette. Skal legges inn senere som en mer teknisk seksjon for dem som klikker dypere — sannsynligvis etter Seksjon 3 og før Seksjon 4.
