import { describe, it, expect } from 'vitest'
import menuData from '../data/menu.json'
const { menuCategories } = menuData

describe('menu data integrity', () => {
  it('has categories with items', () => {
    expect(Array.isArray(menuCategories)).toBe(true)
    expect(menuCategories.length).toBeGreaterThan(0)
    for (const cat of menuCategories) {
      expect(cat.slug).toBeTypeOf('string')
      expect(cat.name).toBeTypeOf('string')
      expect(Array.isArray(cat.items)).toBe(true)
      expect(cat.items.length).toBeGreaterThan(0)
    }
  })

  it('items have required fields and positive prices', () => {
    const ids = new Set()
    for (const cat of menuCategories) {
      for (const item of cat.items) {
        expect(typeof item.id).toBe('string')
        expect(ids.has(item.id)).toBe(false)
        ids.add(item.id)
        expect(typeof item.name).toBe('string')
        expect(typeof item.price).toBe('number')
        expect(item.price).toBeGreaterThan(0)
      }
    }
  })
})


