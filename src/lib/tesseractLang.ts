const LANG_MAP: Record<string, string> = {
  en: 'eng', es: 'spa', fr: 'fra', de: 'deu', pt: 'por',
  it: 'ita', nl: 'nld', ru: 'rus', ja: 'jpn', zh: 'chi_sim',
  pl: 'pol', ko: 'kor', ar: 'ara', tr: 'tur', sv: 'swe',
}

export function detectTesseractLang(): string {
  if (typeof navigator === 'undefined') return 'eng'
  const lang = (navigator.language || navigator.languages?.[0] || 'en').split('-')[0].toLowerCase()
  return LANG_MAP[lang] ?? 'eng'
}
