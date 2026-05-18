export async function convertText(file: File): Promise<string> {
  return file.text()
}

function isNumeric(s: string): boolean {
  return s !== '' && !isNaN(Number(s))
}

function detectFormStyle(rows: string[][], colCount: number): boolean {
  if (colCount < 3) return false

  // Col 0 must be empty in ALL rows
  if (!rows.every(row => (row[0] ?? '') === '')) return false

  // Col 1 must have non-numeric text in >60% of its non-empty cells
  const col1NonEmpty = rows.map(row => row[1] ?? '').filter(c => c !== '')
  if (col1NonEmpty.length === 0) return false
  const nonNumericRatio = col1NonEmpty.filter(c => !isNumeric(c)).length / col1NonEmpty.length
  if (nonNumericRatio <= 0.6) return false

  // Cols 3+ must have <10% data
  const totalRows = rows.length
  for (let c = 3; c < colCount; c++) {
    const filled = rows.filter(row => (row[c] ?? '') !== '').length
    if (filled / totalRows >= 0.1) return false
  }

  return true
}

function countGhostCols(rows: string[][], colCount: number): number {
  const totalRows = rows.length
  let count = 0
  for (let c = 0; c < colCount; c++) {
    if (c === 1 || c === 2) continue // label and value cols — used
    const filled = rows.filter(row => (row[c] ?? '') !== '').length
    if (filled / totalRows < 0.1) count++
  }
  return count
}

function renderForm(rows: string[][]): string {
  const lines: string[] = []
  let labelOnlyCount = 0

  for (const row of rows) {
    const label = (row[1] ?? '').trim()
    const value = (row[2] ?? '').trim()

    if (!label && !value) continue

    if (label && !value) {
      labelOnlyCount++
      if (lines.length > 0) lines.push('')
      if (labelOnlyCount === 1) {
        lines.push(`# ${label}`)
      } else if (labelOnlyCount === 2) {
        lines.push(label)
      } else {
        lines.push(`## ${label}`)
      }
    } else if (label && value) {
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
  const allRows = raw.split(/\r?\n/).map(line => line.split(',').map(cell => cell.trim()))

  // Strip empty rows
  const nonEmptyRows = allRows.filter(row => row.some(c => c !== ''))
  const strippedRows = allRows.length - nonEmptyRows.length

  if (nonEmptyRows.length === 0) return ''

  const colCount = Math.max(...nonEmptyRows.map(r => r.length))

  let body: string
  let strippedCols: number

  if (detectFormStyle(nonEmptyRows, colCount)) {
    strippedCols = countGhostCols(nonEmptyRows, colCount)
    body = renderForm(nonEmptyRows)
  } else {
    // Strip all-empty columns for table rendering
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
    throw new Error('JSON inválido: el archivo no puede parsearse.')
  }
  return `\`\`\`json\n${text}\n\`\`\``
}

export async function convertXml(file: File): Promise<string> {
  const text = await file.text()
  return `\`\`\`xml\n${text}\n\`\`\``
}
