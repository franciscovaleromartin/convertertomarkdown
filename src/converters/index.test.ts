import { describe, it, expect } from 'vitest'
import { getExtension } from './index'

describe('getExtension', () => {
  it('returns lowercase extension including the dot', () => {
    expect(getExtension('report.DOCX')).toBe('.docx')
    expect(getExtension('file.pdf')).toBe('.pdf')
    expect(getExtension('data.XLSX')).toBe('.xlsx')
  })

  it('returns empty string when no extension', () => {
    expect(getExtension('Makefile')).toBe('')
  })

  it('handles dotfiles', () => {
    expect(getExtension('.env')).toBe('.env')
  })

  it('handles multiple dots — uses last one', () => {
    expect(getExtension('archive.tar.gz')).toBe('.gz')
  })
})

describe('convertFile — unsupported format', () => {
  it('throws with a message containing "Formato no soportado"', async () => {
    const { convertFile } = await import('./index')
    const file = new File([''], 'file.xyz')
    await expect(convertFile(file)).rejects.toThrow('Formato no soportado')
  })
})
