import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Analytics } from '@vercel/analytics/react'
import { LangProvider } from './lib/i18n'
import { registerWebMcpTools } from './lib/webmcp'
import './index.css'
import App from './App'

const container = document.getElementById('root')!

const tree = (
  <StrictMode>
    <HelmetProvider>
      <LangProvider>
        <App />
      </LangProvider>
    </HelmetProvider>
    <Analytics />
  </StrictMode>
)

// Use hydrateRoot when pre-rendered SSR content is present, createRoot otherwise
if (container.innerHTML.trim()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}

// Expone la conversión como herramientas WebMCP para agentes que operan la página
registerWebMcpTools()
