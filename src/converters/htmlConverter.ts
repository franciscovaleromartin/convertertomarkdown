import TurndownService from 'turndown'

const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })

export async function convertHtml(file: File): Promise<string> {
  const text = await file.text()
  const result = td.turndown(text)
  if (!result.trim()) {
    throw new Error('El archivo HTML no contiene texto convertible.')
  }
  return result
}
