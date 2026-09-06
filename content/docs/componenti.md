---
title: Componenti disponibili in scrittura
description: Descrizione dettagliata dei componenti disponibili durante la scrittura di un articolo
published: true
sitemap:
  loc: /docs/componenti
  images:
    - loc: https://avatars.githubusercontent.com/u/225214755?s=200&v=4
---

## Componenti predefiniti

```text
Link: [Prose Components](/articles/2026-01-17-lorwyn-eclipsed)
```

Link: [Prose Components](/articles/2026-01-17-lorwyn-eclipsed)

```text
> This is a quote block
```

> This is a quote block

````text
```js [file.js]
export default () => {
  console.log('Code block')
}
```
````

```js [file.js]
export default () => {
  console.log('Code block')
}
```

```text
# Intestazione di primo livello (non usare)

## Intestazione di secondo livello

### Intestazione di terzo livello

#### Intestazione di quarto livello
```

```text
Divisore sotto.

---
```

Divisore sotto.

---

Divisore sopra.

Se necessiti di specificare la larghezza di un'immagine, usa html

```text
![drawing](https://avatars.githubusercontent.com/u/225214755?s=200\&v=4){style="width:400px; display: block; margin: 0 auto;"}
```

![drawing](https://avatars.githubusercontent.com/u/225214755?s=200\&v=4){style="width:400px; display: block; margin: 0 auto;"}

```text
- Una
- lista
- non
- ordinata
```

- Una
- lista
- non
- ordinata

```text
1. Una
2. lista
3. numerata
```

1. Una
2. lista
3. numerata

```text
Una parola **in grassetto**.
```

Una parola **in grassetto**.

```text
Una parola *in corsivo*.
```

Una parola *in corsivo*.

```text
Scrivo `codice` in linea.
```

Scrivo `codice` in linea.

```text
::tip
Messaggio di nota.
::
```

::tip
Messaggio di nota.
::

```text
::caution
Messaggio di cautela.
::
```

::caution
Messaggio di cautela.
::

```text
::note
Messaggio informativo.
::
```

::note
Messaggio informativo.
::

```text
::warning
Messaggio di allerta.
::
```

::warning
Messaggio di allerta.
::

```text
::card{title="Titolo della card"}
Contenuto della card.
::
```

::card{title="The Consistency Paradox"}
The people who seem most disciplined aren't superhuman – they've just made their habits so small and automatic that they barely require willpower. They're like efficiency ninjas, but with better sleep schedules.
::

```text
| Key | Type      | Description |
| --- | --------- | ----------- |
| 1   | Wonderful | Table       |
| 2   | Wonderful | Data        |
| 3   | Wonderful | Website     |
```

| Key | Type      | Description |
| --- | --------- | ----------- |
| 1   | Wonderful | Table       |
| 2   | Wonderful | Data        |
| 3   | Wonderful | Website     |

```text
::u-table
---
data:
  - Time Period: Week 1-2
    What Happens: Feels hard, requires lots of willpower
    Example: Every workout is a battle
  - Time Period: Week 3-4
    What Happens: Starts to feel slightly easier
    Example: You remember to pack gym clothes
  - Time Period: Week 5-8
    What Happens: Becomes part of routine
    Example: You feel weird on rest days
  - Time Period: Month 3+
    What Happens: Automatic behavior
    Example: Working out feels as natural as brushing teeth
---
::
```

::u-table
---
data:
  - Time Period: Week 1-2
    What Happens: Feels hard, requires lots of willpower
    Example: Every workout is a battle
  - Time Period: Week 3-4
    What Happens: Starts to feel slightly easier
    Example: You remember to pack gym clothes
  - Time Period: Week 5-8
    What Happens: Becomes part of routine
    Example: You feel weird on rest days
  - Time Period: Month 3+
    What Happens: Automatic behavior
    Example: Working out feels as natural as brushing teeth
---
::

## Componenti personalizzati

### Simboli di mana singoli

```js [Simboli di mana]
:magic-card-mana-symbol{symbol="w"}

:magic-card-mana-symbol{symbol="u"}

:magic-card-mana-symbol{symbol="b"}

:magic-card-mana-symbol{symbol="r"}

:magic-card-mana-symbol{symbol="g"}

:magic-card-mana-symbol{symbol="c"}
```

:magic-card-mana-symbol{symbol="w"} / :magic-card-mana-symbol{symbol="u"} / :magic-card-mana-symbol{symbol="b"} / :magic-card-mana-symbol{symbol="r"} / :magic-card-mana-symbol{symbol="g"} / :magic-card-mana-symbol{symbol="c"}

### Combinazioni di simboli di mana

::note
Nota lo spazio fra i simboli
::

```js [Simboli di mana]
:magic-card-mana-symbol{symbol="wubrgc"}
```

:magic-card-mana-symbol{symbol="wubrgc"}

### Simboli speciali

```js [Simboli speciali]
:magic-card-mana-symbol{symbol="X"}

:magic-card-mana-symbol{symbol="0"}

:magic-card-mana-symbol{symbol="1"}

:magic-card-mana-symbol{symbol="2"}

:magic-card-mana-symbol{symbol="3"}

:magic-card-mana-symbol{symbol="4"}

:magic-card-mana-symbol{symbol="5"}

:magic-card-mana-symbol{symbol="6"}

:magic-card-mana-symbol{symbol="7"}

:magic-card-mana-symbol{symbol="8"}

:magic-card-mana-symbol{symbol="9"}

:magic-card-mana-symbol{symbol="10"}
```

:magic-card-mana-symbol{symbol="X"} / :magic-card-mana-symbol{symbol="0"} / :magic-card-mana-symbol{symbol="1"} / :magic-card-mana-symbol{symbol="2"} / :magic-card-mana-symbol{symbol="3"} / :magic-card-mana-symbol{symbol="4"} / :magic-card-mana-symbol{symbol="5"} / :magic-card-mana-symbol{symbol="6"} / :magic-card-mana-symbol{symbol="7"} / :magic-card-mana-symbol{symbol="8"} / :magic-card-mana-symbol{symbol="9"} / :magic-card-mana-symbol{symbol="10"}

### Combinazioni di colori

```js [Combinazioni di colori]
:magic-card-mana-symbol{symbol="W/B"}

:magic-card-mana-symbol{symbol="U/B"}

:magic-card-mana-symbol{symbol="U/R"}

:magic-card-mana-symbol{symbol="B/R"}

:magic-card-mana-symbol{symbol="B/G"}

:magic-card-mana-symbol{symbol="R/G"}

:magic-card-mana-symbol{symbol="R/W"}

:magic-card-mana-symbol{symbol="G/W"}

:magic-card-mana-symbol{symbol="G/U"}
```

:magic-card-mana-symbol{symbol="W/U"} / :magic-card-mana-symbol{symbol="W/B"} / :magic-card-mana-symbol{symbol="U/B"} / :magic-card-mana-symbol{symbol="U/R"} / :magic-card-mana-symbol{symbol="B/R"} / :magic-card-mana-symbol{symbol="B/G"} / :magic-card-mana-symbol{symbol="R/G"} / :magic-card-mana-symbol{symbol="R/W"} / :magic-card-mana-symbol{symbol="G/W"} / :magic-card-mana-symbol{symbol="G/U"}

### Tipi di carte

```js [Tipi di carte]
:magic-card-mana-symbol{symbol="creature"}

:magic-card-mana-symbol{symbol="instant"}

:magic-card-mana-symbol{symbol="sorcery"}

:magic-card-mana-symbol{symbol="artifact"}

:magic-card-mana-symbol{symbol="land"}

:magic-card-mana-symbol{symbol="enchantment"}
```

:magic-card-mana-symbol{symbol="creature"} / :magic-card-mana-symbol{symbol="instant"} / :magic-card-mana-symbol{symbol="sorcery"} / :magic-card-mana-symbol{symbol="artifact"} / :magic-card-mana-symbol{symbol="land"} / :magic-card-mana-symbol{symbol="enchantment"}

### Simboli di mana phyrexiano

```js [Simboli di mana phyrexiano]
:magic-card-mana-symbol{symbol="P"}

:magic-card-mana-symbol{symbol="W/P"}

:magic-card-mana-symbol{symbol="U/P"}

:magic-card-mana-symbol{symbol="B/P"}

:magic-card-mana-symbol{symbol="R/P"}

:magic-card-mana-symbol{symbol="G/P"}
```

:magic-card-mana-symbol{symbol="P"} / :magic-card-mana-symbol{symbol="W/P"} / :magic-card-mana-symbol{symbol="U/P"} / :magic-card-mana-symbol{symbol="B/P"} / :magic-card-mana-symbol{symbol="R/P"} / :magic-card-mana-symbol{symbol="G/P"}

::note
Per una lista completa consultare [Mana & Card Icons](https://mana.andrewgioia.com/icons.html)
::

## Mostrare l'anteprima di una carta nel testo

### Quando usarlo

Il componente `magic-card-tooltip` è utile nel testo, è quindi un componente *in linea*, quando si vuole mostrare l'anteprima di una carta tramite hover (da pc) o toccando il nome della carta da mobile.

### Come usarlo

Selezionare il nome della carta completo **in inglese** e premere due volte il carattere `[` (parentesi quadra aperta), l'editor di testo Visual Studio Code inserirà automaticamente le parentesi di chiusura (`]]`).

Una volta che il codice viene analizzato verrà automaticamente trasformato nel componente `magic-card-tooltip`.

```md [La sintassi con le parentesi quadre viene trasformata automaticamente]
:magic-card-tooltip{name="Swords to Plowshares"}
```

### Varianti

Ci sono due varianti di questo componente:

- con la sola specifica del nome (`name`): viene restituita l'ultima illustrazione "normale";
  ```md \[Versione minimale]
  [[Swords to Plowshares]]
  ```
  Risultato: :magic-card-tooltip{image="https://cards.scryfall.io/normal/front/b/4/b4e9c870-23c0-413a-ae39-265f09da16d1.jpg?1782682546" name="Swords to Plowshares"}
- con la specifica del nome (`name`) e dell'espansione (`set`): spiegazione;
  ```md \[Versione minimale]
  [[Swords to Plowshares | spg]]
  ```
  Risultato: :magic-card-tooltip{image="https://cards.scryfall.io/normal/front/8/0/80590c26-285e-4b7b-9ee5-62956dba4ad7.jpg?1782689989" name="Swords to Plowshares" set="spg"}

Il componente `magic-card-tooltip` viene riutilizzato all'interno del componente `magic-decklist` e del componente `magic-sideboard-guide` come potrai notare più avanti.

### Alcuni casi limite

Alcuni casi limite con double faced cards e adventure cards

::note
Questi casi sono gestiti in modo speciale per garantire che la prima faccia della carta venga visualizzata correttamente.
::

::tip
Per le carte a due facce (transform, modal DFC, adventure, split, ...) il nome da usare **dipende da dove scrivi**:

- Nel testo in prosa (`[[Card Name]]`) usa solo il nome della prima faccia, così come stampato sulla carta: `[[Sagu Wildling]]`.
- Nelle decklist (`::magic-decklist`, `::magic-sideboard-guide`) usa il nome completo con `//`, così come lo esporta MTGO/Scryfall: `4 Sagu Wildling // Roost Seek`.

Entrambe le forme risolvono correttamente: `cards.db` viene generato con una riga per ciascuna delle due varianti (vedi `docs/architecture/card-download-database-flow.md`).
::

[[Delver of Secrets]] / [[The Modern Age]] / [[Sagu Wildling]]

::caution
Su desktop (hover) al momento non è possibile mostrare la seconda faccia di una carta double faced — viene sempre mostrata la prima. Da mobile invece, aprendo la modale a schermo intero, è disponibile un pulsante per mostrare il retro della carta.
::

```text
[[Insectile Aberration]]
```

[[Insectile Aberration]]

```text
[[Vector Glider]]
```

[[Vector Glider]]

## Mostrare una o più carte

`magic-cards` è l'unico componente da usare per mostrare carte intere negli articoli — sia per una carta sola (utile in `spoiler`) sia per più carte insieme, con ventaglio ruotato (`fan`, default) o variante "a mano" (`hand`, senza rotazione). Su schermi stretti (mobile) passa automaticamente a una striscia scorrevole: non è una modalità scelta dall'autore, è il comportamento responsive automatico, come nel componente originale di WotC.

Per una singola carta basta un array con un solo elemento:

```md
::magic-cards
---
cards:
  - Swords to Plowshares
---
::
```

::magic-cards
---
cards:
  - Swords to Plowshares
---
::

Per più carte insieme: il ventaglio ruotato.

```md
::magic-cards
---
cards:
  - Swords to Plowshares
  - Counterspell
  - Lightning Bolt
  - Brainstorm
  - Lava Spike
caption: "Cinque carte a ventaglio"
arch: 20.5 # opzionale, apertura totale del ventaglio in gradi (solo layout: fan)
---
::
```

::magic-cards
---
cards:
  - Swords to Plowshares
  - Counterspell
  - Lightning Bolt
  - Brainstorm
  - Lava Spike
caption: Cinque carte a ventaglio
---
::

### Variante "a mano"

Impostando `layout: hand` le carte non ruotano più: si dispongono in un leggero arco verticale (la carta centrale è la più "vicina", quelle ai lati risalgono leggermente), come tenerle in mano.

```md
::magic-cards
---
cards:
  - Lightning Bolt
  - Mulldrifter
  - Prophetic Prism
  - Chain Lightning
  - Ghostly Flicker
caption: "Cinque carte a mano"
layout: hand
---
::
```

::magic-cards
---
cards:
  - Lightning Bolt
  - Mulldrifter
  - Prophetic Prism
  - Chain Lightning
  - Ghostly Flicker
caption: Cinque carte a mano
layout: hand
---
::

## Icona del tipo di carta

Piccola icona inline (mana-font) per un tipo di carta, utile in prosa o tabelle senza dover caricare l'immagine intera.

```md
:magic-card-types-icon{type="creature" size="md"}
```

:magic-card-types-icon{size="md" type="creature"} Creatura  
:magic-card-types-icon{size="md" type="instant"} Istantaneo  
:magic-card-types-icon{size="md" type="land"} Terra

## Mostrare l'art di una carta

Il componente `magic-card-art-crop` in modo predefinito prende il nome della carta e ne restituisce l'art.
è possibile specificare l'espansione e il numero di collezione della carta, il numero di espansione non è necessario quando l'art è univoca.

```md
::magic-card-art-crop
---
card: Swords to Plowshares (spg)
---
::
```

:magic-card-art-crop{card="Swords to Plowshares (spg)"}

### Varianti

Opzionalmente è possibile specificare la proprietà `crop` con due parametri obbligatori:

- `height`: che assumere i valori `small` | `medium` | `large` | `xl`
- `position`: che assumere i valori `top` | `center` | `bottom`

### Comportamento predefinito

Senza alcun parametro viene restituita tutta l'art.

```md
::magic-card-art-crop
---
card: Repel Calamity
---
::
```

In questo caso è possibile specificare in modo più immediato:

```md
:magic-card-art-crop{card="Repel Calamity"}
```

::warning
Nota bene che in questo caso si usano solo un due punti, non due.
::

Il risultato è il medesimo:

:magic-card-art-crop{card="Repel Calamity"}

### Small top crop

```md
::magic-card-art-crop
---
card: Repel Calamity
crop:
  height: small
  position: top
---
::
```

### Small center crop

::magic-card-art-crop
---
crop:
  height: medium
  position: top
card: Repel Calamity
---
::

```md
::magic-card-art-crop
---
card: Repel Calamity
crop:
  height: small
  position: center
---
::
```

::magic-card-art-crop
---
crop:
  height: medium
  position: center
card: Repel Calamity
---
::

### Small bottom crop

```md
::magic-card-art-crop
---
card: Repel Calamity
crop:
  height: small
  position: bottom
---
::
```

::magic-card-art-crop
---
crop:
  height: medium
  position: bottom
card: Repel Calamity
---
::

## Esprimere una valutazione

Componente per mostrare il voto di una carta su una scala da 0 a 10.

### Come usarlo

```md
::magic-card-rating
---
cardName: Nome della carta
rating: 6.5
---
::
```

### Esempi di voti da 0 a 10

Il colore del badge cambia in base al voto:

- **0 - 3.5**: Rosso (error) - Voto insufficiente
- **4 - 5.5**: Giallo/Arancio (warning) - Voto mediocre
- **6 - 7.5**: Blu (primary) - Voto buono
- **8 - 10**: Verde (success) - Voto eccellente

::magic-card-rating{:rating='0' card-name="Pessimo"}
::

::magic-card-rating{:rating='3.5' card-name="Molto scarso"}
::

::magic-card-rating{:rating='4' card-name="Scarso"}
::

::magic-card-rating{:rating='5.5' card-name="Sotto la media"}
::

::magic-card-rating{:rating='6' card-name="Nella media"}
::

::magic-card-rating{:rating='7.5' card-name="Discreto"}
::

::magic-card-rating{:rating='8' card-name="Buono"}
::

::magic-card-rating{:rating='10' card-name="Molto buono"}
::

## Opinione del revisore

Componente per mostrare l'opinione di un revisore su una carta, utilizzato negli articoli di spoiler.

### Come usarlo

```md
::reviewer-opinion
---
name: Nome del revisore
rating: 7
---
Testo dell'opinione del revisore sulla carta.
::
```

### Esempio

::reviewer-opinion{:rating='7' name="Pietro Bragioto"}
Carta interessante che potrebbe trovare spazio in diversi archetipi. La sua versatilità la rende una solida aggiunta al formato, anche se non è una carta definitiva. Il costo di mana è giustificato dall'impatto che può avere sulla partita.
::

## Card Autore

Piccola card cliccabile con avatar, nome e descrizione dell'autore — usata ad esempio nelle byline degli articoli. Tutti gli autori attualmente registrati:

::note
Nella byline degli articoli questa card viene impostata **automaticamente**: basta scrivere il nome completo dell'autore nel frontmatter (`author: "Nome Cognome"`) — non serve invocare `::author-card` a mano nel corpo del testo. Il nome deve corrispondere esattamente (case-insensitive) al campo `name` di un file in `content/authors/**.yml`. La card completa con la **bio** (mostrata ad esempio nella sezione "Riguardo l'autore" in fondo agli articoli) è un componente diverso da quello mostrato qui sotto, e al momento non è dimostrata in questa pagina.
::

```md
::author-card
---
author:
  name: Alessandro Moretti
  avatar: /assets/avatars/alessandro-moretti.png
  description: Presidente Pauperwave
  nickname: AdeptoTerra
  url: /authors/alessandro-moretti
---
::
```

::author-card
---
author:
  name: Alessandro Moretti
  avatar: /assets/avatars/alessandro-moretti.png
  description: Presidente Pauperwave
  nickname: AdeptoTerra
  url: /authors/alessandro-moretti
---
::

::author-card
---
author:
  name: Pietro Bragioto
  avatar: /assets/avatars/pietro-bragioto.jpg
  description: Scribacchino di liste
  nickname: crila-peoty
  url: /authors/pietro-bragioto
---
::

::author-card
---
author:
  name: Nicola Cordeschi
  avatar: /assets/avatars/nicola-cordeschi.jpg
  description: Fondatore Lega Pauper TAA
  nickname: ilFritto
  url: /authors/nicola-cordeschi
---
::

::author-card
---
author:
  name: Paolo Donfrancesco
  avatar: /assets/avatars/paolo-donfrancesco.jpg
  description: Walker735
  nickname: Walker735
  url: /authors/paolo-donfrancesco
---
::

::author-card
---
author:
  name: Hypergeomancer
  avatar: /assets/avatars/hypergeomancer.png
  description: Matematico
  nickname: hypergeomancer
  url: /authors/hypergeomancer
---
::

## Guida al sideboard

::warning
Non disponible in `decklists` e in `spoilers`.
::

```md
::magic-sideboard-guide
---
description: Descrizione breve delle scelte di side
matchup: Mono Red Rally
---
#in
3 Cast into the Fire
#out
3 Thermo-Alchemist
#out-alt
1 Thermo-Alchemist
2 Great Furnace
::
```

::magic-sideboard-guide
---
description: Descrizione breve delle scelte di side
matchup: Mono Red Rally
---
#in
3 Cast into the Fire
#out
3 Thermo-Alchemist
#out-alt
1 Thermo-Alchemist
2 Great Furnace
::

## Mostrare una decklist

::note
Componente utile in articoli `decklist`, `report` e `tutorial`.
::

```md
::magic-decklist
---
name: Elves
player: Lahiri Cristofori
placement: Winner
headerGradient: monowhite
---
Creatures
4 Delver of Secrets
4 Elvish Mystic
4 Sagu Wildling // Roost Seek
4 The Modern Age
4 Masked Vandal
4 Priest of Titania
4 Timberwatch Elf
4 Avenging Hunter
3 Sagu Wildling // Roost Seek
4 Generous Ent

Sorceries
4 Land Grant
4 Winding Way
4 Lead the Stampede

Lands
1 Gingerbread Cabin
8 Forest

Sideboard
4 Spinewoods Paladin
3 Faerie Macabre
3 Hydroblast
3 Monstrous Emergence
1 Island
1 Tangled Islet
::
```

::magic-decklist
---
name: Elves
player: Lahiri Cristofori
placement: Winner
headerGradient: monowhite
---
Creatures
4 Delver of Secrets
4 Elvish Mystic
4 Sagu Wildling // Roost Seek
4 The Modern Age
4 Masked Vandal
4 Priest of Titania
4 Timberwatch Elf
4 Avenging Hunter
3 Sagu Wildling // Roost Seek
4 Generous Ent

Sorceries
4 Land Grant
4 Winding Way
4 Lead the Stampede

Lands
1 Gingerbread Cabin
8 Forest

Sideboard
4 Spinewoods Paladin
3 Faerie Macabre
3 Hydroblast
3 Monstrous Emergence
1 Island
1 Tangled Islet
::

### Gradienti per le decklist

#### Gradienti mono-colore

```text
headerGradient: monowhite
```

::magic-decklist
---
headerOnly: true
headerGradient: monowhite
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: monoblue
```

::magic-decklist
---
headerOnly: true
headerGradient: monoblue
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: monoblack
```

::magic-decklist
---
headerOnly: true
headerGradient: monoblack
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: monored
```

::magic-decklist
---
headerOnly: true
headerGradient: monored
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: monogreen
```

::magic-decklist
---
headerOnly: true
headerGradient: monogreen
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: colorless
```

::magic-decklist
---
headerOnly: true
headerGradient: colorless
name: heading
placement: placement
player: subheading
---
::

#### Gradienti due-colori

```text
headerGradient: gruul
```

::magic-decklist
---
headerOnly: true
headerGradient: gruul
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: azorius
```

::magic-decklist
---
headerOnly: true
headerGradient: azorius
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: dimir
```

::magic-decklist
---
headerOnly: true
headerGradient: dimir
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: boros
```

::magic-decklist
---
headerOnly: true
headerGradient: boros
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: golgari
```

::magic-decklist
---
headerOnly: true
headerGradient: golgari
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: izzet
```

::magic-decklist
---
headerOnly: true
headerGradient: izzet
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: orzhov
```

::magic-decklist
---
headerOnly: true
headerGradient: orzhov
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: rakdos
```

::magic-decklist
---
headerOnly: true
headerGradient: rakdos
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: selesnya
```

::magic-decklist
---
headerOnly: true
headerGradient: selesnya
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: simic
```

::magic-decklist
---
headerOnly: true
headerGradient: simic
name: heading
placement: placement
player: subheading
---
::

#### Gradienti tre-colori

```text
headerGradient: esper
```

::magic-decklist
---
headerOnly: true
headerGradient: esper
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: grixis
```

::magic-decklist
---
headerOnly: true
headerGradient: grixis
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: jund
```

::magic-decklist
---
headerOnly: true
headerGradient: jund
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: naya
```

::magic-decklist
---
headerOnly: true
headerGradient: naya
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: bant
```

::magic-decklist
---
headerOnly: true
headerGradient: bant
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: mardu
```

::magic-decklist
---
headerOnly: true
headerGradient: mardu
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: temur
```

::magic-decklist
---
headerOnly: true
headerGradient: temur
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: sultai
```

::magic-decklist
---
headerOnly: true
headerGradient: sultai
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: jeskai
```

::magic-decklist
---
headerOnly: true
headerGradient: jeskai
name: heading
placement: placement
player: subheading
---
::

```text
headerGradient: abzan
```

::magic-decklist
---
headerOnly: true
headerGradient: abzan
name: heading
placement: placement
player: subheading
---
::

## Immagini

### Immagine con didascalia

```md
::image-caption
---
src: /arts/cmm-81-counterspell.jpg
alt: "Counterspell"
caption: "Una didascalia esplicativa sotto l'immagine"
---
::
```

:image-caption{alt="Counterspell" caption="Una didascalia esplicativa sotto l'immagine" src="/arts/cmm-81-counterspell.jpg"}

### Carosello di immagini

Utile per foto di mazzi o più angolazioni di una carta fisica.

```md
::image-carousel
---
images:
  - /arts/cmm-81-counterspell.jpg
  - src: /sets/lord-of-the-rings.jpg
    alt: "Lord of the Rings"
---
::
```

::image-carousel
---
images:
  - /arts/cmm-81-counterspell.jpg
  - src: /sets/lord-of-the-rings.jpg
    alt: Lord of the Rings
---
::

## Grafici

Sette componenti grafico (sei via ECharts, più un renderer di diagrammi Mermaid) utili per articoli di meta-analisi, report e tutorial. Si adattano automaticamente alla dark mode e allo schermo.

### Grafico a barre

Utile per confronti tra categorie (es. numero di copie giocate per archetipo). Usa `horizontal: true` quando i nomi delle categorie sono lunghi o numerosi.

#### Grafico a barre verticale

Comportamento predefinito (senza `horizontal`).

```md
::bar-chart
---
title: Meta Breakdown - Copie Giocate
seriesName: Copie
data:
  - { name: Jund Wildfire, value: 11 }
  - { name: Monored Madness, value: 11 }
  - { name: Spy Combo, value: 8 }
  - { name: Grixis Affinity, value: 7 }
---
::
```

::bar-chart
---
data:
  - name: Jund Wildfire
    value: 11
  - name: Monored Madness
    value: 11
  - name: Spy Combo
    value: 8
  - name: Grixis Affinity
    value: 7
seriesName: Copie
title: Meta Breakdown - Copie Giocate
---
::

#### Grafico a barre orizzontale

Con `horizontal: true`, utile quando i nomi delle categorie sono lunghi o numerosi.

```md
::bar-chart
---
title: Meta Breakdown - Copie Giocate
seriesName: Copie
horizontal: true
data:
  - { name: Jund Wildfire, value: 11 }
  - { name: Monored Madness, value: 11 }
  - { name: Spy Combo, value: 8 }
  - { name: Grixis Affinity, value: 7 }
---
::
```

::bar-chart
---
data:
  - name: Jund Wildfire
    value: 11
  - name: Monored Madness
    value: 11
  - name: Spy Combo
    value: 8
  - name: Grixis Affinity
    value: 7
horizontal: true
seriesName: Copie
title: Meta Breakdown - Copie Giocate
---
::

### Grafico a linee

Una o più serie nominate sull'asse temporale condiviso `categories`. Con `stacked: true` ottieni il classico grafico ad area impilata, utile per mostrare l'andamento della meta share nel tempo.

```md
::line-chart
---
title: Andamento Meta nel Tempo
categories: [Gen, Feb, Mar, Apr, Mag, Giu]
stacked: true
yAxisName: "% Meta Share"
series:
  - { name: Jund Wildfire, data: [12, 14, 13, 15, 16, 18] }
  - { name: Monoblu Terror, data: [8, 9, 10, 9, 8, 7] }
  - { name: RDW, data: [5, 6, 6, 7, 6, 5] }
---
::
```

::line-chart
---
categories:
  - Gen
  - Feb
  - Mar
  - Apr
  - Mag
  - Giu
series:
  - name: Jund Wildfire
    data:
      - 12
      - 14
      - 13
      - 15
      - 16
      - 18
  - name: Monoblu Terror
    data:
      - 8
      - 9
      - 10
      - 9
      - 8
      - 7
  - name: RDW
    data:
      - 5
      - 6
      - 6
      - 7
      - 6
      - 5
stacked: true
title: Andamento Meta nel Tempo
yAxisName: "% Meta Share"
---
::

### Grafico con banda di confidenza

Una linea di valore con una fascia superiore/inferiore intorno, utile per stime e proiezioni (es. win rate previsto).

```md
::confidence-band-chart
---
title: Win Rate Previsto - Mono Blue Control
seriesName: Win Rate
bandLabel: "Intervallo di Confidenza (95%)"
yAxisName: "Win Rate %"
data:
  - { x: "Round 1", value: 55, lower: 48, upper: 62 }
  - { x: "Round 2", value: 57, lower: 51, upper: 63 }
  - { x: "Round 3", value: 54, lower: 46, upper: 61 }
  - { x: "Round 4", value: 58, lower: 52, upper: 65 }
---
::
```

::confidence-band-chart
---
data:
  - x: Round 1
    value: 55
    lower: 48
    upper: 62
  - x: Round 2
    value: 57
    lower: 51
    upper: 63
  - x: Round 3
    value: 54
    lower: 46
    upper: 61
  - x: Round 4
    value: 58
    lower: 52
    upper: 65
bandLabel: Intervallo di Confidenza (95%)
seriesName: Win Rate
title: Win Rate Previsto - Mono Blue Control
yAxisName: Win Rate %
---
::

### Grafico a torta

Utile per mostrare la distribuzione degli archetipi in un torneo.

```md
::pie-chart
---
title: Meta Breakdown
data:
  - { value: 11, name: Jund Wildfire }
  - { value: 11, name: Monored Madness }
  - { value: 8, name: Spy Combo }
  - { value: 7, name: Grixis Affinity }
---
::
```

::pie-chart
---
data:
  - value: 11
    name: Jund Wildfire
  - value: 11
    name: Monored Madness
  - value: 8
    name: Spy Combo
  - value: 7
    name: Grixis Affinity
title: Meta Breakdown
---
::

### Grafico a dispersione (scatter)

Utile per mostrare correlazioni tra due valori (es. costo di mana medio e win rate). La legenda compare solo con più di una serie.

```md
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

::scatter-chart
---
series:
  - name: Aggro
    data:
      - x: 1.8
        y: 52
      - x: 2.1
        y: 55
      - x: 1.5
        y: 58
  - name: Control
    data:
      - x: 3.2
        y: 51
      - x: 3.8
        y: 49
      - x: 3.5
        y: 53
title: CMC medio vs Win Rate
xAxisName: CMC medio
yAxisName: Win Rate %
---
::

### Grafico radar

Utile per confrontare uno o più mazzi su più assi contemporaneamente (es. profilo di un archetipo). L'ordine dei `values` di ogni serie deve corrispondere all'ordine degli `indicators`.

```md
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

::radar-chart
---
indicators:
  - name: Aggro
    max: 10
  - name: Control
    max: 10
  - name: Consistenza
    max: 10
  - name: Potenza
    max: 10
  - name: Budget
    max: 10
series:
  - name: Mono Red Madness
    values:
      - 9
      - 2
      - 6
      - 7
      - 8
  - name: Mono Blue Control
    values:
      - 2
      - 9
      - 7
      - 8
      - 5
title: Profilo Archetipo
---
::

### Diagramma Mermaid

Renderizza un diagramma [Mermaid](https://mermaid.js.org/) (flowchart, sequence diagram, ecc.) lato client. Utile per illustrare flussi decisionali (es. guide al sideboard, alberi di scelta durante una partita). A differenza degli altri grafici, il diagramma viene renderizzato solo dopo l'hydration della pagina, non è presente nell'HTML prerenderizzato.

```md
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

::mermaid
---
code: |
  flowchart TD
    A[Mainboard] --> B{Sideboard}
    B -->|Round 1| C[Swap]
    B -->|Round 2| D[Keep]
---
::
