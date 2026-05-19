import { TopBar } from '../components/TopBar'
import { LandingFooter } from '../components/LandingFooter'

interface Props { navigate: (path: string) => void }

export function Licencia({ navigate }: Props) {
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
          Licencia
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '40px', lineHeight: 1.6 }}>
          ConverterToMarkdown.com es una herramienta de uso libre y gratuito.
        </p>

        {/* MIT block */}
        <div style={{ borderRadius: '14px', border: '1px solid #1e293b', background: '#0c111d', padding: '24px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' as const, padding: '3px 9px', borderRadius: '6px', background: 'rgba(52,211,153,.08)', color: '#34d399', border: '1px solid rgba(52,211,153,.2)' }}>
              MIT License
            </span>
          </div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '12px' }}>
            Copyright © 2026 Francisco Alejandro Valero Martín
          </p>
          <pre style={{
            fontSize: '11px', color: '#64748b', lineHeight: 1.7, whiteSpace: 'pre-wrap' as const,
            fontFamily: 'monospace', background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.05)',
            borderRadius: '8px', padding: '14px',
          }}>
{`Permission is hereby granted, free of charge, to any
person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the
Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice
shall be included in all copies or substantial portions
of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT.`}
          </pre>
        </div>

        {/* Dependencias */}
        <div style={{ borderRadius: '14px', border: '1px solid #1e293b', background: '#0c111d', padding: '18px 20px', marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9', marginBottom: '12px' }}>Librerías de terceros</p>
          {[
            { name: 'mammoth', license: 'MIT', use: 'Conversión DOCX → HTML' },
            { name: 'pdf.js', license: 'Apache 2.0', use: 'Extracción de texto PDF' },
            { name: 'SheetJS (xlsx)', license: 'Apache 2.0', use: 'Lectura de XLSX/XLS' },
            { name: 'Turndown', license: 'MIT', use: 'HTML → Markdown' },
            { name: 'PapaParse', license: 'MIT', use: 'Parsing de CSV' },
          ].map(dep => (
            <div key={dep.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
              <div>
                <code style={{ fontSize: '11px', color: '#38bdf8' }}>{dep.name}</code>
                <span style={{ fontSize: '10px', color: '#475569', marginLeft: '8px' }}>{dep.use}</span>
              </div>
              <span style={{ fontSize: '10px', color: '#64748b', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.06)', padding: '2px 7px', borderRadius: '5px', flexShrink: 0 }}>
                {dep.license}
              </span>
            </div>
          ))}
        </div>

      </div>
      <LandingFooter navigate={navigate} />
    </div>
  )
}
