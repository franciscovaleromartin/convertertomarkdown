import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const toAbs = p => path.resolve(root, p)

const template = fs.readFileSync(toAbs('dist/index.html'), 'utf-8')
const { render } = await import(toAbs('dist-ssr/entry-server.js'))

const TODAY = new Date().toISOString().split('T')[0]

const routes = [
  '/',
  '/como-funciona',
  '/casos-de-uso',
  '/privacidad',
  '/licencia',
]

const routeSchemas = {
  '/': `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Markdown?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Markdown is a lightweight text format that uses simple symbols to structure documents: # for headings, **text** for bold, *text* for italic, - for lists, and backtick-text for code. It reads as plain text but renders as formatted content. It is the standard format in GitHub, Notion, Obsidian, VS Code, ChatGPT, Claude and most AI tools."
        }
      },
      {
        "@type": "Question",
        "name": "How many file formats are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "15 formats: DOCX, PDF, XLSX, XLS, HTML, TXT, MD, CSV, JSON, XML, JPG, JPEG, PNG, WEBP, BMP and GIF. Image files are processed with automatic OCR via Tesseract.js."
        }
      },
      {
        "@type": "Question",
        "name": "Is my file uploaded to a server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. All processing happens in your browser using JavaScript. Your file never leaves your device and no data is sent to external servers."
        }
      },
      {
        "@type": "Question",
        "name": "Is it free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, completely free with no registration. No account or credit card required."
        }
      },
      {
        "@type": "Question",
        "name": "What is the maximum file size?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "20 MB per file. Since all processing happens locally in your browser, performance depends on your device."
        }
      },
      {
        "@type": "Question",
        "name": "Can I edit the generated Markdown?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The result appears in an editor where you can modify it directly, then copy or download it as a .md file."
        }
      },
      {
        "@type": "Question",
        "name": "Does it work offline?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Once the page is loaded, the converter works fully offline. No internet connection is required to process files."
        }
      },
      {
        "@type": "Question",
        "name": "Does it work on mobile?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Works in Chrome, Safari and Firefox on Android and iOS. You can select files from your device storage or from cloud apps like Google Drive or iCloud."
        }
      },
      {
        "@type": "Question",
        "name": "What happens with scanned PDFs or image-based PDFs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Scanned PDFs are processed automatically with OCR via Tesseract.js. pdf.js first attempts text extraction; if a page yields no text it is rendered to a canvas and passed to Tesseract. No manual action required — OCR is fully automatic and runs entirely in your browser."
        }
      },
      {
        "@type": "Question",
        "name": "Can I convert multiple files at once?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Use the Multiple files tab to select or drop any number of files at once. They are converted sequentially and each file can be downloaded individually as .md as soon as it finishes. When all files are done, a Download all button appears — 1 file downloads directly, 2 or more files download as a ZIP archive."
        }
      }
    ]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "ConverterToMarkdown — demo",
    "description": "See how ConverterToMarkdown converts files to Markdown in seconds, directly in the browser. Supports DOCX, PDF, images with OCR, batch mode and live preview. No installation, no upload.",
    "contentUrl": "https://www.convertertomarkdown.com/demo.mp4",
    "thumbnailUrl": "https://www.convertertomarkdown.com/og-image.png",
    "uploadDate": "2026-05-01",
    "publisher": { "@id": "https://www.convertertomarkdown.com/#org" }
  }
  </script>`,

  '/como-funciona': `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": "https://www.convertertomarkdown.com/como-funciona",
    "name": "How it works — ConverterToMarkdown",
    "inLanguage": "en",
    "isPartOf": { "@id": "https://www.convertertomarkdown.com/#website" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.convertertomarkdown.com" },
        { "@type": "ListItem", "position": 2, "name": "How it works", "item": "https://www.convertertomarkdown.com/como-funciona" }
      ]
    },
    "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", "h2", "p"] },
    "mainEntity": {
      "@type": "HowTo",
      "name": "How to convert a file to Markdown",
      "description": "Convert any file to Markdown directly in your browser — DOCX, PDF, images and more. OCR for scanned PDFs and images. Batch mode with ZIP download. No installation, no upload.",
      "tool": [
        { "@type": "HowToTool", "name": "mammoth.js" },
        { "@type": "HowToTool", "name": "pdf.js" },
        { "@type": "HowToTool", "name": "Tesseract.js" },
        { "@type": "HowToTool", "name": "SheetJS" },
        { "@type": "HowToTool", "name": "Turndown" },
        { "@type": "HowToTool", "name": "PapaParse" }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Choose how to convert",
          "text": "Three input modes: File (drag & drop or select a single file), URL (paste a public link and convert without downloading), or Multiple files (select several files at once for batch conversion with ZIP download). Supports DOCX, PDF, XLSX, XLS, HTML, TXT, MD, CSV, JSON, XML and images (JPG, PNG, WEBP, BMP, GIF) via OCR."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "The browser processes it",
          "text": "The file is converted entirely in your browser. No bytes are sent to any server. Scanned PDFs and images are processed with automatic OCR via Tesseract.js running in a Web Worker. The process shows OCR progress percentage for image-heavy files."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Edit, preview, copy or download",
          "text": "The Markdown opens in a built-in editor with a live HTML preview. Switch between editor .md mode (raw Markdown) and Preview mode (rendered headings, bold, tables, code blocks). Both modes sync in real time. Download as .md or copy to clipboard."
        }
      ]
    }
  }
  </script>`,

  '/casos-de-uso': `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": "https://www.convertertomarkdown.com/casos-de-uso",
    "name": "Use cases — ConverterToMarkdown",
    "inLanguage": "en",
    "isPartOf": { "@id": "https://www.convertertomarkdown.com/#website" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.convertertomarkdown.com" },
        { "@type": "ListItem", "position": 2, "name": "Use cases", "item": "https://www.convertertomarkdown.com/casos-de-uso" }
      ]
    },
    "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", "h2", "p"] },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Use cases for ConverterToMarkdown",
      "numberOfItems": 6,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Developers — Documentation", "description": "Convert Word or PDF specs to Markdown for GitHub, GitLab, Docusaurus or wikis. Batch-convert entire spec folders to ZIP in one pass." },
        { "@type": "ListItem", "position": 2, "name": "Writers and bloggers — Content migration", "description": "Migrate Word articles to Markdown for Jekyll, Hugo, Ghost or Astro. Use batch mode to convert a full blog archive and download as ZIP." },
        { "@type": "ListItem", "position": 3, "name": "Students — Notes and study", "description": "Convert PDF notes, presentations or Word documents to Markdown for Obsidian or Notion. OCR extracts text from scanned handouts and images." },
        { "@type": "ListItem", "position": 4, "name": "Data analysts — Tables and data", "description": "Transform Excel or CSV reports into Markdown tables for documentation, GitHub comments or Confluence pages." },
        { "@type": "ListItem", "position": 5, "name": "Teams and companies — Standardization", "description": "Unify Word, PDF, Excel, HTML into portable Markdown. Batch conversion with ZIP download for bulk imports into version control." },
        { "@type": "ListItem", "position": 6, "name": "AI and LLMs — Context preparation", "description": "Convert documents to clean Markdown as context for ChatGPT, Claude, Gemini. Batch-convert a full corpus in one pass and download as ZIP." }
      ]
    }
  }
  </script>`,

  '/privacidad': `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": "https://www.convertertomarkdown.com/privacidad",
    "name": "Privacy Policy — ConverterToMarkdown",
    "inLanguage": "en",
    "isPartOf": { "@id": "https://www.convertertomarkdown.com/#website" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.convertertomarkdown.com" },
        { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": "https://www.convertertomarkdown.com/privacidad" }
      ]
    },
    "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", "h2", "p"] }
  }
  </script>`,

  '/licencia': `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": "https://www.convertertomarkdown.com/licencia",
    "name": "License — ConverterToMarkdown",
    "inLanguage": "en",
    "isPartOf": { "@id": "https://www.convertertomarkdown.com/#website" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.convertertomarkdown.com" },
        { "@type": "ListItem", "position": 2, "name": "License", "item": "https://www.convertertomarkdown.com/licencia" }
      ]
    },
    "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", "h2", "p"] }
  }
  </script>`,
}

for (const url of routes) {
  const { html: appHtml, headTags } = render(url)

  let page = template
    .replace(/<!-- HelmetStart -->[\s\S]*?<!-- HelmetEnd -->/, `<!-- HelmetStart -->\n    ${headTags}\n    <!-- HelmetEnd -->`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

  if (routeSchemas[url]) {
    page = page.replace('</head>', `${routeSchemas[url]}\n  </head>`)
  }

  page = page.replace(/"dateModified": "\d{4}-\d{2}-\d{2}"/, `"dateModified": "${TODAY}"`)

  const outPath = url === '/'
    ? toAbs('dist/index.html')
    : toAbs(`dist${url}/index.html`)

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, page)
  console.log(`✓ ${url}`)
}

console.log(`\nPre-rendering complete — ${routes.length} routes`)

// Refresh sitemap.xml lastmod dates so search engines see accurate crawl-freshness signals
const sitemapPath = toAbs('dist/sitemap.xml')
const sitemap = fs.readFileSync(sitemapPath, 'utf-8')
  .replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g, `<lastmod>${TODAY}</lastmod>`)
fs.writeFileSync(sitemapPath, sitemap)
console.log(`✓ sitemap.xml lastmod refreshed to ${TODAY}`)

// Ping IndexNow so Bing and other engines pick up updated content immediately
const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? '019dc048525741c6a39036a5d62f22ea'
const INDEXNOW_HOST = 'www.convertertomarkdown.com'
const urlsToIndex = routes.map(r => `https://${INDEXNOW_HOST}${r}`)

try {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
      urlList: urlsToIndex,
    }),
  })
  console.log(`\nIndexNow ping: HTTP ${res.status}`)
} catch (e) {
  console.warn(`\nIndexNow ping failed (non-critical): ${e instanceof Error ? e.message : String(e)}`)
}
