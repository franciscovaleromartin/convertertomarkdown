import { useT } from '../lib/i18n'

interface Props {
  navigate: (path: string) => void
}

const Dot = () => <span style={{ color: '#334155', userSelect: 'none' }}>·</span>

export function LandingFooter({ navigate }: Props) {
  const t = useT()

  const link = (path: string, label: string) => (
    <a
      href={path}
      onClick={e => { e.preventDefault(); navigate(path) }}
      style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.15s' }}
      onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8')}
      onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#64748b')}
    >
      {label}
    </a>
  )

  return (
    <footer style={{
      width: '100%', borderTop: '1px solid rgba(255,255,255,0.06)',
      marginTop: '48px', paddingTop: '32px', paddingBottom: '32px',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '12px' }}>
          {link('/como-funciona', t.footerHow)}
          <Dot />
          {link('/casos-de-uso', t.footerUseCases)}
          <Dot />
          {link('/privacidad', t.footerPrivacy)}
          <Dot />
          {link('/licencia', t.footerLicense)}
          <Dot />
          <a
            href="https://github.com/franciscovaleromartin/convertertomarkdown"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8')}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#64748b')}
          >
            GitHub
          </a>
        </div>
        <p style={{ fontSize: '11px', color: '#334155' }}>© 2026 Francisco Valero</p>
      </div>
    </footer>
  )
}
