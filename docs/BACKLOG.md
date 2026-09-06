# Backlog

<!-- docs/BACKLOG.md -->

Committed, actionable work items, ranked by priority with a rough effort estimate. For loose observations/ideas that aren't yet committed work, see `docs/TODO.md`. For what's already done, see `docs/PROGRESS.md`.

**Priority:** P1 (do next) · P2 (soon) · P3 (someday)
**Effort:** S (< 1h) · M (a few hours) · L (a day+)

| # | Item | Priority | Effort |
|---|------|----------|--------|
| 1 | [Sistemare generazione og-images](#1-sistemare-generazione-og-images) | P2 | S |
| 2 | [Pie chart legend overlaps the chart on mobile](#2-pie-chart-legend-overlaps-the-chart-on-mobile) | P2 | S |
| 3 | [Pulsante "torna in cima" su mobile](#3-pulsante-torna-in-cima-su-mobile) | P2 | M |
| 4 | [Editor custom (markdown/MDC) per la modifica articoli](#4-editor-custom-markdownmdc-per-la-modifica-articoli) | P2 | L |

---

## 1. Sistemare generazione og-images

Log osservato in dev/build:

```
[log] [nitro]   ├─ /__og-image__/static/articles/0000-00-00-decklist-template/og.png (658ms)
```

L'og-image viene generata anche per il decklist template (`0000-00-00-decklist-template`), che non è un articolo pubblicato — da capire se va escluso dal prerender o se il comportamento è atteso. Verificare anche le altre og-image generate per contenuti reali.

Relates to `docs/audits/2026-07-11-build-performance-investigation.md`, which flagged OG-image render timeouts as a separate, still-open cost during `bun run generate`.

---

## 2. Pie chart legend overlaps the chart on mobile

`app/components/charts/PieChart.vue` — in the mobile viewport, the legend (positioned on the left) sits on top of the pie chart itself instead of stacking below/around it. Needs a responsive layout fix (e.g. move the legend below the chart, or stack vertically, under a mobile breakpoint).

---

## 3. Pulsante "torna in cima" su mobile

Aggiungere un tasto flottante in basso a destra, visibile solo su mobile, per tornare rapidamente in cima alla pagina (utile su articoli lunghi).

Verificato: **non esiste già** — né altrove in questo sito (`app/`), né come componente pronto in Nuxt UI (nessun `back-to-top`/`scroll-to-top` nei componenti installati). Andrebbe costruito da zero: `@vueuse/core`'s `useWindowScroll` (già installato, vedi `nuxt.config.ts` → `@vueuse/nuxt`) per tracciare la posizione di scroll ed eventualmente mostrare/nascondere il pulsante, più un `UButton` stilizzato come floating action button, gestito con lo stesso `useDevice()`'s `isMobile` usato altrove nel progetto (vedi nota in `CLAUDE.md` sui grafici) per limitarlo a mobile.

---

## 4. Editor custom (markdown/MDC) per la modifica articoli

**Decisione presa (utente, 2026-07-24): si procede con un editor custom basato su TipTap**, invece di continuare a investire su Nuxt Studio (che nel frattempo è stato rimosso del tutto dal progetto — modulo, config e route `/editor`, vedi `docs/PROGRESS.md` ADR-003). Non è più solo un'ipotesi di ripiego: Studio mostrava un banner "Conflitto rilevato" permanente sui contenuti che passano dai transformer custom (`modules/decklist-transformer.ts`, `modules/sideboard-guide-transformer.ts`, `modules/card-tooltip-transformer.ts`) — causa accertata (non solo ipotizzata): un confronto testuale banale (`content.trim() === websiteContent.trim()`, trovato in `node_modules/nuxt-studio/dist/app/main-*.js`) tra il file grezzo su GitHub e il contenuto pubblicato, che per questo progetto differiscono sempre per design (il sito pubblicato mostra la forma espansa post-transform). Non era un problema di parsing dei componenti MDC — Studio li riconosceva correttamente — ma il rischio che il salvataggio scrivesse su git la forma espansa non è stato verificato empiricamente prima di decidere di procedere comunque con l'editor custom. Dettagli completi in `docs/PROGRESS.md` ADR-003.

**Componente di base già disponibile:** `UEditor` di `@nuxt/ui` — **già incluso nella versione installata (`@nuxt/ui@4.9.0`)**, nessun bump di versione richiesto (verificato: `node_modules/@nuxt/ui/dist/runtime/components/Editor.vue` esiste). Costruito su `@tiptap/vue-3`/`@tiptap/core` direttamente (non sul modulo community `nuxt-tiptap-editor` — sono due cose distinte, verificato leggendo `package.json` del progetto di riferimento). Supporta `content-type="markdown"` per il round-trip nativo testo↔ProseMirror.

**Progetto di riferimento:** [`nuxt-ui-templates/editor`](https://github.com/nuxt-ui-templates/editor) ([demo](https://editor-template.nuxt.dev/)) — mostra `UEditor` con toolbar, drag handle, slash commands, upload immagini, completions AI (Vercel AI SDK) e collaborazione realtime (Y.js/PartyKit) opzionali. **Non ha alcuna persistenza reale** (il contenuto è un `ref` locale inizializzato a una stringa hardcoded, mai scritto su file/git) — è un punto di partenza per l'interazione editor, non per il salvataggio.

**Formato reale da preservare al round-trip** (verificato leggendo sorgenti .md committati, non il template vuoto):
- `[[Card Name]]` / `[[Card Name|set]]` — inline, dentro il testo normale (es. `content/blog/articles/2019-05-01-vantaggio-carte-vantaggio-tempo.md`).
- `::magic-decklist` — blocco a recinto con frontmatter YAML (`name`, `player`, `placement`, `headerGradient`) + corpo **testo semplice**, non JSON: righe `Sezione` seguite da righe `quantità Nome Carta` (es. `content/blog/decklists/2023-11-20-paupergeddon-roma-2023.md`). Il template vuoto (`0000-00-00-decklist-template.md`) mostra la forma minima attesa da un autore.
- `::magic-sideboard-guide` — stessa forma a blocco, corpo con tag `#in`/`#out` seguiti da righe `quantità Nome Carta` (es. `content/blog/reports/2025-12-09-edoardo-bardi-paupergeddon-lucca-winter-2025.md`).

**Vincolo chiave per l'adattamento:** l'editor deve leggere/scrivere esattamente questa forma grezza — mai l'output arricchito dei transformer (`parsed-cards` JSON, ecc.). Questo esclude di poter riusare `UEditor` "as-is" per il contenuto dei blocchi `::magic-decklist`/`::magic-sideboard-guide`: vanno trattati come testo opaco/nodo custom (estensione TipTap dedicata), non fatti passare per il serializzatore markdown generico di `UEditor`, che non conosce la sintassi a recinto MDC e rischierebbe di corromperla.

**Da definire prima di implementare:**
- Design dell'estensione TipTap per i blocchi a recinto (`::nome\n---\nprops\n---\nbody\n::`) — nodo custom con editing del body come testo semplice, non WYSIWYG pieno.
- Persistenza: scrittura diretta su file locali in dev vs. commit su GitHub in produzione — serve un token/OAuth con permessi di scrittura sul repo, da costruire da zero ora che l'infrastruttura auth di Studio non esiste più.
- Form frontmatter separata (title, date, tags, author, thumbnail, published, ...) — `UEditor` gestisce solo il corpo, non lo YAML in testa al file.
- Autenticazione: costruire un proprio allowlist di moderatori (pattern simile a quello che usava Studio).

**P2/L** — scope grande ma ora prioritario, perché non c'è più alcun editor web per decklist/report/sideboard-guide.
