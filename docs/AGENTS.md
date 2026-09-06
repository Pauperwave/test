# AGENTS.md

Quick reference guide for AI agents working on this project.

## Technology Stack
- **Package manager:** pnpm
- **Runtime:** Node (standalone scripts run via `node`, no transpiler needed)
- **Framework:** Nuxt 4 (hybrid prerendering via `nitro.preset: 'vercel'` — only `/`, `/articles`, `/docs/**` and recent articles (last 3 months) are prerendered; older articles and `/editor*` are server-rendered on demand)
- **UI:** Vue 3 + Nuxt UI 4
- **Styling:** Tailwind CSS
- **Language:** TypeScript (strict mode)
- **Content:** Nuxt Content (MDC)
- **Testing:** Vitest + happy-dom

## Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server (port 3000, fallback 3001)
pnpm dev

# Run tests (watch mode)
pnpm test

# Run tests once
pnpm test:run

# Build for production
pnpm run build

# Generate static site
pnpm run generate
```

## Code Style

- TypeScript strict mode
- Single quotes, no semicolons
- Immutable functions (don't modify arguments)
- Type-safe with generics
- Comprehensive JSDoc documentation

## Project Structure

```
app/
├── components/     # Vue components
├── pages/         # File-based routing
├── utils/         # Pure utility functions (colocated tests)
└── constants/     # App constants

content/
├── authors/       # Author data (type: data, YAML)
├── docs/          # Published docs pages (e.g. /componenti)
└── blog/          # MDC content collections
    ├── articles/  # Blog articles
    ├── tutorials/ # How-to guides
    ├── decklists/ # MTG decklists
    ├── reports/   # Tournament reports
    └── spoilers/  # Set spoilers

server/
└── utils/        # Server-side utilities (no API routes — card lookups
                   # happen at build time via the content-transformer modules)
```

## Design Principles

### Minimalist Approach
- Only add dependencies when strictly necessary
- Prefer native JavaScript over external libraries
- Keep bundle size small

### Type Safety & Immutability
- Functions don't mutate arguments
- Use TypeScript generics for reusability
- Return new objects/arrays instead of modifying

### Testing
- Test files colocated: `*.test.ts`
- Focus on edge cases and real-world usage
- Maintain 100% coverage on utility functions

## Documentation

For detailed information, see:
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Technical details, utilities, patterns
- **[CONTENT.md](./CONTENT.md)** - Content management, frontmatter, collections

## AI Agent Guidelines

**Before making changes:**
1. Check existing utilities in `app/utils/`
2. Look for similar patterns in other pages/components
3. Verify Nuxt auto-imports availability

**When adding features:**
1. Follow minimalist principle
2. Add tests for new utility functions
3. Update documentation if adding new patterns

**Before any git operations:**
1. Never push without explicit user permission
2. Never push without testing with `pnpm dev` first
3. Always test changes locally before committing
4. Always ask for confirmation before pushing to remote

**Performance considerations:**
- Use native utilities over external libraries
- Test with large datasets (500+ articles)
- Check bundle size impact of new dependencies