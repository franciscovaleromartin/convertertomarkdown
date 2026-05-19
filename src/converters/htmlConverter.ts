import TurndownService from 'turndown'

function isFullDocument(html: string): boolean {
  return /<!doctype/i.test(html) || /<html[\s>]/i.test(html) || /<head[\s>]/i.test(html)
}

function cleanDocument(html: string): { clean: string; doc: Document } {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Remove noise elements entirely
  for (const sel of ['style', 'script', 'link', 'meta', 'noscript', 'svg']) {
    doc.querySelectorAll(sel).forEach(el => el.remove())
  }

  // Strip inline style attributes
  doc.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'))

  // Replace button elements with their text content
  doc.querySelectorAll('button').forEach(el => {
    el.replaceWith(doc.createTextNode(el.textContent || ''))
  })

  const clean = doc.body ? doc.body.innerHTML : doc.documentElement.innerHTML
  return { clean, doc }
}

const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })

// Skip SVG (handles fragment mode; full-doc mode removes via DOM)
td.addRule('skipSvg', {
  filter: (node) => node.nodeName.toLowerCase() === 'svg',
  replacement: () => ''
})

// Strip style/script/noscript content if they somehow reach Turndown
td.addRule('skipNoise', {
  filter: ['style', 'script', 'noscript'],
  replacement: () => ''
})

// Render <br> as a plain newline
td.addRule('brToNewline', {
  filter: 'br',
  replacement: () => '\n'
})

// Render <button> as its text content, no markup
td.addRule('buttonToText', {
  filter: 'button',
  replacement: (content) => content
})

export async function convertHtml(file: File): Promise<string> {
  const text = await file.text()

  let htmlToConvert = text
  let parsedDoc: Document | null = null

  if (isFullDocument(text)) {
    const { clean, doc } = cleanDocument(text)
    htmlToConvert = clean
    parsedDoc = doc
  }

  let result = td.turndown(htmlToConvert).trim()

  // Fallback: if Turndown produced nearly nothing, extract raw text
  if (result.length < 50) {
    const parser = new DOMParser()
    const doc = parsedDoc ?? parser.parseFromString(text, 'text/html')
    const fallback = (doc.body?.textContent ?? doc.documentElement.textContent ?? '').trim()
    if (fallback.length > result.length) {
      result = fallback
    }
  }

  if (!result) {
    throw new Error('El archivo HTML no contiene texto convertible.')
  }

  return result
}
