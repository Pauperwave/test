<!-- app/components/article/Card.vue -->
<script setup lang="ts">
import type { BadgeProps } from '@nuxt/ui'
import type { Author } from '~/composables/useAuthor'
import type { AnyArticle } from '~/constants/content-config'
import { getArticleFilterLocation, hasLeagueTag } from '~/utils/article-filters'
// Explicit import needed: auto-imports used only in <template> aren't resolved by
// `nuxt typecheck` (vue-tsc -b project references) — https://github.com/nuxt/cli/issues/1224
import { useState, formatDateIT } from '#imports'

interface Props {
  article: AnyArticle
  authorData?: Author | Author[] | null
  topicTags?: string[]
  badge?: string | BadgeProps
  showAuthor?: boolean
  categoryLabel?: string | null
}

const {
  article,
  authorData = null,
  topicTags = [],
  badge = undefined,
  showAuthor = true,
  categoryLabel = null
} = defineProps<Props>()

const authorsList = computed<Author[]>(() => {
  return authorData ? (Array.isArray(authorData) ? authorData : [authorData]) : []
})

const shouldShowAuthor = computed(() => {
  if (!showAuthor) return false
  const category = article.category
  return category !== 'decklist' && category !== 'report'
})

const articleLocation = computed(() => getArticleFilterLocation(article))
const isLeagueArticle = computed(() => hasLeagueTag(article))
const displayedTopicTags = computed(() => {
  const normalizedLocation = articleLocation.value?.trim().toLowerCase() || null
  const seen = new Set<string>()

  return topicTags.filter((tag) => {
    if (typeof tag !== 'string') return false
    const normalizedTag = tag.trim().toLowerCase()
    if (!normalizedTag) return false
    if (normalizedTag === 'league') return false
    if (normalizedLocation && normalizedTag === normalizedLocation) return false
    if (seen.has(normalizedTag)) return false
    seen.add(normalizedTag)
    return true
  })
})

const deckTags = computed(() => article.decks || [])

const cardVariantClasses = computed(() =>
  isLeagueArticle.value
    ? 'border-sky-300/80 dark:border-sky-600/70 bg-sky-50/50 dark:bg-sky-500/5 hover:border-sky-500 dark:hover:border-sky-400 hover:shadow-sky-500/10 dark:hover:shadow-sky-400/10'
    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-primary-500/10 dark:hover:shadow-primary-400/10'
)
</script>

<template>
  <UBlogPost
    :title="article.title"
    :image="article.thumbnail"
    :badge="badge"
    :date="article.date"
    :to="article.path"
    variant="naked"
    :class="[
      'group border rounded-xl p-4 backdrop-blur-sm',
      'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]',
      cardVariantClasses
    ]"
  >
    <template #date>
      {{ useState(`article-date-${article.path}`, () => formatDateIT(article.date)).value }}
      <template v-if="article.readingTime">
        · {{ Math.ceil(article.readingTime.minutes) }} min di lettura
      </template>
    </template>
    <template #description>
      <p class="mt-1 text-base text-pretty">
        {{ article.description }}
      </p>
      <div class="flex flex-row gap-2 items-center flex-wrap mt-3">
        <UBadge
          v-if="categoryLabel"
          :key="`${article.path}-category-${categoryLabel}`"
          color="neutral"
          variant="soft"
        >
          {{ categoryLabel }}
        </UBadge>
        <UBadge
          v-if="article.language === 'english'"
          :key="`${article.path}-language`"
          color="neutral"
          variant="soft"
        >
          English
        </UBadge>
        <UBadge
          v-if="isLeagueArticle"
          :key="`${article.path}-league`"
          color="info"
          variant="soft"
        >
          League
        </UBadge>
        <UBadge
          v-if="articleLocation"
          :key="`${article.path}-location-${articleLocation}`"
          color="info"
          variant="soft"
        >
          {{ articleLocation }}
        </UBadge>
        <UBadge
          v-if="deckTags.length === 1"
          :key="`${article.path}-deck-single`"
          color="warning"
          variant="soft"
        >
          Deck: {{ deckTags[0] }}
        </UBadge>
        <div
          v-if="deckTags.length > 1"
          :key="`${article.path}-deck-multiple`"
          class="flex flex-row gap-2 items-center"
        >
          <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">
            Decks:
          </span>
          <UBadge
            v-for="tag in deckTags"
            :key="`${article.path}-deck-${tag}`"
            color="warning"
            variant="soft"
          >
            {{ tag }}
          </UBadge>
        </div>
        <UBadge
          v-for="tag in displayedTopicTags"
          :key="`${article.path}-topic-${tag}`"
          color="neutral"
          variant="outline"
        >
          {{ tag }}
        </UBadge>
      </div>
    </template>
    <template
      v-if="shouldShowAuthor"
      #authors
    >
      <div class="flex flex-wrap gap-2">
        <AuthorCard
          v-for="author in authorsList"
          :key="author.name"
          :author="author"
        />
      </div>
    </template>
  </UBlogPost>
</template>
