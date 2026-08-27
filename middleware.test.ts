import { describe, it, expect } from 'vitest'
import { markdownPath } from './middleware'

describe('markdownPath', () => {
  it('mapea la home a index.md', () => {
    expect(markdownPath('/')).toBe('/index.md')
  })

  it('añade .md a las páginas internas', () => {
    expect(markdownPath('/como-funciona')).toBe('/como-funciona.md')
  })

  it('ignora la barra final', () => {
    expect(markdownPath('/casos-de-uso/')).toBe('/casos-de-uso.md')
  })
})
