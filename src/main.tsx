import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!

const tree = (
  <StrictMode>
    <HelmetProvider>
      <App />
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
