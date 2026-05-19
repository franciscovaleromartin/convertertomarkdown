import { useState } from 'react'
import type { CSSProperties } from 'react'

const BAR: CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '10px 24px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  background: 'rgba(9,9,11,0.85)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
}

const ICON_BTN: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '32px', height: '32px', borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.04)',
  color: '#94a3b8', textDecoration: 'none', transition: 'color 0.15s, background 0.15s',
}

const HOVER_ON: CSSProperties = { color: '#f1f5f9', background: 'rgba(255,255,255,0.08)' }
const HOVER_OFF: CSSProperties = { color: '#94a3b8', background: 'rgba(255,255,255,0.04)' }

function IconLink({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      style={{ ...ICON_BTN, ...(hovered ? HOVER_ON : HOVER_OFF) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  )
}

export function TopBar() {
  return (
    <div style={BAR}>
      <span style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.02em', color: '#f1f5f9' }}>
        <span style={{ color: '#38bdf8' }}>Converter</span>
        <span style={{ color: '#71717a' }}>To</span>
        <span style={{ color: '#c084fc' }}>Markdown</span>
        <span style={{ color: '#52525b', fontSize: '11px' }}>.com</span>
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <IconLink href="https://francisco-valero.com" title="Portfolio">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </IconLink>

        <IconLink href="https://www.linkedin.com/in/francisco-valero/" title="LinkedIn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
          </svg>
        </IconLink>
      </div>
    </div>
  )
}
