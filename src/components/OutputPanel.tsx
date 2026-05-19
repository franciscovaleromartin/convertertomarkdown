import { useState, useEffect } from 'react'

interface Props {
  markdown: string
  fileName: string
  onClear: () => void
}

export default function OutputPanel({ markdown, fileName, onClear }: Props) {
  const [text, setText] = useState(markdown)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setText(markdown)
  }, [markdown])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const base = fileName.replace(/\.[^.]+$/, '')
    const blob = new Blob([text], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${base}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const lines = text.split('\n').length
  const chars = text.length

  return (
    <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <span className="text-xs text-zinc-500 font-medium">
          Output · {chars} chars · {lines} líneas
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="text-xs bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-md transition-colors duration-150 font-medium"
          >
            {copied ? '¡Copiado!' : 'Copiar'}
          </button>
          <button
            onClick={handleDownload}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-md transition-colors duration-150 border border-zinc-700/50"
          >
            ↓ Descargar .md
          </button>
          <button
            onClick={onClear}
            className="text-xs text-zinc-600 hover:text-zinc-300 px-2 py-1.5 transition-colors duration-150"
            aria-label="Limpiar"
          >
            ✕
          </button>
        </div>
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full p-4 font-mono text-sm text-zinc-200 bg-transparent leading-relaxed resize-y min-h-[300px] max-h-[600px] focus:outline-none"
        spellCheck={false}
      />
    </div>
  )
}
