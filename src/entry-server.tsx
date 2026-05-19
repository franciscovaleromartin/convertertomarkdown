import { renderToString } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import type { HelmetServerState } from 'react-helmet-async'
import App from './App'

export function render(url: string): { html: string; headTags: string } {
  const ctx: { helmet?: HelmetServerState | null } = {}

  const html = renderToString(
    <HelmetProvider context={ctx}>
      <App ssrPath={url} />
    </HelmetProvider>
  )

  const { helmet } = ctx
  const headTags = helmet
    ? [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
      ].join('\n    ')
    : ''

  return { html, headTags }
}
