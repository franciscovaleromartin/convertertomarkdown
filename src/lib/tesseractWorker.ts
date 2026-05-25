import { createWorker } from 'tesseract.js'
import { detectTesseractLang } from './tesseractLang'

type TesseractWorker = Awaited<ReturnType<typeof createWorker>>
type LoggerFn = (m: { status: string; progress?: number }) => void

let _worker: TesseractWorker | null = null
let _workerLang = ''
let _logger: LoggerFn = () => {}

async function getWorker(lang: string): Promise<TesseractWorker> {
  if (_worker && _workerLang === lang) return _worker
  if (_worker) { await _worker.terminate(); _worker = null }
  _worker = await createWorker(lang, 1, { logger: (m) => _logger(m) })
  _workerLang = lang
  return _worker
}

export async function ocrRecognize(
  source: string | HTMLCanvasElement,
  logger?: LoggerFn,
): Promise<string> {
  const lang = detectTesseractLang()
  _logger = logger ?? (() => {})
  const worker = await getWorker(lang)
  const { data } = await worker.recognize(source)
  _logger = () => {}
  return data.text
}
