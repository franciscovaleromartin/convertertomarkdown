import * as XLSX from 'xlsx'

function sheetToMarkdown(sheet: XLSX.WorkSheet): string {
  const data = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: '' })
  if (data.length === 0) return '_Hoja vacía_'

  const rows = (data as unknown[][]).map(row => row.map(String))
  const header = rows[0]
  const separator = header.map(() => '---')
  const toRow = (cells: string[]) => `| ${cells.join(' | ')} |`

  return [toRow(header), toRow(separator), ...rows.slice(1).map(toRow)].join('\n')
}

export async function convertXlsx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })

  if (workbook.SheetNames.length === 0) {
    throw new Error('El archivo no contiene hojas.')
  }

  return workbook.SheetNames.map(name => {
    const sheet = workbook.Sheets[name]
    return `## ${name}\n\n${sheetToMarkdown(sheet)}`
  }).join('\n\n')
}
