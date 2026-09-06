# Todos

Loose observations and open questions — not yet committed, ranked work. For that, see `docs/BACKLOG.md`.

## Monetizzazione: pubblicità non invasiva o donazioni

Obiettivo: coprire i costi di hosting/mantenimento, target indicativo ~20€/mese. Due strade, non necessariamente alternative:

- **Pubblicità non invasiva** — valutare provider ad-friendly (es. EthicalAds, Carbon Ads) che non richiedono banner pesanti/popup e si adattano al tema del sito; evitare qualunque cosa impatti Core Web Vitals o l'esperienza di lettura.
- **Richiesta donazioni** — link a Ko-fi/Buy Me a Coffee/GitHub Sponsors o simili, probabilmente in footer o in una pagina dedicata.

Da decidere: quale delle due (o entrambe), dove posizionarle nel layout, e se serve una pagina `/supporta` o basta un widget nel footer. Non ancora promosso a `BACKLOG.md` — manca una decisione su quale strada seguire prima che sia un item implementabile.

## Show the back face of double-faced cards on desktop

`magic-card-tooltip` (and by extension `[[Card Name]]` inline references) currently can't show the second face of a double-faced card on desktop — the `UTooltip` there is front-face-only. Mobile already has a working flip button in the fullscreen modal (see `app/components/magic/card/Tooltip.vue`). Already flagged inline in `content/docs/componenti.md` ("Alcuni casi limite"), tracked here so it doesn't only live as a caution note.

## Verify `hand` layout against a live magic.wizards.com session

`magic-cards`' `layout: hand` is only partially reverse-engineered — 2 of 5 card slot positions were captured live (from "Design Files: Urza's Destiny, Part 3", the one article found using `config="hand"`), the rest is extrapolated. Unverified: the other 3 slot positions, and whether hovering a hand card repositions siblings the way `fan` does. See `docs/architecture/2026-07-10-magic-cards-component-research.md` for what's confirmed vs. assumed.
