import { TopBar } from '../components/TopBar'
import { LandingFooter } from '../components/LandingFooter'

interface Props { navigate: (path: string) => void }

const SECTION = {
  borderRadius: '14px', border: '1px solid #1e293b',
  background: '#0c111d', padding: '18px 20px', marginBottom: '10px',
}

export function Privacidad({ navigate }: Props) {
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
          Política de privacidad
        </h1>
        <p style={{ fontSize: '12px', color: '#475569', marginBottom: '40px' }}>
          Última actualización: mayo de 2026
        </p>

        <div style={{ marginBottom: '48px' }}>
          {[
            {
              icon: '🔒', color: '#2dd4bf',
              title: 'Sin recopilación de datos',
              body: 'ConverterToMarkdown.com no recoge ningún dato personal, de uso ni analítico. No existe ningún formulario de registro, inicio de sesión ni seguimiento de usuario.',
            },
            {
              icon: '🖥️', color: '#38bdf8',
              title: 'Procesamiento 100% local',
              body: 'Todos los archivos que conviertes se procesan en tu navegador. Tu archivo nunca abandona tu dispositivo. No existe ningún servidor que reciba, almacene ni procese tus documentos.',
            },
            {
              icon: '🍪', color: '#f59e0b',
              title: 'Sin cookies de seguimiento',
              body: 'Esta web no usa cookies de analítica ni seguimiento de ningún tipo. Puede que el navegador almacene preferencias de sesión de forma local, pero no se transfieren a ningún servidor.',
            },
            {
              icon: '🤝', color: '#a78bfa',
              title: 'Sin terceros',
              body: 'No compartimos datos con terceros porque no tenemos datos que compartir. No integramos Google Analytics, Mixpanel, Segment ni ningún otro servicio de analítica o publicidad.',
            },
            {
              icon: '🌐', color: '#34d399',
              title: 'Modo URL',
              body: 'Cuando usas el modo URL, tu navegador realiza una petición fetch() directa a la URL que indiques. Esta petición no pasa por ningún proxy ni servidor intermediario nuestro.',
            },
            {
              icon: '✉️', color: '#c084fc',
              title: 'Contacto',
              body: 'Si tienes alguna pregunta sobre privacidad, puedes escribir a correodefranciscovalero@gmail.com',
            },
          ].map(s => (
            <div key={s.title} style={SECTION}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{s.icon}</span>
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
