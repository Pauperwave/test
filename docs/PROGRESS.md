# PROGRESS — Pauperwave Blog

Documento vivo per tracciare avanzamento, architettura e decisioni. Aggiornare quando cambiano scope, stack o convenzioni rilevanti — non per ogni commit (per quello vedi `docs/CHANGELOG.md`).

**Ultimo aggiornamento:** 2026-07-23

---

## Obiettivo del progetto

Blog/sito editoriale per il formato Magic: The Gathering **Pauper**: articoli, tutorial, decklist, report torneo, spoiler set — con componenti interattivi (grafici, tooltip carte, gallerie di carte in stile magic.wizards.com) e un content pipeline basato su Nuxt Content che risolve riferimenti a carte a build time.

---

## Stack tecnologico

| Layer | Tecnologia |
|-------|------------|
| Runtime/package manager | Bun |
| Framework | Nuxt 4 (deploy target: `vercel`, hybrid SSG/prerender) |
| UI | Nuxt UI 4, Tailwind CSS |
| Contenuto | Nuxt Content 3 (MDC) + 3 moduli custom di trasformazione markdown |
| Grafici | ECharts (via componenti custom in `app/components/charts/`) |
| Card data | Scryfall bulk data → SQLite (`server/database/cards.db`, committato in git) |
| Testing | Vitest |
| Lint | ESLint (`@nuxt/eslint`) |

---

## Architettura (panoramica)

Vedi il root `CLAUDE.md` per i dettagli che attraversano più file (content pipeline, prerendering ibrido, prefissi componenti). Riferimenti approfonditi per sottosistema in `docs/architecture/`:

- `docs/architecture/card-download-database-flow.md` — flusso Scryfall → SQLite → risoluzione a build time.
- `docs/architecture/2026-07-10-magic-cards-component-research.md` — reverse engineering del componente `::magic-cards`.
- `docs/architecture/author-system-improvements.md` — stato del sistema autori.

---

## Decisioni architetturali

Le decisioni architetturali che *non* sono già ovvie dal codice o coperte dal root `CLAUDE.md` (content pipeline, prerendering ibrido, alias immagini, convenzione `useDevice()` sui grafici) vanno registrate qui come `### ADR-NNN — Titolo`. Per la cronologia commit-per-commit, vedi `docs/CHANGELOG.md`.

### ADR-001 — Pin di `nuxt-schema-org` a `6.0.4` via `overrides`

- **Contesto (2026-06-18):** `nuxt-schema-org` 6.2.1, aggiornato automaticamente tramite `@nuxtjs/seo`, ha introdotto una funzione in `webPageResolver.defaults` per rilevare il tipo di pagina dall'URL. `unhead` v2 (richiesto da Nuxt 4) chiama con zero argomenti qualsiasi funzione incontrata nei props dei tag `<head>`, causando un crash runtime (`Cannot destructure property 'meta' of 'undefined'`).
- **Decisione:** `package.json`'s `overrides.nuxt-schema-org` pinnato a `6.0.4` (ultima versione funzionante), `bun.lock` ripristinato dal commit `4c259b7`.
- **Da rivedere:** questo pin va rimosso solo dopo aver verificato a mano che una versione più recente di `nuxt-schema-org` non ripresenti lo stesso crash con `unhead` v2 — non è sufficiente che `bun update` proponga una versione più recente.
- **Dettaglio:** `docs/CHANGELOG.md`, voce 2026-06-18.

### ADR-002 — Collection `docs`: prefisso path esplicito + query by path, non by id

- **Contesto (2026-07-08):** la collection `docs` in `content.config.ts` aveva `source.prefix: "/"` invece di `"/docs"`, causando URL di sitemap tipo `/statuto`/`/componenti` che non combaciavano con la route reale `/docs/[slug]`. Il fix del prefisso a livello di collection ha esposto due bug nascosti, non ovvi dal codice:
  1. **Sitemap `loc` stantio:** Nuxt Studio scrive un blocco `sitemap: { loc }` nel frontmatter quando un file viene aperto/salvato nell'editor — uno snapshot statico dell'URL al momento del salvataggio, che non si aggiorna da solo se il prefisso della collection cambia dopo. `content/docs/statuto.md` e `content/docs/componenti.md` avevano un `loc` stantio da una sessione Studio precedente che ha continuato a vincere sul path corretto dopo il fix; `content/docs/codice-di-condotta.md` non aveva l'override e ha recepito il fix automaticamente — l'inconsistenza tra i tre file è stata l'indizio che ha rivelato il problema.
  2. **`id` raddoppiato, non solo `path`:** per una collection `type: "page"`, `source.prefix` incide sul campo `id` calcolato, non solo su `path`. Dopo il cambio prefisso, l'`id` di ogni doc è passato da `docs/statuto.md` a `docs/docs/statuto.md` (cartella sorgente `docs/` raddoppiata dal nuovo prefisso). `app/pages/docs/[slug].vue` interrogava per `id` costruito a mano (`queryCollection('docs').where('id', '=', \`docs/${slug}.md\`)`), quindi ha iniziato a restituire `null` in silenzio — nessun errore, area contenuto vuota.
- **Decisione:** (a) tutti e 3 i file in `content/docs/` hanno ricevuto un `sitemap.loc` esplicito e corretto invece di affidarsi al path calcolato dalla collection — collection piccola, quindi esplicito-ovunque è costato meno che costruire un controllo di drift automatico; da rivedere se la collection cresce molto; (b) `[slug].vue` riscritto per interrogare `.path(route.path)` invece di un `id` costruito a mano — pattern già usato altrove nel codebase (`useArticleData` per `articles`), la pagina `docs` era l'eccezione.
- **Da tenere a mente:** riaprire/salvare un file `docs` in Nuxt Studio dopo che l'autenticazione GitHub OAuth sarà configurata (`docs/BACKLOG.md` #1) potrebbe reintrodurre silenziosamente un `loc` stantio se l'editor lo riscrive con un path calcolato non aggiornato — da verificare dopo la prima modifica via Studio.
- **Regola generale ricavata:** qualsiasi cambio futuro a `source.prefix`/`source.include`/struttura cartelle di una collection richiede: (1) grep di `sitemap:` nel frontmatter di quella collection per `loc` stantii, (2) grep di query `.where('id'` costruite a mano contro quella collection, preferendo `.path(route.path)`.

### ADR-003 — Nuxt Studio: auth risolta, ma incompatibile con la content pipeline per decklist/report

- **Contesto (2026-07-24):** setup dell'autenticazione GitHub OAuth per `/editor`, poi scoperta di un'incompatibilità architetturale più profonda che ridimensiona l'utilità di Nuxt Studio per questo progetto.
- **Parte 1 — auth, tre bug distinti trovati e corretti (docs ufficiali `nuxt.studio` inaffidabili, verificato tutto contro il codice sorgente installato di `node_modules/nuxt-studio@1.7.0`, che è anche l'ultima versione pubblicata su npm — non un problema di versione datata):
  1. **Callback URL sbagliato.** La route di callback OAuth è fissa (`/__nuxt_studio/auth/github`, in `github.get.js`), indipendente dalla `studio.route` configurata (`/editor`). L'app GitHub OAuth era inizialmente configurata con callback sulla root (`https://.../`), causando un mismatch silenzioso: GitHub reindirizzava dopo il login a un URL senza handler per `code`/`state`.
  2. **Nomi delle env var sbagliati.** La documentazione ufficiale (`nuxt.studio/raw/auth-providers.md`) indica `NUXT_STUDIO_AUTH_GITHUB_CLIENT_ID`/`_SECRET` (convenzione standard Nuxt, prefisso `NUXT_` + path del runtime config). Il codice installato non usa mai questa convenzione: `admin.js` (gate che decide se mostrare il login) e `github.get.js` leggono `process.env.STUDIO_GITHUB_CLIENT_ID`/`_SECRET` **direttamente**, bypassando `useRuntimeConfig()` — grep sull'intero pacchetto per `NUXT_STUDIO` ha dato zero risultati. Con i nomi "giusti" secondo i docs, `admin.js` restituiva 404 "No authentication provider found".
  3. **`STUDIO_GITHUB_MODERATORS` non impostata → accesso editor aperto a chiunque.** Senza questa env var (lista email separate da virgola), il controllo di autorizzazione in `github.get.js` è saltato del tutto: qualunque account GitHub che completa l'OAuth ottiene una sessione valida su `/editor`. Scoperto perché l'utente, visitando `/editor` da un browser con sessione GitHub già autorizzata, ha ottenuto un login automatico — comportamento OAuth normale, ma che ha reso evidente l'assenza di una allowlist.
- **Decisione (parte 1):** callback URL corretto (`.../__nuxt_studio/auth/github`), env var rinominate ai nomi piatti letti dal codice reale, `STUDIO_GITHUB_MODERATORS` impostata con l'email primaria verificata dell'unico maintainer. Tutto verificato leggendo il sorgente del modulo installato, non fidandosi dei docs ufficiali quando in conflitto col codice.
- **Parte 2 — incompatibilità con la content pipeline, non risolta.** Aprendo un articolo decklist esistente in Studio, il banner "Il contenuto su GitHub differisce dalla versione del tuo sito web" appare in modo permanente, anche senza modifiche pendenti. Causa: `modules/decklist-transformer.ts` (e gli analoghi per sideboard-guide e `[[Card]]` tooltip) riscrivono il markdown **solo in memoria**, all'hook `content:file:beforeParse` — il file su git resta testo semplice scritto a mano (nomi carte, quantità), mentre "il sito" (post-transform) espone `::magic-decklist` con un prop `parsed-cards` JSON enorme, risolto via Scryfall (immagini, mana cost, ecc.). Studio assume che sorgente-git e contenuto-editabile siano sempre la stessa cosa 1:1; questo progetto rompe deliberatamente quell'assunzione per disaccoppiare l'autoring da uno snapshot Scryfall specifico.
- **Rischio non ancora verificato empiricamente:** se si salva/pubblica tramite Studio un file decklist, è plausibile che scriva su git la forma espansa (JSON Scryfall) invece del testo semplice originale, rompendo permanentemente lo scopo del transformer. Non testato — **non pubblicare tramite Studio su contenuti decklist/sideboard-guide/card-reference finché non verificato.**
- **Decisione (parte 2):** Nuxt Studio resta configurato e autenticato correttamente, ma il suo utilizzo pratico è ridimensionato — probabilmente utilizzabile solo per contenuti "puri" senza i tre shortcode custom. `docs/BACKLOG.md` #4 (editor custom) è stato ripromosso da P3 a P2 di conseguenza: un editor su misura che lavora sul markdown grezzo pre-transform (invece che sul renderizzato) è probabilmente necessario, non ridondante. Esplorazione in corso, vedi Backlog #4 per il progetto di riferimento (`nuxt-ui-templates/editor`).
- **Chiarimento importante (2026-07-24):** il "Vue Component Props Editor" di Studio **riconosce correttamente** `::magic-decklist`/`::magic-sideboard-guide` come componenti — il banner "Conflitto rilevato" non è un problema di parsing MDC. Trovato nel bundle client (`node_modules/nuxt-studio/dist/app/main-*.js`): la funzione di confronto è un banale `content.trim() === websiteContent.trim()` tra il file su GitHub e il contenuto servito dal sito pubblicato — un controllo pensato per rilevare deploy non ancora propagati, che però va sempre in falso positivo su questo progetto perché il sito pubblicato mostra sempre la forma *espansa* post-transform (mai identica al sorgente grezzo, per design). Non verificato empiricamente se il banner blocchi il salvataggio o sia solo un avviso — non testato oltre, perché nel frattempo è stata presa la decisione (utente, 2026-07-24) di procedere comunque con l'editor custom, indipendentemente dall'esito di quel test.
- **Decisione finale (utente, 2026-07-24):** procedere con un editor custom basato su TipTap (via `UEditor` di `@nuxt/ui`, già disponibile nella versione installata `4.9.0` — nessun bump richiesto) invece di continuare a investire su Nuxt Studio. Vedi `docs/BACKLOG.md` #4 per il piano.
- **Rimozione completa (2026-09-01):** Nuxt Studio non era mai stato effettivamente disinstallato dopo questa decisione — il modulo, la sua configurazione e le routeRules di `/editor` erano ancora nel codice, inutilizzati (integrazione mai completata). Rimossi: dipendenza `nuxt-studio` da `package.json`, blocco `studio: {...}` e voce `"nuxt-studio"` da `modules` in `nuxt.config.ts`, routeRules `/editor`/`/editor/**`. Nessun file custom da rimuovere in `app/`/`server/` (l'integrazione era puramente config-driven). Da fare manualmente, fuori dal repo: rimuovere le env var `STUDIO_*` da Vercel e dai file `.env`/`.env.local` locali, ed eventualmente disattivare/eliminare la GitHub OAuth App creata per l'auth. `docs/BACKLOG.md` #4 (editor custom) resta l'unico piano concreto per un editor web sui contenuti.
