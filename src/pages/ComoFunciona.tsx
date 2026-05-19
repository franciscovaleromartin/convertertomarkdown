import { TopBar } from '../components/TopBar'
import { LandingFooter } from '../components/LandingFooter'

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
          ← Volver
        </button>

        <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Cómo funciona
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '40px', lineHeight: 1.6 }}>
          En tres pasos, de archivo a Markdown. Sin instalación, sin cuenta, sin datos que salgan de tu navegador.
        </p>

        {/* Pasos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '48px' }}>
          {[
            {
              n: '01', icon: '📁', color: '#38bdf8',
              title: 'Elige tu archivo o URL',
              body: 'Arrastra un archivo al área de conversión, haz clic para seleccionarlo desde tu sistema, o cambia al modo URL y pega el enlace de cualquier archivo público (PDF en un CDN, DOCX en un servidor, etc.).',
            },
            {
              n: '02', icon: '⚙️', color: '#c084fc',
              title: 'El navegador lo procesa',
              body: 'El archivo se convierte completamente en tu navegador usando librerías JavaScript (mammoth, pdf.js, SheetJS, Turndown, PapaParse). Ningún byte se envía a ningún servidor. El proceso es instantáneo para archivos pequeños.',
            },
            {
              n: '03', icon: '✓', color: '#34d399',
              title: 'Edita, copia o descarga',
              body: 'El Markdown resultante aparece en un editor. Puedes modificarlo, copiarlo al portapapeles con un clic o descargarlo como fichero .md listo para usar en GitHub, Notion, Obsidian o cualquier editor.',
            },
          ].map(step => (
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

        {/* Detalle técnico */}
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#f1f5f9', marginBottom: '16px' }}>
          Detalle por formato
        </h2>
        <div style={{ marginBottom: '48px' }}>
          {[
            { fmt: 'DOCX', lib: 'mammoth.js', desc: 'Convierte a HTML intermedio, luego a Markdown con Turndown.' },
            { fmt: 'PDF', lib: 'pdf.js', desc: 'Extrae el texto de cada página. No interpreta imágenes ni fórmulas.' },
            { fmt: 'XLSX / XLS', lib: 'SheetJS', desc: 'Convierte cada hoja del libro en una tabla Markdown separada.' },
            { fmt: 'HTML', lib: 'DOMParser + Turndown', desc: 'Limpia estilos, scripts y ruido visual antes de convertir.' },
            { fmt: 'CSV', lib: 'PapaParse', desc: 'Detecta automáticamente tablas normales y hojas tipo formulario.' },
            { fmt: 'TXT / MD', lib: 'Nativo', desc: 'Devuelve el texto plano sin transformación.' },
            { fmt: 'JSON', lib: 'Nativo', desc: 'Valida y envuelve en bloque de código con sintaxis resaltada.' },
            { fmt: 'XML', lib: 'Nativo', desc: 'Envuelve en bloque de código preservando la estructura.' },
          ].map(row => (
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
