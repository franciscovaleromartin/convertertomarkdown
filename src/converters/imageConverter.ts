import { createWorker } from 'tesseract.js'

const LANG_MAP: Record<string, string> = {
  en: 'eng', es: 'spa', fr: 'fra', de: 'deu', pt: 'por',
  it: 'ita', nl: 'nld', ru: 'rus', ja: 'jpn', zh: 'chi_sim',
  pl: 'pol', ko: 'kor', ar: 'ara', tr: 'tur', sv: 'swe',
}

function detectTesseractLang(): string {
  if (typeof navigator === 'undefined') return 'eng'
  const lang = (navigator.language || navigator.languages?.[0] || 'en').split('-')[0].toLowerCase()
  return LANG_MAP[lang] ?? 'eng'
}

export async function convertImage(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const lang = detectTesseractLang()
  const worker = await createWorker(lang, 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && typeof m.progress === 'number') {
        onProgress?.(Math.round(m.progress * 100))
      }
    },
  })

  const url = URL.createObjectURL(file)
  try {
    const { data } = await worker.recognize(url)
    const text = data.text.trim()
    if (!text) throw new Error('No se pudo extraer texto de la imagen. Asegúrate de que contiene texto impreso legible.')
    return text
  } finally {
    URL.revokeObjectURL(url)
    await worker.terminate()
  }
}
