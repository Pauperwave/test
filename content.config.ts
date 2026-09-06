import { defineCollection, defineContentConfig, z } from "@nuxt/content"
import { defineSitemapSchema } from "@nuxtjs/sitemap/content"

// Pass z explicitly so sitemap knows which Zod instance to use
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sitemapSchema: any = (options: any) => defineSitemapSchema({ z, ...options })

/**
 * Shared sitemap filter: excludes any content entry where `published` is explicitly false.
 * Defaults to published=true if the field is missing (e.g. in older content files).
 */
const publishedFilter = (entry: { published?: boolean }) =>
  entry?.published !== false

/**
 * Base schema shared across all blog content types (articles, tutorials, decklists, reports, spoilers).
 * Individual collections extend this with their own category literal and extra fields.
 */
const baseContentSchema = z.object({
  title: z.string(),
  date: z.string(),
  description: z.string(),
  tags: z.optional(z.array(z.string())).default([]),
  language: z.enum(['italiano', 'english']).default('italiano'),
  decks: z.optional(z.array(z.string())).default([]),
  location: z.optional(z.string()).default(''),
  // Supports single author (string) or multiple authors (array of strings)
  author: z.union([z.string(), z.array(z.string())]),
  thumbnail: z.string(),
  published: z.boolean().default(false),
  // Populated automatically by the remark-reading-time plugin, not set in frontmatter.
  readingTime: z.optional(z.object({
    text: z.string(),
    minutes: z.number(),
    time: z.number(),
    words: z.number()
  }))
})

export default defineContentConfig({
  collections: {

    /**
     * Documentation pages.
     * Source: content/docs/**\/*.md
     * URL prefix: /docs (e.g. docs/getting-started.md → /docs/getting-started)
     * Must match the route used by app/pages/docs/[slug].vue.
     */
    docs: defineCollection({
      type: "page",
      source: {
        include: "docs/**/*.md",
        prefix: "/docs"
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        published: z.boolean().default(true),
        sitemap: sitemapSchema({
          name: 'docs',
          filter: publishedFilter
        })
      })
    }),

    /**
     * Author profiles (data collection, not pages).
     * Source: content/authors/**.yml
     * Not included in sitemap — authors don't have dedicated pages.
     */
    authors: defineCollection({
      type: 'data',
      source: 'authors/**.yml',
      schema: z.object({
        name: z.string(),
        nickname: z.string(),
        description: z.string(),
        bio: z.string(),
        avatar: z.string(),
        url: z.string(),
        socials: z.object({
          twitter: z.string().optional(),
          reddit: z.string().optional(),
          github: z.string().optional(),
          youtube: z.string().optional(),
          twitch: z.string().optional(),
          website: z.string().optional()
        }).optional()
      })
    }),

    /**
     * Long-form articles.
     * Source: content/blog/articles/**\/*.md
     * URL prefix: /articles (e.g. blog/articles/foo.md → /articles/foo)
     */
    articles: defineCollection({
      type: "page",
      source: {
        include: "blog/articles/**/*.md",
        prefix: "/articles"
      },
      schema: baseContentSchema.extend({
        category: z.literal("article").default("article"),
        sitemap: sitemapSchema({
          name: 'articles',
          filter: publishedFilter
        })
      })
    }),

    /**
     * Step-by-step tutorials.
     * Source: content/blog/tutorials/**\/*.md
     * URL prefix: /articles (grouped with articles in the URL structure)
     */
    tutorials: defineCollection({
      type: "page",
      source: {
        include: "blog/tutorials/**/*.md",
        prefix: "/articles"
      },
      schema: baseContentSchema.extend({
        category: z.literal("tutorial").default("tutorial"),
        sitemap: sitemapSchema({
          name: 'tutorials',
          filter: publishedFilter
        })
      })
    }),

    /**
     * Deck list posts with structured deck data.
     * Source: content/blog/decklists/**\/*.md
     * URL prefix: /articles
     * Extra field: _decks — list of decks with name, player, and anchor link id.
     */
    decklists: defineCollection({
      type: "page",
      source: {
        include: "blog/decklists/**/*.md",
        prefix: "/articles"
      },
      schema: baseContentSchema.extend({
        category: z.literal("decklist").default("decklist"),
        _decks: z.array(z.object({
          name: z.string(),
          player: z.string(),
          anchorId: z.string()
        })).default([]),
        sitemap: sitemapSchema({
          name: 'decklists',
          filter: publishedFilter
        })
      })
    }),

    /**
     * Tournament / event reports.
     * Source: content/blog/reports/**\/*.md
     * URL prefix: /articles
     */
    reports: defineCollection({
      type: "page",
      source: {
        include: "blog/reports/**/*.md",
        prefix: "/articles"
      },
      schema: baseContentSchema.extend({
        category: z.literal("report").default("report"),
        sitemap: sitemapSchema({
          name: 'reports',
          filter: publishedFilter
        })
      })
    }),

    /**
     * Card spoiler posts for upcoming sets.
     * Source: content/blog/spoilers/**\/*.md
     * URL prefix: /articles
     */
    spoilers: defineCollection({
      type: "page",
      source: {
        include: "blog/spoilers/**/*.md",
        prefix: "/articles"
      },
      schema: baseContentSchema.extend({
        category: z.literal("spoiler").default("spoiler"),
        sitemap: sitemapSchema({
          name: 'spoilers',
          filter: publishedFilter
        })
      })
    }),

  },
})
