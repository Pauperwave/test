# Pauperwave Blog

The blog of [Pauperwave](https://blog.pauperwave.org), an Italian non-profit dedicated to Magic: The Gathering's Pauper format. Articles, tutorials, decklists, tournament reports, and set spoiler analysis, primarily in Italian with some articles in English.

Built with Nuxt 4 + Nuxt Content, with a custom content pipeline that turns `[[Card Name]]` mentions into hoverable card-art tooltips and plain-text decklists into structured, styled decklist components.

## Getting started

```sh
pnpm install
pnpm run download-cards   # build the local card database (Scryfall bulk data)
pnpm run dev
```

The dev server runs on `http://localhost:3000` (falls back to `3001` if busy).

## Documentation

- [`CLAUDE.md`](./CLAUDE.md) — architecture overview and commands for AI coding agents (also a good quick orientation for humans)
- [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md) — code style, utilities, testing, technical patterns
- [`docs/CONTENT.md`](./docs/CONTENT.md) — writing and publishing content: frontmatter, MDC syntax, images, card references

## License

Content and code are the property of Pauperwave. Contact [pauperwave@gmail.com](mailto:pauperwave@gmail.com) for inquiries.
