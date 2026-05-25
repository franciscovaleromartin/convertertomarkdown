import { ocrRecognize } from '../lib/tesseractWorker'

export async function convertImage(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const url = URL.createObjectURL(file)
  try {
    const text = await ocrRecognize(url, (m) => {
      if (m.status === 'recognizing text' && typeof m.progress === 'number') {
        onProgress?.(Math.round(m.progress * 100))
      }
    })
    const result = text.trim()
    if (!result) throw new Error('No se pudo extraer texto de la imagen. Asegúrate de que contiene texto impreso legible.')
    return result
  } finally {
    URL.revokeObjectURL(url)
  }
}
