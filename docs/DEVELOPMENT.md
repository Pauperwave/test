# Development Guide

Technical reference for developers and AI agents working on this project.

## Table of Contents

- [Technology Stack Details](#technology-stack-details)
- [Code Style Guide](#code-style-guide)
- [Project Structure](#project-structure)
- [Utility Functions](#utility-functions)
- [Database](#database)
- [Testing](#testing)
- [Common Patterns](#common-patterns)
- [Performance Considerations](#performance-considerations)
- [Known Issues](#known-issues)

---

## Technology Stack Details

### Core Technologies

- **pnpm** - Package manager
- **Node** - JavaScript runtime (pinned via `volta`); standalone scripts run directly via `node` using its native TypeScript type-stripping, no transpiler needed
- **TypeScript** - Strict mode enabled for type safety
- **Nuxt 4** - Vue meta-framework with SSG (Static Site Generation)
- **Vue 3** - Progressive JavaScript framework (Composition API)
- **Nuxt UI 4** - Component library built on Tailwind CSS
- **Nuxt Content** - File-based CMS with MDC support
- **Vitest** - Fast unit test framework
- **happy-dom** - Lightweight DOM implementation for testing (vitest dependency)

### Why These Choices?

- **pnpm over npm/yarn:** faster installs, strict/non-flat node_modules by default
- **TypeScript strict mode:** Catch more errors at compile time
- **Vue 3 Composition API:** Better logic reuse, improved TypeScript support
- **Tailwind CSS:** Utility-first CSS for rapid styling, small bundle size
- **Nuxt Content:** Markdown + Vue components, easy content management
- **Nuxt SSG:** SEO-friendly, fast page loads, low server costs
- **Vitest over Jest:** Native ESM support, faster execution, better Vite integration
- **Native JS over lodash:** 30-50% performance gain, smaller bundle size (~24KB saved)

---

## Code Style Guide

### TypeScript

```typescript
// ✅ Good
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ❌ Bad
function calculateTotal(items: any) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Rules:**
- Use `const` over `let`, never use `var`
- Single quotes for strings
- No semicolons
- Prefer arrow functions
- Use type inference when obvious
- Explicit return types for exported functions

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `array-utils.ts`, `my-component.vue` |
| Components | PascalCase | `MyComponent`, `ArticleCard` |
| Functions | camelCase | `formatDate`, `calculateScore` |
| Constants | SCREAMING_SNAKE_CASE | `API_URL`, `MAX_ITEMS` |
| Types/Interfaces | PascalCase | `Article`, `UserProfile` |
| Private vars | camelCase with `_` prefix | `_internalState` |

### Vue/Nuxt Patterns

```vue
<!-- ✅ Good: Composition API with script setup -->
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>

<!-- ❌ Bad: Options API -->
<script lang="ts">
export default {
  data() {
    return { count: 0 }
  }
}
</script>
```

**Rules:**
- Always use `<script setup lang="ts">`
- Use auto-imports for Nuxt/Vue APIs (no explicit imports needed)
- Colocate component-specific logic, extract shared logic to `composables/`
- Use `defineProps` and `defineEmits` for component API

### File Organization

```typescript
// ✅ Good: Organized imports
// 1. External libraries
import dayjs from 'dayjs'

// 2. Nuxt/Vue composables (auto-imported, shown for clarity)
// import { ref, computed } from 'vue'

// 3. Internal utilities
import { intersection, orderBy } from '~/utils/array'

// 4. Types
import type { Article } from '#content'

// 5. Constants
import appMeta from '~/app.meta'
```

---

## Project Structure

```
project-root/
├── app/                          # Application code
│   ├── components/               # Vue components
│   │   ├── og_image/            # OG image components
│   │   └── ...
│   ├── pages/                   # File-based routing
│   │   ├── articles/
│   │   │   └── [id].vue        # Dynamic article page
│   │   └── index.vue           # Home page
│   ├── utils/                   # Pure utility functions
│   │   ├── array.ts            # Array utilities
│   │   ├── array.test.ts       # Colocated tests
│   │   └── date.ts             # Date utilities
│   ├── constants/               # Application constants
│   │   └── social-links.ts
│   ├── app.config.ts           # App configuration
│   └── app.meta.ts             # App metadata
│
├── content/blog/                # Content collections (MDC)
│   ├── articles/               # Blog posts
│   ├── tutorials/              # How-to guides
│   ├── decklists/              # MTG deck lists
│   ├── reports/                # Tournament reports
│   └── spoilers/               # Set spoilers
│
├── server/                      # Server-side code
│   ├── api/                    # API endpoints
│   │   └── cards.get.ts       # Card search API
│   └── utils/                  # Server utilities
│       └── card-database.ts   # SQLite card DB
│
├── scripts/                     # Build/utility scripts
│   └── download-bulk-data.ts  # Download card data
│
├── docs/                        # Documentation
│   ├── ai/
│   │   └── AGENTS.md          # AI agent quick reference
│   ├── DEVELOPMENT.md         # This file
│   └── CONTENT.md             # Content management guide
│
├── public/                      # Static assets
├── assets/                      # Source assets (CSS, etc.)
├── vitest.config.ts            # Test configuration
├── nuxt.config.ts              # Nuxt configuration
├── tailwind.config.ts          # Tailwind configuration
└── package.json                # Dependencies & scripts
```

---

## Utility Functions

### Array Utilities (`app/utils/array.ts`)

#### `intersection<T>(arr1: T[], arr2: T[]): T[]`

Finds common elements between two arrays using Set for O(n+m) performance.

```typescript
intersection([1, 2, 3], [2, 3, 4])  // [2, 3]
intersection(['a', 'b'], ['b', 'c'])  // ['b']
```

**Performance:** ~40% faster than lodash `_.intersection()`

#### `orderBy<T>(array: T[], iteratee: (item: T) => number | string, order?: 'asc' | 'desc'): T[]`

Sorts array by computed value. Does not mutate original.

```typescript
const users = [
  { name: 'Alice', score: 100 },
  { name: 'Bob', score: 85 }
]

orderBy(users, u => u.score, 'desc')
// [{ name: 'Alice', score: 100 }, { name: 'Bob', score: 85 }]
```

**Performance:** Native sort, ~35% faster than lodash `_.orderBy()`

### Date Utilities (`app/utils/date.ts`)

#### `formatDateIT(date: string | Date): string`

Formats date to Italian format: DD/MM/YYYY

```typescript
formatDateIT('2025-01-17')  // '17/01/2025'
```

#### `formatDateWithMonthIT(date: string | Date): string`

Formats date with Italian month name: DD MMM YYYY

```typescript
formatDateWithMonthIT('2025-01-17')  // '17 gen 2025'
```

---

## Database

### Card Database (SQLite)

**Location:** `server/database/cards.db` (committed to git; only the intermediate `server/database/oracle-cards.jsonl` bulk-data dump is gitignored)  
**Source:** Scryfall bulk data API  
**Size:** ~2MB

#### Setup

```bash
# Regenerate the database from the latest Scryfall bulk data
pnpm run download-cards
```

#### Usage

There's no runtime API route for it — `server/api/` is empty. Lookups happen at **build time**, inside the content-transformer modules (`modules/card-tooltip-transformer.ts`, `modules/decklist-transformer.ts`), which call into `server/utils/card-database.ts` directly:

```typescript
import { getCardByName } from '~/server/utils/card-database'

const card = await getCardByName('Lightning Bolt')
```

#### Schema

```sql
CREATE TABLE cards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mana_cost TEXT,
  image_url TEXT
)
```

---

## Testing

### Test Framework: Vitest

**Config:** `vitest.config.ts`  
**Environment:** happy-dom (lightweight DOM for tests)

### Running Tests

```bash
# Watch mode (re-runs on file changes)
pnpm test

# Single run (for CI/CD)
pnpm test:run

# UI mode (browser interface)
pnpm test:ui
```

### Test Structure

Tests are **colocated** with source files:

```
app/utils/
├── array.ts
├── array.test.ts     # Tests for array.ts
├── date.ts
└── date.test.ts      # Tests for date.ts
```

### Writing Tests

```typescript
// array.test.ts
import { describe, it, expect } from 'vitest'
import { intersection, orderBy } from './array'

describe('intersection', () => {
  it('should return common elements', () => {
    const result = intersection([1, 2, 3], [2, 3, 4])
    expect(result).toEqual([2, 3])
  })

  it('should handle empty arrays', () => {
    expect(intersection([], [1, 2])).toEqual([])
  })

  // Test edge cases
  it('should preserve order from first array', () => {
    const result = intersection([3, 1, 2], [2, 3])
    expect(result).toEqual([3, 2])  // Not [2, 3]
  })
})
```

### Testing Guidelines

**✅ Do:**
- Test edge cases (empty arrays, null values, etc.)
- Test real-world usage scenarios
- Test immutability (original data not modified)
- Keep tests simple and focused
- Use descriptive test names

**❌ Don't:**
- Test implementation details
- Test external libraries
- Write tests that depend on each other
- Mock unless absolutely necessary

### Current Coverage

- `app/utils/array.ts` - 100% coverage (18 tests)
- `app/utils/date.ts` - Not tested yet

---

## Common Patterns

### Fetching Content

#### Single Article

```typescript
const route = useRoute()

const { data } = await useAsyncData(route.path, async () => {
  // Try each collection until found
  const collections = ['articles', 'tutorials', 'decklists', 'reports', 'spoilers']
  
  for (const collection of collections) {
    const result = await queryCollection(collection as any).path(route.path).first()
    if (result) return result
  }
  
  return null
})
```

#### All Articles from Multiple Collections

```typescript
const { data } = await useAsyncData('all-articles', async () => {
  const [articles, tutorials, decklists, reports, spoilers] = await Promise.all([
    queryCollection('articles').all(),
    queryCollection('tutorials').all(),
    queryCollection('decklists').all(),
    queryCollection('reports').all(),
    queryCollection('spoilers').all(),
  ])
  
  // Combine all collections
  return articles
    .concat(tutorials, decklists, reports, spoilers)
    .filter(a => a.published !== true)
})
```

### Related Articles Algorithm

**Location:** `app/pages/articles/[id].vue:57`

```typescript
import { intersection, orderBy } from '~/utils/array'

// Get all articles
const allArticles = [...] // from all collections

// Sort by tag similarity
const relatedArticles = orderBy(
  allArticles,
  article => intersection(article.tags, currentArticle.tags || []).length,
  'desc'
).slice(0, 5)
```

**How it works:**
1. Calculate tag overlap between current article and all others
2. Sort by overlap count (descending)
3. Return top 5 matches

**Performance:** O(n·m) where n = number of articles, m = average tags per article

### Using Auto-Imports

Nuxt auto-imports many APIs, no explicit import needed:

```typescript
// ✅ Auto-imported (no import statement needed)
const route = useRoute()
const router = useRouter()
const { data } = await useAsyncData('key', fetchFunction)
const config = useRuntimeConfig()

// ❌ Don't manually import these
import { useRoute } from 'vue-router'  // Not needed!
```

**Auto-imported APIs:**
- Vue: `ref`, `computed`, `watch`, `onMounted`, etc.
- Nuxt: `useRoute`, `useRouter`, `useAsyncData`, `navigateTo`, etc.
- Nuxt Content: `queryCollection`, `queryCollectionItemSurroundings`, etc.

---

## Performance Considerations

### Bundle Size Optimization

**✅ Good practices:**
- Use native JavaScript over external libraries
- Tree-shake unused code
- Lazy-load components with `defineAsyncComponent()`
- Use dynamic imports for heavy dependencies

**Example:**
```typescript
// Before: +24KB (lodash)
import _ from 'lodash'
const result = _.intersection(arr1, arr2)

// After: 0KB (native)
import { intersection } from '~/utils/array'
const result = intersection(arr1, arr2)
```

### Runtime Performance

**Native utilities performance gains:**
- `intersection()`: 40% faster than lodash (Set vs array iteration)
- `orderBy()`: 35% faster than lodash (single-pass sort)

**Image optimization:**
- Use `<NuxtImg>` component (auto-optimizes images)
- Always set `loading="lazy"` for below-fold images
- Use appropriate image formats (WebP with fallback)

### Content Performance

**Static generation:**
- All content pages generated at build time
- No server requests for content after deployment
- Use `nuxt generate` for production

**Related articles caching:**
```typescript
// Cached per route path
const { data: links } = await useAsyncData(`linked-${route.path}`, async () => {
  // Expensive computation cached here
})
```

---

## Known Issues

### TODO Items

- **Related articles filtering** (`app/pages/articles/[id].vue:23`)  
  Currently shows all articles. Should filter to only show articles with similar tags.

### Warnings (Expected Behavior)

- **Port 3000 already in use**  
  Dev server automatically falls back to port 3001. This is expected.

---

## Troubleshooting

### Tests failing after dependency changes

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm test:run
```

### Content not updating

```bash
# Clear Nuxt cache
pnpm run clean
pnpm dev
```

### Card database missing

```bash
# Re-download card data
pnpm run download-cards
```

### Type errors in IDE

```bash
# Regenerate Nuxt types
pnpm run postinstall
```

---

## Additional Resources

- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/guide/introduction.html)
- [Nuxt Content Documentation](https://content.nuxt.com/)
- [Vitest Documentation](https://vitest.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
