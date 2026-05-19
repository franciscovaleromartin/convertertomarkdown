# ConverterToMarkdown

**Free browser-based tool to convert documents to Markdown — no upload, no server, no registration.**

🔗 **[convertertomarkdown.com](https://convertertomarkdown.com)**

---

## What it does

Converts files from 10 formats to clean Markdown, entirely in your browser. Your files never leave your device — all processing runs locally using JavaScript.

## Supported formats

| Format | Library | Notes |
|--------|---------|-------|
| DOCX | [mammoth.js](https://github.com/mwilliamson/mammoth.js) | Word documents, preserves headings and lists |
| PDF | [pdf.js](https://github.com/mozilla/pdf.js) | Text-based PDFs (not scanned images) |
| XLSX / XLS | [SheetJS](https://sheetjs.com) | Excel spreadsheets → Markdown tables |
| HTML | [Turndown](https://github.com/mixmark-io/turndown) | Web pages and HTML fragments |
| CSV | [PapaParse](https://www.papaparse.com) | Auto-detects tables and form-style sheets |
| TXT / MD | Native | Plain text passthrough |
| JSON | Native | Formatted JSON as code block |
| XML | Native | Formatted XML as code block |

## How it works

1. Drop a file or paste a public URL
2. The conversion runs instantly in your browser using the libraries above
3. Copy the Markdown to clipboard or download it as a `.md` file

No installation. No account. No data sent anywhere. Works offline once the page is loaded.

## Use cases

- **Developers** — convert Word/PDF specs to Markdown for GitHub, Docusaurus, or internal wikis
- **Writers** — migrate articles to Jekyll, Hugo, Ghost or Astro without rewriting
- **Students** — convert notes and PDFs to Obsidian or Notion
- **Data analysts** — turn Excel/CSV reports into Markdown tables
- **AI & LLMs** — prepare clean Markdown context for ChatGPT, Claude, Gemini

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- react-helmet-async (SSG per-page meta tags)
- Static Site Generation via custom `prerender.mjs`
- Deployed on [Render](https://render.com)

## Run locally

```bash
pnpm install
pnpm dev
```

Build with SSG pre-rendering:

```bash
pnpm build
```

The build script runs `tsc`, `vite build`, SSR bundle, and `prerender.mjs` to generate static HTML for all routes with correct `<head>` tags.

## Privacy

- No analytics, no tracking cookies, no third-party services
- Files are processed entirely client-side
- URL mode fetches files via a serverless proxy to avoid CORS — the file content is never stored

Full policy: [convertertomarkdown.com/privacidad](https://convertertomarkdown.com/privacidad)

## License

MIT — see [LICENSE](https://convertertomarkdown.com/licencia)

Built by [Francisco Valero](https://francisco-valero.com) · [LinkedIn](https://www.linkedin.com/in/francisco-valero/)
