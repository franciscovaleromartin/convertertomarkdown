import { convertText, convertCsv, convertJson, convertXml } from './textConverter'
import { convertHtml } from './htmlConverter'

export function getExtension(filename: string): string {
  const idx = filename.lastIndexOf('.')
  if (idx <= 0) return idx === 0 ? filename : ''
  return filename.slice(idx).toLowerCase()
}

export async function convertFile(file: File): Promise<string> {
  const ext = getExtension(file.name)

  switch (ext) {
    case '.docx': {
      const { convertDocx } = await import('./docxConverter')
      return convertDocx(file)
    }
    case '.pdf': {
      const { convertPdf } = await import('./pdfConverter')
      return convertPdf(file)
    }
    case '.xlsx':
    case '.xls': {
      const { convertXlsx } = await import('./xlsxConverter')
      return convertXlsx(file)
    }
    case '.html':
    case '.htm':              return convertHtml(file)
    case '.txt':
    case '.md':               return convertText(file)
    case '.csv':              return convertCsv(file)
    case '.json':             return convertJson(file)
    case '.xml':              return convertXml(file)
    default:
      throw new Error(
        'Formato no soportado. Formatos aceptados: DOCX, PDF, XLSX, XLS, HTML, TXT, MD, CSV, JSON, XML.'
      )
  }
}
