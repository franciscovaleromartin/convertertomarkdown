import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import TurndownService from 'turndown'
import { useT } from '../lib/i18n'

marked.use({ gfm: true, breaks: false })

type ViewMode = 'split' | 'editor'

interface Props {
  markdown: string
  fileName: string
  onClear: () => void
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

const sanitize = (html: string) =>
  typeof window !== 'undefined' ? DOMPurify.sanitize(html) : html

export default function OutputPanel({ markdown, fileName, onClear }: Props) {
  const t = useT()
  const isMobile = useIsMobile()

  const [text, setText] = useState(markdown)
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('editor')
  const [mobileShowPreview, setMobileShowPreview] = useState(false)

  const previewRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Tracks whether the last text change originated from the preview panel.
  // Prevents re-rendering the preview (and losing cursor position) when the
  // user is editing in the contenteditable div.
  const lastEditSource = useRef<'editor' | 'preview'>('editor')

  const turndown = useMemo(
    () => new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' }),
    []
  )

  const renderToPreview = useCallback((md: string) => {
    if (!previewRef.current) return
    const html = sanitize(String(marked.parse(md)))
    previewRef.current.innerHTML = html
  }, [])

  // Debounced sync: textarea → preview
  useEffect(() => {
    if (lastEditSource.current === 'preview') return
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => renderToPreview(text), 150)
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [text, renderToPreview])

  // Immediate render when the preview panel becomes visible
  useEffect(() => {
    renderToPreview(text)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, mobileShowPreview, renderToPreview])

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    lastEditSource.current = 'editor'
    setText(e.target.value)
  }

  // Sync: preview → textarea (on every keystroke inside contenteditable)
  const handlePreviewInput = useCallback(() => {
    if (!previewRef.current) return
    lastEditSource.current = 'preview'
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
      debounceTimer.current = null
    }
    setText(turndown.turndown(previewRef.current.innerHTML))
  }, [turndown])

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

  const { lines, chars } = useMemo(() => ({
    lines: text.split('\n').length,
    chars: text.length,
  }), [text])

  const showSplit = false
  const editorVisible = isMobile ? !mobileShowPreview : viewMode === 'editor'
  const previewVisible = isMobile ? mobileShowPreview : viewMode === 'split'

  return (
    <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800 gap-2 flex-wrap">

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-zinc-500 font-medium shrink-0">
            Output · {chars} chars · {lines} {t.outputLines}
          </span>

          {/* Desktop view-mode segmented control */}
          <div className="hidden sm:flex items-center bg-zinc-800 border border-zinc-700/50 rounded-lg p-1 gap-1">
            <button
              onClick={() => setViewMode('editor')}
              className={`text-xs px-3 py-1 rounded-md font-medium transition-all duration-150 ${
                viewMode === 'editor'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              editor .md
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`text-xs px-3 py-1 rounded-md font-medium transition-all duration-150 ${
                viewMode === 'split'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Preview
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileShowPreview(p => !p)}
            className="sm:hidden text-xs bg-zinc-800 text-zinc-400 hover:text-zinc-200 px-2 py-0.5 rounded transition-colors shrink-0"
          >
            {mobileShowPreview ? '← Editor' : 'Preview →'}
          </button>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="text-xs bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-md transition-colors duration-150 font-medium"
          >
            {copied ? t.outputCopied : t.outputCopy}
          </button>
          <button
            onClick={handleDownload}
            className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-md transition-colors duration-150 font-medium"
          >
            {t.outputDownload}
          </button>
          <button
            onClick={onClear}
            className="text-xs text-zinc-600 hover:text-zinc-300 px-2 py-1.5 transition-colors duration-150"
            aria-label="Clear"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Panels ── */}
      <div className="flex h-[420px]">

        {/* Editor panel */}
        <div
          className={showSplit ? 'w-1/2 border-r border-zinc-800' : 'w-full'}
          style={editorVisible ? undefined : { display: 'none' }}
        >
          <textarea
            value={text}
            onChange={handleTextareaChange}
            className="w-full h-full p-4 font-mono text-sm text-zinc-200 bg-transparent leading-relaxed resize-none overflow-y-auto focus:outline-none"
            spellCheck={false}
          />
        </div>

        {/* Preview panel — always in DOM to keep the ref stable */}
        <div
          className={showSplit ? 'w-1/2' : 'w-full'}
          style={previewVisible ? undefined : { display: 'none' }}
        >
          <div
            ref={previewRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handlePreviewInput}
            className="markdown-preview h-full p-4 text-sm text-zinc-200 overflow-y-auto focus:outline-none cursor-text"
          />
        </div>

      </div>
    </div>
  )
}
