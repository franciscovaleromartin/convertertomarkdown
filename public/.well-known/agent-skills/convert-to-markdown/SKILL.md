---
name: convert-to-markdown
description: Convert DOCX, PDF, XLSX, XLS, HTML, TXT, CSV, JSON, XML and images (JPG, PNG, WEBP, BMP, GIF, with OCR) into clean Markdown, locally and without uploading files anywhere.
---

# Convert files to Markdown

Turn documents, spreadsheets and images into clean Markdown for use as LLM
context, documentation or notes. All conversion runs locally — files are never
uploaded to a server.

## When to use

- A user gives you a DOCX, PDF, XLSX, CSV, HTML or image and you need its text as Markdown.
- You need to prepare a document corpus as context for a model.
- A PDF or image is scanned and needs OCR before its text is usable.

## How to use

### Option A — MCP server (recommended for agents)

Run the Model Context Protocol server, which exposes conversion as a tool over
stdio:

```
npx convertertomarkdown-mcp
```

Register it in your MCP client config, for example:

```json
{
  "mcpServers": {
    "convertertomarkdown": {
      "command": "npx",
      "args": ["convertertomarkdown-mcp"]
    }
  }
}
```

Source: https://github.com/franciscovaleromartin/convertertomarkdown-mcp

Note: the converted Markdown is returned into the conversation, so it consumes
context tokens. For very large files, convert in the browser instead and hand
the agent only the part it needs.

### Option B — Browser

Open https://www.convertertomarkdown.com and use one of three input modes:

1. **File** — drag & drop or pick a single file.
2. **URL** — paste a public link; the page is fetched and converted.
3. **Multiple files** — batch conversion, downloadable individually or as a ZIP.

The result opens in an editor with live HTML preview, and can be copied or
downloaded as `.md`.

## Supported formats

| Input | Handling |
|---|---|
| DOCX | mammoth.js → HTML → Turndown |
| PDF | pdf.js text layer; OCR fallback for scanned pages |
| XLSX, XLS, CSV | SheetJS / PapaParse → Markdown tables |
| HTML | Turndown |
| JSON, XML | pretty-printed into fenced code blocks |
| TXT, MD | passed through |
| JPG, PNG, WEBP, BMP, GIF | Tesseract.js OCR |

## Limits

- Maximum file size: 20 MB.
- OCR accuracy depends on scan quality; handwriting is not reliably extracted.
- Complex DOCX/PDF layouts (multi-column, floating text boxes) may lose ordering.
- No conversion history is stored — nothing persists after the tab is closed.

## Reference

- Full machine-readable documentation: https://www.convertertomarkdown.com/llms-full.txt
- License: MIT
