// WebMCP: expone la conversión a Markdown como herramientas para agentes de IA
// que operan la página. Todo se ejecuta en el navegador, igual que la UI.
// Spec: https://webmachinelearning.github.io/webmcp/

import { convertFile } from '../converters'
import { fetchUrlAsFile } from './fetchUrl'
import { MAX_FILE_SIZE } from './constants'

const TEXT_FORMATS = ['html', 'csv', 'json', 'xml', 'md', 'txt'] as const
type TextFormat = (typeof TEXT_FORMATS)[number]

interface ToolResult {
  content: { type: 'text'; text: string }[]
  isError?: boolean
}

interface ToolDefinition {
  name: string
  description: string
  inputSchema: object
  execute: (args: Record<string, unknown>) => Promise<ToolResult>
}

declare global {
  interface Navigator {
    modelContext?: { registerTool(tool: ToolDefinition): void }
  }
}

const ok = (text: string): ToolResult => ({ content: [{ type: 'text', text }] })

const failed = (err: unknown): ToolResult => ({
  content: [{ type: 'text', text: err instanceof Error ? err.message : String(err) }],
  isError: true,
})

export function registerWebMcpTools(): void {
  const ctx = navigator.modelContext
  if (!ctx) return

  ctx.registerTool({
    name: 'convert_text_to_markdown',
    description:
      'Convert HTML, CSV, JSON, XML, Markdown or plain text into clean Markdown. ' +
      'Runs entirely in the browser — nothing is uploaded.',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Raw text to convert.' },
        format: {
          type: 'string',
          enum: [...TEXT_FORMATS],
          description: 'Format of the supplied content.',
        },
      },
      required: ['content', 'format'],
    },
    async execute({ content, format }) {
      try {
        if (typeof content !== 'string' || !content.trim()) {
          throw new Error('content must be a non-empty string.')
        }
        if (!TEXT_FORMATS.includes(format as TextFormat)) {
          throw new Error(`format must be one of: ${TEXT_FORMATS.join(', ')}.`)
        }
        const file = new File([content], `input.${format}`, { type: 'text/plain' })
        if (file.size > MAX_FILE_SIZE) throw new Error('Content exceeds the 20 MB limit.')
        return ok(await convertFile(file))
      } catch (err) {
        return failed(err)
      }
    },
  })

  ctx.registerTool({
    name: 'convert_url_to_markdown',
    description:
      'Fetch a public URL — web page, PDF, DOCX, XLSX, CSV or image — and convert it to ' +
      'clean Markdown. Scanned PDFs and images go through OCR. Maximum 20 MB.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Public http(s) URL of the document to convert.' },
      },
      required: ['url'],
    },
    async execute({ url }) {
      try {
        if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
          throw new Error('url must be a public http(s) URL.')
        }
        const file = await fetchUrlAsFile(url)
        if (file.size > MAX_FILE_SIZE) throw new Error('Document exceeds the 20 MB limit.')
        return ok(await convertFile(file))
      } catch (err) {
        return failed(err)
      }
    },
  })
}
