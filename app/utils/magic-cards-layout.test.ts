import { describe, it, expect } from 'vitest'
import {
  fanRotation,
  fanCardTransform,
  handPosition,
  handZIndex,
  cardFilter
} from './magic-cards-layout'

// Rotation is floating-point arithmetic embedded in a template string (e.g.
// `rotate(-2.1574999999999998deg)` instead of the mathematically-exact `-2.1575deg`),
// so exact string equality on it is fragile — parse the degree value out and compare
// numerically, leaving the rest of the transform string checked exactly.
function expectRotateTransform(actual: string, expectedDeg: number, expectedSuffix: string) {
  const match = actual.match(/^rotate\(([^)]+)deg\)(.*)$/)
  expect(match).not.toBeNull()
  expect(Number(match![1])).toBeCloseTo(expectedDeg)
  expect(match![2]).toBe(expectedSuffix)
}

describe('magic-cards layout', () => {
  describe('fanRotation', () => {
    it('returns 0 for a single card', () => {
      expect(fanRotation(0, 1, 20.5)).toBe(0)
    })

    it('matches the verified 5-card, arch=20.5 reference values', () => {
      // Captured directly from magic.wizards.com/en/news/making-magic
      expect(fanRotation(0, 5, 20.5)).toBeCloseTo(-8.2)
      expect(fanRotation(1, 5, 20.5)).toBeCloseTo(-4.1)
      expect(fanRotation(2, 5, 20.5)).toBeCloseTo(0)
      expect(fanRotation(3, 5, 20.5)).toBeCloseTo(4.1)
      expect(fanRotation(4, 5, 20.5)).toBeCloseTo(8.2)
    })

    it('converges toward arch as more cards are added, rather than growing past it', () => {
      const spread = (total: number) => fanRotation(total - 1, total, 20.5) - fanRotation(0, total, 20.5)
      expect(spread(3)).toBeLessThan(20.5)
      expect(spread(10)).toBeLessThan(20.5)
      expect(spread(10)).toBeGreaterThan(spread(3))
    })

    it('is symmetric around the center card', () => {
      expect(fanRotation(0, 5, 20.5)).toBeCloseTo(-fanRotation(4, 5, 20.5))
      expect(fanRotation(2, 5, 20.5)).toBe(0)
    })
  })

  describe('fanCardTransform', () => {
    it('applies plain rotation with no hover state', () => {
      expect(fanCardTransform(0, 5, 20.5, null)).toBe('rotate(-8.2deg)')
    })

    it('matches verified hover values for the leftmost card hovered (index 0 of 5)', () => {
      // Captured directly from magic.wizards.com while hovering the leftmost card.
      expect(fanCardTransform(0, 5, 20.5, 0)).toBe('rotate(-8.815deg) translateY(-18px)')
      expectRotateTransform(fanCardTransform(1, 5, 20.5, 0), -2.1575, ' translateX(15%)')
      expect(fanCardTransform(2, 5, 20.5, 0)).toBe('rotate(1.5deg) translateX(15%)')
      expectRotateTransform(fanCardTransform(3, 5, 20.5, 0), 5.1575, ' translateX(15%)')
      expect(fanCardTransform(4, 5, 20.5, 0)).toBe('rotate(8.815deg) translateX(15%)')
    })

    it('matches verified hover values for hovering a middle-left card (index 1 of 5)', () => {
      // Captured directly from magic.wizards.com/en/news/making-magic while hovering
      // "Guide of Souls" in a 5-card fan (index 1).
      expect(fanCardTransform(0, 5, 20.5, 1)).toBe('rotate(-8.815deg) translateY(0px)')
      expect(fanCardTransform(1, 5, 20.5, 1)).toBe('rotate(-4.4075deg) translateY(-18px)')
      expectRotateTransform(fanCardTransform(2, 5, 20.5, 1), 2.25, ' translateX(15%)')
      expectRotateTransform(fanCardTransform(3, 5, 20.5, 1), 5.9075, ' translateX(15%)')
      expectRotateTransform(fanCardTransform(4, 5, 20.5, 1), 9.565, ' translateX(15%)')
    })

    it('matches verified hover values for the center card hovered (index 2 of 5)', () => {
      expect(fanCardTransform(0, 5, 20.5, 2)).toBe('rotate(-8.815deg) translateY(0px)')
      expect(fanCardTransform(1, 5, 20.5, 2)).toBe('rotate(-4.4075deg) translateY(0px)')
      expect(fanCardTransform(2, 5, 20.5, 2)).toBe('rotate(0deg) translateY(-18px)')
      expect(fanCardTransform(3, 5, 20.5, 2)).toBe('rotate(6.6575deg) translateX(15%)')
      expect(fanCardTransform(4, 5, 20.5, 2)).toBe('rotate(10.315deg) translateX(15%)')
    })

    it('matches verified hover values for the rightmost card hovered (index 4 of 5)', () => {
      expect(fanCardTransform(0, 5, 20.5, 4)).toBe('rotate(-8.815deg) translateY(0px)')
      expect(fanCardTransform(1, 5, 20.5, 4)).toBe('rotate(-4.4075deg) translateY(0px)')
      expect(fanCardTransform(2, 5, 20.5, 4)).toBe('rotate(0deg) translateY(0px)')
      expect(fanCardTransform(3, 5, 20.5, 4)).toBe('rotate(4.4075deg) translateY(0px)')
      expect(fanCardTransform(4, 5, 20.5, 4)).toBe('rotate(8.815deg) translateY(-18px)')
    })
  })

  describe('cardFilter', () => {
    it('is none when nothing is hovered', () => {
      expect(cardFilter(0, null)).toBe('none')
    })

    it('is none for the hovered card itself', () => {
      expect(cardFilter(2, 2)).toBe('none')
    })

    it('fades brightness by distance from the hovered card — adjacent cards end up brighter than normal, matching the live site', () => {
      const brightnessOf = (filter: string) => Number(filter.match(/brightness\(([^)]+)\)/)![1])
      expect(cardFilter(1, 0)).toMatch(/^blur\(0\.5px\) grayscale\(0\.8\) brightness\(/)
      expect(brightnessOf(cardFilter(1, 0))).toBeCloseTo(1.04)
      expect(brightnessOf(cardFilter(2, 0))).toBeCloseTo(0.96)
      expect(brightnessOf(cardFilter(3, 0))).toBeCloseTo(0.88)
      expect(brightnessOf(cardFilter(4, 0))).toBeCloseTo(0.8)
    })

    it('is symmetric around the hovered card', () => {
      expect(cardFilter(0, 2)).toBe(cardFilter(4, 2))
      expect(cardFilter(1, 2)).toBe(cardFilter(3, 2))
    })
  })

  describe('handPosition', () => {
    it('matches the verified 5-card hand exactly (read from the live stylesheet)', () => {
      expect(handPosition(0, 5)).toEqual({ x: -120, y: 25 })
      expect(handPosition(1, 5)).toEqual({ x: -60, y: 45 })
      expect(handPosition(2, 5)).toEqual({ x: 0, y: 10 })
      expect(handPosition(3, 5)).toEqual({ x: 60, y: 45 })
      expect(handPosition(4, 5)).toEqual({ x: 120, y: 25 })
    })

    it('falls back to a flat, unarced Y for unverified card counts', () => {
      expect(handPosition(0, 3).y).toBe(30)
      expect(handPosition(1, 3).y).toBe(30)
      expect(handPosition(2, 3).y).toBe(30)
    })

    it('spreads X in steps of 60% of the card width, symmetric around the center', () => {
      expect(handPosition(0, 5).x).toBe(-120)
      expect(handPosition(4, 5).x).toBe(120)
      expect(handPosition(2, 5).x).toBe(0)
    })
  })

  describe('handZIndex', () => {
    it('elevates only the two cards immediately adjacent to the center (verified for 5 cards)', () => {
      expect(handZIndex(0, 5)).toBe(0)
      expect(handZIndex(1, 5)).toBe(1)
      expect(handZIndex(2, 5)).toBe(0)
      expect(handZIndex(3, 5)).toBe(1)
      expect(handZIndex(4, 5)).toBe(0)
    })
  })
})
