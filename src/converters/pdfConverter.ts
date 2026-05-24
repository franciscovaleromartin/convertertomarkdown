import * as pdfjsLib from 'pdfjs-dist'
import { createWorker } from 'tesseract.js'

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'

const LANG_MAP: Record<string, string> = {
  en: 'eng', es: 'spa', fr: 'fra', de: 'deu', pt: 'por',
  it: 'ita', nl: 'nld', ru: 'rus', ja: 'jpn', zh: 'chi_sim',
}

function detectTesseractLang(): string {
  if (typeof navigator === 'undefined') return 'eng'
  const code = (navigator.language || 'en').split('-')[0].toLowerCase()
  return LANG_MAP[code] ?? 'eng'
}

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

  // Primera pasada: extraer texto embebido
  const textPages: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    textPages.push(await extractPageText(page))
  }

  const extracted = textPages.filter(Boolean)
  if (extracted.length > 0) return extracted.join('\n\n')

  // Sin texto → PDF escaneado: OCR página a página con Tesseract
  const total = pdf.numPages
  let pagesDone = 0

  const worker = await createWorker(detectTesseractLang(), 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && typeof m.progress === 'number') {
        const overall = (pagesDone + m.progress) / total * 100
        onProgress?.(Math.min(Math.round(overall), 99))
      }
    },
  })

  try {
    const ocrPages: string[] = []
    for (let i = 1; i <= total; i++) {
      const page = await pdf.getPage(i)
      const canvas = await renderPageToCanvas(page)
      const { data } = await worker.recognize(canvas)
      if (data.text.trim()) ocrPages.push(data.text.trim())
      pagesDone = i
    }
    onProgress?.(100)
    if (ocrPages.length === 0) {
      throw new Error('No se pudo extraer texto de este PDF. Comprueba que contiene texto legible.')
    }
    return ocrPages.join('\n\n')
  } finally {
    await worker.terminate()
  }
}
