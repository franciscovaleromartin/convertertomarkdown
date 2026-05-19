import { Helmet } from 'react-helmet-async'
import { TopBar } from '../components/TopBar'
import { LandingFooter } from '../components/LandingFooter'
import { useT } from '../lib/i18n'

interface Props { navigate: (path: string) => void }

const ACCENT = [
  { color: '#38bdf8', bg: 'rgba(56,189,248,.08)',   border: 'rgba(56,189,248,.18)'  },
  { color: '#c084fc', bg: 'rgba(192,132,252,.08)',  border: 'rgba(192,132,252,.18)' },
  { color: '#34d399', bg: 'rgba(52,211,153,.08)',   border: 'rgba(52,211,153,.18)'  },
  { color: '#f59e0b', bg: 'rgba(245,158,11,.08)',   border: 'rgba(245,158,11,.18)'  },
  { color: '#a78bfa', bg: 'rgba(167,139,250,.08)',  border: 'rgba(167,139,250,.18)' },
  { color: '#2dd4bf', bg: 'rgba(45,212,191,.08)',   border: 'rgba(45,212,191,.18)'  },
]

const ICONS = ['👩‍💻', '✍️', '🎓', '📊', '🏢', '🤖']
const FORMATS = [
  ['DOCX', 'PDF', 'HTML'],
  ['DOCX', 'HTML'],
  ['PDF', 'DOCX', 'TXT'],
  ['CSV', 'XLSX', 'XLS'],
  ['DOCX', 'PDF', 'XLSX', 'HTML'],
  ['PDF', 'DOCX', 'HTML', 'CSV'],
]

const BACK_BTN = {
  background: 'none', border: 'none', color: '#64748b', fontSize: '13px',
  cursor: 'pointer', marginBottom: '32px', padding: 0,
  display: 'flex', alignItems: 'center', gap: '6px',
}

export function CasosDeUso({ navigate }: Props) {
  const t = useT()

  const cases = [
    { title: t.uc1Title, tag: t.uc1Tag, body: t.uc1Body },
    { title: t.uc2Title, tag: t.uc2Tag, body: t.uc2Body },
    { title: t.uc3Title, tag: t.uc3Tag, body: t.uc3Body },
    { title: t.uc4Title, tag: t.uc4Tag, body: t.uc4Body },
    { title: t.uc5Title, tag: t.uc5Tag, body: t.uc5Body },
    { title: t.uc6Title, tag: t.uc6Tag, body: t.uc6Body },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
      <Helmet>
        <title>{t.pageUsecasesTitle}</title>
        <meta name="description" content={t.pageUsecasesDesc} />
        <link rel="canonical" href="https://www.convertertomarkdown.com/casos-de-uso" />
        <meta property="og:url" content="https://www.convertertomarkdown.com/casos-de-uso" />
        <meta property="og:title" content={t.pageUsecasesTitle} />
        <meta property="og:description" content={t.pageUsecasesDesc} />
      </Helmet>

      <TopBar />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 24px 0' }}>

        <button style={BACK_BTN} onClick={() => navigate('/')}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#94a3b8')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#64748b')}>
          {t.back}
        </button>

        <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>
          {t.usecasesTitle}
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '40px', lineHeight: 1.6 }}>
          {t.usecasesSubtitle}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '48px' }}>
          {cases.map((c, i) => {
            const a = ACCENT[i]
            return (
              <div key={c.title} style={{ borderRadius: '14px', border: '1px solid #1e293b', background: '#0c111d', padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: `radial-gradient(circle, ${a.color}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <span style={{ fontSize: '22px', flexShrink: 0, marginTop: '2px' }}>{ICONS[i]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.2, margin: 0 }}>{c.title}</p>
                      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' as const, padding: '2px 7px', borderRadius: '5px', background: a.bg, color: a.color, border: `1px solid ${a.border}` }}>
                        {c.tag}
                      </span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.65, marginBottom: '10px' }}>{c.body}</p>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' as const }}>
                      {FORMATS[i].map(f => (
                        <span key={f} style={{ fontSize: '10px', color: '#64748b', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', padding: '2px 8px', borderRadius: '5px' }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
      <LandingFooter navigate={navigate} />
    </div>
  )
}
