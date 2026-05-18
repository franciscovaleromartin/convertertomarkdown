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
  describe('table rendering', () => {
    it('renders 4-column CSV as markdown table', async () => {
      const file = makeFile('data.csv', 'Name,Age,City,Job\nAlice,30,NYC,Dev\nBob,25,LA,QA')
      const result = await convertCsv(file)
      expect(result).toBe(
        '| Name | Age | City | Job |\n| --- | --- | --- | --- |\n| Alice | 30 | NYC | Dev |\n| Bob | 25 | LA | QA |'
      )
    })

    it('trims whitespace in table mode', async () => {
      const file = makeFile('data.csv', ' A , B , C , D \n 1 , 2 , 3 , 4 ')
      const result = await convertCsv(file)
      expect(result).toContain('| A | B | C | D |')
      expect(result).toContain('| 1 | 2 | 3 | 4 |')
    })

    it('does not render as form when first column is mostly numeric', async () => {
      const file = makeFile('data.csv', '1,Alice\n2,Bob\n3,Charlie')
      const result = await convertCsv(file)
      expect(result).toContain('| 1 | Alice |')
      expect(result).not.toContain('**')
    })
  })

  describe('form-style rendering', () => {
    it('detects form style for 2 text-label columns', async () => {
      const file = makeFile('form.csv', 'Company,Acme\nEmail,acme@example.com')
      const result = await convertCsv(file)
      expect(result).toContain('**Company:** Acme')
      expect(result).toContain('**Email:** acme@example.com')
      expect(result).not.toContain('|')
    })

    it('renders label-only rows as ## section headers', async () => {
      const file = makeFile('form.csv', 'Section,\nKey,Value')
      const result = await convertCsv(file)
      expect(result).toContain('## Section')
      expect(result).toContain('**Key:** Value')
    })

    it('adds blank line before section headers', async () => {
      const file = makeFile('form.csv', 'SecA,\nKey1,Val1\nSecB,\nKey2,Val2')
      const result = await convertCsv(file)
      expect(result).toContain('**Key1:** Val1\n\n## SecB')
    })
  })

  describe('empty row/column stripping', () => {
    it('strips empty rows silently when ≤10 removed', async () => {
      const file = makeFile('data.csv', 'A,B,C,D\n1,2,3,4\n\n\n')
      const result = await convertCsv(file)
      expect(result).not.toContain('empty rows')
    })

    it('shows footer when more than 10 empty rows stripped', async () => {
      const emptyRows = '\n'.repeat(11)
      const file = makeFile('data.csv', `A,B,C,D\n1,2,3,4${emptyRows}`)
      const result = await convertCsv(file)
      expect(result).toContain('11 empty rows')
    })

    it('shows footer when more than 5 empty columns stripped', async () => {
      const file = makeFile('data.csv', 'A,,,,,,,B\n1,,,,,,,2')
      const result = await convertCsv(file)
      expect(result).toContain('empty columns')
    })

    it('does not show footer when ≤10 rows and ≤5 cols stripped', async () => {
      const file = makeFile('data.csv', 'A,B,C,D\n1,2,3,4\n\n\n\n\n')
      const result = await convertCsv(file)
      expect(result).not.toContain('empty rows')
    })

    it('appends footer after body content', async () => {
      const emptyRows = '\n'.repeat(11)
      const file = makeFile('data.csv', `A,B,C,D\n1,2,3,4${emptyRows}`)
      const result = await convertCsv(file)
      expect(result).toMatch(/\| A \| B \| C \| D \|[\s\S]+empty rows/)
    })
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
