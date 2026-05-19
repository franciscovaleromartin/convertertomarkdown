import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { useT } from './lib/i18n'
import { TopBar } from './components/TopBar'
import { LandingCards } from './components/LandingCards'
import { LandingFooter } from './components/LandingFooter'
import DropZone from './components/DropZone'
import UrlInput from './components/UrlInput'
import FileInfo from './components/FileInfo'
import OutputPanel from './components/OutputPanel'
import { ComoFunciona } from './pages/ComoFunciona'
import { CasosDeUso } from './pages/CasosDeUso'
import { Privacidad } from './pages/Privacidad'
import { Licencia } from './pages/Licencia'
import { convertFile } from './converters'

const MAX_FILE_SIZE = 20 * 1024 * 1024

type InputMode = 'file' | 'url'

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
  const [error, setError] = useState<string | null>(null)

  const processFile = async (f: File) => {
    if (f.size > MAX_FILE_SIZE) { setError(t.errFileTooLarge); return }
    setFile(f); setError(null); setMarkdown(''); setIsLoading(true)
    try {
      setMarkdown(await convertFile(f))
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errConvert)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUrl = async (url: string) => {
    setError(null); setMarkdown(''); setIsLoading(true)
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`${t.errUrl}: ${response.statusText}`)
      const blob = await response.blob()
      const name = new URL(url).pathname.split('/').pop() || 'document.html'
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
        <link rel="canonical" href="https://convertertomarkdown.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://convertertomarkdown.vercel.app" />
        <meta property="og:title" content={t.pageHomeTitle} />
        <meta property="og:description" content={t.pageHomeDesc} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={t.pageHomeTitle} />
        <meta name="twitter:description" content={t.pageHomeDesc} />
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
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <StatPill value="10" label={t.statFormats} />
            <StatPill value="20 MB" label={t.statMax} />
            <StatPill value="0" label={t.statServers} />
            <StatPill label={t.statEdit} />
          </div>
        </header>

        {/* ── Selector modo ── */}
        {!file && (
          <div className="flex mb-5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit mx-auto gap-1">
            <ModeTab active={inputMode === 'file'} onClick={() => setInputMode('file')}>{t.tabFile}</ModeTab>
            <ModeTab active={inputMode === 'url'}  onClick={() => setInputMode('url')}>{t.tabUrl}</ModeTab>
          </div>
        )}

        {/* ── Input ── */}
        {file ? (
          <FileInfo file={file} isLoading={isLoading} onClear={handleClear} />
        ) : inputMode === 'file' ? (
          <DropZone onFile={processFile} />
        ) : (
          <UrlInput onUrl={handleUrl} isLoading={isLoading} />
        )}

        {/* ── Error ── */}
        {error && (
          <div className="mt-4 flex items-start gap-2 text-red-400 text-sm bg-red-950/40 border border-red-900/50 rounded-xl p-3.5">
            <span className="flex-shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* ── Output ── */}
        {markdown && !isLoading && (
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
  const faqs = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 },
    { q: t.faqQ5, a: t.faqA5 },
  ]

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
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px', lineHeight: 1.4, margin: '0 0 6px' }}>
              {faq.q}
            </p>
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
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '8px' }}>
        {t.authorName}
      </p>
      <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.65, marginBottom: '12px' }}>
        {t.authorBio}{' '}
        <a href="https://graphmycode.com" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>
          {t.authorOtherProject}
        </a>.
      </p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { href: 'https://francisco-valero.com', label: 'Portfolio' },
          { href: 'https://www.linkedin.com/in/francisco-valero/', label: 'LinkedIn' },
        ].map(({ href, label }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '11px', color: '#64748b', textDecoration: 'none', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', padding: '3px 10px', borderRadius: '6px' }}>
            {label}
          </a>
        ))}
      </div>
    </div>
  )
}

// ── Pequeños componentes ──────────────────────────────────────────────────────

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
        active ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
