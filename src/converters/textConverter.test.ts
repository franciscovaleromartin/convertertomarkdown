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
  // ─── table rendering ───────────────────────────────────────────────────────

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

    it('does not trigger form style when col 0 has data', async () => {
      const file = makeFile('data.csv', 'A,B,C\n1,2,3')
      const result = await convertCsv(file)
      expect(result).toContain('|')
      expect(result).not.toContain('**')
    })

    it('does not trigger form style when col 0 empty but >7 non-empty cols remain', async () => {
      // col 0 empty but 8 data cols → table
      const file = makeFile('data.csv', ',A,B,C,D,E,F,G,H\n,1,2,3,4,5,6,7,8')
      const result = await convertCsv(file)
      expect(result).toContain('|')
    })
  })

  // ─── form-style detection ──────────────────────────────────────────────────

  describe('form-style detection', () => {
    it('triggers when col 0 empty in all rows AND ≤7 non-empty cols remain', async () => {
      const csv = ',Company,Acme\n,Email,acme@example.com'
      const result = await convertCsv(makeFile('form.csv', csv))
      expect(result).not.toContain('|')
      expect(result).toContain('**Company:** Acme')
    })

    it('triggers with ghost col 0 plus extra nearly-empty cols (≤7 total non-empty)', async () => {
      // col 0 empty, col 1 label, col 2 value, cols 3-4 empty → 2 non-empty cols
      const rows = [',Label A,Value A,,', ',Label B,Value B,,'].join('\n')
      const result = await convertCsv(makeFile('form.csv', rows))
      expect(result).not.toContain('|')
      expect(result).toContain('**Label A:** Value A')
    })

    it('does NOT trigger when col 0 has data', async () => {
      const result = await convertCsv(makeFile('data.csv', 'X,Key,Value\nX,Key2,Value2'))
      expect(result).toContain('|')
    })

    it('does NOT trigger when more than 7 non-empty cols remain', async () => {
      const header = ',A,B,C,D,E,F,G,H'  // col 0 empty + 8 cols = 8 non-empty > 7
      const data = ',1,2,3,4,5,6,7,8'
      const result = await convertCsv(makeFile('data.csv', [header, data].join('\n')))
      expect(result).toContain('|')
    })
  })

  // ─── form-style rendering ──────────────────────────────────────────────────

  describe('form-style rendering', () => {
    it('renders label+value as **label:** value', async () => {
      const result = await convertCsv(makeFile('form.csv', ',Name,Alice\n,Age,30'))
      expect(result).toContain('**Name:** Alice')
      expect(result).toContain('**Age:** 30')
    })

    it('first label-only row becomes # heading', async () => {
      const result = await convertCsv(makeFile('form.csv', ',Document Title,\n,Key,Val'))
      expect(result).toContain('# Document Title')
    })

    it('subsequent label-only rows become ## headings', async () => {
      const csv = ',Title,\n,Section A,\n,Key,Val\n,Section B,\n,Key2,Val2'
      const result = await convertCsv(makeFile('form.csv', csv))
      expect(result).toContain('# Title')
      expect(result).toContain('## Section A')
      expect(result).toContain('## Section B')
    })

    it('strips trailing asterisks from label', async () => {
      const result = await convertCsv(makeFile('form.csv', ',Required Field *,Value'))
      expect(result).toContain('**Required Field:** Value')
      expect(result).not.toContain('*:')
    })

    it('skips rows where label is empty', async () => {
      const csv = ',Title,\n,,Some stray value\n,Key,Val'
      const result = await convertCsv(makeFile('form.csv', csv))
      expect(result).not.toContain('Some stray value')
    })

    it('adds blank line before each heading', async () => {
      const csv = ',Title,\n,Key1,Val1\n,Section,\n,Key2,Val2'
      const result = await convertCsv(makeFile('form.csv', csv))
      expect(result).toContain('**Key1:** Val1\n\n## Section')
    })

    it('output contains no pipe characters', async () => {
      const csv = ',Company,Acme\n,Email,a@b.com'
      const result = await convertCsv(makeFile('form.csv', csv))
      expect(result).not.toContain('|')
    })
  })

  // ─── empty row/column stripping ────────────────────────────────────────────

  describe('empty row/column stripping', () => {
    it('strips empty rows silently when ≤10 removed', async () => {
      const result = await convertCsv(makeFile('data.csv', 'A,B,C,D\n1,2,3,4\n\n\n'))
      expect(result).not.toContain('empty rows')
    })

    it('shows footer when more than 10 empty rows stripped', async () => {
      const emptyRows = '\n'.repeat(11)
      const result = await convertCsv(makeFile('data.csv', `A,B,C,D\n1,2,3,4${emptyRows}`))
      expect(result).toContain('11 empty rows')
    })

    it('shows footer when more than 5 empty columns stripped (table mode)', async () => {
      const result = await convertCsv(makeFile('data.csv', 'A,,,,,,,B\n1,,,,,,,2'))
      expect(result).toContain('empty columns')
    })

    it('does not show footer when ≤10 rows and ≤5 cols stripped', async () => {
      const result = await convertCsv(makeFile('data.csv', 'A,B,C,D\n1,2,3,4\n\n\n\n\n'))
      expect(result).not.toContain('empty rows')
    })

    it('handles quoted CSV fields with commas (PapaParse)', async () => {
      const result = await convertCsv(
        makeFile('data.csv', 'Name,Address\n"Smith, John","123 Main St"')
      )
      expect(result).toContain('| Smith, John | 123 Main St |')
    })
  })
})

describe('convertJson', () => {
  it('wraps valid JSON in fenced code block', async () => {
    const file = makeFile('data.json', '{"key":"value"}')
    expect(await convertJson(file)).toBe('```json\n{"key":"value"}\n```')
  })

  it('throws on invalid JSON', async () => {
    await expect(convertJson(makeFile('bad.json', '{invalid}'))).rejects.toThrow()
  })
})

describe('convertXml', () => {
  it('wraps XML in fenced code block', async () => {
    const file = makeFile('data.xml', '<root><item>1</item></root>')
    expect(await convertXml(file)).toBe('```xml\n<root><item>1</item></root>\n```')
  })
})
