import type { CSSProperties } from 'react'

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

const FORMATS = [
  { icon: '📝', name: 'DOCX', desc: 'Documentos Word' },
  { icon: '📄', name: 'PDF', desc: 'PDFs con texto extraíble' },
  { icon: '📊', name: 'XLSX / XLS', desc: 'Hojas de cálculo Excel' },
  { icon: '🌐', name: 'HTML', desc: 'Páginas y fragmentos web' },
  { icon: '📋', name: 'TXT / MD', desc: 'Texto plano y Markdown' },
  { icon: '📈', name: 'CSV', desc: 'Tablas y formularios' },
  { icon: '🔧', name: 'JSON', desc: 'Datos JSON formateados' },
  { icon: '🏷️', name: 'XML', desc: 'Datos XML formateados' },
]

export function LandingCards() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>

      {/* ── Featured: formatos ── */}
      <div style={{ borderRadius: '16px', border: '1px solid #1e293b', background: '#0c111d', overflow: 'hidden' }}>
        <div style={{ padding: '22px' }}>
          <span style={{ ...TAG, background: 'rgba(56,189,248,.08)', color: '#38bdf8', border: '1px solid rgba(56,189,248,.18)' }}>
            Formatos
          </span>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px', lineHeight: 1.35 }}>
            10 tipos de archivo compatibles
          </p>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px', lineHeight: 1.5 }}>
            Documentos, hojas de cálculo, páginas web y datos estructurados.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {FORMATS.map(f => (
              <div key={f.name} style={{
                display: 'flex', alignItems: 'flex-start', gap: '9px',
                padding: '11px 13px', borderRadius: '11px',
                background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.055)',
              }}>
                <span style={{ fontSize: '15px', flexShrink: 0, marginTop: '1px' }}>{f.icon}</span>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8f0', marginBottom: '3px', lineHeight: 1.2 }}>
                    {f.name}
                  </p>
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
          Privacidad
        </span>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px', lineHeight: 1.35 }}>
          Tu archivo nunca sale del navegador
        </p>
        <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.6 }}>
          Sin uploads, sin servidores, sin datos enviados a terceros.
          Todo el procesamiento ocurre localmente usando las APIs de tu navegador.
          Funciona incluso sin conexión una vez cargada la página.
        </p>
      </div>

      {/* ── Par: edición + URL ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>

        <div style={CARD}>
          <div style={{ ...GLOW, width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(167,139,250,.14) 0%, transparent 70%)' }} />
          <div style={{ ...ICON_BOX, background: 'rgba(167,139,250,.1)', border: '1px solid rgba(167,139,250,.2)' }}>✎</div>
          <span style={{ ...TAG, background: 'rgba(167,139,250,.08)', color: '#c4b5fd', border: '1px solid rgba(196,181,253,.18)' }}>
            Edición
          </span>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px', lineHeight: 1.35 }}>
            Markdown editable
          </p>
          <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.6 }}>
            Edita el resultado directamente en pantalla. Cópialo al portapapeles o descárgalo como <code style={{ color: '#c4b5fd', fontSize: '10px' }}>.md</code>.
          </p>
        </div>

        <div style={CARD}>
          <div style={{ ...GLOW, width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(56,189,248,.12) 0%, transparent 70%)' }} />
          <div style={{ ...ICON_BOX, background: 'rgba(56,189,248,.1)', border: '1px solid rgba(56,189,248,.2)' }}>🔗</div>
          <span style={{ ...TAG, background: 'rgba(56,189,248,.08)', color: '#38bdf8', border: '1px solid rgba(56,189,248,.18)' }}>
            URL
          </span>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px', lineHeight: 1.35 }}>
            Convierte desde URL
          </p>
          <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.6 }}>
            Pega la URL de cualquier archivo público y lo convierte al instante, sin descargarlo.
          </p>
        </div>

      </div>

    </div>
  )
}
