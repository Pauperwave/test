# Card Download & Database Flow

Panoramica del flusso che porta i dati delle carte da Scryfall fino al rendering nel blog.

## Architecture Overview

Nuxt 4. I dati delle carte vengono scaricati da Scryfall e salvati in un database SQLite locale, poi risolti **a build time** dentro i moduli di trasformazione del contenuto — non c'è alcun endpoint API chiamato a runtime dal browser.

---

## Card Download Flow

**Entry point:** `scripts/download-bulk-data.ts`

1. **Fetch Bulk Data Info** — chiama `https://api.scryfall.com/bulk-data`, trova il bulk data type `oracle_cards`.
2. **Download Bulk Data** — crea `server/database/` se necessario, scarica il file gzip da `jsonl_download_uri` (Scryfall non offre più un download JSON semplice, solo JSONL gzippato) e lo decomprime al volo in `server/database/oracle-cards.jsonl` (gitignored) — un oggetto card per riga, nessun array che le racchiude.
3. **Create Database Schema** — crea `server/database/cards.db` (SQLite, **committato in git** nonostante il nome suggerisca il contrario — solo `oracle-cards.jsonl` è gitignored) con tabelle `cards` (name PK, mana_cost, image_url, back_image_url, indexed_at) e `metadata` (key PK, value, updated_at), più indice su `cards.name`.
4. **Import Pauper Cards** — legge `oracle-cards.jsonl` riga per riga (`JSON.parse` per riga, non un unico array), filtra `legalities.pauper === 'legal' || 'banned'`, svuota la tabella (`DELETE FROM cards`) e reimporta da zero ad ogni run. Qualunque carta con `card_faces` (transform, modal DFC, reversible card, ma anche split/adventure e layout più recenti come "prepare") viene inserita **due volte**: una riga con il nome completo Scryfall (`"Fronte // Retro"`, usato dalle decklist incollate da MTGO) e una riga alias con il solo nome della prima faccia (usato da `[[Card Name]]`) — entrambe con `back_image_url` valorizzato quando la seconda faccia ha un'immagine propria (transform/modal DFC; per split/adventure resta vuoto perché condividono un'unica immagine). Il calcolo del nome-alias è centralizzato in un unico punto dello script, indipendente da quale ramo (immagine per-faccia vs immagine unica top-level) ha risolto `image_url`/`mana_cost` — vedi il commento sopra `cardsToInsert` in `scripts/download-bulk-data.ts`.

**Trigger:**
- Manuale: `pnpm run download-cards`
- **Non automatico** — non ci sono hook `prebuild`/`pregenerate` in `package.json`. Il DB va rigenerato a mano quando serve (es. dopo un aggiornamento delle legalità Pauper) e deve esistere prima di `dev`/`build`, altrimenti i transformer ripiegano sulla Scryfall API carta per carta (più lento).

---

## Database Access

**Utility:** `server/utils/card-database.ts`

- `getCardByName(name)` — lookup singolo per nome esatto.
- `getCardsByNames(names[])` — lookup batch con query parametrizzata, ritorna `Map<name, CardData>`.
- Connessione singleton, apertura in sola lettura.

Queste funzioni vengono chiamate **direttamente dai moduli Nuxt in fase di build**, non da un endpoint HTTP: `server/api/` è attualmente vuota, non esiste un `/api/cards`.

---

## Build-Time Content Transformation

Tre moduli custom in `modules/`, registrati come ultimi in `nuxt.config.ts`, agganciati all'hook `content:file:beforeParse` di `@nuxt/content` — riscrivono il markdown grezzo **prima** che venga parsato:

- **`modules/card-tooltip-transformer.ts`** — converte `[[Card Name]]` / `[[Card Name|set]]` in `:MagicCardTooltip{...}`, risolvendo l'immagine da `cards.db` con fallback sulla Scryfall API (`GET /cards/named?exact=...&format=image`).
- **`modules/decklist-transformer.ts`** — converte le decklist testuali dentro `::magic-decklist` in dati strutturati chiamando `getCardsByNames()`.
- **`modules/sideboard-guide-transformer.ts`** — stessa logica per i blocchi `::magic-sideboard-guide`.

Ognuno gira solo su cartelle specifiche (`articles`, `decklists`, `reports`, `tutorials` — controllare `allowedFolders`/`forbiddenFolders` di ciascun modulo, non sono identici tra loro).

---

## Frontend Rendering

Il componente riceve dati **già risolti** (mana cost, immagine) direttamente nelle props/slot del content renderizzato — non fa fetch a runtime:

- **`app/components/magic/Decklist.vue`** — renderizza main deck / sideboard con simboli di mana e preview immagine su hover (desktop) / modal (mobile), copia decklist in formato MTGO.
- **`app/components/magic/card/Tooltip.vue`** — tooltip hover/tap per i riferimenti `[[Card]]` inline.
- **`app/components/magic/Card.vue`** — visualizzazione di una singola carta (usata internamente da `Cards.vue`, non richiamata direttamente nei contenuti); questo fa fetch diretto dalla Scryfall API (non dal DB locale), supporta sintassi set/collector number.

---

## Data Flow Summary

```
Scryfall API → download-bulk-data.ts → oracle-cards.jsonl (gitignored, gunzipped on the fly)
                                    ↓
                              cards.db (~2 MB, solo Pauper-legal, committato in git)
                                    ↓
                     card-database.ts (getCardByName / getCardsByNames)
                                    ↓
        modules/{card-tooltip,decklist,sideboard-guide}-transformer.ts
                        (content:file:beforeParse, build time)
                                    ↓
              markdown riscritto → @nuxt/content parse → componenti Vue
```

---

## Current State

- `cards.db` **è committato in git** (vedi `.gitignore`: la riga che lo escluderebbe è commentata); solo `oracle-cards.jsonl` è gitignored. Va comunque rigenerato in locale con `pnpm run download-cards` dopo un aggiornamento delle legalità Pauper o dei dati Scryfall, e il risultato va committato.
- Nessun endpoint `/api/cards` — tutta la risoluzione carte avviene a build time.
- Filtro legalità Pauper applicato in fase di import.
- Simboli di mana renderizzati via CSS (`mana-font`) lato frontend.
