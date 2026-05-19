import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'

const GITHUB_REPO = 'franciscovaleromartin/convertertomarkdown'

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

function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
      .then(r => r.json())
      .then(d => { if (typeof d.stargazers_count === 'number') setStars(d.stargazers_count) })
      .catch(() => {})
  }, [])

  const base: CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '0 10px', height: '32px', borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: hovered ? '#f1f5f9' : '#94a3b8',
    textDecoration: 'none', transition: 'color 0.15s, background 0.15s',
    fontSize: '12px', fontWeight: 500,
    ...(hovered ? HOVER_ON : HOVER_OFF),
  }

  return (
    <a
      href={`https://github.com/${GITHUB_REPO}`}
      target="_blank"
      rel="noopener noreferrer"
      title="GitHub"
      style={base}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ color: '#f59e0b' }}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      {stars !== null ? stars : '—'}
    </a>
  )
}

export function TopBar() {
  return (
    <div style={BAR}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src="/logo.png" alt="ConverterToMarkdown" width={24} height={24} style={{ borderRadius: '6px', flexShrink: 0 }} />
        <span style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.02em', color: '#f1f5f9' }}>
          <span style={{ color: '#38bdf8' }}>Converter</span>
          <span style={{ color: '#71717a' }}>To</span>
          <span style={{ color: '#c084fc' }}>Markdown</span>
          <span style={{ color: '#52525b', fontSize: '11px' }}>.com</span>
        </span>
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <GitHubStars />

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
