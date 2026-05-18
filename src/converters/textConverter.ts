export async function convertText(file: File): Promise<string> {
  return file.text()
}

export async function convertCsv(file: File): Promise<string> {
  const raw = await file.text()
  const lines = raw.trim().split('\n')
  if (lines.length === 0) return ''

  const rows = lines.map(line => line.split(',').map(cell => cell.trim()))
  const toRow = (cells: string[]) => `| ${cells.join(' | ')} |`
  const separator = rows[0].map(() => '---')

  return [toRow(rows[0]), toRow(separator), ...rows.slice(1).map(toRow)].join('\n')
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
