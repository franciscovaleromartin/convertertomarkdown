import Papa from 'papaparse'
import { getT } from '../lib/i18n'

export async function convertText(file: File): Promise<string> {
  return file.text()
}

function renderForm(rows: string[][]): string {
  const lines: string[] = []
  let headingCount = 0

  for (const row of rows) {
    const label = (row[1] ?? '').trim().replace(/\*+\s*$/, '').trim()
    const value = (row[2] ?? '').trim()

    if (!label) continue

    if (!value) {
      headingCount++
      if (lines.length > 0) lines.push('')
      lines.push(headingCount === 1 ? `# ${label}` : `## ${label}`)
    } else {
      lines.push(`**${label}:** ${value}`)
    }
  }

  return lines.join('\n')
}

function renderTable(data: string[][]): string {
  if (data.length === 0) return ''
  const toRow = (cells: string[]) => `| ${cells.join(' | ')} |`
  const sep = data[0].map(() => '---')
  return [toRow(data[0]), toRow(sep), ...data.slice(1).map(toRow)].join('\n')
}

export async function convertCsv(file: File): Promise<string> {
  const raw = await file.text()

  // Parse with PapaParse (handles quoted fields with commas)
  const parsed = Papa.parse<string[]>(raw, { skipEmptyLines: false, dynamicTyping: false })
  const rawRows: string[][] = parsed.data.map(row =>
    (row as string[]).map(cell => (cell ?? '').trim())
  )

  // Strip empty rows
  const nonEmptyRows = rawRows.filter(row => row.some(c => c !== ''))
  const strippedRows = rawRows.length - nonEmptyRows.length

  if (nonEmptyRows.length === 0) return ''

  const colCount = Math.max(...nonEmptyRows.map(r => r.length))

  // Count non-empty columns (at least one cell with data — this is what would remain after col stripping)
  let nonEmptyColCount = 0
  for (let c = 0; c < colCount; c++) {
    if (nonEmptyRows.some(row => (row[c] ?? '') !== '')) nonEmptyColCount++
  }

  const col0AllEmpty = nonEmptyRows.every(row => (row[0] ?? '') === '')

  let body: string
  let strippedCols: number

  if (nonEmptyColCount <= 7 && col0AllEmpty) {
    // Form-style: col 0 is ghost, col 1 = label, col 2 = value
    console.log('form-style detected')
    strippedCols = colCount - nonEmptyColCount  // all-empty cols
    body = renderForm(nonEmptyRows)
  } else {
    // Table-style: strip all-empty columns then render
    const activeColIndices: number[] = []
    for (let c = 0; c < colCount; c++) {
      if (nonEmptyRows.some(row => (row[c] ?? '') !== '')) activeColIndices.push(c)
    }
    strippedCols = colCount - activeColIndices.length
    const data = nonEmptyRows.map(row => activeColIndices.map(c => row[c] ?? ''))
    body = renderTable(data)
  }

  const footer =
    strippedRows > 10 || strippedCols > 5
      ? `_(${strippedRows} empty rows and ${strippedCols} empty columns removed)_`
      : ''

  return footer ? `${body}\n\n${footer}` : body
}

export async function convertJson(file: File): Promise<string> {
  const text = await file.text()
  try {
    JSON.parse(text)
  } catch {
    throw new Error(getT().errJsonInvalid)
  }
  return `\`\`\`json\n${text}\n\`\`\``
}

export async function convertXml(file: File): Promise<string> {
  const text = await file.text()
  return `\`\`\`xml\n${text}\n\`\`\``
}
