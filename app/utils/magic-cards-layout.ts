// Pure positioning/filter math for the magic-cards fan/hand layouts, extracted from
// app/components/magic/Cards.vue so it's independently unit-testable. See
// docs/architecture/2026-07-10-magic-cards-component-research.md for how these formulas were
// reverse-engineered from magic.wizards.com, and the 2026-09-02 follow-up verification below.

const SPREAD = 0.15

// Mirrors magic.wizards.com/en/news/making-magic's fan component: the step between
// adjacent cards is arch/count (not arch/(count-1)), so the total spread converges
// toward `arch` as more cards are added instead of growing past it.
export function fanRotation(index: number, total: number, arch: number): number {
  if (total <= 1) return 0
  const step = arch / total
  const center = (total - 1) / 2
  return (index - center) * step
}

// Hover behavior verified directly against magic.wizards.com/en/news/making-magic's live fan
// component (devtools computed styles while hovering each card of a 5-card fan). Every
// observed value derives from one constant, SPREAD = 0.15: cards stacked UNDER the hovered
// one (index <= hoveredIndex, since a later DOM index paints on top) get a mild uniform
// rotation amplification; cards stacked ON TOP of it (index > hoveredIndex) have to visibly
// move aside to reveal it, so they rotate further out and shift right by SPREAD (15% of
// their own width). The hovered card itself follows the "under" formula too, plus a -18px
// lift. On the real site this lift is JS-driven inline style (not a CSS :hover rule), same
// as here — confirmed stable with no hover flicker in practice (the shift is small relative
// to card height, and z-index is never touched: reveal is entirely via the sibling
// push-aside, not stacking order).
export function fanCardTransform(
  index: number,
  total: number,
  arch: number,
  hoveredIndex: number | null
): string {
  const base = fanRotation(index, total, arch)

  if (hoveredIndex === null) return `rotate(${base}deg)`

  const scaled = base * (1 + SPREAD / 2)

  if (index <= hoveredIndex) {
    const lift = index === hoveredIndex ? -18 : 0
    return `rotate(${scaled}deg) translateY(${lift}px)`
  }

  const k = index - hoveredIndex
  const extra = SPREAD * total * (total - 1 - k)
  return `rotate(${scaled + extra}deg) translateX(${SPREAD * 100}%)`
}

// Verified against the live fan: adjacent cards (distance 1) end up brighter than normal
// (brightness > 1), not dimmed — that's the real site's actual behavior, not a bug. Fan
// hover filter only applies to non-hovered cards; the hovered card itself gets no filter.
export function cardFilter(index: number, hoveredIndex: number | null): string {
  if (hoveredIndex === null || hoveredIndex === index) return 'none'
  const distance = Math.abs(index - hoveredIndex)
  const brightness = 1.12 - 0.08 * distance
  return `blur(0.5px) grayscale(0.8) brightness(${brightness})`
}

// "Hand" config, verified against the one real article that uses it
// (magic.wizards.com/en/news/making-magic/design-files-urzas-destiny-part-3, a 5-card hand)
// by reading its actual stylesheet rules. Unlike `fan`, hand on the real site has NO
// JavaScript hover behavior for position: each card is positioned by a per-nth-child CSS
// rule, and hovering it is a plain `:hover { transform: ...; z-index: 2 }` override on that
// same rule — no JS-computed z-index, nothing that depends on knowing which sibling is
// hovered. Cards.vue replicates this positioning with actual CSS (:hover / custom
// properties), not a `hoveredIndex` ref, which is also why there's no self-inflicted hover
// flicker here the way there was in this component's history: native `:hover` re-evaluates
// every frame against the element's current (possibly mid-transition) geometry, it can't
// get stuck the way a mouseenter/mouseleave-driven ref can. Dimming the other cards on
// hover is NOT part of the real site's hand behavior (it has none) — added deliberately on
// top of the verified position/z-index, reusing `cardFilter`. This is safe because a filter
// change doesn't move anything, so it can't reintroduce the flicker.
//
// X step (60% of the card's own width from center) and the "cards adjacent to center sit
// above the rest" z-index rule generalize cleanly to any card count. The vertical arc does
// NOT: the verified 5-card values (25%, 45%, 10%, 45%, 25%) are hand-authored, not a formula
// (center is the LOWEST value / furthest back, not a symmetric peak) — so this only replicates
// exactly for a 5-card hand. Other counts fall back to a flat, non-arced Y since we have no
// real reference for them.
const HAND_X_STEP = 60
const HAND_Y_BY_5: readonly number[] = [25, 45, 10, 45, 25]
const HAND_Y_FALLBACK = 30

export function handPosition(index: number, total: number): { x: number, y: number } {
  const center = (total - 1) / 2
  const offset = index - center
  return {
    x: offset * HAND_X_STEP,
    y: total === 5 ? (HAND_Y_BY_5[index] ?? HAND_Y_FALLBACK) : HAND_Y_FALLBACK
  }
}

// Verified base z-index for a 5-card hand: the two cards immediately adjacent to the
// center (nth-child(2) and nth-child(4)) sit at z-index 1, everyone else at 0. Generalizes
// to any card count as "cards exactly one slot from the center are elevated". The +2 hover
// override lives in Cards.vue's CSS (`:hover { z-index: 2 }`), applied to every hand card
// uniformly, matching the real site's un-conditional `:hover, :focus { z-index: 2 }` rule.
export function handZIndex(index: number, total: number): number {
  const center = (total - 1) / 2
  return Math.abs(index - center) === 1 ? 1 : 0
}
