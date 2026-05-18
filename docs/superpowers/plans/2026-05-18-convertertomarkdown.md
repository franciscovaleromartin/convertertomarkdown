# ConverterToMarkdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static React + TypeScript web app that converts DOCX, PDF, XLSX, HTML, TXT, CSV, JSON and XML files to Markdown entirely in the browser, deployable on Vercel.

**Architecture:** `App.tsx` holds all state (`file`, `markdown`, `isLoading`, `error`) using `useState`. Three pure presentational components (`DropZone`, `FileInfo`, `OutputPanel`) receive props and emit callbacks. A dispatcher (`converters/index.ts`) routes to per-format converter modules using the file extension. No backend, no Workers, no Context — just `useState` in the main thread.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v3, mammoth, pdfjs-dist@3.11.174, xlsx (SheetJS), turndown, Vitest + jsdom.

**Note:** The project uses pnpm (pnpm-lock.yaml present). Use `pnpm` instead of `npm` for all package commands.

---

## File Map

| File | Responsibility |
|---|---|
| `src/App.tsx` | State, orchestration, layout |
| `src/components/DropZone.tsx` | Drag & drop file input UI |
| `src/components/FileInfo.tsx` | File metadata + loading spinner |
| `src/components/OutputPanel.tsx` | Markdown textarea + copy/download/clear |
| `src/converters/index.ts` | Dispatcher — routes `File` by extension |
| `src/converters/textConverter.ts` | TXT, MD, CSV→table, JSON/XML→fenced |
| `src/converters/docxConverter.ts` | mammoth → TurndownService |
| `src/converters/xlsxConverter.ts` | SheetJS → Markdown tables |
| `src/converters/htmlConverter.ts` | TurndownService |
| `src/converters/pdfConverter.ts` | pdfjs-dist v3 |
| `index.html` | Inter font, meta tags |
| `tailwind.config.js` | Content paths, Inter font-family extension |
| `vite.config.ts` | React plugin |
| `vitest.config.ts` | jsdom environment |
| `vercel.json` | SPA rewrite rule |

---

## Task 1: Scaffold Vite + React + TypeScript ✅ DONE

Completed. Commit: `069d669`

---

## Task 2: Configure Tailwind CSS

**Files:**
- Create: `tailwind.config.js`, `postcss.config.js`
- Modify: `src/index.css`

- [ ] **Step 1: Install Tailwind v3 and friends**

```bash
pnpm add -D tailwindcss@3 postcss autoprefixer
```

- [ ] **Step 2: Generate Tailwind config**

```bash
npx tailwindcss init -p
```

- [ ] **Step 3: Configure content paths and Inter font family**

Replace the entire `tailwind.config.js` with:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Replace src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 5: Update index.html with Inter font and correct title**

Replace the full `index.html`:

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ConverterToMarkdown</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Clean src/App.tsx to a minimal test stub**

Replace `src/App.tsx` entirely:

```tsx
export default function App() {
  return <div className="font-inter text-indigo-600 p-4">Tailwind + Inter OK</div>
}
```

- [ ] **Step 7: Remove unused App.css import from src/main.tsx if present**

Check `src/main.tsx` — if it imports `./App.css`, remove that import line. Also remove `src/App.css` if it exists.

- [ ] **Step 8: Commit**

```bash
git add tailwind.config.js postcss.config.js src/index.css index.html src/App.tsx src/main.tsx
git commit -m "chore: configure Tailwind CSS v3 and Inter font"
```

---

## Task 3: Install Conversion Libraries

**Files:**
- Modify: `package.json` (via pnpm install)

- [ ] **Step 1: Install runtime libraries**

```bash
pnpm add mammoth pdfjs-dist@3.11.174 xlsx turndown
```

- [ ] **Step 2: Install type definitions**

```bash
pnpm add -D @types/turndown
```

- [ ] **Step 3: Verify install**

```bash
node -e "require('mammoth'); require('xlsx'); require('turndown'); console.log('OK')"
```

Expected output: `OK`

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: install mammoth, pdfjs-dist, xlsx, turndown"
```

---

## Task 4: Setup Vitest

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (add test script)

- [ ] **Step 1: Install Vitest and jsdom**

```bash
pnpm add -D vitest jsdom
```

- [ ] **Step 2: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
})
```

- [ ] **Step 3: Add test script to package.json**

Open `package.json` and add to the `"scripts"` section:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Write a trivial test to verify setup**

Create `src/converters/setup.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('vitest setup', () => {
  it('works', () => {
    expect(1 + 1).toBe(2)
  })

  it('has File API via jsdom', () => {
    const f = new File(['hello'], 'test.txt')
    expect(f.name).toBe('test.txt')
  })
})
```

- [ ] **Step 5: Run tests**

```bash
pnpm test
```

Expected:
```
✓ src/converters/setup.test.ts (2)
  ✓ vitest setup > works
  ✓ vitest setup > has File API via jsdom

Test Files  1 passed (1)
Tests       2 passed (2)
```

- [ ] **Step 6: Delete the setup test and commit**

```bash
rm src/converters/setup.test.ts
git add vitest.config.ts package.json pnpm-lock.yaml
git commit -m "chore: setup Vitest with jsdom environment"
```

---

## Task 5: textConverter — TDD

**Files:**
- Create: `src/converters/textConverter.ts`
- Create: `src/converters/textConverter.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/converters/textConverter.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { convertText, convertCsv, convertJson, convertXml } from './textConverter'

function makeFile(name: string, content: string): File {
  return new File([content], name)
}

describe('convertText', () => {
  it('returns file content unchanged', async () => {
    const file = makeFile('hello.txt', '# Hello\nWorld')
    expect(await convertText(file)).toBe('# Hello\nWorld')
  })
})

describe('convertCsv', () => {
  it('converts header + rows to markdown table', async () => {
    const file = makeFile('data.csv', 'Name,Age\nAlice,30\nBob,25')
    const result = await convertCsv(file)
    expect(result).toBe(
      '| Name | Age |\n| --- | --- |\n| Alice | 30 |\n| Bob | 25 |'
    )
  })

  it('handles header-only CSV', async () => {
    const file = makeFile('data.csv', 'col1,col2')
    const result = await convertCsv(file)
    expect(result).toContain('| col1 | col2 |')
    expect(result).toContain('| --- | --- |')
  })

  it('trims whitespace from cells', async () => {
    const file = makeFile('data.csv', ' Name , Age \n Alice , 30 ')
    const result = await convertCsv(file)
    expect(result).toContain('| Name | Age |')
    expect(result).toContain('| Alice | 30 |')
  })
})

describe('convertJson', () => {
  it('wraps valid JSON in fenced code block', async () => {
    const file = makeFile('data.json', '{"key":"value"}')
    const result = await convertJson(file)
    expect(result).toBe('```json\n{"key":"value"}\n```')
  })

  it('throws on invalid JSON', async () => {
    const file = makeFile('bad.json', '{invalid json}')
    await expect(convertJson(file)).rejects.toThrow()
  })
})

describe('convertXml', () => {
  it('wraps XML in fenced code block', async () => {
    const file = makeFile('data.xml', '<root><item>1</item></root>')
    const result = await convertXml(file)
    expect(result).toBe('```xml\n<root><item>1</item></root>\n```')
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pnpm test
```

Expected: multiple FAIL errors — "convertText is not a function" or similar.

- [ ] **Step 3: Implement textConverter.ts**

Create `src/converters/textConverter.ts`:

```ts
export async function convertText(file: File): Promise<string> {
  return file.text()
}

export async function convertCsv(file: File): Promise<string> {
  const raw = await file.text()
  const lines = raw.trim().split('\n')
  if (lines.length === 0) return ''

  const rows = lines.map(line => line.split(',').map(cell => cell.trim()))
  const toRow = (cells: string[]) => `| ${cells.join(' | ')} |`
  const separator = rows[0].map(() => '---')

  return [toRow(rows[0]), toRow(separator), ...rows.slice(1).map(toRow)].join('\n')
}

export async function convertJson(file: File): Promise<string> {
  const text = await file.text()
  try {
    JSON.parse(text)
  } catch {
    throw new Error('JSON inválido: el archivo no puede parsearse.')
  }
  return `\`\`\`json\n${text}\n\`\`\``
}

export async function convertXml(file: File): Promise<string> {
  const text = await file.text()
  return `\`\`\`xml\n${text}\n\`\`\``
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
pnpm test
```

Expected:
```
✓ src/converters/textConverter.test.ts (7)
Test Files  1 passed (1)
Tests       7 passed (7)
```

- [ ] **Step 5: Commit**

```bash
git add src/converters/textConverter.ts src/converters/textConverter.test.ts
git commit -m "feat: add textConverter (TXT, MD, CSV, JSON, XML)"
```

---

## Task 6: converters/index.ts — TDD dispatcher

**Files:**
- Create: `src/converters/index.ts`
- Create: `src/converters/index.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/converters/index.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getExtension } from './index'

describe('getExtension', () => {
  it('returns lowercase extension including the dot', () => {
    expect(getExtension('report.DOCX')).toBe('.docx')
    expect(getExtension('file.pdf')).toBe('.pdf')
    expect(getExtension('data.XLSX')).toBe('.xlsx')
  })

  it('returns empty string when no extension', () => {
    expect(getExtension('Makefile')).toBe('')
  })

  it('handles dotfiles', () => {
    expect(getExtension('.env')).toBe('.env')
  })

  it('handles multiple dots — uses last one', () => {
    expect(getExtension('archive.tar.gz')).toBe('.gz')
  })
})

describe('convertFile — unsupported format', () => {
  it('throws with a message containing "Formato no soportado"', async () => {
    const { convertFile } = await import('./index')
    const file = new File([''], 'file.xyz')
    await expect(convertFile(file)).rejects.toThrow('Formato no soportado')
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pnpm test src/converters/index.test.ts
```

Expected: FAIL — `getExtension` not found.

- [ ] **Step 3: Implement converters/index.ts**

Create `src/converters/index.ts`:

```ts
import { convertText, convertCsv, convertJson, convertXml } from './textConverter'
import { convertDocx } from './docxConverter'
import { convertXlsx } from './xlsxConverter'
import { convertHtml } from './htmlConverter'
import { convertPdf } from './pdfConverter'

export function getExtension(filename: string): string {
  const idx = filename.lastIndexOf('.')
  if (idx <= 0) return idx === 0 ? filename : ''
  return filename.slice(idx).toLowerCase()
}

export async function convertFile(file: File): Promise<string> {
  const ext = getExtension(file.name)

  switch (ext) {
    case '.docx':             return convertDocx(file)
    case '.pdf':              return convertPdf(file)
    case '.xlsx':
    case '.xls':              return convertXlsx(file)
    case '.html':
    case '.htm':              return convertHtml(file)
    case '.txt':
    case '.md':               return convertText(file)
    case '.csv':              return convertCsv(file)
    case '.json':             return convertJson(file)
    case '.xml':              return convertXml(file)
    default:
      throw new Error(
        'Formato no soportado. Formatos aceptados: DOCX, PDF, XLSX, XLS, HTML, TXT, MD, CSV, JSON, XML.'
      )
  }
}
```

Create stub files so imports resolve:

`src/converters/docxConverter.ts`:
```ts
export async function convertDocx(_file: File): Promise<string> {
  throw new Error('not implemented')
}
```

`src/converters/xlsxConverter.ts`:
```ts
export async function convertXlsx(_file: File): Promise<string> {
  throw new Error('not implemented')
}
```

`src/converters/htmlConverter.ts`:
```ts
export async function convertHtml(_file: File): Promise<string> {
  throw new Error('not implemented')
}
```

`src/converters/pdfConverter.ts`:
```ts
export async function convertPdf(_file: File): Promise<string> {
  throw new Error('not implemented')
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test
```

Expected: all tests in `textConverter.test.ts` and `index.test.ts` pass.

- [ ] **Step 5: Commit**

```bash
git add src/converters/index.ts src/converters/index.test.ts src/converters/docxConverter.ts src/converters/xlsxConverter.ts src/converters/htmlConverter.ts src/converters/pdfConverter.ts
git commit -m "feat: add converters dispatcher and stub converters"
```

---

## Task 7: Implement docxConverter

**Files:**
- Modify: `src/converters/docxConverter.ts`

Strategy: `mammoth.convertToHtml()` → `TurndownService.turndown()`.

- [ ] **Step 1: Replace docxConverter.ts stub with real implementation**

```ts
import mammoth from 'mammoth'
import TurndownService from 'turndown'

const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })

export async function convertDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.convertToHtml({ arrayBuffer })
  if (!result.value.trim()) {
    throw new Error('No se pudo extraer texto del documento. Puede estar vacío o dañado.')
  }
  return td.turndown(result.value)
}
```

- [ ] **Step 2: Run full test suite**

```bash
pnpm test
```

Expected: all previously passing tests still pass.

- [ ] **Step 3: Commit**

```bash
git add src/converters/docxConverter.ts
git commit -m "feat: implement docxConverter using mammoth + turndown"
```

---

## Task 8: Implement xlsxConverter

**Files:**
- Modify: `src/converters/xlsxConverter.ts`

- [ ] **Step 1: Replace xlsxConverter.ts stub**

```ts
import * as XLSX from 'xlsx'

function sheetToMarkdown(sheet: XLSX.WorkSheet): string {
  const data = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: '' })
  if (data.length === 0) return '_Hoja vacía_'

  const rows = (data as unknown[][]).map(row => row.map(String))
  const header = rows[0]
  const separator = header.map(() => '---')
  const toRow = (cells: string[]) => `| ${cells.join(' | ')} |`

  return [toRow(header), toRow(separator), ...rows.slice(1).map(toRow)].join('\n')
}

export async function convertXlsx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })

  if (workbook.SheetNames.length === 0) {
    throw new Error('El archivo no contiene hojas.')
  }

  return workbook.SheetNames.map(name => {
    const sheet = workbook.Sheets[name]
    return `## ${name}\n\n${sheetToMarkdown(sheet)}`
  }).join('\n\n')
}
```

- [ ] **Step 2: Run full test suite**

```bash
pnpm test
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/converters/xlsxConverter.ts
git commit -m "feat: implement xlsxConverter using SheetJS (sheets → Markdown tables)"
```

---

## Task 9: Implement htmlConverter

**Files:**
- Modify: `src/converters/htmlConverter.ts`

- [ ] **Step 1: Replace htmlConverter.ts stub**

```ts
import TurndownService from 'turndown'

const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })

export async function convertHtml(file: File): Promise<string> {
  const text = await file.text()
  const result = td.turndown(text)
  if (!result.trim()) {
    throw new Error('El archivo HTML no contiene texto convertible.')
  }
  return result
}
```

- [ ] **Step 2: Run full test suite**

```bash
pnpm test
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/converters/htmlConverter.ts
git commit -m "feat: implement htmlConverter using turndown"
```

---

## Task 10: Implement pdfConverter

**Files:**
- Modify: `src/converters/pdfConverter.ts`

Note: the pdfjs worker is loaded from CDN. Requires internet during conversion.

- [ ] **Step 1: Replace pdfConverter.ts stub**

```ts
import * as pdfjsLib from 'pdfjs-dist'
import type { TextItem } from 'pdfjs-dist/types/src/display/api'

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'

export async function convertPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const pages: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text = content.items
      .filter((item): item is TextItem => 'str' in item)
      .map(item => item.str)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (text) pages.push(text)
  }

  if (pages.length === 0) {
    throw new Error(
      'Este PDF parece ser una imagen escaneada. No se puede extraer texto directamente.'
    )
  }

  return pages.join('\n\n')
}
```

- [ ] **Step 2: Run full test suite**

```bash
pnpm test
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/converters/pdfConverter.ts
git commit -m "feat: implement pdfConverter using pdfjs-dist v3 (worker from CDN)"
```

---

## Task 11: Build DropZone component

**Files:**
- Create: `src/components/DropZone.tsx`

- [ ] **Step 1: Create src/components/DropZone.tsx**

```tsx
import { useRef, useState, DragEvent, ChangeEvent } from 'react'

const ACCEPTED_EXT = ['.docx','.pdf','.xlsx','.xls','.html','.htm','.txt','.md','.csv','.json','.xml']
const ACCEPT_ATTR = ACCEPTED_EXT.join(',')
const FORMAT_CHIPS = ['DOCX','PDF','XLSX','XLS','HTML','TXT','MD','CSV','JSON','XML']

interface Props {
  onFile: (file: File) => void
}

export default function DropZone({ onFile }: Props) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    e.target.value = ''
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Zona de carga de archivos"
      onClick={() => inputRef.current?.click()}
      onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      className={[
        'cursor-pointer rounded-xl border-2 p-10 text-center transition-all duration-200 select-none',
        isDragOver
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-dashed border-indigo-300 bg-white hover:bg-indigo-50 hover:border-indigo-400',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={handleChange}
      />
      <div className="text-4xl mb-3 pointer-events-none">☁️</div>
      <p className="text-gray-700 font-medium pointer-events-none">
        Arrastra tu archivo aquí
      </p>
      <p className="text-gray-400 text-sm mt-1 pointer-events-none">
        o haz clic para seleccionar
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-1.5 pointer-events-none">
        {FORMAT_CHIPS.map(fmt => (
          <span
            key={fmt}
            className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full"
          >
            {fmt}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/DropZone.tsx
git commit -m "feat: add DropZone component with drag & drop and format chips"
```

---

## Task 12: Build FileInfo component

**Files:**
- Create: `src/components/FileInfo.tsx`

- [ ] **Step 1: Create src/components/FileInfo.tsx**

```tsx
interface Props {
  file: File
  isLoading: boolean
  onClear: () => void
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileInfo({ file, isLoading, onClear }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-6 gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Convirtiendo…</p>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0">📄</span>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">{file.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatSize(file.size)} · {file.type || 'tipo desconocido'}
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="flex-shrink-0 text-xs text-gray-400 hover:text-gray-600 transition-colors duration-150 flex items-center gap-1 whitespace-nowrap"
          >
            ✕ Cambiar
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/FileInfo.tsx
git commit -m "feat: add FileInfo component with spinner and file metadata"
```

---

## Task 13: Build OutputPanel component

**Files:**
- Create: `src/components/OutputPanel.tsx`

- [ ] **Step 1: Create src/components/OutputPanel.tsx**

```tsx
import { useState, useEffect } from 'react'

interface Props {
  markdown: string
  fileName: string
  onClear: () => void
}

export default function OutputPanel({ markdown, fileName, onClear }: Props) {
  const [text, setText] = useState(markdown)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setText(markdown)
  }, [markdown])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const base = fileName.replace(/\.[^.]+$/, '')
    const blob = new Blob([text], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${base}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const lines = text.split('\n').length
  const chars = text.length

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <span className="text-xs text-gray-500 font-medium">
          Output · {chars} chars · {lines} líneas
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md transition-colors duration-150 font-medium"
          >
            {copied ? '¡Copiado!' : 'Copiar'}
          </button>
          <button
            onClick={handleDownload}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition-colors duration-150"
          >
            ↓ Descargar .md
          </button>
          <button
            onClick={onClear}
            className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 transition-colors duration-150"
            aria-label="Limpiar"
          >
            ✕
          </button>
        </div>
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full p-4 font-mono text-sm text-gray-800 leading-relaxed resize-y min-h-[300px] max-h-[600px] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-200"
        spellCheck={false}
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/OutputPanel.tsx
git commit -m "feat: add OutputPanel with editable textarea, copy/download/clear"
```

---

## Task 14: Build App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace src/App.tsx stub with full implementation**

```tsx
import { useState } from 'react'
import DropZone from './components/DropZone'
import FileInfo from './components/FileInfo'
import OutputPanel from './components/OutputPanel'
import { convertFile } from './converters'

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB

export default function App() {
  const [file, setFile] = useState<File | null>(null)
  const [markdown, setMarkdown] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (f: File) => {
    if (f.size > MAX_FILE_SIZE) {
      setError('El archivo supera el límite de 20 MB.')
      return
    }
    setFile(f)
    setError(null)
    setMarkdown('')
    setIsLoading(true)
    try {
      const result = await convertFile(f)
      setMarkdown(result)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error desconocido al convertir el archivo.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setMarkdown('')
    setError(null)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-white font-inter">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            ConverterToMarkdown
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Convierte archivos a Markdown directamente en tu navegador
          </p>
        </header>

        {file ? (
          <FileInfo file={file} isLoading={isLoading} onClear={handleClear} />
        ) : (
          <DropZone onFile={handleFile} />
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
            <span className="flex-shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {markdown && !isLoading && (
          <OutputPanel
            markdown={markdown}
            fileName={file?.name ?? 'output'}
            onClear={handleClear}
          />
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run all tests**

```bash
pnpm test
```

Expected: all converter tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire up App.tsx with state management and all components"
```

---

## Task 15: Integration Test — All Converters

**Manual verification only** (no unit test for binary formats).

Start dev server with `pnpm dev`, test each format manually, verify error states.

---

## Task 16: vercel.json

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create vercel.json**

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add vercel.json
git commit -m "chore: add vercel.json for SPA rewrite rule"
```

---

## Task 17: Production Build Verification

- [ ] **Step 1: Run production build**

```bash
pnpm build
```

Expected: `dist/` directory created with no errors. If `pdfjs-dist` causes a Vite build error about `canvas`, add to `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['pdfjs-dist'],
  },
})
```

Then run `pnpm build` again.

- [ ] **Step 2: Preview production build**

```bash
pnpm preview
```

Verify the app works. Test TXT, CSV, and one binary format. Stop with Ctrl+C.

- [ ] **Step 3: Run final test suite**

```bash
pnpm test
```

Expected: all tests pass.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore: production build verified and ready for Vercel deploy"
```

---

## Deployment

1. Push repo to GitHub
2. In Vercel: import repo, build command `pnpm build`, output `dist`
3. No environment variables needed
