import { renderToString } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import type { HelmetServerState } from 'react-helmet-async'
import App from './App'

// react-helmet-async v3 renders head tags (title, meta, link) into the
// component output instead of populating the SSR context. This regex
// captures the contiguous block of head-appropriate tags at the start
// of the rendered HTML, before any structural element (<div>, <header>, etc.).
const HEAD_PREFIX_RE = /^((?:\s*<(?:title[^>]*>[\s\S]*?<\/title>|(?:meta|link)\s[^>]*\/?>)\s*)+)/

export function render(url: string): { html: string; headTags: string } {
  const ctx: { helmet?: HelmetServerState | null } = {}

  const rawHtml = renderToString(
    <HelmetProvider context={ctx}>
      <App ssrPath={url} />
    </HelmetProvider>
  )

  // Primary path: extract head tags from the rendered HTML prefix (v3 behavior)
  const prefixMatch = rawHtml.match(HEAD_PREFIX_RE)
  if (prefixMatch) {
    return {
      html: rawHtml.slice(prefixMatch[1].length),
      headTags: prefixMatch[1].trim(),
    }
  }

  // Fallback: try the context API (works in react-helmet-async v1)
  const { helmet } = ctx
  const headTags = helmet
    ? [helmet.title.toString(), helmet.meta.toString(), helmet.link.toString()]
        .filter(s => s.trim())
        .join('\n    ')
    : ''

  return { html: rawHtml, headTags }
}
