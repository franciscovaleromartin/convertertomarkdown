import { Helmet } from 'react-helmet-async'
import { TopBar } from '../components/TopBar'
import { LandingFooter } from '../components/LandingFooter'
import { useT } from '../lib/i18n'

interface Props { navigate: (path: string) => void }

const STEP_CARD = {
  borderRadius: '14px', border: '1px solid #1e293b',
  background: '#0c111d', padding: '20px 22px', position: 'relative' as const, overflow: 'hidden' as const,
}

const TECH_ROW = {
  display: 'flex', alignItems: 'flex-start', gap: '12px',
  padding: '12px 14px', borderRadius: '10px',
  background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.055)',
  marginBottom: '8px',
}

const BACK_BTN = {
  background: 'none', border: 'none', color: '#64748b', fontSize: '13px',
  cursor: 'pointer', marginBottom: '32px', padding: 0,
  display: 'flex', alignItems: 'center', gap: '6px',
}

export function ComoFunciona({ navigate }: Props) {
  const t = useT()

  const steps = [
    { n: '01', icon: '📁', color: '#38bdf8', title: t.howStep1Title, body: t.howStep1Body },
    { n: '02', icon: '⚙️', color: '#c084fc', title: t.howStep2Title, body: t.howStep2Body },
    { n: '03', icon: '✓',  color: '#34d399', title: t.howStep3Title, body: t.howStep3Body },
  ]

  const techRows = [
    { fmt: 'DOCX',      lib: 'mammoth.js',          href: 'https://github.com/mwilliamson/mammoth.js',    desc: t.techDocx },
    { fmt: 'PDF',       lib: 'pdf.js',               href: 'https://mozilla.github.io/pdf.js/',             desc: t.techPdf  },
    { fmt: 'XLSX / XLS',lib: 'SheetJS',              href: 'https://sheetjs.com',                           desc: t.techXlsx },
    { fmt: 'HTML',      lib: 'DOMParser + Turndown', href: 'https://github.com/mixmark-io/turndown',        desc: t.techHtml },
    { fmt: 'CSV',       lib: 'PapaParse',             href: 'https://www.papaparse.com',                    desc: t.techCsv  },
    { fmt: 'TXT / MD',  lib: 'Native',               href: null,                                            desc: t.techTxt  },
    { fmt: 'JSON',      lib: 'Native',               href: null,                                            desc: t.techJson },
    { fmt: 'XML',       lib: 'Native',               href: null,                                            desc: t.techXml  },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
      <Helmet>
        <title>{t.pageHowTitle}</title>
        <meta name="description" content={t.pageHowDesc} />
        <link rel="canonical" href="https://convertertomarkdown.com/como-funciona" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://convertertomarkdown.com/como-funciona" />
        <meta property="og:title" content={t.pageHowTitle} />
        <meta property="og:description" content={t.pageHowDesc} />
        <meta property="og:image" content="https://convertertomarkdown.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={t.pageHowTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.pageHowTitle} />
        <meta name="twitter:description" content={t.pageHowDesc} />
        <meta name="twitter:image" content="https://convertertomarkdown.com/og-image.png" />
        <meta name="twitter:image:alt" content={t.pageHowTitle} />
      </Helmet>

      <TopBar />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 24px 0' }}>

        <button style={BACK_BTN} onClick={() => navigate('/')}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#94a3b8')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#64748b')}>
          {t.back}
        </button>

        <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>
          {t.howTitle}
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '40px', lineHeight: 1.6 }}>
          {t.howSubtitle}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '48px' }}>
          {steps.map(step => (
            <div key={step.n} style={STEP_CARD}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: `radial-gradient(circle, ${step.color}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: step.color, letterSpacing: '.1em', minWidth: '24px', paddingTop: '3px' }}>{step.n}</span>
                <div>
                  <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px', lineHeight: 1.35 }}>
                    {step.icon} {step.title}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.65 }}>{step.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#f1f5f9', marginBottom: '16px' }}>
          {t.howTechTitle}
        </h2>
        <div style={{ marginBottom: '48px' }}>
          {techRows.map(row => (
            <div key={row.fmt} style={TECH_ROW}>
              <code style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', minWidth: '90px', flexShrink: 0, paddingTop: '1px' }}>{row.fmt}</code>
              <div>
                {row.href ? (
                  <a href={row.href} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '10px', color: '#38bdf8', letterSpacing: '.05em', textDecoration: 'none', opacity: 0.7 }}>
                    {row.lib} ↗
                  </a>
                ) : (
                  <span style={{ fontSize: '10px', color: '#64748b', letterSpacing: '.05em' }}>{row.lib}</span>
                )}
                <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.5, marginTop: '2px' }}>{row.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
      <LandingFooter navigate={navigate} />
    </div>
  )
}
