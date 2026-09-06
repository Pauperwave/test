---
title: "Regole di Buon Senso per i Report"
description: "Le regole di buon senso da seguire per scrivere un report di torneo per Pauperwave: struttura consigliata, tempistiche di consegna e piccoli accorgimenti di stile."
tags:
  - Meta
date: 2020-02-18
author: Pietro Bragioto
thumbnail: /arts/m20-35-rule-of-law.jpg
published: true
---

## Introduzione

Questa guida raccoglie le regole da seguire per scrivere un report di torneo per Pauperwave: come strutturare i turni, entro quando consegnare il pezzo e come usare correttamente i componenti di gioco (decklist, sideboard, immagini) nel testo.
Seguitele fin dalla prima bozza: velocizza la revisione e accorcia i tempi tra la fine del torneo e la pubblicazione.

## Le 3 regole d'oro

::MagicCardArtCrop
---
card: All That Glitters (CMM)
crop:
  height: xl
  position: top
---
::

1. **Disattivate il "Caps Lock"**: Evitate espressioni tutte in maiuscolo se queste non sono sigle come "UR" oppure "OTP".
2. **Lasciate le parentesi agli informatici**: In grammatica esistono le virgole per sostituire le parentesi che utilizzate raramente sono accettabili, ma ad ogni frase diventano pesanti.
3. **Maiuscole per i nomi propri**: I nomi delle carte sono nomi propri, quindi scriveteli con la maiuscola.

Inoltre vige la <u>**regola aurea di consegnare il report non oltre 10 giorni dall'evento**</u>: un report pubblicato settimane dopo un evento perde di significato e di interesse. Consegnare in tempo permette di pubblicare tutti i report entro due settimane dall'evento anche nel caso peggiore, ossia quando la maggior parte arriva all'ultimo momento — lo scenario più frequente.

Dulcis in fundo, se avete qualche bella foto da voler pubblicare nel vostro report mandatela senza problemi e comunicate anche se prediligete qualche immagine copertina in particolare come, ad esempio, l'art di una carta emblematica del vostro evento.

## Convenzioni

Prima del racconto dei turni, aprite il report con la decklist giocata usando il blocco `::magic-decklist`:

```
::magic-decklist
---
name: Mono Blue Control
player: Alessandro Moretti
description: Decklist vincente al Paupergeddon Lucca Winter 2025
placement: 1° posto
---
Creatures
2 Murmuring Mystic
4 Cryptic Serpent

Instants
4 Brainstorm
4 Counterspell

Lands
16 Island

Sideboard
4 Hydroblast
2 Blue Elemental Blast
::
```

`name`, `player`, `description` e `placement` vanno nel frontmatter del blocco; il corpo elenca le carte una per riga nel formato `quantità nome carta`, raggruppate per sezione (`Creatures`, `Instants`, `Sorceries`, `Artifacts`, `Lands`, `Sideboard`, ...). Il risultato è una card con intestazione (nome mazzo, piazzamento, giocatore), le sezioni della lista con conteggio e costo di mana per carta, e la sideboard separata in fondo.

Per raccontare un turno, suggerisco vivamente — anzi, raccomando fortemente — di seguire la seguente struttura:

- Turno "n": "archetipo" di "cognome+nome player"
- Game 1
  - Sideboard
- Game 2 e Game 3
  - Risultato Match
  - Punteggio Torneo 

Eventuali aneddoti possono essere disseminati tra le varie parti.

### Esempio

```

# Giorno 1

## Turno 1: Elfi di Moretti Alessandro

Conosco l'oppo ed è la decima volta che ci troviamo a turno 1 in un qualsivoglia torneo (bla bla bla [...])

### Game 1

([...])

### Sideboard

::magic-sideboard-guide
---
matchup: Mono R Madness
description: 
---
#in
4 Blue Elemental Blast
1 Hydroblast
2 Dispel
#out
4 The Modern Age // Vector Glider
3 Thraben Charm
::

(Eventuale spiegazione della sidata)

### Game 2

([...])

### Game 3

([...])

- Match: `1-2`
- Score: `0-1`

# Giorno 2

[...]
```

Il blocco `::magic-sideboard-guide` va nella sezione "Sideboard": la riga `matchup` indica l'avversario o l'archetipo affrontato, `#in` e `#out` elencano le carte in entrata e in uscita nel formato `quantità nome carta` (una carta per riga). Se esiste un piano alternativo, aggiungete una terza sezione `#out-alt` con le carte da togliere in quel caso.

Il risultato è una card con due colonne affiancate, "Sideboard In" e "Sideboard Out", ciascuna con il conteggio totale delle carte tra parentesi nell'intestazione; ogni carta mostra quantità, nome (con tooltip al passaggio del mouse) e costo di mana. Se è presente `#out-alt`, compare sotto "Sideboard Out" separata da un divisore con l'etichetta "Alternativa".

Prendete come riferimento questo [report di Paupergeddon Lucca Winter 2025](/articles/2025-12-09-edoardo-bardi-paupergeddon-lucca-winter-2025) e seguite questo formato.

## Conclusioni

::MagicCardArtCrop
---
card: Glittering Wish
crop:
  height: xl
  position: top
---
::

Questa guida è _volutamente_ scarna ed essenziale, in modo da essere veloce da leggere e da consultare ogni volta che scrivete un report.
Seguire queste regole e la convenzione sulla struttura dei turni velocizza la revisione da parte della redazione e accorcia i tempi di pubblicazione: prima arriva un report conforme, prima esce.
