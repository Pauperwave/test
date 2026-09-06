import { readdirSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { definePerson } from "nuxt-schema-org/schema"
import appMeta from "./app/app.meta"

/**
 * Reads content/authors/*.yml directly (avoids depending on Nuxt Content's
 * runtime query API, which isn't available in this build-time Nitro hook)
 * and returns the slug for each author, so their pages can be added to the
 * prerender crawl explicitly. Author cards link via programmatic navigation
 * (no real <a href>), so Nitro's crawlLinks crawler can never discover
 * /authors/[slug] routes on its own.
 */
const getAuthorSlugsAtBuildTime = (): string[] => {
  const authorsDir = fileURLToPath(new URL("./content/authors", import.meta.url))
  return readdirSync(authorsDir)
    .filter(file => file.endsWith(".yml"))
    .map(file => {
      const contents = readFileSync(`${authorsDir}/${file}`, "utf-8")
      const match = contents.match(/^name:\s*(.+)$/m)
      return match?.[1]?.trim()
    })
    .filter((name): name is string => Boolean(name))
    .map(name => name.toLowerCase().replace(/\s+/g, "-"))
}

/**
 * True for /articles/YYYY-MM-DD-... routes older than 3 months.
 *
 * Used by both prerender hooks below: `prerender:routes` removes old articles
 * from the initial crawl seed, but Nitro's crawler re-adds any route it finds
 * a link to (e.g. from an author page or "related articles" widget) via its
 * own `extractLinks` pass, which runs *after* `prerender:routes` and knows
 * nothing about this cutoff — so old articles kept reappearing in the final
 * build regardless of the seed-time filter. `prerender:generate` re-applies
 * this check per-route as each one is actually about to render, catching
 * routes rediscovered by the crawler too. Skipping there also happens before
 * Nitro extracts links from the page, so it prevents that stale article's own
 * OG image (and further links) from being discovered and rendered as well.
 */
const isOldArticleRoute = (route: string): boolean => {
  const match = route.match(/^\/articles\/(\d{4}-\d{2}-\d{2})/)
  if (!match || !match[1]) return false

  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  return new Date(match[1]) < threeMonthsAgo
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  components: [
    {
      path: '~/components/charts',
      pathPrefix: false,
    },
    {
      path: '~/components/content',
      pathPrefix: false,
    },
    {
      path: '~/components/layout',
      pathPrefix: false,
    },
    {
      path: '~/components/ui',
      pathPrefix: false,
    },
    {
      path: '~/components',
    },
  ],
  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },
  site: {
    name: appMeta.name,
    url: appMeta.url,
    defaultLocale: "it",
  },
  sitemap: {
    zeroRuntime: true,
    // Excludes every template/placeholder page in one rule, matched by their shared
    // `0000-00-00-` filename convention — scales to future template files automatically,
    // no per-path entry needed here (unlike the routeRules prerender:false exclusions
    // below, which @nuxtjs/sitemap doesn't derive sitemap exclusion from on their own).
    exclude: [/0000-00-00/],
  },
  schemaOrg: {
    identity: definePerson(appMeta.author),
  },
  ogImage: {
    zeroRuntime: true,
    buildCache: true,
    // Manual escape hatch: buildCache's key hashes the .takumi.vue template
    // file and og:image props, but NOT global CSS/UnoCSS or font config — a
    // design-only change there wouldn't bust the cache on its own. Bump this
    // string after such a change to force a full re-render.
    cacheVersion: 'v1',
    security: {
      // Default 15s is shorter than the takumi prerender worker's own internal 30s
      // timeout (nuxt-og-image's node-dev binding spawns a real Node worker_threads
      // Worker to isolate crashes during prerendering — postToWorker() hardcodes a
      // 30s ceiling). The first render pays a one-time cold-start cost spinning up
      // that worker + loading @takumi-rs/core inside it; every render after reuses
      // the same warm worker and is fast. Confirmed empirically: 15s (default) and
      // 20000ms both failed, 29000ms succeeds twice cleanly — so the real cold-start
      // time is somewhere in the 20-29s range. Kept at 29000 (close to the hard 30s
      // ceiling) rather than narrowing further, since finding the exact minimum isn't
      // worth more ~110s build cycles — see docs/audits/2026-07-11-build-performance-investigation.md.
      renderTimeout: 29000
    }
  },
  content: {
    build: {
      markdown: {
        toc: {
          // h4 headings are included
          depth: 3,
          searchDepth: 2,
        },
        remarkPlugins: {
          "remark-math": {},
          "remark-reading-time": {},
        },
        rehypePlugins: {
          "rehype-katex": {},
        },
      },
    },
  },
  mdc: {
    highlight: {
      // Avoid WASM loading during serverless bundling (Vercel/Nitro).
      shikiEngine: 'javascript',
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/icon", // Must come after @nuxt/ui
    "@nuxt/content", // https://ui.nuxt.com/docs/getting-started/integrations/content
    "@nuxtjs/mdc",
    "@nuxtjs/seo",
    "@nuxtjs/device",
    "@vueuse/nuxt",
    "magic-regexp/nuxt",
    "nuxt-echarts",
    "nuxt-swiper",
    "@vercel/analytics",
    "./modules/card-tooltip-transformer",
    "./modules/decklist-transformer",
    "./modules/sideboard-guide-transformer",
  ],
  echarts: {
    renderer: ['svg'],
    charts: [
      'BarChart',
      'LineChart',
      'PieChart',
      'ScatterChart',
      'RadarChart'
    ],
    components: [
      'DatasetComponent',
      'GridComponent',
      'TooltipComponent',
      'ToolboxComponent',
      'LegendComponent',
      'TitleComponent',
      'RadarComponent',
    ],
    features: [
      'LabelLayout',
      'UniversalTransition'
    ]
  },
  css: [
    "~/assets/css/main.css",
    "katex/dist/katex.min.css",
  ],
  // Disable payload extraction to prevent _payload.json 404 errors on Vercel
  vite: {
    css: {
      devSourcemap: true, // Keep sourcemaps in development for debugging
    },
    build: {
      sourcemap: false, // Disable sourcemaps in production to eliminate Tailwind warnings
      chunkSizeWarningLimit: 3000,
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'INVALID_ANNOTATION' && warning.message.includes('#__PURE__')) {
            return
          }
          if (warning.message?.includes('Sourcemap is likely to be incorrect')) {
            return
          }
          warn(warning)
        }
      }
    }
  },
  // Also note that your routeRules with '/articles/**': { prerender: true } and the nitro.prerender.crawlLinks are complementary
  // the route rules mark those patterns as prerenderable, while crawlLinks is what actually discovers the concrete URLs.
  nitro: {
    preset: 'vercel',
    // disables sourcemaps for server functions
    sourceMap: false,
    prerender: {
      // Pre-render the homepage
      routes: ['/', '/docs/componenti'],
      // Then crawl all the links on the page
      crawlLinks: true,
      failOnError: false,
      // NOTE: nitropack's string-pattern matcher here is a plain `path.startsWith(pattern)`,
      // not a glob — no `**`/`*` wildcards, just a literal prefix.
      //
      // /articles?... : the filter query params (category/author/location/tag/deck) on the
      // articles listing are a client-side-only filter — the SAME static articles/index.html
      // serves every query-string variant (Vercel routes by path, not query string; the tag
      // filter is applied client-side post-hydration via route.query), so excluding these from
      // the crawl removes zero real content. It only stops 30 distinct crawled combinations
      // from each separately triggering a full page render AND its own OG image render, even
      // though defineOgImage() on that page never references the filter, so every one of
      // those 30 OG images was pixel-identical duplicate work.
      //
      // Do NOT add '/_ipx/' here (tried it, had to revert): this project's Vercel deployment
      // is 100% static (`nitro.preset: 'vercel'` + `nuxt generate` → .vercel/output/static
      // only, confirmed no functions/ directory at all) — there is no on-demand ipx serverless
      // function to fall back to. Excluding _ipx from prerender means those image URLs 404 in
      // production. Unlike the /articles? case, each _ipx URL is a uniquely-computed image
      // variant with no equivalent already-generated fallback file.
      ignore: ['/articles?'],
      // Nitro's own default is 1 (fully sequential) — testing whether an explicit bump
      // helps, since observed prerender wall time already looked more parallel than
      // that default would suggest (something may already be overriding it).
      concurrency: 4
    },
    // Filter routes to only prerender recent articles (< 3 months), and add
    // author routes explicitly since the crawler can't discover them (see
    // getAuthorSlugsAtBuildTime above).
    hooks: {
      'prerender:routes' (routes: Set<string>) {
        for (const route of routes) {
          if (isOldArticleRoute(route)) routes.delete(route)
        }

        routes.add('/authors')
        for (const slug of getAuthorSlugsAtBuildTime()) {
          routes.add(`/authors/${slug}`)
        }
      },
      // Catches old articles the crawler re-adds via extractLinks after the
      // 'prerender:routes' seed-time filter above already ran — see
      // isOldArticleRoute's own comment for why both hooks are needed.
      'prerender:generate' (route) {
        if (isOldArticleRoute(route.route)) route.skip = true
      }
    }
  },
  routeRules: {
    // Homepage pre-rendered at build time with cache headers
    '/': { prerender: true, headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } },
    // Articles index page - always prerendered
    '/articles': { prerender: true, headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } },
    // Individual articles: prerendered with long cache (rarely change after publication)
    '/articles/**': { prerender: true, headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800' } },
    // Exclude template files from prerendering. Empirically confirmed redundant for the
    // crawl-based generate flow today (published:false content is never linked anywhere,
    // so crawlLinks never reaches these routes regardless) — kept anyway as cheap, explicit
    // protection against that assumption breaking (e.g. an accidental link to one of these).
    // Sitemap exclusion is handled centrally via sitemap.exclude below instead of per-path.
    '/articles/0000-00-00-decklist-template': { prerender: false },
    '/articles/0000-00-00-trio-template': { prerender: false },
    '/articles/0000-00-00-chart-demo-template': { prerender: false },
    '/reports/0000-00-00-report-template': { prerender: false },
    '/spoilers/0000-00-00-spoiler-template': { prerender: false },
    // Code of Conduct and Statuto
    '/docs/**': { prerender: true, headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } },
    // Author profile pages: prerendered explicitly (see the prerender:routes hook above),
    // since author cards link via programmatic navigation with no crawlable <a href>.
    '/authors': { prerender: true, headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } },
    '/authors/**': { prerender: true, headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } },
    // Static assets with long cache
    '/_nuxt/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    '/assets/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } }
  },
  experimental: {
    payloadExtraction: process.env.NODE_ENV === 'production'
  },
  icon: {
    serverBundle: {
      collections: ['lucide', 'simple-icons']
    },
    clientBundle: {
      scan: true,
      icons: [
        // Nuxt UI prose / MDC components
        'lucide:hash',
        'lucide:info',
        'lucide:lightbulb',
        'lucide:triangle-alert',
        'lucide:circle-alert',
        'lucide:file-code',
        'lucide:arrow-up-right',
        // UI icons
        'lucide:search',
        'lucide:menu',
        // Social icons used dynamically
        'simple-icons:x',
        'simple-icons:twitch',
        'simple-icons:reddit',
        'simple-icons:youtube',
        'simple-icons:github',
      ]
    },
    // Avoid external Iconify fetches during prerender/build.
    fallbackToApi: false,
    aliases: {
      // Nuxt UI prose code blocks default to vscode-icons for file extensions.
      // We don't ship that collection locally, so map the JS file icon to an installed icon.
      'vscode-icons-file-type-js': 'lucide:file-code'
    }
  },
  image: {
    // Use static provider for SSG compatibility
    // Vercel provider only works with SSR, not static generation
    provider: 'ipx',
    // Enable image optimization for better performance
    quality: 80,
    format: ['webp', 'jpg', 'png'],
    // Short aliases documented in docs/CONTENT.md for frontmatter/content image paths
    alias: {
      '/arts': '/assets/blog/arts',
      '/sets': '/assets/blog/sets',
      '/events': '/assets/blog/events',
      '/articles': '/assets/blog/articles',
      '/blog': '/assets/blog',
    },
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    presets: {
      thumbnail: {
        modifiers: {
          format: 'webp',
          width: 1200,
          height: 630,
          fit: 'cover',
          quality: 80
        }
      },
      card: {
        modifiers: {
          format: 'webp',
          width: 488,
          height: 680,
          fit: 'contain',
          quality: 85
        }
      }
    }
  }
})