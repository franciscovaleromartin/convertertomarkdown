import { Helmet } from 'react-helmet-async'
import { PageShell } from '../components/PageShell'
import { BackButton } from '../components/BackButton'
import { useT } from '../lib/i18n'

interface Props { navigate: (path: string) => void }

const SECTION = { borderRadius: '14px', border: '1px solid #1e293b', background: '#0c111d', padding: '18px 20px', marginBottom: '10px' }
const ICONS = ['🔒', '🖥️', '🍪', '🤝', '🌐', '✉️']

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
    <PageShell navigate={navigate}>
      <Helmet>
        <title>{t.pagePrivacyTitle}</title>
        <meta name="description" content={t.pagePrivacyDesc} />
        <link rel="canonical" href="https://www.convertertomarkdown.com/privacidad" />
        <link rel="alternate" hrefLang="en" href="https://www.convertertomarkdown.com/privacidad" />
        <link rel="alternate" hrefLang="es" href="https://www.convertertomarkdown.com/privacidad" />
        <link rel="alternate" hrefLang="x-default" href="https://www.convertertomarkdown.com/privacidad" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ConverterToMarkdown" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="es_ES" />
        <meta property="og:url" content="https://www.convertertomarkdown.com/privacidad" />
        <meta property="og:title" content={t.pagePrivacyTitle} />
        <meta property="og:description" content={t.pagePrivacyDesc} />
        <meta property="og:image" content="https://www.convertertomarkdown.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={t.pagePrivacyTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.pagePrivacyTitle} />
        <meta name="twitter:description" content={t.pagePrivacyDesc} />
        <meta name="twitter:image" content="https://www.convertertomarkdown.com/og-image.png" />
        <meta name="twitter:image:alt" content={t.pagePrivacyTitle} />
      </Helmet>

      <BackButton navigate={navigate} />

      <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>{t.privPageTitle}</h1>
      <p style={{ fontSize: '12px', color: '#475569', marginBottom: '40px' }}>{t.privUpdated}</p>

      <div style={{ marginBottom: '48px' }}>
        {sections.map((s, i) => (
          <div key={s.title} style={SECTION}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{ICONS[i]}</span>
              <div>
                <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px', lineHeight: 1.35 }}>{s.title}</h2>
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.65 }}>{s.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
