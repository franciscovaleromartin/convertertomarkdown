import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { useT } from '../lib/i18n'

const CARD: CSSProperties = {
  borderRadius: '14px', border: '1px solid #1e293b',
  background: '#0c111d', padding: '18px 20px', position: 'relative', overflow: 'hidden',
}

const GLOW: CSSProperties = {
  position: 'absolute', top: '-30px', right: '-30px',
  borderRadius: '50%', pointerEvents: 'none',
}

const ICON_BOX: CSSProperties = {
  width: '32px', height: '32px', borderRadius: '9px', display: 'flex',
  alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginBottom: '12px',
}

const TAG: CSSProperties = {
  display: 'inline-flex', fontSize: '9px', fontWeight: 700, letterSpacing: '.1em',
  textTransform: 'uppercase', padding: '3px 9px', borderRadius: '6px', marginBottom: '8px',
}

export function LandingCards() {
  const t = useT()

  const formats = useMemo(() => [
    { icon: '📝', name: 'DOCX', desc: t.fmtDocxDesc },
    { icon: '📄', name: 'PDF', desc: t.fmtPdfDesc },
    { icon: '📊', name: 'XLSX / XLS', desc: t.fmtXlsxDesc },
    { icon: '🌐', name: 'HTML', desc: t.fmtHtmlDesc },
    { icon: '📋', name: 'TXT / MD', desc: t.fmtTxtDesc },
    { icon: '📈', name: 'CSV', desc: t.fmtCsvDesc },
    { icon: '🔧', name: 'JSON', desc: t.fmtJsonDesc },
    { icon: '🏷️', name: 'XML', desc: t.fmtXmlDesc },
    { icon: '🖼️', name: 'JPG / PNG / WEBP / BMP / GIF', desc: t.fmtImgDesc },
  ], [t])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>

      {/* ── Featured: formatos ── */}
      <div style={{ borderRadius: '16px', border: '1px solid #1e293b', background: '#0c111d', overflow: 'hidden' }}>
        <div style={{ padding: '22px' }}>
          <span style={{ ...TAG, background: 'rgba(56,189,248,.08)', color: '#38bdf8', border: '1px solid rgba(56,189,248,.18)' }}>
            {t.cardsFormatsTag}
          </span>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px', lineHeight: 1.35 }}>
            {t.cardsFormatsTitle}
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px', lineHeight: 1.5 }}>
            {t.cardsFormatsSub}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {formats.map(f => (
              <div key={f.name} style={{
                display: 'flex', alignItems: 'flex-start', gap: '9px',
                padding: '11px 13px', borderRadius: '11px',
                background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.055)',
              }}>
                <span style={{ fontSize: '15px', flexShrink: 0, marginTop: '1px' }}>{f.icon}</span>
                <div>
                  <h3 style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8f0', marginBottom: '3px', lineHeight: 1.2 }}>{f.name}</h3>
                  <p style={{ fontSize: '10px', color: '#94a3b8', lineHeight: 1.4 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Privacidad (full width) ── */}
      <div style={CARD}>
        <div style={{ ...GLOW, width: '110px', height: '110px', background: 'radial-gradient(circle, rgba(45,212,191,.13) 0%, transparent 70%)' }} />
        <div style={{ ...ICON_BOX, background: 'rgba(45,212,191,.1)', border: '1px solid rgba(45,212,191,.2)' }}>🔒</div>
        <span style={{ ...TAG, background: 'rgba(45,212,191,.08)', color: '#2dd4bf', border: '1px solid rgba(45,212,191,.18)' }}>
          {t.cardsPrivacyTag}
        </span>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px', lineHeight: 1.35 }}>
          {t.cardsPrivacyTitle}
        </h2>
        <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.6 }}>
          {t.cardsPrivacyBody}
        </p>
      </div>

      {/* ── Par: edición + URL ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={CARD}>
          <div style={{ ...GLOW, width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(167,139,250,.14) 0%, transparent 70%)' }} />
          <div style={{ ...ICON_BOX, background: 'rgba(167,139,250,.1)', border: '1px solid rgba(167,139,250,.2)' }}>✎</div>
          <span style={{ ...TAG, background: 'rgba(167,139,250,.08)', color: '#c4b5fd', border: '1px solid rgba(196,181,253,.18)' }}>
            {t.cardsEditTag}
          </span>
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px', lineHeight: 1.35 }}>
            {t.cardsEditTitle}
          </h2>
          <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.6 }}>
            {t.cardsEditBody}
          </p>
        </div>

        <div style={CARD}>
          <div style={{ ...GLOW, width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(56,189,248,.12) 0%, transparent 70%)' }} />
          <div style={{ ...ICON_BOX, background: 'rgba(56,189,248,.1)', border: '1px solid rgba(56,189,248,.2)' }}>🔗</div>
          <span style={{ ...TAG, background: 'rgba(56,189,248,.08)', color: '#38bdf8', border: '1px solid rgba(56,189,248,.18)' }}>
            {t.cardsUrlTag}
          </span>
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px', lineHeight: 1.35 }}>
            {t.cardsUrlTitle}
          </h2>
          <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.6 }}>
            {t.cardsUrlBody}
          </p>
        </div>
      </div>

      {/* ── MCP (full width) ── */}
      <div style={{ ...CARD, display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
        <div style={{ ...GLOW, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(251,146,60,.12) 0%, transparent 70%)' }} />
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
          <div style={{ ...ICON_BOX, background: 'rgba(251,146,60,.1)', border: '1px solid rgba(251,146,60,.2)', flexShrink: 0 }}>⚡</div>
          <div style={{ minWidth: 0 }}>
            <span style={{ ...TAG, background: 'rgba(251,146,60,.08)', color: '#fb923c', border: '1px solid rgba(251,146,60,.2)' }}>
              {t.cardsMcpTag}
            </span>
            <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px', lineHeight: 1.35 }}>
              {t.cardsMcpTitle}
            </h2>
            <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              {t.cardsMcpBody.split('npx convertertomarkdown-mcp').map((part, i, arr) => (
                i < arr.length - 1
                  ? <span key={i}>{part}<code style={{ fontFamily: 'monospace', fontSize: '10px', background: 'rgba(251,146,60,.1)', color: '#fb923c', padding: '1px 5px', borderRadius: '4px' }}>npx convertertomarkdown-mcp</code></span>
                  : <span key={i}>{part}</span>
              ))}
            </p>
          </div>
        </div>
        <a
          href="https://github.com/franciscovaleromartin/convertertomarkdown-mcp"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flexShrink: 0,
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '11px', fontWeight: 600, color: '#fb923c',
            padding: '7px 13px', borderRadius: '8px',
            background: 'rgba(251,146,60,.08)', border: '1px solid rgba(251,146,60,.2)',
            textDecoration: 'none', whiteSpace: 'nowrap',
            transition: 'background .15s',
          }}
        >
          {t.cardsMcpLink} →
        </a>
      </div>

    </div>
  )
}
