import { useState } from 'react'
import type { ReactNode } from 'react'
import DropZone from './components/DropZone'
import UrlInput from './components/UrlInput'
import FileInfo from './components/FileInfo'
import OutputPanel from './components/OutputPanel'
import { convertFile } from './converters'

const MAX_FILE_SIZE = 20 * 1024 * 1024

type InputMode = 'file' | 'url'

export default function App() {
  const [inputMode, setInputMode] = useState<InputMode>('file')
  const [file, setFile] = useState<File | null>(null)
  const [markdown, setMarkdown] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processFile = async (f: File) => {
    if (f.size > MAX_FILE_SIZE) {
      setError('El archivo supera el límite de 20 MB.')
      return
    }
    setFile(f)
    setError(null)
    setMarkdown('')
    setIsLoading(true)
    try {
      const result = await convertFile(f)
      setMarkdown(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al convertir el archivo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUrl = async (url: string) => {
    setError(null)
    setMarkdown('')
    setIsLoading(true)
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Error al obtener la URL: ${response.statusText}`)
      const blob = await response.blob()
      const urlPath = new URL(url).pathname
      const name = urlPath.split('/').pop() || 'document.html'
      const f = new File([blob], name, { type: blob.type || 'text/html' })
      await processFile(f)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener la URL.')
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setMarkdown('')
    setError(null)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#09090b] font-inter text-white">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight">
            <span className="text-sky-400">Converter</span>
            <span className="text-zinc-500">To</span>
            <span className="text-purple-400">Markdown</span>
            <span className="text-zinc-600 text-xs">.com</span>
          </span>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/franciscovalero"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-150"
            >
              GitHub
            </a>
            <button
              onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
              className="text-sm bg-white text-black font-medium px-4 py-1.5 rounded-lg hover:bg-zinc-200 transition-colors duration-150"
            >
              Convertir ahora
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero + content ── */}
      <div className="max-w-2xl mx-auto px-4 pt-36 pb-16">

        <header className="mb-14 text-center">
          <h1 className="text-[clamp(3rem,8vw,5.5rem)] font-extrabold tracking-tight leading-[1.05]">
            <span className="text-sky-400">Converter</span>
            <span className="text-zinc-500">To</span>
            <span className="text-purple-400">Markdown</span>
            <span className="text-zinc-600 text-[0.55em] align-baseline relative top-[0.05em]">.com</span>
          </h1>
          <p className="text-zinc-600 text-xs mt-3 tracking-widest uppercase font-medium">
            por Francisco Valero
          </p>
          <p className="text-zinc-300 text-lg mt-6 leading-relaxed">
            Convierte archivos a Markdown directamente en tu navegador
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <StatPill value="10" label="formatos compatibles" />
            <StatPill value="20 MB" label="máximo" />
            <StatPill value="0" label="servidores" />
            <StatPill label="Edita y descarga" />
          </div>
        </header>

        {!file && (
          <div className="flex mb-5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit mx-auto gap-1">
            <ModeTab active={inputMode === 'file'} onClick={() => setInputMode('file')}>
              Archivo
            </ModeTab>
            <ModeTab active={inputMode === 'url'} onClick={() => setInputMode('url')}>
              URL
            </ModeTab>
          </div>
        )}

        {file ? (
          <FileInfo file={file} isLoading={isLoading} onClear={handleClear} />
        ) : inputMode === 'file' ? (
          <DropZone onFile={processFile} />
        ) : (
          <UrlInput onUrl={handleUrl} isLoading={isLoading} />
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 text-red-400 text-sm bg-red-950/40 border border-red-900/50 rounded-xl p-3.5">
            <span className="flex-shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {markdown && !isLoading && (
          <OutputPanel markdown={markdown} fileName={file?.name ?? 'output'} onClear={handleClear} />
        )}
      </div>
    </div>
  )
}

function StatPill({ value, label }: { value?: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-sm">
      {value && <span className="font-bold text-white">{value}</span>}
      <span className="text-zinc-400">{label}</span>
    </div>
  )
}

function ModeTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={[
        'px-5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
        active
          ? 'bg-zinc-700 text-white shadow-sm'
          : 'text-zinc-500 hover:text-zinc-300',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
