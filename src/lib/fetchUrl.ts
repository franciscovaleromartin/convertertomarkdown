// Descarga una URL pública a través del proxy y la envuelve en un File listo
// para convertFile(). Compartido por la UI y por las herramientas WebMCP.

function mimeToExt(contentType: string): string {
  const mime = contentType.split(';')[0].trim().toLowerCase()
  const map: Record<string, string> = {
    'text/html':                                                        '.html',
    'application/xhtml+xml':                                            '.html',
    'application/pdf':                                                  '.pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':       '.xlsx',
    'application/vnd.ms-excel':                                         '.xls',
    'text/plain':                                                        '.txt',
    'text/markdown':                                                     '.md',
    'text/csv':                                                          '.csv',
    'application/json':                                                  '.json',
    'text/xml':                                                          '.xml',
    'application/xml':                                                   '.xml',
  }
  return map[mime] ?? '.html'
}

export async function fetchUrlAsFile(url: string): Promise<File> {
  const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`)
  if (!response.ok) throw new Error(response.statusText || `HTTP ${response.status}`)
  const blob = await response.blob()

  const rawName = new URL(url).pathname.split('/').pop() || 'document'
  const name = rawName.includes('.')
    ? rawName
    : rawName + mimeToExt(response.headers.get('content-type') ?? blob.type)

  return new File([blob], name, { type: blob.type || 'text/html' })
}
