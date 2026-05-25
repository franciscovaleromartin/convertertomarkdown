import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url'
import { ocrRecognize } from '../lib/tesseractWorker'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

type PdfPage = Awaited<ReturnType<Awaited<ReturnType<typeof pdfjsLib.getDocument>['promise']>['getPage']>>

async function extractPageText(page: PdfPage): Promise<string> {
  const content = await page.getTextContent()
  return (content.items as Array<{ str?: string }>)
    .filter(item => typeof item.str === 'string')
    .map(item => item.str as string)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function renderPageToCanvas(page: PdfPage): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale: 2.0 })
  const canvas = document.createElement('canvas')
  canvas.width = viewport.width
  canvas.height = viewport.height
  await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise
  return canvas
}

export async function convertPdf(file: File, onProgress?: (pct: number) => void): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const textPages: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    textPages.push(await extractPageText(page))
  }

  const extracted = textPages.filter(Boolean)
  if (extracted.length > 0) return extracted.join('\n\n')

  // PDF escaneado: OCR página a página con worker singleton
  const total = pdf.numPages
  let pagesDone = 0

  const ocrPages: string[] = []
  for (let i = 1; i <= total; i++) {
    const page = await pdf.getPage(i)
    const canvas = await renderPageToCanvas(page)
    const text = await ocrRecognize(canvas, (m) => {
      if (m.status === 'recognizing text' && typeof m.progress === 'number') {
        const overall = (pagesDone + m.progress) / total * 100
        onProgress?.(Math.min(Math.round(overall), 99))
      }
    })
    if (text.trim()) ocrPages.push(text.trim())
    pagesDone = i
  }

  onProgress?.(100)

  if (ocrPages.length === 0) {
    throw new Error('No se pudo extraer texto de este PDF. Comprueba que contiene texto legible.')
  }
  return ocrPages.join('\n\n')
}
