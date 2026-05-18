import { convertText, convertCsv, convertJson, convertXml } from './textConverter'
import { convertDocx } from './docxConverter'
import { convertXlsx } from './xlsxConverter'
import { convertHtml } from './htmlConverter'
import { convertPdf } from './pdfConverter'

export function getExtension(filename: string): string {
  const idx = filename.lastIndexOf('.')
  if (idx <= 0) return idx === 0 ? filename : ''
  return filename.slice(idx).toLowerCase()
}

export async function convertFile(file: File): Promise<string> {
  const ext = getExtension(file.name)

  switch (ext) {
    case '.docx':             return convertDocx(file)
    case '.pdf':              return convertPdf(file)
    case '.xlsx':
    case '.xls':              return convertXlsx(file)
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
