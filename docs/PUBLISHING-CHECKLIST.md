# Lista di Controllo per la Pubblicazione

<!-- docs/PUBLISHING-CHECKLIST.md -->

Promemoria rapido per chi scrive, da controllare prima di pubblicare. Non fa parte
dell'indice della documentazione di proposito: è una lista di controllo personale da
seguire prima di impostare `published: true`, non un riferimento tecnico (per quello
c'è `CONTENT.md`).

## Intestazione (frontmatter)

- [ ] `published: true`
- [ ] `date` corretta e nel formato `YYYY-MM-DD`
- [ ] `title`, `description`, `author`, `thumbnail` tutti compilati
- [ ] `thumbnail` usa il percorso breve (`/arts/...`, `/sets/...`, `/events/...`, `/articles/...`, `/blog/...`), non il percorso completo `/assets/blog/...`
- [ ] `language: english` impostato se l'articolo non è in italiano (il default è `italiano`, non serve impostarlo per i contenuti italiani)
- [ ] `tags` pertinenti e, dove possibile, riutilizzati tra quelli già esistenti (controlla la sezione "Common Tags" di `docs/CONTENT.md` prima di inventarne una nuova)
- [ ] il nome del file segue `YYYY-MM-DD-titolo-breve.md`, ed è coerente con eventuale numerazione "part N" nel titolo (es. `part-1`/`part-2`, non `part-1`/`-2`)

## Riferimenti alle carte

- [ ] i nomi delle carte dentro `[[Nome Carta]]` corrispondono **esattamente all'ortografia ufficiale su Scryfall**, accenti inclusi (es. `Dandân`, non `Dandan`), perché la ricerca nel `cards.db` distingue maiuscole/minuscole e i caratteri accentati
- [ ] ogni carta effettivamente citata nel testo è racchiusa in `[[ ]]` (facile dimenticarne qualcuna dentro parentesi o elenchi)
- [ ] i nomi di prodotti/set (Chronicles, TMNT Team-Up, un drop specifico di Secret Lair...) **non** vanno racchiusi in `[[ ]]`, riservato alle singole carte. Se utile, rimanda invece alla pagina del set su Scryfall, tenendo conto che i drop di Secret Lair non hanno un codice set individuale (condividono tutti `sld`)
- [ ] se `server/database/cards.db` è disallineato (manca un set uscito di recente), esegui `pnpm run download-cards` prima di pubblicare
- [ ] nessun `[[ ]]` è incollato subito dopo un trattino puntato senza spazio (es. `-[[Copper Tablet]]`): MDC non riconosce il componente in quel punto e lo mostra come testo letterale (`:MagicCardTooltip{...}`) invece di renderizzarlo — serve lo spazio dopo il `-` (`- [[Copper Tablet]]`), che tra l'altro lo rende anche un elenco puntato vero e proprio

## Collegamenti

- [ ] i collegamenti esterni usano il protocollo completo `https://`: uno slash iniziale (es. `/youtu.be/...`) viene trattato come rotta interna e restituisce 404
- [ ] gli URL nudi nelle liste Sources/Notes sono racchiusi in un `[Etichetta](url)` descrittivo invece di essere incollati grezzi
- [ ] verifica che tutti i collegamenti risolvano davvero (200), specialmente i PDF e gli URL lunghi/con codifica

## Testo

- [ ] nessuna virgoletta/apostrofo curvo (`’ “ ”`): esegui `pnpm run fix-apostrophe -- <percorso>` per normalizzare in `'` dritto
- [ ] gli articoli in inglese sono stati riletti per la grammatica (accordo soggetto-verbo, ausiliari mancanti, falsi amici come "argument" per "topic"): non dare per scontato che un testo dal suono naturale sia privo di errori
- [ ] le intestazioni nel corpo partono da `##` (h2), perché il `title` nell'intestazione viene già renderizzato come `<h1>` della pagina
- [ ] c'è una riga vuota prima e dopo i blocchi `::componente`/`::/componente` — attaccati al testo circostante rischiano di non essere riconosciuti
- [ ] c'è lo spazio dopo il `#`/`##`/`###` nelle intestazioni (`## Titolo`, non `##Titolo`)
- [ ] c'è lo spazio dopo il `-`/`1.` negli elenchi puntati e numerati (`- voce`, non `-voce`)

## Immagini

- [ ] la miniatura e le immagini incorporate nel testo esistono al percorso referenziato (`public/assets/blog/...`)
- [ ] ogni immagine ha il testo alternativo impostato

## Prima di fare il commit

- [ ] `pnpm run typecheck` e `pnpm run lint` passano entrambi
- [ ] l'anteprima è corretta nel server di sviluppo, inclusi eventuali blocchi `::magic-decklist`/`::magic-cards` e le anteprime delle carte
