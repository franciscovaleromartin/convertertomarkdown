export async function convertText(file: File): Promise<string> {
  return file.text()
}

function isNumeric(s: string): boolean {
  return s !== '' && !isNaN(Number(s))
}

function detectFormStyle(data: string[][]): boolean {
  if (data.length === 0) return false
  const numCols = data[0]?.length ?? 0
  if (numCols === 0 || numCols > 3) return false

  const firstCol = data.map(row => row[0] ?? '').filter(c => c !== '')
  if (firstCol.length === 0) return false

  const nonNumericCount = firstCol.filter(c => !isNumeric(c)).length
  return nonNumericCount / firstCol.length > 0.6
}

function renderForm(data: string[][]): string {
  const lines: string[] = []

  for (const row of data) {
    const label = row[0] ?? ''
    const value = row[1] ?? ''

    if (!label && !value) continue

    if (label && !value) {
      if (lines.length > 0) lines.push('')
      lines.push(`## ${label}`)
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

  // Strip empty rows (all cells blank)
  const nonEmptyRows = allRows.filter(row => row.some(c => c !== ''))
  const strippedRows = allRows.length - nonEmptyRows.length

  if (nonEmptyRows.length === 0) return ''

  // Identify non-empty column indices
  const colCount = Math.max(...nonEmptyRows.map(r => r.length))
  const activeColIndices: number[] = []
  for (let c = 0; c < colCount; c++) {
    if (nonEmptyRows.some(row => (row[c] ?? '') !== '')) {
      activeColIndices.push(c)
    }
  }
  const strippedCols = colCount - activeColIndices.length

  // Build normalized data (active columns only, uniform width)
  const data = nonEmptyRows.map(row => activeColIndices.map(c => row[c] ?? ''))

  // Footer — only when >10 rows OR >5 cols stripped
  const footer =
    strippedRows > 10 || strippedCols > 5
      ? `_(${strippedRows} empty rows and ${strippedCols} empty columns removed)_`
      : ''

  const body = detectFormStyle(data) ? renderForm(data) : renderTable(data)

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
