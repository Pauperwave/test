# Content Management Guide

Guide for managing content in the MTG Pauper blog.

## Table of Contents

- [Content Collections](#content-collections)
- [Frontmatter Reference](#frontmatter-reference)
- [Text Style Rules](#text-style-rules)
- [MDC Syntax](#mdc-syntax)
- [Adding New Content](#adding-new-content)
- [Card References](#card-references)
- [Charts](#charts)
- [Images](#images)
- [SEO Best Practices](#seo-best-practices)

---

## Content Collections

The blog uses **Nuxt Content** with 5 distinct collections, all located in `content/blog/`:

### 1. Articles (`content/blog/articles/`)

General blog posts about Magic: The Gathering Pauper format.

**Topics:**
- Meta Analysis
- Card evaluations
- Strategy guides
- Format news

**Example:** `2026-01-15-pyroblast-hydroblast-meta-decline.md`

---

### 2. Tutorials (`content/blog/tutorials/`)

Step-by-step how-to guides for learning Pauper.

**Topics:**
- Deck building guides
- Archetype primers
- Gameplay tutorials
- Sideboarding guides

**Example:** `2025-12-06-pingers.md`

---

### 3. Decklists (`content/blog/decklists/`)

Competitive deck lists with card breakdowns.

**Topics:**
- Tournament-winning lists
- Archetype decklists
- Budget alternatives
- Deck techs

**Example:** `2023-06-19-paupergeddon-pisa-2023.md`

---

### 4. Reports (`content/blog/reports/`)

Tournament reports and event coverage.

**Topics:**
- Tournament results
- Event recaps
- Match reports
- Meta snapshots

**Example:** `2025-12-09-edoardo-bardi-paupergeddon-lucca-winter-2025.md`

---

### 5. Spoilers (`content/blog/spoilers/`)

Set previews and spoiler analysis for new releases.

**Topics:**
- New card evaluations
- Set Reviews
- Pauper impact analysis
- Downshift announcements

**Example:** `2026-01-17-lorwyn-eclipsed.md`

---

## Frontmatter Reference

Every content file must include frontmatter metadata at the top.

### Required Fields

```yaml
---
title: string              # Article title (SEO important) — required
description: string        # Short summary (150-160 chars recommended) — required
date: YYYY-MM-DD           # Publication date (ISO format) — required
author: string | string[]  # Name(s) matching content/authors/*.yml — required
thumbnail: string           # Hero image path, use an alias (see Images) — required
tags: string[]              # Optional, defaults to []
language: "italiano" | "english"  # Optional, defaults to "italiano" — set to "english" for non-Italian articles
published: boolean          # Optional, defaults to false (hidden)
---
```

### Example Frontmatter

```yaml
---
title: "Pyroblast e Hydroblast: La Combo Vincente che Sta Cambiando il Meta Pauper"
description: "Un'analisi approfondita su come Pyroblast e Hydroblast stanno rivoluzionando il meta Pauper, con strategie avanzate e consigli per il sideboard."
date: 2026-01-15
tags:
  - pauper
  - meta
  - sideboard
  - blu
  - rosso
author: "Alessandro Moretti"
thumbnail: /arts/pyroblast-hydroblast.jpg
published: true
---
```

### Field Guidelines

#### `title`
- **Length:** 40-70 characters (optimal for SEO)
- **Format:** Use title case
- **Language:** Italian by default (primary audience); if the article is written in English, set `language: english` in frontmatter so it's labeled correctly (see `language` below)
- **Keywords:** Include primary keyword for SEO

**✅ Good:**
```yaml
title: "Mono Blue Control: Guida Completa al Mazzo Tier 1"
```

**❌ Bad:**
```yaml
title: "mazzo blu"  # Too short, no context
```

---

#### `description`
- **Length:** 150-160 characters (Google displays ~155 chars)
- **Purpose:** SEO meta description and article preview
- **Format:** Complete sentence(s)
- **Include:** Main topic and value proposition

**✅ Good:**
```yaml
description: "Scopri come costruire e giocare Mono Blue Control nel meta Pauper attuale, con sideboard, matchup guide e consigli pro."
```

**❌ Bad:**
```yaml
description: "Un mazzo blu"  # Too vague
```

---

#### `date`
- **Format:** `YYYY-MM-DD` (ISO 8601)
- **Required:** Yes (used for sorting and "New" badges)
- **Timezone:** Dates are in local time (Italy)

```yaml
date: 2026-01-17  # ✅ Correct
date: 17/01/2026  # ❌ Wrong format
date: 2026-1-17   # ❌ Missing leading zeros
```

---

#### `tags`
- **Format:** Array of lowercase strings
- **Count:** 3-8 tags recommended
- **Purpose:** Related articles, categorization, filtering

**Common Tags:**
```yaml
# Colors
- mono-white
- mono-blue
- mono-black
- mono-red
- mono-green
- azorius (white-blue)
- dimir (blue-black)
- rakdos (black-red)
- gruul (red-green)
- selesnya (green-white)
- orzhov (white-black)
- izzet (blue-red)
- golgari (black-green)
- simic (green-blue)
- boros (white-red)
- jund (black-red-green)
- temur (green-blue-red)
- esper (white-blue-black)
- grixis (blue-black-red)

# Archetypes
- aggro
- control
- combo
- midrange
- tempo

# Topics
- meta
- sideboard
- budget
- beginner
- advanced
- tournament
- deck-tech

# Card Types
- creature
- removal
- cantrip
- counterspell
```

**✅ Good:**
```yaml
tags:
  - meta
  - mono-blue
  - control
```

**❌ Bad:**
```yaml
tags:
  - monoblu          # Use english: "mono-blue"
  - "Meta Analysis"  # No spaces, use "meta" + "analisi"
```

#### Tag già in uso

L'elenco "Common Tags" sopra è indicativo (archetipi, colori, argomenti). In pratica, però, i tag realmente usati nei contenuti pubblicati sono principalmente **categorie di torneo/formato**, non archetipi — e seguono uno stile diverso (Title Case, spazi ammessi) da quello raccomandato più sopra. Prima di crearne uno nuovo, controlla se uno di questi copre già il caso:

| Tag | Occorrenze | Uso |
|---|---|---|
| `Top 8` | 82 | Piazzamento in un torneo (top 8) |
| `League` | 38 | Risultato/report di una league su Magic Online |
| `IPT` | 31 | Torneo della serie IPT (es. "IPT Amsterdam") |
| `Paupergeddon` | 29 | Evento Paupergeddon (torneo dal vivo) |
| `Set Review` | 23 | Analisi di un nuovo set/espansione |
| `Meta` | 20 | Analisi del metagame |
| `Top 16` | 7 | Piazzamento in un torneo (top 16) |
| `Top 4` | 3 | Piazzamento in un torneo (top 4) |
| `Data Analysis` | 3 | Contenuto basato su analisi statistiche/probabilità |
| `Top 32` | 2 | Piazzamento in un torneo (top 32) |
| `PTE` | 1 | Torneo della serie PTE |
| `Game Mechanics` | 1 | Contenuto su regole/meccaniche di gioco |
| `Final` | 1 | Piazzamento in finale |

> Nota: questo elenco riflette lo stato di `content/blog/` al 2026-09-01 (file placeholder/template esclusi, incluso `Top X` nel template report che non è un tag reale) — se aggiungi molti tag nuovi, vale la pena rigenerarlo invece di fidarsi ciecamente.

---

#### `language`

- **Values:** `italiano` (default) or `english`
- **Purpose:** labels non-Italian articles with an "English" badge on their article card; doesn't affect routing or the card lookup database
- Only set it for articles actually written in English — leave it unset for Italian content

```yaml
language: english
```

---

#### `author`

A string (single author) or array of strings (co-authors) — both are supported today, not a future feature. The value must match the `name` field of an entry in the separate `authors` collection (`content/authors/*.yml`), not inline avatar/bio fields.

```yaml
author: "Alessandro Moretti"
# or, for co-authored articles:
author: ["Alessandro Moretti", "Pietro Bragioto"]
```

Avatar, bio, description and social links live in the matching `content/authors/*.yml` file instead of the article's own frontmatter:

```yaml
# content/authors/moretti-alessandro.yml
name: Alessandro Moretti
nickname: AdeptoTerra
description: Presidente Pauperwave
bio: Bio più lunga mostrata nella pagina autore...
avatar: /assets/avatars/alessandro-moretti.png
url: /authors/alessandro-moretti
socials:
  twitter: https://x.com/A_AdeptoTerra
```

**Avatar requirements:**
- Format: JPG or PNG
- Size: 200x200px minimum
- Aspect ratio: 1:1 (square)
- Location: `public/assets/avatars/`

---

#### `thumbnail`

Hero image displayed at top of article and in previews.

```yaml
thumbnail: "/arts/counterspell.jpg"
# Or use other aliases: /sets/, /events/, /articles/, /blog/
```

**Image requirements:**
- Format: JPG or PNG
- Dimensions: 1200x630px (Facebook/OG image ratio)
- Aspect ratio: 1.91:1 (16:9 is acceptable)
- File size: < 200KB
- Location: `public/assets/blog/[subdirectory]/`

**Path Aliases:**

The project uses `@nuxt/image` with pre-configured aliases for cleaner paths:

| Alias | Resolves To | Use For |
|-------|-------------|---------|
| `/arts/*` | `/assets/blog/arts/*` | Card artwork and general art |
| `/sets/*` | `/assets/blog/sets/*` | Magic set images |
| `/events/*` | `/assets/blog/events/*` | Event banners and photos |
| `/articles/*` | `/assets/blog/articles/*` | Article-specific images |
| `/blog/*` | `/assets/blog/*` | Any blog asset |

**Examples:**
```yaml
# Card artwork
thumbnail: /arts/counterspell.jpg

# Set image
thumbnail: /sets/lorwyn-eclipsed.jpg

# Event banner
thumbnail: /events/paupergeddon-lucca-2025.jpg

# Article-specific image
thumbnail: /articles/meta-analysis.jpg
```

**Naming convention:**
```
# Use descriptive names with card set codes when possible
cmm-81-counterspell.jpg
inr-174-thermo-alchemist.jpeg

# Or descriptive names for original content
paupergeddon-lucca-2025-hero.jpg
meta-analysis-diagram.jpg
```

---

#### `published`

Controls article visibility.

```yaml
published: false  # Hidden from production, visible in dev (default)
published: true    # Published and visible
```

**Usage:**
- Leave `published: false` (or omit it) while writing — there is no necessity to commit unfinished articles
- Change to `published: true` when ready to publish
- Not published articles are filtered in production builds

---

## Text Style Rules

Simple find-and-replace rules to apply to article body text before publishing:

- Replace every en-dash `–` with a regular hyphen `-`.
- Replace every curly apostrophe `'` with a straight apostrophe `'`.

---

## MDC Syntax

Nuxt Content uses **MDC** (Markdown Components), an enhanced Markdown syntax.

### Basic Markdown

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
~~Strikethrough~~

[Link text](https://example.com)

![Alt text](/path/to/image.jpg)

- Unordered list item
- Another item

1. Ordered list item
2. Another item

> Blockquote
```

### Code Blocks

````markdown
```typescript
const greeting = 'Hello World'
console.log(greeting)
```
````

**Supported languages:** `typescript`, `javascript`, `vue`, `bash`, `json`, `yaml`, `css`, `html`

### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Alerts/Callouts

```markdown
::alert{type="info"}
Questa è un'informazione importante per i lettori.
::

::alert{type="warning"}
Attenzione: questo deck richiede esperienza avanzata.
::

::alert{type="success"}
Questo mazzo ha vinto il torneo!
::
```

### Vue Components in MDC

You can use Vue components directly in Markdown:

```markdown
<!-- Card display, see "Cards (fan / hand)" below — magic-card-display no longer exists,
magic-cards is the only shortcode for showing card images now -->
::magic-cards
---
cards:
  - Counterspell
---
::

<!-- TODO da testare -->
<!-- Image with caption -->
:image-caption{src="/assets/deck.jpg" caption="Mono Blue Control decklist"}
```

---

## Adding New Content

### Step-by-Step Guide

#### 1. Choose Collection

Determine which collection your content belongs to:
- General discussion → `articles/`
- How-to guide → `tutorials/`
- Top X Deck lists → `decklists/`
- Tournament coverage → `reports/`
- New set analysis → `spoilers/`

#### 2. Create File

**Naming convention:** `YYYY-MM-DD-slug.md`

```bash
# Example
content/blog/tutorial/2026-01-17-mono-blue-control-guide.md
```

**Rules:**
- Use kebab-case for slug
- Include date prefix
- Keep slug short but descriptive
- Use English slug even if content is Italian (for URL consistency)

#### 3. Add Frontmatter

Copy template from [Frontmatter Reference](#frontmatter-reference) and fill in all required fields.

#### 4. Write Content

- Use MDC syntax (see [MDC Syntax](#mdc-syntax))
- Structure with clear headings
- Add images where appropriate
- Include code examples if relevant

#### 5. Add Images

Place images in `public/assets/blog/articles/` (see [Images](#images) for the full alias reference):

```bash
public/assets/blog/articles/
├── mono-blue-control-hero.jpg      # Thumbnail
├── mono-blue-control-diagram.jpg   # In-article image
└── ...
```

Reference in content using the `/articles/*` alias, not the full path:
```markdown
![Mono Blue Control diagram](/articles/mono-blue-control-diagram.jpg)
```

#### 6. Preview

```bash
pnpm dev
# Navigate to http://localhost:3000/articles/2026-01-17-mono-blue-control-guide
```

#### 7. Set Published Status

```yaml
# While writing
published: false

# When ready to publish
published: true
```

---

## Card References

### Inline Card Mentions

When mentioning cards in text:

```markdown
Il mazzo gioca 4 copie di [[Counterspell]] e 2 [[Exclude]] per il controllo.
```

Use double square brackets `[[Card Name]]` to reference cards.
This will render the card image when the user hovers over the card name or touches it on mobile.

### Cards (fan / hand)

Use `::magic-cards` to show one or more cards — a rotated fan arrangement (default) or an upright "hand" arrangement, both with hover-to-lift. It's the *only* shortcode content authors use for card images now; for a single card, just pass a one-element `cards` array. Mirrors the naming of WotC's own component: their `<magic-cards>` wraps N `<magic-card>` elements, and ours does the same — `Cards.vue` only owns positioning, it composes `MagicCard` (`app/components/magic/Card.vue`, `::magic-card`) for each card's actual resolution/rendering rather than duplicating it. `magic-card` itself is an internal building block, not meant to be used directly in content.

```markdown
::magic-cards
---
cards:
  - Swords to Plowshares
  - Counterspell
  - Lightning Bolt
caption: "Le opzioni a confronto"
---
::
```

| Prop | Type | Required | Description |
|------|------|----------|--------------|
| `cards` | `string[]` | Yes | Card names, resolved client-side at runtime via the Scryfall API (`useScryfallCard`, cached in `useState`) — same mechanism as `magic-card-art-crop`, *not* the build-time DB lookup used by `[[Card Name]]` |
| `caption` | `string` | No | Text shown below the cards |
| `arch` | `number` | No | Total rotation spread in degrees (default: `20.5`, matching the WotC blog's fan component). The step between adjacent cards is `arch / count`, so the spread converges toward `arch` as more cards are added rather than growing past it. Only applies to `layout: fan`. |
| `layout` | `'fan' \| 'hand'` | No | `fan` (default) rotates cards around a shared pivot. `hand` skips rotation entirely — cards spread horizontally in fixed 60%-of-own-width steps and rise into a shallow arc (center card frontmost), like holding a hand of cards. ⚠️ The `hand` values were only partially captured live from magic.wizards.com (2 of 5 slot positions) and extrapolated for the rest — treat it as a reasonable approximation, not a byte-exact reproduction like `fan` is. |

Below `md` (768px), *both* layouts fall back to a plain horizontal scroll strip (rotated/spread cards don't work on narrow viewports) — this isn't a selectable mode, it's the same automatic responsive swap WotC's own component does below its `mobile-breakpoint` attribute. There is no separate "gallery" shortcode/mode anymore — that case is just `magic-cards` viewed on a narrow screen.

See `docs/architecture/2026-07-10-magic-cards-component-research.md` for the full reverse-engineering notes (rotation/position formulas, hover math, what's verified vs. extrapolated) and a matched-articles list from crawling WotC's own archive.

### Card Type Icons

Use `::magic-card-types-icon` to render a small inline mana-font icon for a card type (artifact, creature, enchantment, instant, land, sorcery) — useful in prose or tables without pulling in a full card image.

```markdown
:magic-card-types-icon{type="creature" size="md"}
```

| Prop | Type | Required | Description |
|------|------|----------|--------------|
| `type` | `string` | Yes | One of: `artifacts`, `creatures`, `enchantments`, `instants`, `lands`, `sorceries` |
| `size` | `'sm' \| 'md' \| 'lg'` | No | Icon size, default `md` |

### Decklists

Use `MagicDecklist` component for formatted decklists.

````markdown
::magic-decklist
---
name: "Mono Blue Control"
player: "Alessandro Moretti"
description: "Decklist vincente di Alessandro Moretti al Paupergeddon Lucca Winter 2025"
placement: "1° posto"
---
Creatures
2 Murmuring Mystic
4 Cryptic Serpent
4 Tolarian Terror

Instants
4 Brainstorm
4 Force Spike
4 Mental Note
2 Spell Pierce
4 Thought Scour
4 Counterspell

Sorceries
3 Ponder
2 Sleep of the Dead
2 Deem Inferior
1 Deep Analysis
4 Lórien Revealed

Lands
16 Island

Sideboard
4 Hydroblast
2 Blue Elemental Blast
3 Annul
3 Gut Shot
2 Dispel
1 Steel Sabotage
::
```
````

### Card Database Integration

The project includes a SQLite card database (`server/database/cards.db`) built from Scryfall's bulk data, filtered to Pauper-legal and banned cards. There is no runtime API route for it — `server/api/` is empty.

Card lookups instead happen at **build time**, inside the content-transformer modules (`modules/card-tooltip-transformer.ts` for `[[Card Name]]`, `modules/decklist-transformer.ts` for `::magic-decklist` bodies), which call `getCardByName`/`getCardsByNames` from `server/utils/card-database.ts` directly:

```typescript
// server/utils/card-database.ts
import { getCardByName } from '~/server/utils/card-database'

const card = await getCardByName('Lightning Bolt')
```

If a card isn't in the local database (e.g. a set released after the last `pnpm run download-cards`), the transformers fall back to a live Scryfall API lookup.

---

## Charts

Seven chart components (six via ECharts using `nuxt-echarts`/`vue-echarts`, plus a Mermaid diagram renderer) are available as MDC shortcodes. All are dark-mode aware and responsive automatically — no extra props needed for that. Source: `app/components/charts/`.

### `::bar-chart`

One bar per data item. Use `horizontal: true` when you have more than ~5 categories or long labels — it avoids rotated/overlapping axis text.

```markdown
::bar-chart
---
title: Meta Breakdown - Copie Giocate
description: Numero di copie della carta per archetipo, torneo Paupergeddon
seriesName: Copie
horizontal: true
data:
  - { name: Jund Wildfire, value: 11 }
  - { name: Monored Madness, value: 11 }
  - { name: Spy Combo, value: 8 }
---
::
```

| Prop | Type | Notes |
|---|---|---|
| `title`, `description` | string | optional |
| `data` | `{ name, value }[]` | one bar per item |
| `seriesName` | string | tooltip/legend label, defaults to `title` |
| `horizontal` | boolean | categories on the y-axis instead of rotated x-axis labels |
| `yAxisName`, `height` | string | optional |

### `::line-chart`

One or more named series over shared `categories`. Set `stacked: true` for the classic stacked-area "meta share over time" look; leave it `false` for a plain multi-line comparison.

```markdown
::line-chart
---
title: Andamento Meta nel Tempo
categories: [Gen, Feb, Mar, Apr, Mag, Giu]
stacked: true
yAxisName: "% Meta Share"
series:
  - { name: Jund Wildfire, data: [12, 14, 13, 15, 16, 18] }
  - { name: Monoblu Terror, data: [8, 9, 10, 9, 8, 7] }
---
::
```

| Prop | Type | Notes |
|---|---|---|
| `title`, `description` | string | optional |
| `categories` | string[] | x-axis labels |
| `series` | `{ name, data: number[] }[]` | one line per entry |
| `stacked` | boolean | default `false` |
| `area` | boolean | area fill; defaults to match `stacked` |
| `smooth` | boolean | default `false` |
| `yAxisName`, `height` | string | optional |

### `::confidence-band-chart`

A value line with a shaded upper/lower bound band around it (win-rate projections, statistical ranges).

```markdown
::confidence-band-chart
---
title: Win Rate Previsto - Mono Blue Control
seriesName: Win Rate
bandLabel: "Intervallo di Confidenza (95%)"
yAxisName: "Win Rate %"
data:
  - { x: "Round 1", value: 55, lower: 48, upper: 62 }
  - { x: "Round 2", value: 57, lower: 51, upper: 63 }
---
::
```

| Prop | Type | Notes |
|---|---|---|
| `title`, `description` | string | optional |
| `data` | `{ x, value, lower, upper }[]` | one point per x position |
| `seriesName` | string | value-line label, defaults to `title` |
| `bandLabel` | string | band legend label, default "Confidence Band" |
| `smooth`, `yAxisName`, `height` | — | optional |

### `::pie-chart`

```markdown
::pie-chart
---
title: Meta Breakdown
data:
  - { value: 11, name: Jund Wildfire }
  - { value: 8, name: Spy Combo }
---
::
```

| Prop | Type | Notes |
|---|---|---|
| `title`, `description` | string | optional |
| `data` | `{ value, name }[]` | one slice per item |
| `height` | string | default `500px` |

### `::scatter-chart`

One or more named point series. Legend only shows with 2+ series.

```markdown
::scatter-chart
---
title: CMC medio vs Win Rate
xAxisName: CMC medio
yAxisName: Win Rate %
series:
  - name: Aggro
    data: [{ x: 1.8, y: 52 }, { x: 2.1, y: 55 }, { x: 1.5, y: 58 }]
  - name: Control
    data: [{ x: 3.2, y: 51 }, { x: 3.8, y: 49 }, { x: 3.5, y: 53 }]
---
::
```

| Prop | Type | Notes |
|---|---|---|
| `title`, `description` | string | optional |
| `series` | `{ name, data: { x, y }[] }[]` | one point series per group |
| `xAxisName`, `yAxisName` | string | axis labels |
| `symbolSize` | number | point size, default `12` |
| `height` | string | optional |

### `::radar-chart`

Compares one or more entities across shared axes (`indicators`). Legend only shows with 2+ series.

```markdown
::radar-chart
---
title: Profilo Archetipo
indicators:
  - { name: Aggro, max: 10 }
  - { name: Control, max: 10 }
  - { name: Consistenza, max: 10 }
  - { name: Potenza, max: 10 }
  - { name: Budget, max: 10 }
series:
  - { name: Mono Red Madness, values: [9, 2, 6, 7, 8] }
  - { name: Mono Blue Control, values: [2, 9, 7, 8, 5] }
---
::
```

| Prop | Type | Notes |
|---|---|---|
| `title`, `description` | string | optional |
| `indicators` | `{ name, max }[]` | the radar axes, shared by all series |
| `series` | `{ name, values: number[] }[]` | one polygon per entity; `values` order must match `indicators` |
| `height` | string | optional |

### `::mermaid`

Renders a [Mermaid](https://mermaid.js.org/) diagram (flowcharts, sequence diagrams, etc.) client-side. Dark-mode aware like the other charts, but rendered after hydration (not present in prerendered HTML) since Mermaid requires the DOM — the `mermaid` package is only downloaded when a page actually has a diagram on it. Source: `app/components/charts/Mermaid.vue`.

```markdown
::mermaid
---
code: |
  flowchart TD
    A[Mainboard] --> B{Sideboard}
    B -->|Round 1| C[Swap]
    B -->|Round 2| D[Keep]
---
::
```

| Prop | Type | Notes |
|---|---|---|
| `code` | string | raw Mermaid diagram definition (use YAML block scalar `\|` for multi-line) |
| `height` | string | minimum height while rendering/loading, default `100px` |

---

## Images

### Image Configuration

The project uses `@nuxt/image` (v2.0.0) with pre-configured path aliases and presets for optimal performance.

### Path Aliases

Use these shorter paths instead of full paths:

| Alias | Resolves To | Use For |
|-------|-------------|---------|
| `/arts/*` | `/assets/blog/arts/*` | Card artwork and general art |
| `/sets/*` | `/assets/blog/sets/*` | Magic set images |
| `/events/*` | `/assets/blog/events/*` | Event banners and photos |
| `/articles/*` | `/assets/blog/articles/*` | Article-specific images |
| `/blog/*` | `/assets/blog/*` | Any blog asset |

**Benefits:**
- ✅ Shorter, cleaner paths
- ✅ Easy to refactor and maintain
- ✅ Consistent across the project
- ✅ Automatic image optimization

### Image Presets

Pre-configured optimization settings for different use cases:

**`thumbnail` Preset** - For hero images and OG images:
- Size: 1200×630px
- Format: WebP (automatic conversion)
- Quality: 80%
- Fit: Cover

**`card` Preset** - For article listing cards:
- Size: 600×315px
- Format: WebP (automatic conversion)
- Quality: 75%
- Fit: Cover

### Image Locations

```
public/
├── assets/
│   ├── blog/           # Blog assets (use aliases to reference)
│   │   ├── articles/   # Article-specific images
│   │   ├── arts/       # Card artwork and general art
│   │   ├── events/     # Event banners and photos
│   │   └── sets/       # Magic set images
│   └── avatars/        # Author avatars (no alias needed)
```

### Using Images in Frontmatter

```yaml
---
title: "Article Title"
thumbnail: /arts/counterspell.jpg  # ✅ Use alias path
# NOT: /assets/blog/arts/counterspell.jpg  # ❌ Don't use full path
---
```

**More examples:**
```yaml
# Card artwork
thumbnail: /arts/cmm-81-counterspell.jpg

# Set image
thumbnail: /sets/lorwyn-eclipsed.jpg

# Event banner
thumbnail: /events/paupergeddon-lucca-2025.jpg

# Article-specific image
thumbnail: /articles/meta-analysis.jpg
```

### Using Images in Content

#### Standard Markdown Images

```markdown
![Alt text describing the image](/arts/counterspell.jpg)
```

#### NuxtImg Component (Recommended)

For better performance, use the `NuxtImg` component with presets:

**Basic Usage:**
```vue
<NuxtImg 
  src="/arts/counterspell.jpg" 
  alt="Counterspell artwork"
  loading="lazy"
/>
```

**With Thumbnail Preset (Recommended for hero images):**
```vue
<NuxtImg 
  src="/arts/counterspell.jpg"
  preset="thumbnail"
  alt="Counterspell artwork"
  loading="lazy"
/>
```

**With Card Preset (For listing previews):**
```vue
<NuxtImg 
  src="/arts/counterspell.jpg"
  preset="card"
  alt="Counterspell artwork"
  loading="lazy"
/>
```

**With Custom Modifiers:**
```vue
<NuxtImg 
  src="/arts/counterspell.jpg"
  alt="Counterspell artwork"
  width="800"
  height="450"
  format="webp"
  quality="85"
  fit="cover"
  loading="lazy"
/>
```

**Using MDC Syntax in Markdown:**
```markdown
::NuxtImg
---
src: /arts/counterspell.jpg
alt: Counterspell card artwork
preset: thumbnail
loading: lazy
---
::
```

**Benefits:**
- ✅ Automatic WebP conversion
- ✅ Responsive image sizing
- ✅ Lazy loading support
- ✅ Optimized for Core Web Vitals
- ✅ On-demand image processing
- ✅ Automatic caching

#### Image with Caption

Use `::image-caption` for a single image with an optional caption underneath, e.g. a step in a tutorial.

```markdown
::image-caption
---
src: /assets/blog/articles/white-border/rubber.jpg
alt: "Gomma Faber Castell"
caption: "Lo strumento usato per questo passaggio"
---
::
```

| Prop | Type | Required | Description |
|------|------|----------|--------------|
| `src` | `string` | Yes | Image path |
| `alt` | `string` | No | Alt text, default `''` |
| `caption` | `string` | No | Caption shown below the image |

#### Image Carousel

Use `::image-carousel` for a swiper carousel of multiple images (e.g. deck photos, multiple angles of a physical card).

```markdown
::image-carousel
---
images:
  - /assets/blog/articles/white-border/deck-0.jpg
  - /assets/blog/articles/white-border/deck-1.jpg
  - src: /assets/blog/articles/white-border/deck-2.jpg
    alt: "Vista dall'alto del mazzo"
---
::
```

| Prop | Type | Required | Description |
|------|------|----------|--------------|
| `images` | `(string \| { src: string; alt?: string })[]` | Yes | Plain paths or objects with per-image alt text |

---

### OG Images (Social Media Previews)

The project uses **static thumbnails** for Open Graph images (social media previews).

#### How It Works

When you share an article on social media (Twitter, Facebook, LinkedIn), the thumbnail image from your frontmatter appears as the preview image.

**Architecture:**
1. Your `thumbnail` field in frontmatter becomes the OG image
2. `useSeoMeta()` automatically sets `og:image` meta tags
3. No dynamic generation needed - fast and reliable
4. Works perfectly with static site generation (`nuxt generate`)

#### Requirements for OG Images

**Dimensions:**
- Recommended: 1200×630px (1.91:1 aspect ratio)
- Minimum: 600×315px
- Maximum: 8MB file size

**Format:**
- JPG or PNG (both work)
- Optimized/compressed before upload
- Use descriptive filenames

**Path:**
- Must use image aliases (e.g., `/arts/counterspell.jpg`)
- File must exist in `public/assets/blog/[subdirectory]/`

#### Example Social Share Appearance

When someone shares your article:

```
┌──────────────────────────────────┐
│  [Card Artwork - Full Width]      │
│                                   │
│  Pyroblast e Hydroblast:          │
│  La Combo Vincente...             │
│                                   │
│  pauper.it                        │
└──────────────────────────────────┘
```

#### Testing OG Images

Before publishing, verify your OG images render correctly:

**Tools:**
- **Facebook Sharing Debugger:** https://developers.facebook.com/tools/debug/
- **Twitter Card Validator:** https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/
- **OpenGraph.xyz:** https://www.opengraph.xyz/

**Testing Process:**
1. Deploy your changes to Vercel (or preview URL)
2. Copy the full article URL
3. Paste into one of the tools above
4. Verify:
   - Image loads correctly
   - Dimensions are correct (1200×630px)
   - Title and description appear
   - No errors or warnings

**Common Issues:**

| Issue | Solution |
|-------|----------|
| Image not showing | Verify thumbnail path uses alias (e.g., `/arts/image.jpg`) |
| Wrong image displays | Clear social media cache using debugger tools |
| Image too small | Ensure thumbnail is at least 600×315px |
| Broken image | Check that file exists in `public/assets/blog/` |

#### Frontmatter Example

```yaml
---
title: "Pyroblast e Hydroblast: La Combo Vincente"
description: "Un'analisi approfondita su come Pyroblast e Hydroblast stanno rivoluzionando il meta Pauper."
thumbnail: /arts/cmm-81-counterspell.jpg  # ← This becomes the OG image
date: 2026-01-15
tags: [pauper, meta, sideboard]
---
```

**Generated HTML meta tags:**
```html
<meta property="og:image" content="/arts/cmm-81-counterspell.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="/arts/cmm-81-counterspell.jpg">
```

#### Why Static Thumbnails?

The project uses static thumbnails instead of dynamically generated OG images because:

✅ **Simple & Reliable** - No complex image generation at build time  
✅ **Fast Builds** - No SSR required, works with `nuxt generate`  
✅ **Great Visual Appeal** - Card artwork is eye-catching on social media  
✅ **Optimal Dimensions** - Thumbnails already follow 1200×630px guidelines  
✅ **Easy to Test** - Standard image files, easy to verify  
✅ **Vercel-Friendly** - Perfect for static site deployment  

#### Alternative: Branded OG Images (Not Currently Used)

If you need branded OG images with custom layouts (logo, title overlay, author info):

1. Enable OG Image module in `nuxt.config.ts`:
   ```typescript
   ogImage: {
       enabled: true,
       // Add prerendering config
   }
   ```

2. Uncomment `defineOgImageComponent()` in `app/pages/articles/[id].vue`

3. The template is available at `app/components/og_image/article.vue`

**Trade-offs:**
- ⚠️ Requires SSR or build-time prerendering
- ⚠️ Slower builds (generates images for each article)
- ⚠️ More complex configuration
- ✅ Custom branding and consistent design
- ✅ Can include logo, author info, formatted titles

### Image Guidelines

**File formats:**
- **Photos:** JPG or PNG (better compression for photos)
- **Logos/Icons:** SVG or PNG (better compression for photos)
- **Screenshots:** JPG or PNG (better compression for photos)

**Optimization:**
- Compress images before upload (TinyPNG)
- Use appropriate dimensions (don't upload 4K images)
- Add descriptive alt text for SEO/accessibility

**Naming:**
- Use kebab-case: `mono-blue-deck-photo.jpg`
- Be descriptive: `counterspell-art.jpg` not `image1.jpg` or `pic.png`

---

## SEO Best Practices

### Meta Tags

Frontmatter automatically generates SEO meta tags:

```html
<!-- Generated from frontmatter -->
<title>Article Title | MTG Pauper</title>
<meta name="description" content="Article description...">
<meta property="og:title" content="Article Title">
<meta property="og:image" content="/assets/articles/thumbnail.jpg">
```

### URL Structure

Clean, descriptive URLs are generated from file names:

```
✅ Good:
/articles/2026-01-17-mono-blue-control-guide

❌ Bad:
/articles/article1
/articles/2026-01-17-a
```

### Internal Linking

Link to related articles when relevant:

```markdown
Per approfondire il sideboard, leggi la nostra [guida al sideboard](/articles/sideboard-guide).
```

### Heading Structure

Use proper heading hierarchy:

```markdown
# Title (H1) - Only once (in frontmatter)
## Section (H2)
### Subsection (H3)
#### Sub-subsection (H4)
```

### Content Length

**Recommended lengths:**
- Articles: 800-2000 words
- Tutorials: 1000-3000 words
- Reports: 500-1500 words
- Spoilers: 600-1500 words

---

## Content Checklist

Before publishing, verify:

- [ ] All frontmatter fields filled correctly
- [ ] `published: true` for publication
- [ ] Date is correct (`YYYY-MM-DD` format)
- [ ] 3-8 relevant tags added
- [ ] Description is 150-160 characters
- [ ] Thumbnail image exists and is optimized
- [ ] All images have alt text
- [ ] Card names are in double brackets `[[Card Name]]`
- [ ] Content is properly structured with headings
- [ ] No broken links
- [ ] Spell-checked (Italian content)
- [ ] En-dashes (`–`) and curly apostrophes (`'`) replaced with `-` and `'` (see [Text Style Rules](#text-style-rules))
- [ ] Preview looks good in dev server

---

## Examples

### Complete Article Example

```markdown
---
title: "Mono Blue Control: La Guida Definitiva al Mazzo Tier 1"
description: "Impara a giocare Mono Blue Control nel meta Pauper attuale: decklist, sideboard, matchup e strategie avanzate per dominare il formato."
date: 2026-01-17
category: article
tags: [mono-blue, control, strategy]
author: "Alessandro Moretti"
thumbnail: /arts/cmm-81-counterspell.jpg
published: true
---

# Introduzione

Mono Blue Control è uno dei mazzi più iconici del formato Pauper, capace di controllare la partita grazie a controspell come [[Counterspell]] e carte di card advantage come [[Deep Analysis]].

## La Decklist

::magic-decklist
---
name: Mono Blue Control
player: Alessandro Moretti
placement: 1° posto
headerGradient: monoblue
---
Creatures
4 Cryptic Serpent

Instants
4 Counterspell
4 Spell Pierce

Sorceries
4 Preordain

Lands
16 Island

Sideboard
4 Dispel
::

## Conclusione

Un mazzo solido e versatile, adatto sia ai principianti che ai giocatori esperti del formato.
```

Nota: `author` deve corrispondere esattamente al `name` di un file in `content/authors/*.yml`. `category`, `decks` e `location` sono opzionali e non richiedono di essere specificati se non rilevanti.

---

## Support

For questions about content management:
- Check [DEVELOPMENT.md](DEVELOPMENT.md) for technical details
- Review existing articles for examples
- Test in dev server before publishing
