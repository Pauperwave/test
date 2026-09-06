<script setup lang="ts">
import { fanCardTransform, cardFilter, handPosition, handZIndex } from '~/utils/magic-cards-layout'

interface Props {
  cards: string[]
  caption?: string
  /** Total rotation arch in degrees, matches magic.wizards.com's `overall-arch` (default: 20.5). Fan-only. */
  arch?: number
  /** Layout style, matches magic.wizards.com's `config` values: 'fan' (default) or 'hand'. Below the `md`
   * breakpoint this is ignored — cards always fall back to a plain scroll strip (WotC's own component does
   * the same: the swiper/gallery swap on mobile isn't a selectable config, it's automatic infrastructure). */
  layout?: 'fan' | 'hand'
}

const {
  cards,
  caption = '',
  arch = 20.5,
  layout = 'fan'
} = defineProps<Props>()

const MAX_CARDS = 7

if (cards.length > MAX_CARDS) {
  console.warn(`magic-cards: received ${cards.length} cards, showing only the first ${MAX_CARDS}`)
}

const visibleCards = computed(() => cards.slice(0, MAX_CARDS))

// Positioning (translate/z-index) is pure CSS for hand — see the `.hand-*` rules below and
// handPosition/handZIndex in magic-cards-layout.ts for why. hoveredIndex is only needed to
// dim the *other* cards (a filter change, which doesn't move anything, so it can't cause
// the hover flicker a position change would).
const hoveredIndex = ref<number | null>(null)

function handCardStyle(idx: number, total: number) {
  const { x, y } = handPosition(idx, total)
  return { '--hand-x': `${x}%`, '--hand-y': `${y}%`, filter: cardFilter(idx, hoveredIndex.value) }
}
</script>

<template>
  <figure class="my-8">
    <!-- Below md: plain horizontal scroll strip — not a selectable layout, just the
    responsive fallback (rotated/spread cards don't work on narrow viewports), matching
    how magic.wizards.com's own component swaps to a swiper below its mobile breakpoint
    regardless of which config the page author chose. -->
    <div class="md:hidden flex gap-4 overflow-x-auto justify-center mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <MagicCard
        v-for="card in visibleCards"
        :key="card"
        :card="card"
        class="shrink-0"
      />
    </div>

    <!-- md and up: fan/hand arrangement. Cards are all absolutely stacked at the exact
    same center position (no margin/flex-based overlap) — the spread comes purely from
    positioning each one relative to a shared pivot, matching how magic.wizards.com's
    fan actually works (verified: every card's un-rotated `left` is identical there).
    magic-cards wraps N magic-card instances, same relationship as WotC's real
    <magic-cards>/<magic-card> elements — MagicCard (our "magic-card") owns the
    actual card resolution/rendering, this component only owns positioning. -->
    <div
      class="fan-container hidden md:block relative px-4 pb-6"
      :class="layout === 'hand' ? 'min-h-125 lg:min-h-150' : 'min-h-75 lg:min-h-90'"
    >
      <div
        v-for="(card, idx) in visibleCards"
        :key="card"
        class="absolute left-1/2 top-6 -translate-x-1/2 card-slot"
        :class="layout === 'hand' ? 'hand-slot' : undefined"
        :style="layout === 'hand' ? { '--hand-z': handZIndex(idx, visibleCards.length) } : undefined"
      >
        <MagicCard
          v-if="layout === 'hand'"
          :card="card"
          img-class="w-48 lg:w-56"
          class="hand-card"
          :style="handCardStyle(idx, visibleCards.length)"
          @mouseenter="hoveredIndex = idx"
          @mouseleave="hoveredIndex = null"
        />
        <MagicCard
          v-else
          :card="card"
          img-class="w-48 lg:w-56"
          class="fan-card"
          :style="{
            transform: fanCardTransform(idx, visibleCards.length, arch, hoveredIndex),
            filter: cardFilter(idx, hoveredIndex)
          }"
          @mouseenter="hoveredIndex = idx"
          @mouseleave="hoveredIndex = null"
        />
      </div>
    </div>
    <figcaption
      v-if="caption"
      class="text-sm text-muted text-center py-2"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>

<style scoped>
/* Matches magic.wizards.com's own wrapper (`height: 0px`): without this, each card's
   untransformed anchor box (all 5 sit at the identical anchor point) has its own real,
   hoverable area, which can intercept hover meant for a neighboring card that has been
   moved elsewhere via transform. Zero height means only the actual (transformed) card
   content is ever hoverable. */
.card-slot {
  height: 0;
}

.fan-card {
  /* Shared distant pivot (~5.83x the card's own height below it), matching the
     magic.wizards.com fan's transform-origin: 50% 2168.18px on a 372px-tall card. */
  transform-origin: 50% 582.84%;
  transition:
    transform 0.4s ease,
    filter 0.4s ease;
}

/* Hand layout: pure CSS hover, matching magic.wizards.com's own implementation for its one
   real hand-config article — no `hoveredIndex` involved, see magic-cards-layout.ts. */
.hand-slot {
  z-index: var(--hand-z, 0);
}

.hand-slot:hover {
  z-index: 2;
}

.hand-card {
  transform: translateX(var(--hand-x)) translateY(var(--hand-y));
  transition:
    transform 0.4s ease,
    filter 0.4s ease;
}

.hand-card:hover {
  transform: translateX(var(--hand-x)) translateY(calc(var(--hand-y) - 10%));
}
</style>
