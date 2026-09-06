/**
 * Replaces curly apostrophes (’) with straight ones (') in a file.
 *
 * Run with: node scripts/fix-apostrophe.mjs <path>
 */

import { readFileSync, writeFileSync } from 'fs'

const path = process.argv[2]
if (!path) {
  console.error('Usage: node scripts/fix-apostrophe.mjs <path>')
  process.exit(1)
}

let content = readFileSync(path, 'utf-8')
const before = (content.match(/’/g) || []).length
content = content.replaceAll('’', "'")
writeFileSync(path, content, 'utf-8')
console.log(`replaced ${before} occurrence(s) in ${path}`)
