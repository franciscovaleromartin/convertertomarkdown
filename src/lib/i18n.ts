import { useState, useEffect } from 'react'

export type Lang = 'es' | 'en'

export function detectLang(): Lang {
  const lang =
    (typeof navigator !== 'undefined' && (navigator.language || navigator.languages?.[0])) || 'en'
  const detected: Lang = lang.startsWith('es') ? 'es' : 'en'
  if (typeof document !== 'undefined') {
    document.documentElement.lang = detected
  }
  return detected
}

const translations = {
  es: {
    // ── Hero ──────────────────────────────────────────────────────────────
    heroBy: 'por Francisco Valero',
    heroTagline: 'Convierte archivos a Markdown directamente en tu navegador',
    statFormats: 'formatos compatibles',
    statMax: 'máximo',
    statServers: 'servidores',
    statEdit: 'Edita y descarga',

    // ── Tabs ──────────────────────────────────────────────────────────────
    tabFile: 'Archivo',
    tabUrl: 'URL',

    // ── DropZone ──────────────────────────────────────────────────────────
    dropTitle: 'Arrastra tu archivo aquí',
    dropSubtitle: 'o haz clic para seleccionar',

    // ── UrlInput ──────────────────────────────────────────────────────────
    urlTitle: 'Pega la URL del archivo',
    urlSubtitle: 'PDF, DOCX, HTML, TXT y más · La URL debe ser accesible públicamente',
    urlPlaceholder: 'https://ejemplo.com/documento.pdf',
    urlButton: 'Convertir',

    // ── FileInfo ──────────────────────────────────────────────────────────
    fileConverting: 'Convirtiendo…',
    fileChange: '✕ Cambiar',
    fileUnknownType: 'tipo desconocido',
    ocrNote: 'El OCR extrae texto impreso de imágenes. La escritura a mano puede tener menor precisión.',

    // ── OutputPanel ───────────────────────────────────────────────────────
    outputLines: 'líneas',
    outputCopy: 'Copiar',
    outputCopied: '¡Copiado!',
    outputDownload: '↓ Descargar .md',

    // ── Errors ────────────────────────────────────────────────────────────
    errFileTooLarge: 'El archivo supera el límite de 20 MB.',
    errConvert: 'Error desconocido al convertir el archivo.',
    errUrl: 'Error al obtener la URL.',
    errHtmlNoContent: 'El archivo HTML no contiene texto convertible.',
    errJsonInvalid: 'JSON inválido: el archivo no puede parsearse.',

    // ── Privacy badge ─────────────────────────────────────────────────────
    privacyBadge: 'Procesamiento 100% local · ningún archivo sale de tu navegador',

    // ── Page meta (for Helmet + SSR) ──────────────────────────────────────
    pageHomeTitle: 'ConverterToMarkdown — Convertidor gratuito de archivos a Markdown',
    pageHomeDesc: 'Convierte DOCX, PDF, XLSX, HTML, CSV, JSON, XML y más a Markdown en tu navegador. Sin subir archivos. Sin servidores. 100% gratis.',
    pageHowTitle: 'Cómo funciona — ConverterToMarkdown',
    pageHowDesc: 'Tres pasos para convertir cualquier archivo a Markdown. Procesamiento local con mammoth, pdf.js, SheetJS, Turndown y PapaParse. Sin subida de archivos.',
    pageUsecasesTitle: 'Casos de uso — ConverterToMarkdown',
    pageUsecasesDesc: 'Cómo usan ConverterToMarkdown desarrolladores, escritores, estudiantes, analistas de datos y equipos de IA para preparar contexto.',
    pagePrivacyTitle: 'Política de privacidad — ConverterToMarkdown',
    pagePrivacyDesc: 'Sin recopilación de datos. Todo el procesamiento ocurre en tu navegador. Tus archivos nunca salen de tu dispositivo.',
    pageLicenseTitle: 'Licencia — ConverterToMarkdown',
    pageLicenseDesc: 'ConverterToMarkdown es de uso libre y código abierto bajo licencia MIT.',

    faqQ10: '¿Qué es Markdown?',
    faqA10: 'Markdown es un formato de texto ligero que usa símbolos simples para estructurar documentos: # para encabezados, **texto** para negrita, *texto* para cursiva, - para listas y `texto` para código. Se lee como texto plano pero se renderiza como contenido formateado. Es el formato estándar en GitHub, Notion, Obsidian, VS Code, ChatGPT, Claude y la mayoría de herramientas de IA.',

    // ── LandingCards ──────────────────────────────────────────────────────
    cardsFormatsTag: 'Formatos',
    cardsFormatsTitle: '15 tipos de archivo compatibles',
    cardsFormatsSub: 'Documentos, hojas de cálculo, páginas web, datos estructurados e imágenes.',
    fmtDocxDesc: 'Documentos Word',
    fmtPdfDesc: 'PDFs con texto extraíble',
    fmtXlsxDesc: 'Hojas de cálculo Excel',
    fmtHtmlDesc: 'Páginas y fragmentos web',
    fmtTxtDesc: 'Texto plano y Markdown',
    fmtCsvDesc: 'Tablas y formularios',
    fmtJsonDesc: 'Datos JSON formateados',
    fmtXmlDesc: 'Datos XML formateados',
    fmtImgDesc: 'Extracción de texto por OCR',
    cardsPrivacyTag: 'Privacidad',
    cardsPrivacyTitle: 'Tu archivo nunca sale del navegador',
    cardsPrivacyBody:
      'Sin uploads, sin servidores, sin datos enviados a terceros. Todo el procesamiento ocurre localmente usando las APIs de tu navegador. Funciona incluso sin conexión una vez cargada la página.',
    cardsEditTag: 'Edición',
    cardsEditTitle: 'Markdown editable',
    cardsEditBody:
      'Edita el resultado directamente en pantalla. Cópialo al portapapeles o descárgalo como .md.',
    cardsUrlTag: 'URL',
    cardsUrlTitle: 'Convierte desde URL',
    cardsUrlBody:
      'Pega la URL de cualquier archivo público y lo convierte al instante, sin descargarlo.',

    // ── FAQ ───────────────────────────────────────────────────────────────
    faqTitle: 'Preguntas frecuentes',
    faqQ1: '¿Cuántos formatos de archivo son compatibles?',
    faqA1: '15 formatos: DOCX, PDF, XLSX, XLS, HTML, TXT, MD, CSV, JSON, XML, JPG, PNG, WEBP, BMP y GIF. Las imágenes se convierten mediante OCR (reconocimiento óptico de caracteres). Se añaden más según la demanda de los usuarios.',
    faqQ2: '¿Se sube mi archivo a algún servidor?',
    faqA2: 'No. Todo el procesamiento ocurre en tu navegador mediante JavaScript. Tu archivo nunca abandona tu dispositivo y ningún dato se envía a servidores externos.',
    faqQ3: '¿Es gratuito?',
    faqA3: 'Sí, completamente gratuito y sin registro. No se requiere cuenta ni tarjeta de crédito.',
    faqQ4: '¿Cuál es el tamaño máximo de archivo?',
    faqA4: '20 MB por archivo. Si tu documento es mayor, considera comprimirlo o dividir el contenido antes de convertirlo.',
    faqQ5: '¿Puedo editar el Markdown generado?',
    faqA5: 'Sí. El resultado aparece en un editor de texto donde puedes modificarlo directamente. Luego puedes copiarlo al portapapeles o descargarlo como archivo .md.',
    faqQ6: '¿Funciona sin conexión a internet?',
    faqA6: 'Sí. Una vez cargada la página, el conversor funciona completamente sin conexión. No se requiere internet para procesar archivos.',
    faqQ7: '¿Funciona en móvil?',
    faqA7: 'Sí. Funciona en Chrome, Safari y Firefox para Android e iOS. Puedes seleccionar archivos desde el almacenamiento de tu dispositivo o desde apps de nube como Google Drive o iCloud.',
    faqQ8: '¿Qué ocurre con los PDFs escaneados o con imágenes?',
    faqA8: 'Los PDFs se procesan extrayendo su texto directamente. Para imágenes (JPG, PNG, WEBP, BMP, GIF) la herramienta realiza OCR en el navegador con Tesseract.js. Funciona bien con texto impreso; la escritura a mano puede tener menor precisión.',
    faqQ9: '¿Puedo convertir varios archivos a la vez?',
    faqA9: 'Actualmente un archivo por conversión. Cada conversión es independiente e instantánea, por lo que puedes procesar varios archivos seguidos sin recargar la página.',

    // ── Author section ────────────────────────────────────────────────────
    authorTitle: 'Sobre el creador',
    authorName: 'Francisco Valero',
    authorBio: 'Soy desarrollador independiente especializado en herramientas web de productividad. Construí ConverterToMarkdown porque necesitaba convertir documentación, PDFs y hojas de cálculo a Markdown de forma recurrente —para repos de GitHub, notas en Obsidian y contexto para LLMs— y no encontraba ninguna herramienta gratuita y sin subida de archivos que funcionara completamente en el navegador. Si te resulta útil, también puedes ver mi otro proyecto,',
    authorOtherProject: 'GraphMyCode — visualiza la arquitectura de tu código',

    // ── LandingFooter ─────────────────────────────────────────────────────
    footerHow: 'Cómo funciona',
    footerUseCases: 'Casos de uso',
    footerPrivacy: 'Política de privacidad',
    footerLicense: 'Licencia',

    // ── Back button ───────────────────────────────────────────────────────
    back: '← Volver',

    // ── ComoFunciona page ─────────────────────────────────────────────────
    howTitle: 'Cómo funciona',
    howSubtitle:
      'En tres pasos, de archivo a Markdown. Sin instalación, sin cuenta, sin datos que salgan de tu navegador.',
    howStep1Title: 'Elige tu archivo o URL',
    howStep1Body:
      'Arrastra un archivo al área de conversión, haz clic para seleccionarlo desde tu sistema, o cambia al modo URL y pega el enlace de cualquier archivo público (PDF en un CDN, DOCX en un servidor, etc.). Compatible con DOCX, PDF, XLSX, XLS, HTML, TXT, MD, CSV, JSON y XML. Tamaño máximo: 20 MB.',
    howStep2Title: 'El navegador lo procesa',
    howStep2Body:
      'El archivo se convierte completamente en tu navegador usando librerías JavaScript especializadas: mammoth.js para DOCX, pdf.js para PDF, SheetJS para Excel, Turndown para HTML y PapaParse para CSV. Ningún byte se envía a ningún servidor. El proceso es instantáneo para archivos pequeños y no requiere conexión a internet una vez que la página está cargada.',
    howStep3Title: 'Edita, copia o descarga',
    howStep3Body:
      'El Markdown resultante aparece en un editor de texto directamente en pantalla. Puedes modificar el resultado antes de usarlo, copiarlo al portapapeles con un clic o descargarlo como fichero .md listo para usar en GitHub, GitLab, Notion, Obsidian, Docusaurus, Jekyll, Hugo o cualquier editor que entienda Markdown.',
    howTechTitle: 'Detalle por formato',
    techDocx:
      'Convierte a HTML intermedio usando mammoth.js, preservando encabezados (h1–h6), negrita, cursiva, tablas y listas. El HTML se limpia y pasa a Markdown con Turndown. Las imágenes se omiten; solo se convierte el contenido de texto.',
    techPdf:
      'Extrae texto de cada página usando pdf.js (el motor de renderizado de PDF de Mozilla). Mejores resultados en PDFs basados en texto. Los documentos escaneados como imágenes requieren OCR, que esta herramienta no realiza. Cabeceras y pies de página pueden fusionarse con el cuerpo según la estructura del PDF.',
    techXlsx:
      'Lee el libro de trabajo con SheetJS y convierte cada hoja en una tabla Markdown separada con columnas delimitadas por barras verticales. Los archivos con múltiples hojas producen múltiples tablas, cada una etiquetada con el nombre de la hoja. Las fórmulas se resuelven a sus valores actuales.',
    techHtml:
      'Elimina estilos inline, scripts, elementos de navegación y ruido visual con DOMParser antes de pasar el HTML limpio a Turndown. Preserva la estructura semántica: encabezados, párrafos, enlaces, énfasis, citas en bloque y bloques de código.',
    techCsv:
      'Analiza archivos CSV con PapaParse, detectando automáticamente el delimitador (coma, punto y coma, tabulador). Genera una tabla Markdown con detección de fila de encabezado. Compatible con archivos grandes de cientos de filas.',
    techTxt: 'Devuelve el texto plano sin transformación. Los saltos de línea se preservan tal cual.',
    techJson:
      'Valida la estructura JSON y envuelve la salida formateada en un bloque de código delimitado con resaltado de sintaxis json. Gestiona objetos anidados, arrays, JSON minificado y entrada malformada.',
    techXml:
      'Envuelve el contenido XML en un bloque de código delimitado preservando la indentación y estructura. Útil para inspección y propósitos de documentación.',

    // ── CasosDeUso page ───────────────────────────────────────────────────
    usecasesTitle: 'Casos de uso',
    usecasesSubtitle:
      'ConverterToMarkdown.com es útil en cualquier flujo donde necesites transformar contenido a Markdown sin instalar nada ni subir archivos a ningún servidor.',
    uc1Title: 'Desarrolladores',
    uc1Tag: 'Documentación',
    uc1Body:
      'Convierte especificaciones en Word o PDF a Markdown para publicarlas en GitHub, GitLab, Docusaurus o un wiki interno. Arrastra el archivo, obtén Markdown al instante y preserva encabezados, negrita, tablas y listas. Sin necesidad de tener Word instalado ni perder formato en el copiar-pegar. Útil para archivos README, descripciones de PR, documentación de APIs y changelogs.',
    uc2Title: 'Escritores y bloggers',
    uc2Tag: 'Migración de contenido',
    uc2Body:
      'Migra artículos de Word a Markdown para publicarlos en Jekyll, Hugo, Ghost o Astro sin reescribir nada. Conserva encabezados, énfasis, enlaces y párrafos intactos. Exporta desde Google Docs o Word, arrastra el archivo y obtén un .md listo para hacer commit. Ideal para migrar blogs enteros a generadores de sitios estáticos.',
    uc3Title: 'Estudiantes',
    uc3Tag: 'Apuntes y notas',
    uc3Body:
      'Convierte apuntes en PDF, presentaciones o documentos de Word a Markdown para organizarlos en Obsidian o Notion. Transforma diapositivas de clases en texto plano con capacidad de búsqueda, crea notas enlazadas desde PDFs de cursos o importa materiales de lectura como Markdown estructurado para tu sistema de gestión del conocimiento.',
    uc4Title: 'Analistas de datos',
    uc4Tag: 'Tablas y datos',
    uc4Body:
      'Transforma informes en Excel o CSV en tablas Markdown para incluirlas en documentación técnica o informes de PR. Cada hoja se convierte en una tabla Markdown con encabezados de columna alineados. Pega directamente en comentarios de GitHub, archivos README o páginas de Confluence sin reformatear manualmente.',
    uc5Title: 'Equipos y empresas',
    uc5Tag: 'Estandarización',
    uc5Body:
      'Unifica documentos internos de múltiples formatos —Word, PDF, Excel, HTML— a un único formato de texto plano portable. No se requiere software propietario para leer el resultado. Almacena documentación en control de versiones, diferencia cambios como código y comparte en cualquier herramienta que entienda Markdown.',
    uc6Title: 'IA y LLMs',
    uc6Tag: 'Preparación de contexto',
    uc6Body:
      'Convierte documentos a Markdown limpio para incluirlos como contexto en prompts de ChatGPT, Claude, Gemini u otros LLMs. El Markdown reduce el ruido de tokens comparado con HTML crudo o texto copiado. Introduce documentación de APIs, artículos de investigación, especificaciones internas o exportaciones de datos directamente en tu flujo de trabajo de IA.',

    // ── Privacidad page ───────────────────────────────────────────────────
    privPageTitle: 'Política de privacidad',
    privUpdated: 'Última actualización: mayo de 2026',
    priv1Title: 'Sin recopilación de datos',
    priv1Body: 'ConverterToMarkdown.com no recoge ningún dato personal, de uso ni analítico. No existe ningún formulario de registro, inicio de sesión ni seguimiento de usuario.',
    priv2Title: 'Procesamiento 100% local',
    priv2Body: 'Todos los archivos que conviertes se procesan en tu navegador. Tu archivo nunca abandona tu dispositivo. No existe ningún servidor que reciba, almacene ni procese tus documentos.',
    priv3Title: 'Sin cookies de seguimiento',
    priv3Body: 'Esta web no usa cookies de analítica ni seguimiento de ningún tipo. Puede que el navegador almacene preferencias de sesión de forma local, pero no se transfieren a ningún servidor.',
    priv4Title: 'Sin terceros',
    priv4Body: 'No compartimos datos con terceros porque no tenemos datos que compartir. No integramos Google Analytics, Mixpanel, Segment ni ningún otro servicio de analítica o publicidad.',
    priv5Title: 'Modo URL',
    priv5Body: 'Cuando usas el modo URL, tu navegador realiza una petición fetch() directa a la URL que indiques. Esta petición no pasa por ningún proxy ni servidor intermediario nuestro.',
    priv6Title: 'Contacto',
    priv6Body: 'Si tienes alguna pregunta sobre privacidad, puedes escribir a correodefranciscovalero@gmail.com',

    // ── Licencia page ─────────────────────────────────────────────────────
    licTitle: 'Licencia',
    licSubtitle: 'ConverterToMarkdown.com es una herramienta de uso libre y gratuito.',
    licCopyright: 'Copyright © 2026 Francisco Alejandro Valero Martín',
    licDepsTitle: 'Librerías de terceros',
    licMammoth: 'Conversión DOCX → HTML',
    licPdfjs: 'Extracción de texto PDF',
    licXlsx: 'Lectura de XLSX/XLS',
    licTurndown: 'HTML → Markdown',
    licPapaparse: 'Parsing de CSV',
  },

  en: {
    // ── Hero ──────────────────────────────────────────────────────────────
    heroBy: 'by Francisco Valero',
    heroTagline: 'Convert files to Markdown directly in your browser',
    statFormats: 'supported formats',
    statMax: 'maximum',
    statServers: 'servers',
    statEdit: 'Edit & download',

    // ── Tabs ──────────────────────────────────────────────────────────────
    tabFile: 'File',
    tabUrl: 'URL',

    // ── DropZone ──────────────────────────────────────────────────────────
    dropTitle: 'Drop your file here',
    dropSubtitle: 'or click to select',

    // ── UrlInput ──────────────────────────────────────────────────────────
    urlTitle: 'Paste the file URL',
    urlSubtitle: 'PDF, DOCX, HTML, TXT and more · The URL must be publicly accessible',
    urlPlaceholder: 'https://example.com/document.pdf',
    urlButton: 'Convert',

    // ── FileInfo ──────────────────────────────────────────────────────────
    fileConverting: 'Converting…',
    fileChange: '✕ Change',
    fileUnknownType: 'unknown type',
    ocrNote: 'OCR extracts printed text from images. Handwriting may have lower accuracy.',

    // ── OutputPanel ───────────────────────────────────────────────────────
    outputLines: 'lines',
    outputCopy: 'Copy',
    outputCopied: 'Copied!',
    outputDownload: '↓ Download .md',

    // ── Errors ────────────────────────────────────────────────────────────
    errFileTooLarge: 'The file exceeds the 20 MB limit.',
    errConvert: 'Unknown error converting the file.',
    errUrl: 'Error fetching the URL.',
    errHtmlNoContent: 'The HTML file contains no convertible text.',
    errJsonInvalid: 'Invalid JSON: the file could not be parsed.',

    // ── Privacy badge ─────────────────────────────────────────────────────
    privacyBadge: '100% local processing · no file ever leaves your browser',

    // ── Page meta (for Helmet + SSR) ──────────────────────────────────────
    pageHomeTitle: 'ConverterToMarkdown — Free File to Markdown Converter',
    pageHomeDesc: 'Convert DOCX, PDF, XLSX, HTML, CSV, JSON, XML and more to Markdown directly in your browser. No upload, no server, 100% free.',
    pageHowTitle: 'How it works — ConverterToMarkdown',
    pageHowDesc: 'Three steps from file to Markdown. Browser-side processing using mammoth, pdf.js, SheetJS, Turndown and PapaParse. No file upload required.',
    pageUsecasesTitle: 'Use cases — ConverterToMarkdown',
    pageUsecasesDesc: 'How developers, writers, students, data analysts and AI teams use ConverterToMarkdown to convert documents to Markdown.',
    pagePrivacyTitle: 'Privacy Policy — ConverterToMarkdown',
    pagePrivacyDesc: 'No data collected. All file processing happens locally in your browser. Your files never leave your device.',
    pageLicenseTitle: 'License — ConverterToMarkdown',
    pageLicenseDesc: 'ConverterToMarkdown is free and open source under the MIT License.',

    faqQ10: 'What is Markdown?',
    faqA10: 'Markdown is a lightweight text format that uses simple symbols to structure documents: # for headings, **text** for bold, *text* for italic, - for lists, and `text` for code. It reads as plain text but renders as formatted content. It is the standard format in GitHub, Notion, Obsidian, VS Code, ChatGPT, Claude and most AI tools.',

    // ── LandingCards ──────────────────────────────────────────────────────
    cardsFormatsTag: 'Formats',
    cardsFormatsTitle: '15 compatible file types',
    cardsFormatsSub: 'Documents, spreadsheets, web pages, structured data and images.',
    fmtDocxDesc: 'Word documents',
    fmtPdfDesc: 'PDFs with extractable text',
    fmtXlsxDesc: 'Excel spreadsheets',
    fmtHtmlDesc: 'Web pages and fragments',
    fmtTxtDesc: 'Plain text and Markdown',
    fmtCsvDesc: 'Tables and forms',
    fmtJsonDesc: 'Formatted JSON data',
    fmtXmlDesc: 'Formatted XML data',
    fmtImgDesc: 'Text extraction via OCR',
    cardsPrivacyTag: 'Privacy',
    cardsPrivacyTitle: 'Your file never leaves the browser',
    cardsPrivacyBody:
      "No uploads, no servers, no data sent to third parties. All processing happens locally using your browser's APIs. Works offline once the page is loaded.",
    cardsEditTag: 'Editing',
    cardsEditTitle: 'Editable Markdown',
    cardsEditBody:
      'Edit the result directly on screen. Copy it to the clipboard or download it as .md.',
    cardsUrlTag: 'URL',
    cardsUrlTitle: 'Convert from URL',
    cardsUrlBody:
      'Paste the URL of any public file and convert it instantly, without downloading it first.',

    // ── FAQ ───────────────────────────────────────────────────────────────
    faqTitle: 'Frequently asked questions',
    faqQ1: 'How many file formats are supported?',
    faqA1: '15 formats: DOCX, PDF, XLSX, XLS, HTML, TXT, MD, CSV, JSON, XML, JPG, PNG, WEBP, BMP and GIF. Images are processed using in-browser OCR. More formats are added based on user demand.',
    faqQ2: 'Is my file uploaded to a server?',
    faqA2: 'No. All processing happens in your browser using JavaScript. Your file never leaves your device and no data is sent to external servers.',
    faqQ3: 'Is it free?',
    faqA3: 'Yes, completely free with no registration. No account or credit card required.',
    faqQ4: 'What is the maximum file size?',
    faqA4: '20 MB per file. If your document is larger, consider compressing it or splitting the content before converting.',
    faqQ5: 'Can I edit the generated Markdown?',
    faqA5: 'Yes. The result appears in a text editor where you can modify it directly. You can then copy it to the clipboard or download it as a .md file.',
    faqQ6: 'Does it work offline?',
    faqA6: 'Yes. Once the page is loaded, the converter works fully offline. No internet connection is required to process files.',
    faqQ7: 'Does it work on mobile?',
    faqA7: 'Yes. Works in Chrome, Safari and Firefox on Android and iOS. You can select files from your device storage or from cloud apps like Google Drive or iCloud.',
    faqQ8: 'What happens with scanned PDFs or image-based PDFs?',
    faqA8: 'PDFs are processed by extracting their embedded text directly. For images (JPG, PNG, WEBP, BMP, GIF), the tool runs OCR in your browser using Tesseract.js. Works well for printed text; handwritten content may have lower accuracy.',
    faqQ9: 'Can I convert multiple files at once?',
    faqA9: 'Currently one file per conversion. Each conversion is independent and instant, so you can process several files in a row without reloading the page.',

    // ── Author section ────────────────────────────────────────────────────
    authorTitle: 'About the creator',
    authorName: 'Francisco Valero',
    authorBio: "I'm an independent developer focused on web productivity tools. I built ConverterToMarkdown because I kept needing to convert documentation, PDFs and spreadsheets to Markdown — for GitHub repos, Obsidian notes and LLM context — and couldn't find a free, privacy-first tool that worked entirely in the browser. If you find it useful, also check out my other project,",
    authorOtherProject: 'GraphMyCode — visualize your code architecture',

    // ── LandingFooter ─────────────────────────────────────────────────────
    footerHow: 'How it works',
    footerUseCases: 'Use cases',
    footerPrivacy: 'Privacy policy',
    footerLicense: 'License',

    // ── Back button ───────────────────────────────────────────────────────
    back: '← Back',

    // ── ComoFunciona page ─────────────────────────────────────────────────
    howTitle: 'How it works',
    howSubtitle:
      'Three steps from file to Markdown. No installation, no account, no data leaving your browser.',
    howStep1Title: 'Choose your file or URL',
    howStep1Body:
      'Drag a file to the conversion area, click to select it from your system, or switch to URL mode and paste the link to any public file (PDF on a CDN, DOCX on a server, etc.). Supports DOCX, PDF, XLSX, XLS, HTML, TXT, MD, CSV, JSON and XML. Maximum file size: 20 MB.',
    howStep2Title: 'The browser processes it',
    howStep2Body:
      'The file is converted entirely in your browser using specialized JavaScript libraries: mammoth.js for DOCX, pdf.js for PDF, SheetJS for Excel, Turndown for HTML and PapaParse for CSV. No bytes are sent to any server. The process is instant for small files and works offline once the page is loaded.',
    howStep3Title: 'Edit, copy or download',
    howStep3Body:
      'The resulting Markdown appears in a text editor directly on screen. You can modify the output before using it, copy it to the clipboard with one click, or download it as a .md file ready to use in GitHub, GitLab, Notion, Obsidian, Docusaurus, Jekyll, Hugo or any Markdown-aware editor.',
    howTechTitle: 'Details by format',
    techDocx:
      'Converts to intermediate HTML using mammoth.js, preserving headings (h1–h6), bold, italic, tables and lists. The HTML is then cleaned and converted to Markdown with Turndown. Images are skipped; only text content is converted.',
    techPdf:
      "Extracts text from each page using pdf.js (Mozilla's PDF rendering engine). Best results on text-based PDFs. Scanned documents with images require OCR, which this tool does not perform. Headers and footers may merge with body text depending on the PDF structure.",
    techXlsx:
      'Reads the workbook with SheetJS and converts each sheet into a separate Markdown table with pipe-delimited columns. Multi-sheet files produce multiple tables, each labeled with the sheet name. Formulas are resolved to their current values.',
    techHtml:
      'Strips inline styles, scripts, navigation elements and visual noise with DOMParser before passing the cleaned HTML to Turndown. Preserves semantic structure: headings, paragraphs, links, emphasis, blockquotes and code blocks.',
    techCsv:
      'Parses CSV files with PapaParse, auto-detecting delimiter (comma, semicolon, tab). Outputs a Markdown table with header row detection. Supports large files with hundreds of rows.',
    techTxt: 'Returns plain text without transformation. Line breaks are preserved as-is.',
    techJson:
      'Validates the JSON structure and wraps the formatted output in a fenced code block with json syntax highlighting. Handles nested objects, arrays, minified JSON and malformed input.',
    techXml:
      'Wraps the raw XML content in a fenced code block preserving indentation and structure. Useful for inspection and documentation purposes.',

    // ── CasosDeUso page ───────────────────────────────────────────────────
    usecasesTitle: 'Use cases',
    usecasesSubtitle:
      'ConverterToMarkdown.com is useful in any workflow where you need to convert content to Markdown without installing anything or uploading files to any server.',
    uc1Title: 'Developers',
    uc1Tag: 'Documentation',
    uc1Body:
      'Convert Word or PDF specifications to Markdown to publish them on GitHub, GitLab, Docusaurus or an internal wiki. Drop the file, get Markdown instantly — preserve headings, bold, tables and lists. No Word installed required, no formatting lost in copy-paste. Useful for README files, PR descriptions, API docs and changelogs.',
    uc2Title: 'Writers & bloggers',
    uc2Tag: 'Content migration',
    uc2Body:
      'Migrate Word articles to Markdown to publish on Jekyll, Hugo, Ghost or Astro without rewriting anything. Keeps headings, emphasis, links and paragraphs intact. Export from Google Docs or Word, drop the file and get a .md ready to commit. Ideal for migrating entire blogs to static site generators.',
    uc3Title: 'Students',
    uc3Tag: 'Notes & study',
    uc3Body:
      'Convert PDF notes, presentations or Word documents to Markdown to organize them in Obsidian or Notion. Turn lecture slides into searchable plain text, create linked notes from course PDFs, or import reading materials as structured Markdown for your knowledge management system.',
    uc4Title: 'Data analysts',
    uc4Tag: 'Tables & data',
    uc4Body:
      'Transform Excel or CSV reports into Markdown tables to include in technical documentation or PR reports. Each sheet becomes a formatted Markdown table with aligned column headers. Paste directly into GitHub comments, README files or Confluence pages without manual reformatting.',
    uc5Title: 'Teams & companies',
    uc5Tag: 'Standardization',
    uc5Body:
      'Unify internal documents from multiple formats — Word, PDF, Excel, HTML — into a single portable plain-text format. No proprietary software required to read the output. Store documentation in version control, diff changes like code, and share across tools that understand Markdown.',
    uc6Title: 'AI & LLMs',
    uc6Tag: 'Context preparation',
    uc6Body:
      'Convert documents to clean Markdown to include them as context in ChatGPT, Claude, Gemini or other LLM prompts. Markdown reduces token noise compared to raw HTML or copy-pasted text. Feed API docs, research papers, internal specs or data exports directly into your AI workflow.',

    // ── Privacidad page ───────────────────────────────────────────────────
    privPageTitle: 'Privacy policy',
    privUpdated: 'Last updated: May 2026',
    priv1Title: 'No data collection',
    priv1Body: 'ConverterToMarkdown.com does not collect any personal, usage or analytics data. There is no registration form, login, or user tracking of any kind.',
    priv2Title: '100% local processing',
    priv2Body: 'All files you convert are processed in your browser. Your file never leaves your device. There is no server that receives, stores or processes your documents.',
    priv3Title: 'No tracking cookies',
    priv3Body: 'This site does not use analytics or tracking cookies of any kind. The browser may store local session preferences, but these are not transferred to any server.',
    priv4Title: 'No third parties',
    priv4Body: 'We do not share data with third parties because we have no data to share. We do not integrate Google Analytics, Mixpanel, Segment or any other analytics or advertising service.',
    priv5Title: 'URL mode',
    priv5Body: 'When you use URL mode, your browser makes a direct fetch() request to the URL you provide. This request does not pass through any proxy or intermediary server of ours.',
    priv6Title: 'Contact',
    priv6Body: 'If you have any privacy questions, you can write to correodefranciscovalero@gmail.com',

    // ── Licencia page ─────────────────────────────────────────────────────
    licTitle: 'License',
    licSubtitle: 'ConverterToMarkdown.com is a free and open tool.',
    licCopyright: 'Copyright © 2026 Francisco Alejandro Valero Martín',
    licDepsTitle: 'Third-party libraries',
    licMammoth: 'DOCX → HTML conversion',
    licPdfjs: 'PDF text extraction',
    licXlsx: 'XLSX/XLS reading',
    licTurndown: 'HTML → Markdown',
    licPapaparse: 'CSV parsing',
  },
}

export type Translations = typeof translations.es

/** Para componentes React — empieza en 'en' para compatibilidad SSR, cambia al idioma del navegador tras el primer render */
export function useT(): Translations {
  const [lang, setLang] = useState<Lang>('en')
  useEffect(() => {
    const detected = detectLang()
    setLang(detected)
  }, [])
  return translations[lang] as Translations
}

/** Para código fuera de React (converters, utils) */
export function getT(): Translations {
  return translations[detectLang()] as Translations
}
