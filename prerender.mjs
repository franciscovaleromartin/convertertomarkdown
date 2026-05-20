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

const routeSchemas = {
  '/': `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How many file formats are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "10 formats: DOCX, PDF, XLSX, XLS, HTML, TXT, MD, CSV, JSON and XML. More formats are added based on user demand."
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
      }
    ]
  }
  </script>`,

  '/como-funciona': `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": "https://convertertomarkdown.com/como-funciona",
    "name": "How it works — ConverterToMarkdown",
    "isPartOf": { "@id": "https://convertertomarkdown.com/#website" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://convertertomarkdown.com" },
        { "@type": "ListItem", "position": 2, "name": "How it works", "item": "https://convertertomarkdown.com/como-funciona" }
      ]
    },
    "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", "h2", "p"] },
    "mainEntity": {
      "@type": "HowTo",
      "name": "How to convert a file to Markdown",
      "description": "Convert any file to Markdown directly in your browser in three steps, with no installation or upload required.",
      "tool": [
        { "@type": "HowToTool", "name": "mammoth.js" },
        { "@type": "HowToTool", "name": "pdf.js" },
        { "@type": "HowToTool", "name": "SheetJS" },
        { "@type": "HowToTool", "name": "Turndown" },
        { "@type": "HowToTool", "name": "PapaParse" }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Choose your file or URL",
          "text": "Drag a file to the conversion area, click to select it from your system, or switch to URL mode and paste a link to any public file (PDF on a CDN, DOCX on a server, etc.)."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "The browser processes it",
          "text": "The file is converted entirely in your browser using JavaScript libraries (mammoth, pdf.js, SheetJS, Turndown, PapaParse). No bytes are sent to any server. The process is instant for small files."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Edit, copy or download",
          "text": "The resulting Markdown appears in an editor. You can modify it, copy it to the clipboard with one click, or download it as a .md file ready to use in GitHub, Notion, Obsidian or any editor."
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
    "url": "https://convertertomarkdown.com/casos-de-uso",
    "name": "Use cases — ConverterToMarkdown",
    "isPartOf": { "@id": "https://convertertomarkdown.com/#website" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://convertertomarkdown.com" },
        { "@type": "ListItem", "position": 2, "name": "Use cases", "item": "https://convertertomarkdown.com/casos-de-uso" }
      ]
    },
    "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", "h2", "p"] },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Use cases for ConverterToMarkdown",
      "numberOfItems": 6,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Developers — Documentation", "description": "Convert Word or PDF specs to Markdown to publish on GitHub, GitLab, Docusaurus or an internal wiki." },
        { "@type": "ListItem", "position": 2, "name": "Writers and bloggers — Content migration", "description": "Migrate Word articles to Markdown for Jekyll, Hugo, Ghost or Astro without rewriting." },
        { "@type": "ListItem", "position": 3, "name": "Students — Notes and study", "description": "Convert PDF notes or Word documents to Markdown for Obsidian or Notion." },
        { "@type": "ListItem", "position": 4, "name": "Data analysts — Tables and data", "description": "Transform Excel or CSV reports into Markdown tables for technical documentation." },
        { "@type": "ListItem", "position": 5, "name": "Teams and companies — Standardization", "description": "Unify internal documents from Word, PDF, Excel, HTML into a single portable format." },
        { "@type": "ListItem", "position": 6, "name": "AI and LLMs — Context preparation", "description": "Convert documents to clean Markdown as context for ChatGPT, Claude, Gemini or other LLMs." }
      ]
    }
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

  const outPath = url === '/'
    ? toAbs('dist/index.html')
    : toAbs(`dist${url}/index.html`)

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, page)
  console.log(`✓ ${url}`)
}

console.log(`\nPre-rendering complete — ${routes.length} routes`)
