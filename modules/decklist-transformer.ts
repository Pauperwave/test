// ./modules/decklist-transformer.ts
import { existsSync } from 'fs'
import { join } from 'path'

import { defineNuxtModule } from '@nuxt/kit'
import type { FileBeforeParseHook } from '@nuxt/content'
import { createRegExp, digit, whitespace, oneOrMore, char } from 'magic-regexp'

import { getCardsByNames } from '#server/utils/card-database'
import type { ParsedCard } from '#shared/types'
import { slugify, buildLog } from '#shared/utils'
import { getFencedRanges, isInsideFence } from './card-tooltip-transformer'

export default defineNuxtModule({
  meta: {
    name: 'decklist-transformer'
  },
  setup(_options, nuxt) {
    buildLog('🚀 [Decklist Transformer] MODULE LOADED!')

    const hookContentBeforeParse = nuxt.hook as unknown as (
      name: 'content:file:beforeParse',
      handler: (ctx: FileBeforeParseHook) => void | Promise<void>
    ) => void

    /* eslint-disable @typescript-eslint/no-explicit-any */
    hookContentBeforeParse('content:file:beforeParse', async (ctx: FileBeforeParseHook) => {
      const file = ctx.file || ctx

      // Skip template files
      if (file.path?.includes('template')) {
        return
      }

      const allowedFolders = [
        'articles',
        'decklists',
        'reports',
        // 'spoilers',
        'tutorials',
        // 'docs',
      ]

      if (file.extension === '.md' && allowedFolders.some(folder => file.path?.includes(folder))) {
        const content = file.body

        if (content.includes('::MagicDecklist') || content.includes('::magic-decklist')) {
          file.body = await transformDecklistBlocks(content, file.path)
        }
      }
    })
  }
})

async function transformDecklistBlocks(content: string, filePath: string): Promise<string> {
  const blockWithFrontmatter = /::(MagicDecklist|magic-decklist)\s*\n---\n([\s\S]*?)\n---\n([\s\S]*?)::/gi
  const fencedRanges = getFencedRanges(content)

  const matches: Array<{
    match: string,
    componentName: string,
    frontmatter: string,
    decklistContent: string,
    index: number
  }> = []

  let match
  while ((match = blockWithFrontmatter.exec(content)) !== null) {
    if (!match[1] || !match[2] || !match[3]) continue
    if (isInsideFence(match.index, fencedRanges)) continue

    matches.push({
      match: match[0],
      componentName: match[1],
      frontmatter: match[2],
      decklistContent: match[3],
      index: match.index
    })
  }

  if (matches.length === 0) return content

  buildLog(`\n📝 [Decklist Transformer] Processing file: ${filePath}`)
  buildLog(`   └─ Found ${matches.length} decklist block(s)`)

  // Process matches in reverse order to maintain correct indices
  for (let i = matches.length - 1; i >= 0; i--) {
    const item = matches[i]
    if (!item) continue

    const { match, componentName, frontmatter, decklistContent, index } = item

    buildLog(`\n   🔄 Processing decklist ${matches.length - i}/${matches.length}`)

    const props = parseFrontmatter(frontmatter)
    const parsedCards = await parseDecklist(decklistContent)
    const sectionCounts = calculateSectionCounts(parsedCards)

    // Log the transformation
    logDecklistTransformation(props, parsedCards, sectionCounts)

    const cardsJson = JSON.stringify(parsedCards).replace(/"/g, '&quot;')
    const countsJson = JSON.stringify(sectionCounts).replace(/"/g, '&quot;')

    const propStrings = []
    for (const [key, value] of Object.entries(props)) {
      if (typeof value === 'string') {
        propStrings.push(`${key}="${value}"`)
      }
    }
    propStrings.push(`parsedCards="${cardsJson}"`)
    propStrings.push(`sectionCounts="${countsJson}"`)

    const deckId = `deck-${slugify(props.name ?? '')}-${slugify(props.player ?? '')}`
    propStrings.unshift(`anchor-id="${deckId}"`)

    const result = `::${componentName}{${propStrings.join(' ')}}\n::`

    content = content.substring(0, index) + result + content.substring(index + match.length)
  }

  const deckMetas = matches.map(item => {
    const props = parseFrontmatter(item.frontmatter)
    return {
      name: props.name ?? '',
      player: props.player ?? '',
      anchorId: `deck-${slugify(props.name ?? '')}-${slugify(props.player ?? '')}`,
    }
  })

  content = content.replace(/\r\n/g, '\n')
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (frontmatterMatch) {
    const existingFrontmatter = frontmatterMatch[1]
    const decksLines = deckMetas
      .map(d => [
        `  - name: "${d.name.replace(/"/g, '\\"')}"`,
        `    player: "${d.player.replace(/"/g, '\\"')}"`,
        `    anchorId: "${d.anchorId}"`,
      ].join('\n'))
      .join('\n')
    const newFrontmatter = `---\n${existingFrontmatter}\n_decks:\n${decksLines}\n---`
    content = content.replace(/^---\n[\s\S]*?\n---/, newFrontmatter)
  }

  buildLog(`   ✅ All decklists transformed successfully\n`)

  return content
}

function parseFrontmatter(yaml: string): Record<string, string> {
  const props: Record<string, string> = {}
  const lines = yaml.split('\n')

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/)
    if (match && match[1] && match[2]) {
      const key = match[1]
      const value = match[2].trim()
      props[key] = value
    }
  }

  return props
}

const CARD_PATTERN = createRegExp(
  oneOrMore(digit).grouped(),
  oneOrMore(whitespace),
  oneOrMore(char).grouped()
)

const SECTION_HEADERS: Record<string, string> = {
  'Creatures': 'Creatures',
  'Instants': 'Instants',
  'Sorceries': 'Sorceries',
  'Artifacts': 'Artifacts',
  'Enchantments': 'Enchantments',
  'Lands': 'Lands',
  'Sideboard': 'Sideboard',
}

const SECTION_ORDER = [
  'Creatures',
  'Instants',
  'Sorceries',
  'Artifacts',
  'Enchantments',
  'Lands',
  'Sideboard'
]

async function parseDecklist(rawText: string): Promise<Record<string, ParsedCard[]>> {
  const grouped: Record<string, ParsedCard[]> = {
    'Creatures': [],
    'Instants': [],
    'Sorceries': [],
    'Artifacts': [],
    'Enchantments': [],
    'Lands': [],
    'Sideboard': [],
  }

  const lines = rawText.split('\n')

  // First pass: collect all unique card names (section is irrelevant here)
  const cardNames: Set<string> = new Set()
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (SECTION_HEADERS[trimmed]) continue

    const match = trimmed.match(CARD_PATTERN)
    if (match && match[1] && match[2]) {
      cardNames.add(match[2])
    }
  }

  // Check if database exists
  const dbPath = join(process.cwd(), 'server', 'database', 'cards.db')
  const dbExists = existsSync(dbPath)

  let cardDataMap: Map<string, any> = new Map()

  if (dbExists) {
    cardDataMap = await getCardsByNames(Array.from(cardNames))

    // Log database lookup results
    logDatabaseLookup(cardNames, cardDataMap)
  } else {
    console.warn('   ⚠️  Database not found, skipping mana cost lookup')
  }

  // Second pass: build the grouped structure with mana costs
  let currentSection: keyof typeof grouped = 'Creatures'
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (SECTION_HEADERS[trimmed]) {
      currentSection = SECTION_HEADERS[trimmed] as keyof typeof grouped
      continue
    }

    const match = trimmed.match(CARD_PATTERN)
    if (match && match[1] && match[2]) {
      const cardName = match[2]
      const cardData = cardDataMap.get(cardName)

      const section = grouped[currentSection]
      if (section) {
        section.push({
          quantity: parseInt(match[1], 10),
          name: cardName,
          section: currentSection,
          manaCost: cardData?.manaCost || '',
          imageUrl: cardData?.imageUrl || '',
          backImageUrl: cardData?.backImageUrl || undefined
        })
      }
    }
  }

  const result: Record<string, ParsedCard[]> = {}
  for (const section of SECTION_ORDER) {
    const cards = grouped[section]
    if (cards && cards.length > 0) {
      result[section] = cards
    }
  }

  return result
}

function calculateSectionCounts(cardsBySection: Record<string, ParsedCard[]>): Record<string, number> {
  const counts: Record<string, number> = {}

  for (const [section, cards] of Object.entries(cardsBySection)) {
    counts[section] = cards.reduce((total, card) => total + card.quantity, 0)
  }

  return counts
}

// ============================================================================
// LOGGING FUNCTIONS
// ============================================================================

function logDatabaseLookup(cardNames: Set<string>, cardDataMap: Map<string, any>): void {
  buildLog(`   🔍 Found ${cardNames.size} unique card names`)
  buildLog(`   💾 Loaded ${cardDataMap.size}/${cardNames.size} cards from database`)

  const missingCards = Array.from(cardNames).filter(name => !cardDataMap.has(name))
  if (missingCards.length > 0) {
    buildLog(`   ⚠️  Missing from database (${missingCards.length}):`)
    missingCards.forEach(name => buildLog(`      └─ ${name}`))
  }
}

function logDecklistTransformation(
  props: Record<string, string>,
  parsedCards: Record<string, ParsedCard[]>,
  sectionCounts: Record<string, number>
): void {
  buildLog(`   📋 Frontmatter props:`, props)
  buildLog(`   📊 Section counts:`, sectionCounts)
  buildLog(`   🃏 Total cards by section:`)

  for (const [section, cards] of Object.entries(parsedCards)) {
    const totalCount = sectionCounts[section] || 0
    buildLog(`      └─ ${section}: ${cards.length} unique cards (${totalCount} total)`)
  }
}
