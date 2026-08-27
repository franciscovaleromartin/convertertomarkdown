import { describe, it, expect, beforeAll } from 'vitest'
import { registerWebMcpTools } from './webmcp'

type Tool = Parameters<NonNullable<Navigator['modelContext']>['registerTool']>[0]

const tools = new Map<string, Tool>()

beforeAll(() => {
  Object.defineProperty(navigator, 'modelContext', {
    value: { registerTool: (t: Tool) => tools.set(t.name, t) },
    configurable: true,
  })
  registerWebMcpTools()
})

describe('registerWebMcpTools', () => {
  it('registra las dos herramientas de conversión', () => {
    expect([...tools.keys()]).toEqual(['convert_text_to_markdown', 'convert_url_to_markdown'])
  })

  it('convierte CSV a una tabla Markdown', async () => {
    const res = await tools.get('convert_text_to_markdown')!.execute({
      content: 'nombre,edad\nAna,30',
      format: 'csv',
    })
    expect(res.isError).toBeUndefined()
    expect(res.content[0].text).toContain('| nombre | edad |')
    expect(res.content[0].text).toContain('| Ana | 30 |')
  })

  it('rechaza un formato no soportado', async () => {
    const res = await tools.get('convert_text_to_markdown')!.execute({
      content: 'hola',
      format: 'docx',
    })
    expect(res.isError).toBe(true)
    expect(res.content[0].text).toContain('format must be one of')
  })

  it('rechaza contenido vacío', async () => {
    const res = await tools.get('convert_text_to_markdown')!.execute({ content: '  ', format: 'txt' })
    expect(res.isError).toBe(true)
  })

  it('rechaza una URL que no es http(s)', async () => {
    const res = await tools.get('convert_url_to_markdown')!.execute({ url: 'file:///etc/passwd' })
    expect(res.isError).toBe(true)
    expect(res.content[0].text).toContain('public http(s) URL')
  })
})
