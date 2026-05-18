import { describe, it, expect } from 'vitest'
import { convertText, convertCsv, convertJson, convertXml } from './textConverter'

function makeFile(name: string, content: string): File {
  return new File([content], name)
}

describe('convertText', () => {
  it('returns file content unchanged', async () => {
    const file = makeFile('hello.txt', '# Hello\nWorld')
    expect(await convertText(file)).toBe('# Hello\nWorld')
  })
})

describe('convertCsv', () => {
  it('converts header + rows to markdown table', async () => {
    const file = makeFile('data.csv', 'Name,Age\nAlice,30\nBob,25')
    const result = await convertCsv(file)
    expect(result).toBe(
      '| Name | Age |\n| --- | --- |\n| Alice | 30 |\n| Bob | 25 |'
    )
  })

  it('handles header-only CSV', async () => {
    const file = makeFile('data.csv', 'col1,col2')
    const result = await convertCsv(file)
    expect(result).toContain('| col1 | col2 |')
    expect(result).toContain('| --- | --- |')
  })

  it('trims whitespace from cells', async () => {
    const file = makeFile('data.csv', ' Name , Age \n Alice , 30 ')
    const result = await convertCsv(file)
    expect(result).toContain('| Name | Age |')
    expect(result).toContain('| Alice | 30 |')
  })
})

describe('convertJson', () => {
  it('wraps valid JSON in fenced code block', async () => {
    const file = makeFile('data.json', '{"key":"value"}')
    const result = await convertJson(file)
    expect(result).toBe('```json\n{"key":"value"}\n```')
  })

  it('throws on invalid JSON', async () => {
    const file = makeFile('bad.json', '{invalid json}')
    await expect(convertJson(file)).rejects.toThrow()
  })
})

describe('convertXml', () => {
  it('wraps XML in fenced code block', async () => {
    const file = makeFile('data.xml', '<root><item>1</item></root>')
    const result = await convertXml(file)
    expect(result).toBe('```xml\n<root><item>1</item></root>\n```')
  })
})
