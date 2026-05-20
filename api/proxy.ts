/// <reference types="node" />
import type { VercelRequest, VercelResponse } from '@vercel/node'

// Block loopback, link-local (AWS/GCP metadata at 169.254.169.254), and RFC-1918 ranges
const PRIVATE_HOST_RE = /^(localhost|127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|::1$|fc[0-9a-f]{2}:|fe[89ab][0-9a-f]:)/i

const MAX_BYTES = 20 * 1024 * 1024 // 20 MB — matches app file size limit

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url parameter' })
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return res.status(400).json({ error: 'Only http/https URLs are allowed' })
  }

  if (PRIVATE_HOST_RE.test(parsed.hostname)) {
    return res.status(403).json({ error: 'Forbidden host' })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ConverterToMarkdown/1.0)' },
    })

    const declared = Number(response.headers.get('content-length') ?? 0)
    if (declared > MAX_BYTES) {
      return res.status(413).json({ error: 'Response too large' })
    }

    const buffer = await response.arrayBuffer()
    if (buffer.byteLength > MAX_BYTES) {
      return res.status(413).json({ error: 'Response too large' })
    }

    const contentType = response.headers.get('content-type') ?? 'application/octet-stream'
    res.setHeader('Content-Type', contentType)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(response.status).send(Buffer.from(buffer))
  } finally {
    clearTimeout(timeout)
  }
}
