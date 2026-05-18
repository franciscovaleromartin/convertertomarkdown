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
      const file = makeFile('data.csv', '1,Alice\n2,Bob\n3,Charlie')
      const result = await convertCsv(file)
      expect(result).toContain('| 1 | Alice |')
      expect(result).not.toContain('**')
    })
  })

  // ─── form-style detection ──────────────────────────────────────────────────

  describe('form-style detection', () => {
    it('detects form style: col 0 empty, col 1 labels, col 2 values', async () => {
      const csv = ',Company,Acme\n,Email,acme@example.com'
      const file = makeFile('form.csv', csv)
      const result = await convertCsv(file)
      expect(result).toContain('**Company:** Acme')
      expect(result).toContain('**Email:** acme@example.com')
      expect(result).not.toContain('|')
    })

    it('detects form style when cols 3+ are nearly empty', async () => {
      // 7 cols: col 0 empty, col 1 label, col 2 value, cols 3-6 empty (<10% data)
      const row = (label: string, value: string) => `,${label},${value},,,`
      const csv = [row('Company', 'Acme'), row('Email', 'a@b.com')].join('\n')
      const file = makeFile('form.csv', csv)
      const result = await convertCsv(file)
      expect(result).toContain('**Company:** Acme')
      expect(result).not.toContain('|')
    })

    it('does NOT detect form when col 0 is non-empty', async () => {
      const csv = 'X,Company,Acme\nX,Email,a@b.com'
      const file = makeFile('data.csv', csv)
      const result = await convertCsv(file)
      expect(result).toContain('|')
    })

    it('does NOT detect form when col 1 is mostly numeric', async () => {
      const csv = ',1,Alice\n,2,Bob\n,3,Charlie'
      const file = makeFile('data.csv', csv)
      const result = await convertCsv(file)
      expect(result).toContain('|')
      expect(result).not.toContain('**')
    })

    it('does NOT detect form when cols 3+ have significant data (≥10%)', async () => {
      // 20 rows, col 3 has 2 non-empty cells = 10% exactly → NOT form
      const rows = Array.from({ length: 20 }, (_, i) =>
        i < 2 ? `,Label${i},Value${i},Extra` : `,Label${i},Value${i},`
      )
      const file = makeFile('data.csv', rows.join('\n'))
      const result = await convertCsv(file)
      expect(result).toContain('|')
    })
  })

  // ─── form-style rendering ──────────────────────────────────────────────────

  describe('form-style rendering', () => {
    it('renders label+value rows as **label:** value', async () => {
      const csv = ',Name,Alice\n,Age,30'
      const file = makeFile('form.csv', csv)
      const result = await convertCsv(file)
      expect(result).toContain('**Name:** Alice')
      expect(result).toContain('**Age:** 30')
    })

    it('first label-only row becomes # (document title)', async () => {
      const csv = ',Document Title,\n,Key,Value'
      const file = makeFile('form.csv', csv)
      const result = await convertCsv(file)
      expect(result).toContain('# Document Title')
    })

    it('second label-only row becomes plain text (subtitle)', async () => {
      const csv = ',Main Title,\n,Subtitle here,\n,Key,Value'
      const file = makeFile('form.csv', csv)
      const result = await convertCsv(file)
      expect(result).toContain('Subtitle here')
      expect(result).not.toMatch(/^#+ Subtitle here/m)
    })

    it('third+ label-only rows become ## section headers', async () => {
      const csv = ',Title,\n,Sub,\n,Section A,\n,Key,Val\n,Section B,\n,Key2,Val2'
      const file = makeFile('form.csv', csv)
      const result = await convertCsv(file)
      expect(result).toContain('## Section A')
      expect(result).toContain('## Section B')
    })

    it('adds blank line before each label-only row (except first)', async () => {
      // Title(1st→#), Sub(2nd→plain), SecA(3rd→##): each gets blank line before it except Title
      const csv = ',Title,\n,Sub,\n,SecA,\n,Key,Val'
      const file = makeFile('form.csv', csv)
      const result = await convertCsv(file)
      expect(result).toContain('# Title\n\nSub\n\n## SecA')
    })
  })

  // ─── empty row/column stripping ────────────────────────────────────────────

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

    it('shows footer when more than 5 empty columns stripped (table mode)', async () => {
      const file = makeFile('data.csv', 'A,,,,,,,B\n1,,,,,,,2')
      const result = await convertCsv(file)
      expect(result).toContain('empty columns')
    })

    it('shows footer when form mode ignores many ghost columns', async () => {
      // col 0 empty + 6 cols 3-8 empty = 7 ghost cols > 5 → footer
      const row = (l: string, v: string) => `,${l},${v},,,,,,`
      const file = makeFile('form.csv', [row('A', 'B'), row('C', 'D')].join('\n'))
      const result = await convertCsv(file)
      expect(result).toContain('empty columns')
    })

    it('does not show footer when ≤10 rows and ≤5 cols stripped', async () => {
      const file = makeFile('data.csv', 'A,B,C,D\n1,2,3,4\n\n\n\n\n')
      const result = await convertCsv(file)
      expect(result).not.toContain('empty rows')
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
