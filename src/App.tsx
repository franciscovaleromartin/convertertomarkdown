import { useState, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { useT, detectLang } from './lib/i18n'
import { TopBar } from './components/TopBar'
import { LandingCards } from './components/LandingCards'
import { LandingFooter } from './components/LandingFooter'
import DropZone from './components/DropZone'
import UrlInput from './components/UrlInput'
import MultiBatch from './components/MultiBatch'
import FileInfo from './components/FileInfo'
import OutputPanel from './components/OutputPanel'
import { ComoFunciona } from './pages/ComoFunciona'
import { CasosDeUso } from './pages/CasosDeUso'
import { Privacidad } from './pages/Privacidad'
import { Licencia } from './pages/Licencia'
import { convertFile } from './converters'
import { MAX_FILE_SIZE } from './lib/constants'

type InputMode = 'file' | 'url' | 'multi'

// ── Router mínimo, compatible con SSR ────────────────────────────────────────

function useRouter(ssrPath?: string) {
  const [path, setPath] = useState(() => {
    if (ssrPath) return ssrPath
    if (typeof window === 'undefined') return '/'
    return window.location.pathname
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handler = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  const navigate = (to: string) => {
    if (typeof window === 'undefined') return
    window.history.pushState({}, '', to)
    setPath(to)
    window.scrollTo(0, 0)
  }

  return { path, navigate }
}

// ── App ──────────────────────────────────────────────────────────────────────

export default function App({ ssrPath }: { ssrPath?: string } = {}) {
  const { path, navigate } = useRouter(ssrPath)

  if (path === '/como-funciona') return <ComoFunciona navigate={navigate} />
  if (path === '/casos-de-uso')  return <CasosDeUso navigate={navigate} />
  if (path === '/privacidad')    return <Privacidad navigate={navigate} />
  if (path === '/licencia')      return <Licencia navigate={navigate} />

  return <HomePage navigate={navigate} />
}

// ── HomePage ─────────────────────────────────────────────────────────────────

function HomePage({ navigate }: { navigate: (p: string) => void }) {
  const t = useT()
  const [inputMode, setInputMode] = useState<InputMode>('file')
  const [file, setFile] = useState<File | null>(null)
  const [markdown, setMarkdown] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [ocrProgress, setOcrProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const processFile = async (f: File) => {
    if (f.size > MAX_FILE_SIZE) { setError(t.errFileTooLarge); return }
    setFile(f); setError(null); setMarkdown(''); setIsLoading(true); setOcrProgress(null)
    try {
      setMarkdown(await convertFile(f, (pct) => setOcrProgress(pct)))
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errConvert)
    } finally {
      setIsLoading(false)
      setOcrProgress(null)
    }
  }

  const handleUrl = async (url: string) => {
    setError(null); setMarkdown(''); setIsLoading(true)
    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`
      const response = await fetch(proxyUrl)
      if (!response.ok) throw new Error(`${t.errUrl}: ${response.statusText}`)
      const blob = await response.blob()

      const rawName = new URL(url).pathname.split('/').pop() || 'document'
      const hasExt = rawName.includes('.')
      const name = hasExt ? rawName : rawName + mimeToExt(response.headers.get('content-type') ?? blob.type)

      await processFile(new File([blob], name, { type: blob.type || 'text/html' }))
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errUrl)
      setIsLoading(false)
    }
  }

  const handleClear = () => { setFile(null); setMarkdown(''); setError(null); setIsLoading(false) }

  return (
    <div className="min-h-screen bg-[#09090b] font-inter text-white">
      <Helmet>
        <title>{t.pageHomeTitle}</title>
        <meta name="description" content={t.pageHomeDesc} />
        <link rel="canonical" href="https://www.convertertomarkdown.com" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.convertertomarkdown.com" />
        <meta property="og:title" content={t.pageHomeTitle} />
        <meta property="og:description" content={t.pageHomeDesc} />
        <meta property="og:image" content="https://www.convertertomarkdown.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={t.pageHomeTitle} />
        <meta property="og:video" content={`https://www.convertertomarkdown.com${detectLang() === 'en' ? '/demo_eng.mp4' : '/demo.mp4'}`} />
        <meta property="og:video:secure_url" content={`https://www.convertertomarkdown.com${detectLang() === 'en' ? '/demo_eng.mp4' : '/demo.mp4'}`} />
        <meta property="og:video:type" content="video/mp4" />
        <meta property="og:video:width" content="1920" />
        <meta property="og:video:height" content="1080" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.pageHomeTitle} />
        <meta name="twitter:description" content={t.pageHomeDesc} />
        <meta name="twitter:image" content="https://www.convertertomarkdown.com/og-image.png" />
        <meta name="twitter:image:alt" content={t.pageHomeTitle} />
      </Helmet>

      <TopBar />

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-8">

        {/* ── Hero ── */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight leading-tight">
            <span className="text-sky-400">Converter</span>
            <span className="text-zinc-500">To</span>
            <span className="text-purple-400">Markdown</span>
            <span className="text-zinc-600 text-sm font-normal">.com</span>
          </h1>
          <p className="text-zinc-600 text-xs mt-2.5 tracking-widest uppercase font-medium">
            {t.heroBy}
          </p>
          <p className="text-zinc-300 text-sm mt-5 leading-relaxed">{t.heroTagline}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <span className="flex items-center gap-1.5 bg-emerald-900/30 border border-emerald-700/40 rounded-full px-4 py-1 text-xs font-medium text-emerald-400">Free</span>
            <span className="flex items-center gap-1.5 bg-sky-900/30 border border-sky-700/40 rounded-full px-4 py-1 text-xs font-medium text-sky-400">Open Source</span>
            <span className="flex items-center gap-1.5 bg-purple-900/30 border border-purple-700/40 rounded-full px-4 py-1 text-xs font-medium text-purple-400">OCR</span>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <StatPill value="15" label={t.statFormats} />
            <StatPill value="20 MB" label={t.statMax} />
            <StatPill value="0" label={t.statServers} />
            <StatPill label={t.statEdit} />
          </div>
        </header>

        {/* ── Demo video ── */}
        <div className="mb-8">
          <video
            src={detectLang() === 'en' ? '/demo_eng.mp4' : '/demo.mp4'}
            controls
            playsInline
            preload="none"
            poster="/video-poster.jpg"
            width={1920}
            height={1080}
            style={{ aspectRatio: '16/9' }}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900"
          />
        </div>

        {/* ── Selector modo ── */}
        {!file && (
          <div className="flex mb-5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-full gap-1">
            <ModeTab active={inputMode === 'file'}  onClick={() => setInputMode('file')}>{t.tabFile}</ModeTab>
            <ModeTab active={inputMode === 'url'}   onClick={() => setInputMode('url')}>{t.tabUrl}</ModeTab>
            <ModeTab active={inputMode === 'multi'} onClick={() => setInputMode('multi')}>{t.tabMulti}</ModeTab>
          </div>
        )}

        {/* ── Input ── */}
        {file ? (
          <FileInfo file={file} isLoading={isLoading} ocrProgress={ocrProgress} onClear={handleClear} />
        ) : inputMode === 'file' ? (
          <DropZone onFile={processFile} />
        ) : inputMode === 'url' ? (
          <UrlInput onUrl={handleUrl} isLoading={isLoading} />
        ) : (
          <MultiBatch />
        )}

        {/* ── Error ── */}
        {inputMode !== 'multi' && error && (
          <div className="mt-4 flex items-start gap-2 text-red-400 text-sm bg-red-950/40 border border-red-900/50 rounded-xl p-3.5">
            <span className="flex-shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* ── Output ── */}
        {inputMode !== 'multi' && markdown && !isLoading && (
          <OutputPanel markdown={markdown} fileName={file?.name ?? 'output'} onClear={handleClear} />
        )}

        {/* ── Tarjetas informativas ── */}
        <LandingCards />

        {/* ── FAQ ── */}
        <FaqSection />

        {/* ── Autor ── */}
        <AuthorSection />

        {/* ── Badge privacidad ── */}
        <p className="mt-8 text-center text-xs text-zinc-600">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 align-middle mr-1.5" />
          {t.privacyBadge}
        </p>

      </div>

      <LandingFooter navigate={navigate} />
    </div>
  )
}

// ── FAQ Section ───────────────────────────────────────────────────────────────

function FaqSection() {
  const t = useT()
  const faqs = useMemo(() => [
    { q: t.faqQ10, a: t.faqA10 },
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 },
    { q: t.faqQ5, a: t.faqA5 },
    { q: t.faqQ6, a: t.faqA6 },
    { q: t.faqQ7, a: t.faqA7 },
    { q: t.faqQ8, a: t.faqA8 },
    { q: t.faqQ9, a: t.faqA9 },
  ], [t])

  return (
    <div style={{ marginTop: '32px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#f1f5f9', marginBottom: '12px', letterSpacing: '-0.01em' }}>
        {t.faqTitle}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {faqs.map((faq) => (
          <div key={faq.q} style={{
            borderRadius: '12px', border: '1px solid #1e293b',
            background: '#0c111d', padding: '14px 18px',
          }}>
            <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0', lineHeight: 1.4, margin: '0 0 6px' }}>
              {faq.q}
            </h3>
            <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Author Section ────────────────────────────────────────────────────────────

function AuthorSection() {
  const t = useT()
  return (
    <div style={{
      borderRadius: '14px', border: '1px solid #1e293b',
      background: '#0c111d', padding: '18px 20px', marginTop: '10px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: '10px' }}>
        {t.authorTitle}
      </p>
      <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '8px' }}>
        {t.authorName}
      </h2>
      <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.65, marginBottom: '12px' }}>
        {t.authorBio}{' '}
        <a href="https://graphmycode.com" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>
          {t.authorOtherProject}
        </a>.
      </p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { href: 'https://www.linkedin.com/in/francisco-valero/', label: 'LinkedIn' },
        ].map(({ href, label }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '11px', color: '#64748b', textDecoration: 'none', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', padding: '3px 10px', borderRadius: '6px' }}>
            {label}
          </a>
        ))}
      </div>
      <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.65, marginTop: '12px' }}>
        {t.authorStar}{' '}
        <a href="https://github.com/franciscovaleromartin/convertertomarkdown" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>
          {t.authorStarLink}
        </a>
        {' '}{t.authorStarSuffix}
      </p>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function mimeToExt(contentType: string): string {
  const mime = contentType.split(';')[0].trim().toLowerCase()
  const map: Record<string, string> = {
    'text/html':                                                        '.html',
    'application/xhtml+xml':                                            '.html',
    'application/pdf':                                                  '.pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':       '.xlsx',
    'application/vnd.ms-excel':                                         '.xls',
    'text/plain':                                                        '.txt',
    'text/markdown':                                                     '.md',
    'text/csv':                                                          '.csv',
    'application/json':                                                  '.json',
    'text/xml':                                                          '.xml',
    'application/xml':                                                   '.xml',
  }
  return map[mime] ?? '.html'
}

// ── Pequeños componentes ──────────────────────────────────────────────────────

function StatPill({ value, label }: { value?: string; label: string }) {
  return (
    <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 text-xs">
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
        'flex-1 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 text-center',
        active ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
