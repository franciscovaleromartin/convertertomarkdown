import mammoth from 'mammoth'
import TurndownService from 'turndown'

const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })

export async function convertDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.convertToHtml({ arrayBuffer })
  if (!result.value.trim()) {
    throw new Error('No se pudo extraer texto del documento. Puede estar vacío o dañado.')
  }
  return td.turndown(result.value)
}
