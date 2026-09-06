// ./modules/sideboard-guide-transformer.ts
import { existsSync } from 'fs'
import { join } from 'path'
import { defineNuxtModule } from '@nuxt/kit'
import type { FileBeforeParseHook } from '@nuxt/content'
import { createRegExp, digit, whitespace, oneOrMore, char } from 'magic-regexp'

import { getCardsByNames } from '#server/utils/card-database'
import type { ParsedCard } from '#shared/types'
import { buildLog } from '#shared/utils'
import { getFencedRanges, isInsideFence } from './card-tooltip-transformer'

export default defineNuxtModule({
  meta: {
    name: 'sideboard-guide-transformer'
  },
  setup(_options, nuxt) {
    buildLog('🚀 [Sideboard Guide Transformer] MODULE LOADED!')

    const hookContentBeforeParse = nuxt.hook as unknown as (
      name: 'content:file:beforeParse',
      handler: (ctx: FileBeforeParseHook) => void | Promise<void>
    ) => void

    /* eslint-disable @typescript-eslint/no-explicit-any */
    hookContentBeforeParse('content:file:beforeParse', async (ctx: FileBeforeParseHook) => {
      const file = ctx.file || ctx

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

        if (content.includes('::MagicSideboardGuide') || content.includes('::magic-sideboard-guide')) {
          file.body = await transformSideboardGuideBlocks(content, file.path)
        }
      }
    })
  }
})

async function transformSideboardGuideBlocks(content: string, filePath: string): Promise<string> {
  const blockWithFrontmatter = /::(MagicSideboardGuide|magic-sideboard-guide)\s*\n---\n([\s\S]*?)\n---\n([\s\S]*?)::/gi
  const fencedRanges = getFencedRanges(content)

  const matches: Array<{
    match: string,
    componentName: string,
    frontmatter: string,
    guideContent: string,
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
      guideContent: match[3],
      index: match.index
    })
  }

  if (matches.length === 0) return content

  buildLog(`\n📝 [Sideboard Guide Transformer] Processing file: ${filePath}`)
  buildLog(`   └─ Found ${matches.length} sideboard guide block(s)`)

  // Process matches in reverse order to maintain correct indices
  for (let i = matches.length - 1; i >= 0; i--) {
    const item = matches[i]
    if (!item) continue

    const { match, componentName, frontmatter, guideContent, index } = item

    buildLog(`\n   🔄 Processing sideboard guide ${matches.length - i}/${matches.length}`)

    const props = parseFrontmatter(frontmatter)
    const { cardsIn, cardsOut, cardsOutAlt } = await parseSideboardGuide(guideContent)

    // Log the transformation
    logSideboardGuideTransformation(props, cardsIn, cardsOut, cardsOutAlt)

    const cardsInJson = JSON.stringify(cardsIn).replace(/"/g, '&quot;')
    const cardsOutJson = JSON.stringify(cardsOut).replace(/"/g, '&quot;')
    const cardsOutAltJson = JSON.stringify(cardsOutAlt).replace(/"/g, '&quot;')

    const propStrings = []
    for (const [key, value] of Object.entries(props)) {
      if (typeof value === 'string') {
        propStrings.push(`${key}="${value}"`)
      }
    }
    propStrings.push(`cardsInParsed="${cardsInJson}"`)
    propStrings.push(`cardsOutParsed="${cardsOutJson}"`)
    propStrings.push(`cardsOutAltParsed="${cardsOutAltJson}"`)

    const result = `::${componentName}{${propStrings.join(' ')}}\n::`

    content = content.substring(0, index) + result + content.substring(index + match.length)
  }

  buildLog(`   ✅ All sideboard guides transformed successfully\n`)

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

async function parseSideboardGuide(rawText: string): Promise<{
  cardsIn: ParsedCard[]
  cardsOut: ParsedCard[]
  cardsOutAlt: ParsedCard[]
}> {
  const sections = {
    in: [] as string[],
    out: [] as string[],
    outAlt: [] as string[]
  }

  let currentSection: 'in' | 'out' | 'outAlt' | null = null
  const lines = rawText.split('\n')

  // First pass: group lines by section
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // Detect section headers (like #in, #out, #out-alt)
    if (trimmed.startsWith('#in')) {
      currentSection = 'in'
      continue
    } else if (trimmed.startsWith('#out-alt')) {
      currentSection = 'outAlt'
      continue
    } else if (trimmed.startsWith('#out')) {
      currentSection = 'out'
      continue
    }

    // Add card lines to current section
    if (currentSection && CARD_PATTERN.test(trimmed)) {
      sections[currentSection].push(trimmed)
    }
  }

  // Collect all unique card names
  const cardNames: Set<string> = new Set()
  for (const section of Object.values(sections)) {
    for (const line of section) {
      const match = line.match(CARD_PATTERN)
      if (match && match[2]) {
        cardNames.add(match[2])
      }
    }
  }

  // Check if database exists
  const dbPath = join(process.cwd(), 'server', 'database', 'cards.db')
  const dbExists = existsSync(dbPath)

  let cardDataMap: Map<string, any> = new Map()

  if (dbExists) {
    cardDataMap = await getCardsByNames(Array.from(cardNames))

    // Log database lookup and sections
    logSectionsAndDatabaseLookup(sections, cardNames, cardDataMap)
  } else {
    console.warn('   ⚠️  Database not found, skipping card data lookup')
  }

  // Parse each section
  const cardsIn = await parseCardSection(sections.in, cardDataMap, 'in')
  const cardsOut = await parseCardSection(sections.out, cardDataMap, 'out')
  const cardsOutAlt = await parseCardSection(sections.outAlt, cardDataMap, 'out-alt')

  return { cardsIn, cardsOut, cardsOutAlt }
}

async function parseCardSection(
  lines: string[],
  cardDataMap: Map<string, any>,
  section: string
): Promise<ParsedCard[]> {
  const cards: ParsedCard[] = []

  for (const line of lines) {
    const match = line.match(CARD_PATTERN)
    if (match && match[1] && match[2]) {
      const cardName = match[2]
      const cardData = cardDataMap.get(cardName)

      cards.push({
        quantity: parseInt(match[1], 10),
        name: cardName,
        section: section || '',
        manaCost: cardData?.manaCost || '',
        imageUrl: cardData?.imageUrl || '',
        backImageUrl: cardData?.backImageUrl || undefined
      })
    }
  }

  return cards
}

// ============================================================================
// LOGGING FUNCTIONS
// ============================================================================

function logSectionsAndDatabaseLookup(
  sections: { in: string[], out: string[], outAlt: string[] },
  cardNames: Set<string>,
  cardDataMap: Map<string, any>
): void {
  buildLog(`   📦 Sections found:`)
  buildLog(`      └─ #in: ${sections.in.length} lines`)
  buildLog(`      └─ #out: ${sections.out.length} lines`)
  buildLog(`      └─ #out-alt: ${sections.outAlt.length} lines`)

  buildLog(`   🔍 Found ${cardNames.size} unique card names`)
  buildLog(`   💾 Loaded ${cardDataMap.size}/${cardNames.size} cards from database`)

  const missingCards = Array.from(cardNames).filter(name => !cardDataMap.has(name))
  if (missingCards.length > 0) {
    buildLog(`   ⚠️  Missing from database (${missingCards.length}):`)
    missingCards.forEach(name => buildLog(`      └─ ${name}`))
  }
}

function logSideboardGuideTransformation(
  props: Record<string, string>,
  cardsIn: ParsedCard[],
  cardsOut: ParsedCard[],
  cardsOutAlt: ParsedCard[]
): void {
  buildLog(`   📋 Frontmatter props:`, props)
  buildLog(`\n   🎯 Final Parsed Object:`)

  buildLog(`      📥 Cards IN (${cardsIn.length} cards):`)
  cardsIn.forEach(card => {
    buildLog(`         ${card.quantity}x ${card.name}`)
    buildLog(`            └─ Mana Cost: ${card.manaCost || '(none)'}`)
    buildLog(`            └─ Image: ${card.imageUrl ? '✅' : '❌'}`)
  })

  buildLog(`\n      📤 Cards OUT (${cardsOut.length} cards):`)
  cardsOut.forEach(card => {
    buildLog(`         ${card.quantity}x ${card.name}`)
    buildLog(`            └─ Mana Cost: ${card.manaCost || '(none)'}`)
    buildLog(`            └─ Image: ${card.imageUrl ? '✅' : '❌'}`)
  })

  if (cardsOutAlt.length > 0) {
    buildLog(`\n      🔄 Cards OUT (Alternative) (${cardsOutAlt.length} cards):`)
    cardsOutAlt.forEach(card => {
      buildLog(`         ${card.quantity}x ${card.name}`)
      buildLog(`            └─ Mana Cost: ${card.manaCost || '(none)'}`)
      buildLog(`            └─ Image: ${card.imageUrl ? '✅' : '❌'}`)
    })
  }
}
