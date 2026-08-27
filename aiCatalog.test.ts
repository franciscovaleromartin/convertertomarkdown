import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'

const catalog = JSON.parse(
  readFileSync('public/.well-known/ai-catalog.json', 'utf-8')
)

describe('ai-catalog.json', () => {
  it('declara specVersion y un host identificable', () => {
    expect(catalog.specVersion).toBeTruthy()
    expect(catalog.host.displayName).toBeTruthy()
    expect(catalog.host.identifier).toBeTruthy()
  })

  it('tiene entradas con identifier, displayName y type', () => {
    expect(catalog.entries.length).toBeGreaterThan(0)
    for (const e of catalog.entries) {
      expect(e.identifier).toMatch(/^urn:air:convertertomarkdown\.com:/)
      expect(e.displayName).toBeTruthy()
      expect(e.type).toBeTruthy()
    }
  })

  it('cada entrada lleva exactamente uno de url o data (spec §3.4)', () => {
    for (const e of catalog.entries) {
      expect(['url' in e, 'data' in e].filter(Boolean)).toHaveLength(1)
    }
  })

  it('cada entrada aporta entre 2 y 5 representativeQueries', () => {
    for (const e of catalog.entries) {
      expect(e.representativeQueries.length).toBeGreaterThanOrEqual(2)
      expect(e.representativeQueries.length).toBeLessThanOrEqual(5)
    }
  })
})
