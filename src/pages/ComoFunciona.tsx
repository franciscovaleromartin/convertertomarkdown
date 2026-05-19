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

export function ComoFunciona({ navigate }: Props) {
  const t = useT()

  const steps = [
    { n: '01', icon: '📁', color: '#38bdf8', title: t.howStep1Title, body: t.howStep1Body },
    { n: '02', icon: '⚙️', color: '#c084fc', title: t.howStep2Title, body: t.howStep2Body },
    { n: '03', icon: '✓',  color: '#34d399', title: t.howStep3Title, body: t.howStep3Body },
  ]

  const techRows = [
    { fmt: 'DOCX',     lib: 'mammoth.js',          desc: t.techDocx },
    { fmt: 'PDF',      lib: 'pdf.js',               desc: t.techPdf  },
    { fmt: 'XLSX / XLS', lib: 'SheetJS',            desc: t.techXlsx },
    { fmt: 'HTML',     lib: 'DOMParser + Turndown', desc: t.techHtml },
    { fmt: 'CSV',      lib: 'PapaParse',            desc: t.techCsv  },
    { fmt: 'TXT / MD', lib: 'Native',               desc: t.techTxt  },
    { fmt: 'JSON',     lib: 'Native',               desc: t.techJson },
    { fmt: 'XML',      lib: 'Native',               desc: t.techXml  },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
      <TopBar />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 24px 0' }}>

        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', cursor: 'pointer', marginBottom: '32px', padding: 0, display: 'flex', alignItems: 'center', gap: '6px' }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#94a3b8')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#64748b')}
        >
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
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px', lineHeight: 1.35 }}>
                    {step.icon} {step.title}
                  </p>
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
                <span style={{ fontSize: '10px', color: '#64748b', letterSpacing: '.05em' }}>{row.lib}</span>
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
