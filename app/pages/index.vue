<script setup lang="ts">

import type { Author } from '~/composables/useAuthor'
import { normalizeAuthors } from '~/composables/useAuthor'
import { defineWebPage } from 'nuxt-schema-org/schema'
import appMeta from '~/app.meta'
import {
  CATEGORY_LABELS,
  CONTENT_TYPE_ORDER,
  type CategoryType,
  getHomeSections,
  initializeCategories
} from '~/constants/content-config'
import { hasLeagueTag } from '~/utils/article-filters'

// SEO meta tags for homepage
useSeoMeta({
  description: appMeta.description,
  ogTitle: appMeta.name,
  ogDescription: appMeta.description,
  twitterCard: 'summary_large_image'
})

// OG Image for homepage
defineOgImage('Page.takumi', {
  title: appMeta.name,
  description: appMeta.description,
})

const { data: homeArticlesData } = await useHomeArticles()
const allArticles = computed(() => homeArticlesData.value?.articles || [])
const freshThisWeekCount = computed(() => homeArticlesData.value?.freshThisWeekCount ?? 0)

const authorsMap = ref<Record<string, Author>>({})

if (allArticles.value.length) {
  const uniqueAuthors = new Set<string>()
  allArticles.value.forEach(article => {
    const authorNames = normalizeAuthors(article.author)
    authorNames.forEach((name: string) => uniqueAuthors.add(name))
  })

  for (const authorName of uniqueAuthors) {
    try {
      const { data: authorInfo } = await useAuthor(authorName)
      if (authorInfo.value) {
        authorsMap.value[authorName] = authorInfo.value
      }
    } catch (e) {
      console.error(`Failed to load author data for ${authorName}:`, e)
    }
  }
}

const articlesByCategory = computed(() => {
  const categories = initializeCategories()

  allArticles.value.forEach((article) => {
    if (article.category && categories[article.category as CategoryType]) {
      categories[article.category as CategoryType].push(article)
    }
  })

  return categories
})

const sectionArticlesByCategory = computed(() => {
  const categories = initializeCategories()

  Object.entries(articlesByCategory.value).forEach(([category, articles]) => {
    const typedCategory = category as CategoryType

    if (typedCategory === 'decklist') {
      categories[typedCategory] = articles.filter(article => !hasLeagueTag(article))
      return
    }

    categories[typedCategory] = articles
  })

  return categories
})

const categoryHighlights = computed(() =>
  CONTENT_TYPE_ORDER
    .map(category => ({
      category,
      label: CATEGORY_LABELS[category],
      count: articlesByCategory.value[category].length
    }))
    .filter(item => item.count > 0)
)

const sections = getHomeSections()

useSchemaOrg([
  defineWebPage({
    '@type': 'WebPage',
    name: appMeta.name,
    description: appMeta.description,
    url: appMeta.url
  })
])
</script>

<template>
  <UPage>
    <UPageBody>
      <HomeHeroSection
        :articles="allArticles"
        :fresh-this-week-count="freshThisWeekCount"
        :category-highlights="categoryHighlights"
        :authors-map="authorsMap"
      />

      <MigrationNotice class="mb-6" />

      <section>
        <div class="flex items-end justify-between gap-3 mb-5">
          <div>
            <p class="text-xs uppercase tracking-[0.18em] text-primary font-semibold">
              Esplora
            </p>
            <h1 class="text-3xl md:text-3xl font-bold">
              Sezioni del blog
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Tutte le categorie, ordinate per priorità editoriale
            </p>
          </div>
        </div>

        <div class="space-y-8 pb-2">
          <ArticleCategorySection
            v-for="section in sections"
            :key="section.category"
            :title="section.title"
            :category="section.category"
            :articles="sectionArticlesByCategory[section.category]"
            :authors-map="authorsMap"
          />
        </div>
      </section>
    </UPageBody>
  </UPage>
</template>
