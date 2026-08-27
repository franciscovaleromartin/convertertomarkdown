import { next, rewrite } from '@vercel/functions'

/**
 * Markdown for Agents: la misma URL devuelve Markdown cuando el cliente lo pide
 * con `Accept: text/markdown`; los navegadores siguen recibiendo el HTML.
 *
 * Va en middleware y no en los `rewrites` de vercel.json porque Vercel resuelve
 * el filesystem antes que los rewrites: `/` casa con index.html y nunca llega
 * a ellos. El middleware sí corre antes.
 */
export const config = {
  matcher: ['/', '/como-funciona', '/casos-de-uso', '/privacidad', '/licencia'],
}

/** Ruta del .md pre-renderizado que corresponde a una página. */
export function markdownPath(pathname: string): string {
  const clean = pathname.replace(/\/$/, '')
  return clean === '' ? '/index.md' : `${clean}.md`
}

export default function middleware(request: Request) {
  if (!request.headers.get('accept')?.includes('text/markdown')) return next()

  const url = new URL(request.url)
  url.pathname = markdownPath(url.pathname)
  return rewrite(url)
}
