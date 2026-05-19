import { TopBar } from '../components/TopBar'
import { LandingFooter } from '../components/LandingFooter'

interface Props { navigate: (path: string) => void }

const CASES = [
  {
    icon: '👩‍💻', color: '#38bdf8', bg: 'rgba(56,189,248,.08)', border: 'rgba(56,189,248,.18)',
    title: 'Desarrolladores',
    tag: 'Documentación',
    body: 'Convierte especificaciones en Word o PDF a Markdown para publicarlas en GitHub, GitLab, Docusaurus o un wiki interno.',
    formats: ['DOCX', 'PDF', 'HTML'],
  },
  {
    icon: '✍️', color: '#c084fc', bg: 'rgba(192,132,252,.08)', border: 'rgba(192,132,252,.18)',
    title: 'Escritores y bloggers',
    tag: 'Migración de contenido',
    body: 'Migra artículos de Word a Markdown para publicarlos en Jekyll, Hugo, Ghost o Astro sin reescribir nada.',
    formats: ['DOCX', 'HTML'],
  },
  {
    icon: '🎓', color: '#34d399', bg: 'rgba(52,211,153,.08)', border: 'rgba(52,211,153,.18)',
    title: 'Estudiantes',
    body: 'Convierte apuntes escaneados como PDF, presentaciones o documentos de Word a Markdown para organizarlos en Obsidian o Notion.',
    tag: 'Apuntes y notas',
    formats: ['PDF', 'DOCX', 'TXT'],
  },
  {
    icon: '📊', color: '#f59e0b', bg: 'rgba(245,158,11,.08)', border: 'rgba(245,158,11,.18)',
    title: 'Analistas de datos',
    tag: 'Tablas y datos',
    body: 'Transforma informes en Excel o CSV en tablas Markdown para incluirlas en documentación técnica o informes de PR.',
    formats: ['CSV', 'XLSX', 'XLS'],
  },
  {
    icon: '🏢', color: '#a78bfa', bg: 'rgba(167,139,250,.08)', border: 'rgba(167,139,250,.18)',
    title: 'Equipos y empresas',
    tag: 'Estandarización',
    body: 'Unifica documentos internos de múltiples formatos —Word, PDF, Excel, HTML— a un único formato de texto plano portable.',
    formats: ['DOCX', 'PDF', 'XLSX', 'HTML'],
  },
  {
    icon: '🤖', color: '#2dd4bf', bg: 'rgba(45,212,191,.08)', border: 'rgba(45,212,191,.18)',
    title: 'IA y LLMs',
    tag: 'Preparación de contexto',
    body: 'Convierte documentos a Markdown limpio para incluirlos como contexto en prompts de ChatGPT, Claude, Gemini u otros LLMs.',
    formats: ['PDF', 'DOCX', 'HTML', 'CSV'],
  },
]

export function CasosDeUso({ navigate }: Props) {
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
          Casos de uso
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '40px', lineHeight: 1.6 }}>
          ConverterToMarkdown.com es útil en cualquier flujo donde necesites transformar contenido a Markdown sin instalar nada.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '48px' }}>
          {CASES.map(c => (
            <div key={c.title} style={{
              borderRadius: '14px', border: '1px solid #1e293b',
              background: '#0c111d', padding: '18px 20px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: `radial-gradient(circle, ${c.color}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '22px', flexShrink: 0, marginTop: '2px' }}>{c.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.2 }}>{c.title}</p>
                    <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' as const, padding: '2px 7px', borderRadius: '5px', background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                      {c.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.65, marginBottom: '10px' }}>{c.body}</p>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' as const }}>
                    {c.formats.map(f => (
                      <span key={f} style={{ fontSize: '10px', color: '#64748b', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', padding: '2px 8px', borderRadius: '5px' }}>
                        {f}
                      </span>
                    ))}
                  </div>
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
