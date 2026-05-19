import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const toAbs = p => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbs('dist/index.html'), 'utf-8')
const { render } = await import('./dist-ssr/entry-server.js')

const routes = [
  '/',
  '/como-funciona',
  '/casos-de-uso',
  '/privacidad',
  '/licencia',
]

for (const url of routes) {
  const { html: appHtml, headTags } = render(url)

  const page = template
    .replace(/<!-- HelmetStart -->[\s\S]*?<!-- HelmetEnd -->/, `<!-- HelmetStart -->\n    ${headTags}\n    <!-- HelmetEnd -->`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

  const outPath = url === '/'
    ? toAbs('dist/index.html')
    : toAbs(`dist${url}/index.html`)

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, page)
  console.log(`✓ ${url}`)
}

console.log(`\nPre-rendering complete — ${routes.length} routes`)
