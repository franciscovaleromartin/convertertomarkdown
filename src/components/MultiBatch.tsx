import { useState, useRef } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import { convertFile } from '../converters'
import { useT } from '../lib/i18n'

const ACCEPT_ATTR =
  '.docx,.pdf,.xlsx,.xls,.html,.htm,.txt,.md,.csv,.json,.xml,' +
  '.jpg,.jpeg,.png,.webp,.bmp,.gif,' +
  'image/jpeg,image/png,image/webp,image/bmp,image/gif'

const MAX_FILE_SIZE = 20 * 1024 * 1024

const FORMAT_CHIPS = [
  'DOCX','PDF','XLSX','XLS','HTML','TXT','MD',
  'CSV','JSON','XML','JPG','PNG','WEBP','BMP','GIF',
]

type Status = 'pending' | 'converting' | 'done' | 'error'

interface FileEntry {
  id: string
  file: File
  status: Status
  markdown: string
  error: string
  progress: number | null
}

export default function MultiBatch() {
  const t = useT()
  const [entries, setEntries] = useState<FileEntry[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const update = (id: string, patch: Partial<FileEntry>) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e))

  const processFiles = async (files: File[]) => {
    const initial: FileEntry[] = files.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      status: (file.size > MAX_FILE_SIZE ? 'error' : 'pending') as Status,
      markdown: '',
      error: file.size > MAX_FILE_SIZE ? t.errFileTooLarge : '',
      progress: null,
    }))
    setEntries(initial)
    setIsProcessing(true)

    for (const entry of initial) {
      if (entry.status === 'error') continue
      update(entry.id, { status: 'converting' })
      try {
        const markdown = await convertFile(entry.file, pct =>
          update(entry.id, { progress: pct })
        )
        update(entry.id, { status: 'done', markdown, progress: null })
      } catch (err) {
        update(entry.id, {
          status: 'error',
          error: err instanceof Error ? err.message : t.errConvert,
          progress: null,
        })
      }
    }
    setIsProcessing(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length) processFiles(files)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length) processFiles(files)
    e.target.value = ''
  }

  const downloadOne = (entry: FileEntry) => {
    const base = entry.file.name.replace(/\.[^.]+$/, '')
    const blob = new Blob([entry.markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${base}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAll = async () => {
    const done = entries.filter(e => e.status === 'done')
    if (done.length === 0) return
    if (done.length === 1) { downloadOne(done[0]); return }
    const { default: JSZip } = await import('jszip')
    const zip = new JSZip()
    done.forEach(e => {
      zip.file(`${e.file.name.replace(/\.[^.]+$/, '')}.md`, e.markdown)
    })
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'conversiones.zip'
    a.click()
    URL.revokeObjectURL(url)
  }

  const reset = () => { setEntries([]); setIsProcessing(false) }

  const allFinished = entries.length > 0 &&
    entries.every(e => e.status === 'done' || e.status === 'error')
  const successCount = entries.filter(e => e.status === 'done').length

  // ── Drop zone (no files selected yet) ────────────────────────────────────
  if (entries.length === 0) {
    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={t.multiDropTitle}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        className={[
          'cursor-pointer rounded-xl border-2 p-10 text-center transition-all duration-200 select-none',
          isDragOver
            ? 'border-sky-500 bg-sky-950/30'
            : 'border-dashed border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-700',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          multiple
          className="hidden"
          onChange={handleChange}
        />
        <div className="text-4xl mb-3 pointer-events-none">📂</div>
        <p className="text-zinc-200 font-medium pointer-events-none">{t.multiDropTitle}</p>
        <p className="text-zinc-500 text-sm mt-1 pointer-events-none">{t.multiDropSubtitle}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-1.5 pointer-events-none">
          {FORMAT_CHIPS.map(fmt => (
            <span
              key={fmt}
              className="bg-zinc-800 text-zinc-400 border border-zinc-700/60 text-xs font-medium px-2.5 py-0.5 rounded-full"
            >
              {fmt}
            </span>
          ))}
        </div>
      </div>
    )
  }

  // ── File list ─────────────────────────────────────────────────────────────
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <span className="text-xs text-zinc-500 font-medium">
          {entries.length} {t.multiFilesCount} · {successCount} {t.multiDoneCount}
        </span>
        {!isProcessing && (
          <button
            onClick={reset}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {t.multiReset}
          </button>
        )}
      </div>

      {/* Rows */}
      <div className="divide-y divide-zinc-800/60">
        {entries.map(entry => (
          <div key={entry.id} className="flex items-center gap-3 px-4 py-3 flex-wrap sm:flex-nowrap">

            {/* File name */}
            <span className="text-lg flex-shrink-0">📄</span>
            <span className="flex-1 text-sm text-zinc-200 truncate min-w-0 min-w-[120px]">
              {entry.file.name}
            </span>

            {/* Status */}
            <span className="text-xs flex-shrink-0 min-w-[100px] text-right">
              {entry.status === 'pending' && (
                <span className="text-zinc-600">{t.multiStatusPending}</span>
              )}
              {entry.status === 'converting' && (
                <span className="text-sky-400 inline-flex items-center justify-end gap-1.5">
                  <span className="w-3 h-3 border border-sky-400 border-t-transparent rounded-full animate-spin" />
                  {entry.progress !== null
                    ? `OCR ${entry.progress}%`
                    : t.multiStatusConverting}
                </span>
              )}
              {entry.status === 'done' && (
                <span className="text-emerald-400">✅ {t.multiStatusDone}</span>
              )}
              {entry.status === 'error' && (
                <span className="text-red-400 cursor-help" title={entry.error}>
                  ❌ {t.multiStatusError}
                </span>
              )}
            </span>

            {/* Download button — visible once done or error */}
            {(entry.status === 'done' || entry.status === 'error') && (
              <button
                onClick={() => downloadOne(entry)}
                disabled={entry.status === 'error'}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-md font-medium transition-colors duration-150 ${
                  entry.status === 'done'
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700/40'
                }`}
              >
                {t.multiDownload}
              </button>
            )}

          </div>
        ))}
      </div>

      {/* Footer: Download all + Reset */}
      {allFinished && successCount > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800 bg-zinc-900">
          <span className="text-xs text-zinc-600">
            {successCount} / {entries.length} {t.multiSuccessOf}
          </span>
          <button
            onClick={downloadAll}
            className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-md font-medium transition-colors duration-150"
          >
            {successCount === 1 ? t.multiDownload : t.multiDownloadAll}
          </button>
        </div>
      )}

    </div>
  )
}
