import { Helmet } from 'react-helmet-async'
import { TopBar } from '../components/TopBar'
import { LandingFooter } from '../components/LandingFooter'
import { useT } from '../lib/i18n'

interface Props { navigate: (path: string) => void }

const SECTION = { borderRadius: '14px', border: '1px solid #1e293b', background: '#0c111d', padding: '18px 20px', marginBottom: '10px' }
const ICONS = ['🔒', '🖥️', '🍪', '🤝', '🌐', '✉️']
const BACK_BTN = {
  background: 'none', border: 'none', color: '#64748b', fontSize: '13px',
  cursor: 'pointer', marginBottom: '32px', padding: 0,
  display: 'flex', alignItems: 'center', gap: '6px',
}

export function Privacidad({ navigate }: Props) {
  const t = useT()

  const sections = [
    { title: t.priv1Title, body: t.priv1Body },
    { title: t.priv2Title, body: t.priv2Body },
    { title: t.priv3Title, body: t.priv3Body },
    { title: t.priv4Title, body: t.priv4Body },
    { title: t.priv5Title, body: t.priv5Body },
    { title: t.priv6Title, body: t.priv6Body },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
      <Helmet>
        <title>{t.pagePrivacyTitle}</title>
        <meta name="description" content={t.pagePrivacyDesc} />
        <link rel="canonical" href="https://www.convertertomarkdown.com/privacidad" />
        <meta property="og:url" content="https://www.convertertomarkdown.com/privacidad" />
        <meta property="og:title" content={t.pagePrivacyTitle} />
        <meta property="og:description" content={t.pagePrivacyDesc} />
      </Helmet>

      <TopBar />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 24px 0' }}>

        <button style={BACK_BTN} onClick={() => navigate('/')}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#94a3b8')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#64748b')}>
          {t.back}
        </button>

        <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>{t.privPageTitle}</h1>
        <p style={{ fontSize: '12px', color: '#475569', marginBottom: '40px' }}>{t.privUpdated}</p>

        <div style={{ marginBottom: '48px' }}>
          {sections.map((s, i) => (
            <div key={s.title} style={SECTION}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{ICONS[i]}</span>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px', lineHeight: 1.35 }}>{s.title}</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.65 }}>{s.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
      <LandingFooter navigate={navigate} />
    </div>
  )
}
