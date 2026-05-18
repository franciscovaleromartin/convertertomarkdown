import { useState } from 'react'
import DropZone from './components/DropZone'
import FileInfo from './components/FileInfo'
import OutputPanel from './components/OutputPanel'
import { convertFile } from './converters'

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB

export default function App() {
  const [file, setFile] = useState<File | null>(null)
  const [markdown, setMarkdown] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (f: File) => {
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
      setError(
        err instanceof Error
          ? err.message
          : 'Error desconocido al convertir el archivo.'
      )
    } finally {
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
    <div className="min-h-screen bg-white font-inter">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            ConverterToMarkdown
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Convierte archivos a Markdown directamente en tu navegador
          </p>
        </header>

        {file ? (
          <FileInfo file={file} isLoading={isLoading} onClear={handleClear} />
        ) : (
          <DropZone onFile={handleFile} />
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
            <span className="flex-shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {markdown && !isLoading && (
          <OutputPanel
            markdown={markdown}
            fileName={file?.name ?? 'output'}
            onClear={handleClear}
          />
        )}
      </div>
    </div>
  )
}
