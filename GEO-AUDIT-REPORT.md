# GEO Audit Report: ConverterToMarkdown

**Audit Date:** 2026-05-19
**URL:** https://convertertomarkdown.vercel.app
**Business Type:** SaaS / Free Web Tool (browser-based file converter)
**Pages Analyzed:** 5 (/, /como-funciona, /casos-de-uso, /privacidad, /licencia)

---

## Executive Summary

**Overall GEO Score: 13/100 — Critical**

ConverterToMarkdown is a well-built browser tool with genuine user value, but it is virtually invisible to every AI system. The root cause is a single architectural decision: pure client-side rendering (CSR). When GPTBot, ClaudeBot, PerplexityBot, or Googlebot fetch the site, they receive an empty `<div id="root"></div>` with no content to index, cite, or recommend. Compounding this, the site has zero schema markup, no robots.txt, no llms.txt, no sitemap, no meta description, and no third-party brand mentions. The good news: three of the five critical gaps (llms.txt, meta tags, schema) can be fixed in `index.html` and `public/` without touching the rendering architecture, delivering immediate GEO gains even before SSR is implemented.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 3/100 | 25% | 0.75 |
| Brand Authority | 5/100 | 20% | 1.00 |
| Content E-E-A-T | 34/100 | 20% | 6.80 |
| Technical GEO | 22/100 | 15% | 3.30 |
| Schema & Structured Data | 0/100 | 10% | 0.00 |
| Platform Optimization | 7/100 | 10% | 0.70 |
| **Overall GEO Score** | | | **13/100** |

---

## Critical Issues (Fix Immediately)

### C1 — Pure CSR: AI crawlers see an empty page
**Affected pages:** All 5 routes
**Impact:** GPTBot, ClaudeBot, PerplexityBot, Googlebot receive `<div id="root"></div>` only. Zero content is indexable or citable. This single issue accounts for the low AI Citability score (3/100).
**Fix:** Add static pre-rendering for the 5 routes at build time using `vite-plugin-prerender` or `vite-ssg`. All 5 pages are static content — no server required, no auth — making them ideal candidates for SSG. Alternatively, migrate homepage to Next.js App Router if more control is needed.

### C2 — No llms.txt
**Affected pages:** Entire site
**Impact:** The only AI-readable discovery file is absent. Currently the single fastest way to make the tool visible to AI systems that respect llms.txt (Perplexity, Claude, others).
**Fix:** Create `/public/llms.txt` immediately (see template in Quick Wins section).

### C3 — No schema markup anywhere
**Affected pages:** All 5 routes
**Impact:** Schema score 0/100. AI models cannot understand what the site is, who built it, or what it does from structured signals. No SoftwareApplication, no Organization, no WebSite schema.
**Fix:** Add `SoftwareApplication` + `Organization` + `WebSite` JSON-LD directly to `index.html <head>` — parseable by crawlers without JS execution (see exact snippets in Schema section).

### C4 — No meta description, no Open Graph tags
**Affected pages:** All (index.html)
**Impact:** Search snippets are auto-generated (low quality). Social shares show no preview. AI models that parse `<head>` find only `<title>ConverterToMarkdown</title>`.
**Fix:** Add to `index.html <head>`: description, og:title, og:description, og:url, og:type, twitter:card. These are read from the HTML shell even without SSR.

### C5 — No robots.txt
**Affected pages:** Site root
**Impact:** No sitemap reference for crawlers. No explicit AI crawler allowlist. No signal of site structure.
**Fix:** Create `/public/robots.txt` with explicit allow rules for all major AI crawlers and a sitemap reference.

---

## High Priority Issues

### H1 — No sitemap.xml
All 5 routes are invisible to crawlers that rely on sitemaps. Without a sitemap, /como-funciona and /casos-de-uso (the most citable content pages) will not be discovered even if SSR is implemented.
**Fix:** Generate `/public/sitemap.xml` listing all 5 routes with `<lastmod>` dates.

### H2 — lang="es" hardcoded, overridden dynamically
`index.html` has `lang="es"` but JS changes it to the browser language. Crawlers see Spanish regardless of content language. English-language content gets classified as Spanish.
**Fix:** Remove `lang="es"` from `index.html` and set it only via `document.documentElement.lang` in `detectLang()` (already done), or default to `lang="en"` in the static shell as the wider-reach language.

### H3 — GitHub repo returned 404 to AI crawlers
The GitHub repo `franciscovaleromartin/convertertomarkdown` is private or inaccessible. Public GitHub repos are indexed by AI training corpora and create authoritative third-party mentions.
**Fix:** Make the repo public. Add descriptive README with live demo link. Add GitHub topics: `markdown`, `converter`, `docx-to-markdown`, `pdf-to-markdown`, `browser-tool`.

### H4 — No About/author page
Francisco Valero is named in the footer but has no bio page on the site. No credentials, no story, no motivation for building the tool. E-E-A-T score suffers significantly.
**Fix:** Add an `/about` page or author section on the homepage with bio, credentials, link to graphmycode.com (existing indexed project), LinkedIn, and a "Why I built this" paragraph.

### H5 — Zero brand presence on AI-cited platforms
No Product Hunt listing, no Reddit thread, no Hacker News post, no dev.to article. AI models (especially Perplexity) cite community sources heavily. The tool is unrecognized as an entity.
**Fix:** Submit to Product Hunt. Post "Show HN" on Hacker News. Submit to AlternativeTo and awesome-markdown lists on GitHub.

---

## Medium Priority Issues

### M1 — No content publication/update dates
No `<time>` elements, no `datePublished`, no visible "last updated" on any page. Perplexity weights freshness heavily.
**Fix:** Add a `<meta name="last-modified" content="2026-05-19">` to index.html and visible dates to content pages.

### M2 — No external citations on /como-funciona
The tech detail page describes mammoth, pdf.js, SheetJS, Turndown, and PapaParse but doesn't link to their official documentation. Zero outbound authoritative links hurts Trustworthiness.
**Fix:** Add hyperlinks to the official documentation of each library in the tech table.

### M3 — Thin topical coverage (5 pages, ~1,000 words total)
The site has no format-specific landing pages, no FAQ section, no comparison content. AI models prefer sites with topical depth.
**Fix:** Add one format-specific page (e.g., `/convert/pdf-to-markdown`) and a FAQ section on the homepage with 5 direct-answer questions.

### M4 — No canonical URL declared
URL variants (https vs http, trailing slash, www) create duplicate content signals.
**Fix:** Add `<link rel="canonical" href="https://convertertomarkdown.vercel.app">` to index.html.

### M5 — No Bing Webmaster Tools verification
Bing has no verified access to the site. Bing Copilot relies on Bing's index.
**Fix:** Add `<meta name="msvalidate.01" content="[TOKEN]">` after verifying at Bing Webmaster Tools. Submit sitemap via BWT.

---

## Low Priority Issues

### L1 — No speakable schema
No content sections are marked for AI voice/reading extraction.

### L2 — No Twitter/X presence
No twitter:card meta tags. No @handle. Minor signal for ChatGPT/Gemini entity resolution.

### L3 — No cross-link from graphmycode.com
An existing indexed Google property (graphmycode.com) by the same author is not linking to this tool. One descriptive link would accelerate Gemini Knowledge Graph association.

### L4 — README is Vite template boilerplate
The GitHub README (when public) should describe the tool, not the Vite scaffold. Crawlers and AI training corpora index READMEs heavily.

---

## Category Deep Dives

### AI Citability — 3/100
When any AI crawler fetches https://convertertomarkdown.vercel.app, the complete indexable text is: `ConverterToMarkdown`. That is the entirety of the `<title>` tag — the only readable signal in the HTML shell. The tool's real value proposition, its 10 supported formats, its privacy model, its step-by-step guide, and all use cases are rendered client-side and are invisible to every AI system. Citation-ready passages: 0. The 3 points reflect the fact that the domain name itself is semantically descriptive.

**What good looks like:** A pre-rendered homepage with an H1 ("Free File to Markdown Converter"), a 60-word description paragraph above the fold, a format list, and a clear privacy claim ("no file upload required"). Each of these is a citable passage.

### Brand Authority — 5/100
- Wikipedia: No article. Top Wikipedia results for "ConverterToMarkdown" return Pandoc and Typst (competitors).
- Reddit: No confirmed threads or mentions.
- YouTube: No videos found.
- LinkedIn: No company page.
- GitHub: Repo private/inaccessible — no open-source authority signal.
- Product Hunt / AlternativeTo: Not listed.
- The 5 points are a floor credit for the site existing on Vercel's CDN.

The brand is not yet recognized as an entity by any AI model. Francisco Valero has an existing entity footprint via graphmycode.com, but it is not connected to this tool.

### Content E-E-A-T — 34/100
**Experience (7/25):** The tech stack table on /como-funciona is the strongest specificity signal. No first-hand narrative, no "why I built this," no benchmarks or failure stories, no before/after examples.

**Expertise (8/25):** Author identity is established (name, LinkedIn, personal site) but there is no author bio page on the site. Library choices are listed but not explained. No technical depth beyond naming dependencies.

**Authoritativeness (8/25):** No external citations, no About page, no press mentions, no industry recognition. Zero outbound links to authoritative sources.

**Trustworthiness (13/25):** Privacy page is the strongest E-E-A-T asset — 6 detailed sections, explains URL fetch mode, names the contact email. MIT license page with full dependency table is a genuine trust signal. HTTPS active. Gaps: no ToS, no content dates, no correction policy.

### Technical GEO — 22/100
The dominant problem is CSR architecture (0/100 on rendering). Secondary issues: no robots.txt, no sitemap, no llms.txt, no meta tags beyond title, hardcoded `lang="es"`, no CSP header. Positives: Vercel TLS enforced, clean URL structure, fast CDN, viewport meta present (injected by Vite), Vercel Analytics installed. Google Fonts are render-blocking (LCP risk) — `<link rel="preconnect">` tags are already in index.html which partially mitigates this.

### Schema & Structured Data — 0/100
Zero schema of any kind anywhere. The site has no JSON-LD, no Microdata, no RDFa. For AI systems, this means no machine-readable confirmation of what the tool is, who built it, that it's free, or what it does. Note: any schema added client-side via React effects will still be invisible to crawlers — all schema must be in the static `index.html <head>`.

### Platform Optimization — 7/100
Every platform scores in the 6-8 range because the same root cause (CSR + no meta tags + no entity footprint) blocks all of them equally. The one differentiator: the domain name "convertertomarkdown" is semantically self-describing, giving Google AI Overviews a marginally higher score (8) over ChatGPT (6) which requires Wikipedia/Wikidata entity recognition.

---

## Quick Wins (Implement This Week)

These five actions require zero SSR changes, zero new dependencies, and can be deployed in under 2 hours.

### QW1 — Add `/public/llms.txt`
```
# ConverterToMarkdown

> Free browser-based tool to convert DOCX, PDF, XLSX, XLS, HTML, TXT, MD, CSV, JSON, and XML files to Markdown. No upload, no server — 100% client-side processing.

## Tool

- [Converter](https://convertertomarkdown.vercel.app/): Upload or paste a URL. Get clean Markdown output instantly.

## Documentation

- [How it works](https://convertertomarkdown.vercel.app/como-funciona): Step-by-step guide and library breakdown.
- [Use cases](https://convertertomarkdown.vercel.app/casos-de-uso): Developers, writers, students, data teams, AI/LLM context prep.

## Legal

- [Privacy Policy](https://convertertomarkdown.vercel.app/privacidad): No data collected. Files never leave the browser.
- [License](https://convertertomarkdown.vercel.app/licencia): MIT License.

## Author

Francisco Valero — https://francisco-valero.com
```

### QW2 — Add meta tags to `index.html`
```html
<meta name="description" content="Convert DOCX, PDF, XLSX, HTML, CSV, JSON and XML to Markdown free. No upload — 100% browser-side. Edit and download the result." />
<link rel="canonical" href="https://convertertomarkdown.vercel.app" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://convertertomarkdown.vercel.app" />
<meta property="og:title" content="ConverterToMarkdown — Free File to Markdown Converter" />
<meta property="og:description" content="Convert DOCX, PDF, XLSX, HTML, CSV, JSON, XML and more to Markdown directly in your browser. No upload, no server, 100% free." />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="ConverterToMarkdown — Free File to Markdown Converter" />
<meta name="twitter:description" content="10 formats to Markdown. No upload. Runs entirely in your browser." />
```

### QW3 — Add JSON-LD to `index.html <head>`
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "ConverterToMarkdown",
      "url": "https://convertertomarkdown.vercel.app",
      "description": "Free browser-based tool to convert DOCX, PDF, XLSX, XLS, HTML, TXT, MD, CSV, JSON and XML files to Markdown. No file upload — all processing is local.",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web",
      "isAccessibleForFree": true,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": ["DOCX to Markdown","PDF to Markdown","XLSX to Markdown","HTML to Markdown","CSV to Markdown","JSON to Markdown","XML to Markdown","TXT to Markdown","No file upload required"],
      "author": {
        "@type": "Person",
        "name": "Francisco Valero",
        "url": "https://francisco-valero.com",
        "sameAs": ["https://www.linkedin.com/in/francisco-valero/"]
      },
      "datePublished": "2026-05-01",
      "dateModified": "2026-05-19",
      "inLanguage": ["es", "en"]
    },
    {
      "@type": "Organization",
      "@id": "https://convertertomarkdown.vercel.app/#org",
      "name": "ConverterToMarkdown",
      "url": "https://convertertomarkdown.vercel.app",
      "sameAs": ["https://github.com/franciscovaleromartin/convertertomarkdown"]
    },
    {
      "@type": "WebSite",
      "@id": "https://convertertomarkdown.vercel.app/#website",
      "url": "https://convertertomarkdown.vercel.app",
      "name": "ConverterToMarkdown",
      "publisher": { "@id": "https://convertertomarkdown.vercel.app/#org" }
    }
  ]
}
</script>
```

### QW4 — Add `/public/robots.txt`
```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://convertertomarkdown.vercel.app/sitemap.xml
```

### QW5 — Add `/public/sitemap.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://convertertomarkdown.vercel.app/</loc><lastmod>2026-05-19</lastmod><priority>1.0</priority></url>
  <url><loc>https://convertertomarkdown.vercel.app/como-funciona</loc><lastmod>2026-05-19</lastmod><priority>0.8</priority></url>
  <url><loc>https://convertertomarkdown.vercel.app/casos-de-uso</loc><lastmod>2026-05-19</lastmod><priority>0.8</priority></url>
  <url><loc>https://convertertomarkdown.vercel.app/privacidad</loc><lastmod>2026-05-19</lastmod><priority>0.5</priority></url>
  <url><loc>https://convertertomarkdown.vercel.app/licencia</loc><lastmod>2026-05-19</lastmod><priority>0.4</priority></url>
</urlset>
```

---

## 30-Day Action Plan

### Week 1: Static files + meta (0 code risk, high GEO impact)
- [ ] Create `/public/llms.txt` (QW1)
- [ ] Add meta description + OG + Twitter Card to `index.html` (QW2)
- [ ] Add JSON-LD schema block to `index.html <head>` (QW3)
- [ ] Create `/public/robots.txt` (QW4)
- [ ] Create `/public/sitemap.xml` (QW5)
- [ ] Fix `lang` attribute: change `index.html` from `lang="es"` to `lang="en"` (wider reach)
- [ ] Make GitHub repo public + rewrite README with tool description, demo link, and format list
- [ ] Add link from graphmycode.com footer pointing to convertertomarkdown.vercel.app

### Week 2: SSR / Static pre-rendering
- [ ] Add `vite-plugin-ssg` or `vite-plugin-prerender` to pre-render the 5 static routes at build time
- [ ] Verify pre-rendered HTML contains H1, content paragraphs, and schema via `curl https://convertertomarkdown.vercel.app | grep '<h1'`
- [ ] Add `react-helmet-async` for per-page title and meta tags (/como-funciona, /casos-de-uso get their own `<title>` and `<meta name="description">`)
- [ ] Add BreadcrumbList schema to /como-funciona and /casos-de-uso

### Week 3: Content depth + E-E-A-T
- [ ] Add author section to homepage: Francisco Valero bio, photo if available, link to graphmycode.com
- [ ] Add "Why I built this" paragraph (100 words, first-person, specific)
- [ ] Add external links on /como-funciona to official mammoth, pdf.js, SheetJS, Turndown docs
- [ ] Add 5-question FAQ section to homepage with 50-word direct answers (format: "How do I convert PDF to Markdown?", "Is it free?", "Are my files uploaded?", "What formats are supported?", "Can I edit the output?")
- [ ] Add `datePublished` and `dateModified` visible dates to all 5 pages

### Week 4: Distribution + entity establishment
- [ ] Submit to Product Hunt
- [ ] Post "Show HN" on Hacker News: "ConverterToMarkdown – convert DOCX/PDF/XLSX to Markdown in the browser, no upload"
- [ ] Submit to AlternativeTo (category: Markdown editors / file converters)
- [ ] Submit repo to relevant awesome-markdown GitHub lists
- [ ] Verify Bing Webmaster Tools + submit sitemap
- [ ] Implement IndexNow via Vercel integration (pushes URLs to Bing/Yandex instantly)

---

## Appendix: Pages Analyzed

| URL | Title (static shell) | GEO Issues |
|---|---|---|
| `https://convertertomarkdown.vercel.app/` | "ConverterToMarkdown" | C1, C2, C3, C4, C5, H1, H2, M4 |
| `https://convertertomarkdown.vercel.app/como-funciona` | "ConverterToMarkdown" | C1, C3, M2, M3 |
| `https://convertertomarkdown.vercel.app/casos-de-uso` | "ConverterToMarkdown" | C1, C3 |
| `https://convertertomarkdown.vercel.app/privacidad` | "ConverterToMarkdown" | C1, C3 |
| `https://convertertomarkdown.vercel.app/licencia` | "ConverterToMarkdown" | C1, C3 |

*Note: All 5 pages return the same `<title>` tag because the SPA shell is identical for every route. Per-page titles exist only in the React component tree, not in the served HTML.*
