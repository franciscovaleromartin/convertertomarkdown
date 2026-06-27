import { useState, useEffect, useContext, createContext, createElement } from 'react'
import type { ReactNode } from 'react'

export type Lang = 'es' | 'en'

export function detectLang(): Lang {
  // `typeof window` se usa como guarda de entorno-navegador: Node.js 18+ expone un
  // `navigator` global que refleja el locale del sistema de la máquina de build, no
  // el del visitante. Sin esta guarda, el idioma detectado en SSR dependería del
  // locale del servidor de build en lugar de ser determinista.
  const lang =
    (typeof window !== 'undefined' && typeof navigator !== 'undefined' && (navigator.language || navigator.languages?.[0])) || 'en'
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
    heroTagline: 'Convierte DOCX, PDF, Excel, HTML e imágenes a Markdown — gratis, en tu navegador, sin subir archivos',
    statFormats: 'formatos compatibles',
    statMax: 'máximo',
    statServers: 'servidores',
    statEdit: 'Edita, previsualiza y descarga',

    // ── Tabs ──────────────────────────────────────────────────────────────
    tabFile: 'Archivo',
    tabUrl: 'URL',
    tabMulti: 'Múltiples Archivos',

    // ── MultiBatch ────────────────────────────────────────────────────────
    multiDropTitle: 'Arrastra los archivos aquí',
    multiDropSubtitle: 'o haz clic para seleccionar · múltiples archivos · 20 MB máx por archivo',
    multiStatusPending: 'Pendiente',
    multiStatusConverting: 'Convirtiendo…',
    multiStatusDone: 'Listo',
    multiStatusError: 'Error',
    multiDownload: '↓ Descargar',
    multiDownloadAll: '↓ Descargar todos (.zip)',
    multiReset: '← Nueva conversión',
    multiFilesCount: 'archivos',
    multiDoneCount: 'completados',
    multiSuccessOf: 'convertidos con éxito',

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
    pageHomeDesc: 'Convierte DOCX, PDF, XLSX, HTML, CSV, JSON, XML, imágenes y más a Markdown en tu navegador. OCR para PDFs escaneados e imágenes. Modo batch. Sin servidores.',
    pageHowTitle: 'Cómo convierte archivos a Markdown — ConverterToMarkdown',
    pageHowDesc: 'Tres pasos para convertir cualquier archivo a Markdown en el navegador. Procesamiento local con mammoth, pdf.js, SheetJS, Turndown, PapaParse y Tesseract.js. Sin subida de archivos.',
    pageUsecasesTitle: 'Casos de uso de ConverterToMarkdown — DOCX, PDF, imágenes a Markdown',
    pageUsecasesDesc: 'Cómo usan ConverterToMarkdown desarrolladores, escritores, estudiantes, analistas de datos, equipos de empresa y flujos de IA para convertir documentos a Markdown sin instalar nada.',
    pagePrivacyTitle: 'Política de privacidad — ConverterToMarkdown',
    pagePrivacyDesc: 'Sin recopilación de datos ni cuentas. Todo el procesamiento de archivos ocurre en tu navegador: tus documentos nunca salen de tu dispositivo.',
    pageLicenseTitle: 'Licencia — ConverterToMarkdown',
    pageLicenseDesc: 'ConverterToMarkdown es de código abierto bajo licencia MIT: úsalo, modifícalo y redistribúyelo libremente, sin coste ni restricciones. Código en GitHub.',

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
    cardsEditTag: 'Editor',
    cardsEditTitle: 'Editor .md con preview en vivo',
    cardsEditBody:
      'Edita el Markdown resultante en el modo "editor .md" o cambia a "Preview" para ver el HTML renderizado con formato real. Los cambios se sincronizan en tiempo real entre ambos modos. Copia al portapapeles o descarga como .md.',
    cardsUrlTag: 'URL',
    cardsUrlTitle: 'Convierte desde URL',
    cardsUrlBody:
      'Pega la URL de cualquier archivo público y lo convierte al instante, sin descargarlo.',
    cardsMcpTag: 'MCP',
    cardsMcpTitle: '¿Quieres usarlo desde Claude Code, Cursor u otro agente?',
    cardsMcpBody:
      'Hay un servidor Model Context Protocol (MCP) disponible. Añade npx convertertomarkdown-mcp a tu cliente y cualquier agente compatible podrá convertir archivos a Markdown directamente, sin abrir el navegador. ⚠️ Esta opción sí consumirá tokens de tu agente.',
    cardsMcpLink: 'Ver en GitHub',

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
    faqA5: 'Sí. El resultado aparece en un editor integrado con dos modos: "editor .md" para editar la sintaxis Markdown directamente, y "Preview" para ver el resultado renderizado con encabezados, tablas y formato real. Ambos modos están sincronizados en tiempo real. Puedes copiar al portapapeles o descargar el archivo .md en cualquier momento.',
    faqQ6: '¿Funciona sin conexión a internet?',
    faqA6: 'Sí. Una vez cargada la página, el conversor funciona completamente sin conexión. No se requiere internet para procesar archivos.',
    faqQ7: '¿Funciona en móvil?',
    faqA7: 'Sí. Funciona en Chrome, Safari y Firefox para Android e iOS. Puedes seleccionar archivos desde el almacenamiento de tu dispositivo o desde apps de nube como Google Drive o iCloud.',
    faqQ8: '¿Funcionan los PDFs escaneados?',
    faqA8: 'Sí. La herramienta detecta automáticamente si un PDF no contiene texto extraíble y aplica OCR página a página. Los PDFs con texto digital se convierten directamente; los PDFs escaneados se procesan con reconocimiento óptico de caracteres en el propio navegador.',
    faqQ9: '¿Puedo convertir varios archivos a la vez?',
    faqA9: 'Sí. El modo "Múltiples archivos" permite arrastrar o seleccionar varios archivos de una vez. Se convierten secuencialmente para no saturar el navegador, y cada archivo tiene su propio botón de descarga en cuanto termina. Cuando todos están listos, un botón descarga todos los .md en un ZIP. Si solo hay un archivo exitoso, se descarga directamente sin comprimir.',

    // ── Author section ────────────────────────────────────────────────────
    authorTitle: 'Sobre el creador',
    authorName: 'Francisco Valero',
    authorBio: 'Soy desarrollador independiente especializado en herramientas web de productividad. Construí ConverterToMarkdown porque necesitaba convertir documentación, PDFs y hojas de cálculo a Markdown de forma recurrente —para repos de GitHub, notas en Obsidian y contexto para LLMs— y no encontraba ninguna herramienta gratuita y sin subida de archivos que funcionara completamente en el navegador. Si te resulta útil, también puedes ver mi otro proyecto,',
    authorOtherProject: 'GraphMyCode — visualiza la arquitectura de tu código',
    authorStar: 'Si quieres agradecerme mi trabajo, puedes',
    authorStarLink: 'darme una estrella en GitHub',
    authorStarSuffix: '— gracias.',

    // ── LandingFooter ─────────────────────────────────────────────────────
    footerHow: 'Cómo funciona',
    footerUseCases: 'Casos de uso',
    footerPrivacy: 'Política de privacidad',
    footerLicense: 'Licencia',

    // ── Back button ───────────────────────────────────────────────────────
    back: '← Volver',

    // ── ComoFunciona page ─────────────────────────────────────────────────
    howTitle: 'Cómo funciona ConverterToMarkdown',
    howSubtitle:
      'ConverterToMarkdown convierte cualquier archivo a Markdown directamente en el navegador usando librerías JavaScript especializadas — sin instalación, sin servidor, sin subida de archivos. Compatible con 15 formatos: DOCX, PDF, XLSX, HTML, CSV, JSON, XML e imágenes con OCR automático vía Tesseract.js.',
    howStep1Title: 'Elige cómo convertir',
    howStep1Body:
      'Tres modos de entrada: "Archivo" para arrastrar o seleccionar un único archivo desde tu sistema; "URL" para pegar el enlace de cualquier archivo público accesible (PDF en un CDN, DOCX en un servidor, etc.); y "Múltiples archivos" para seleccionar varios documentos a la vez y convertirlos en lote. Compatible con DOCX, PDF, XLSX, XLS, HTML, TXT, MD, CSV, JSON, XML y con imágenes JPG, PNG, WEBP, BMP y GIF mediante OCR. Tamaño máximo: 20 MB por archivo.',
    howStep2Title: 'El navegador lo procesa',
    howStep2Body:
      'El archivo se convierte completamente en tu navegador usando librerías JavaScript especializadas: mammoth.js para DOCX, pdf.js para PDF, SheetJS para Excel, Turndown para HTML, PapaParse para CSV y Tesseract.js para imágenes (OCR). Ningún byte se envía a ningún servidor. El proceso es instantáneo para archivos pequeños y no requiere conexión a internet una vez que la página está cargada.',
    howStep3Title: 'Edita, previsualiza, copia o descarga',
    howStep3Body:
      'El Markdown resultante aparece en el editor integrado. Usa el control "editor .md" para editar el texto directamente en sintaxis Markdown, o cambia a "Preview" para ver el resultado renderizado —encabezados, negrita, tablas, bloques de código— y editar con formato visual. Los cambios se sincronizan en tiempo real entre los dos modos. Copia al portapapeles o descarga como fichero .md listo para GitHub, GitLab, Notion, Obsidian, Docusaurus, Jekyll, Hugo o cualquier herramienta que entienda Markdown.',
    howTechTitle: 'Detalle por formato',
    techDocx:
      'Convierte a HTML intermedio usando mammoth.js, preservando encabezados (h1–h6), negrita, cursiva, tablas y listas. El HTML se limpia y pasa a Markdown con Turndown. Las imágenes se omiten; solo se convierte el contenido de texto.',
    techPdf:
      'Extrae texto de cada página usando pdf.js. Si el PDF no contiene texto extraíble (PDF escaneado), aplica automáticamente OCR con Tesseract.js página a página, igual que con imágenes. Cabeceras y pies de página pueden fusionarse con el cuerpo según la estructura del PDF.',
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
    techImg:
      'Ejecuta OCR (reconocimiento óptico de caracteres) en el navegador con Tesseract.js. Detecta el idioma automáticamente a partir de la configuración del navegador y usa el modelo correspondiente. Compatible con JPG, PNG, WEBP, BMP y GIF. El modelo de idioma (~4 MB) se descarga la primera vez y se cachea. Funciona bien con texto impreso; la escritura a mano puede tener menor precisión.',

    // ── CasosDeUso page ───────────────────────────────────────────────────
    usecasesTitle: 'Casos de uso de ConverterToMarkdown',
    usecasesSubtitle:
      'ConverterToMarkdown.com es útil en cualquier flujo donde necesites transformar contenido a Markdown sin instalar nada ni subir archivos a ningún servidor.',
    uc1Title: 'Desarrolladores',
    uc1Tag: 'Documentación',
    uc1Body:
      'Convierte especificaciones en Word o PDF a Markdown para publicarlas en GitHub, GitLab, Docusaurus o un wiki interno. Arrastra el archivo, obtén Markdown al instante y preserva encabezados, negrita, tablas y listas. Sin necesidad de tener Word instalado ni perder formato en el copiar-pegar. Útil para archivos README, descripciones de PR, documentación de APIs y changelogs. Con el modo "Múltiples archivos" puedes convertir en lote una carpeta entera de especificaciones y descargarlos todos en un ZIP.',
    uc2Title: 'Escritores y bloggers',
    uc2Tag: 'Migración de contenido',
    uc2Body:
      'Migra artículos de Word a Markdown para publicarlos en Jekyll, Hugo, Ghost o Astro sin reescribir nada. Conserva encabezados, énfasis, enlaces y párrafos intactos. Exporta desde Google Docs o Word, arrastra el archivo y obtén un .md listo para hacer commit. Para migrar un blog completo, usa el modo "Múltiples archivos": selecciona todos los DOCX de una vez, descarga el ZIP y tendrás cada artículo como .md listo para commit.',
    uc3Title: 'Estudiantes',
    uc3Tag: 'Apuntes y notas',
    uc3Body:
      'Convierte apuntes en PDF, presentaciones o documentos de Word a Markdown para organizarlos en Obsidian o Notion. Transforma diapositivas de clases en texto plano con capacidad de búsqueda, crea notas enlazadas desde PDFs de cursos o importa materiales de lectura como Markdown estructurado para tu sistema de gestión del conocimiento. El OCR automático extrae texto de PDFs escaneados y apuntes fotograﬁados — útil para material de clases antiguo que no tiene versión digital. Todo ocurre en el navegador sin subir tus apuntes a ningún servidor.',
    uc4Title: 'Analistas de datos',
    uc4Tag: 'Tablas y datos',
    uc4Body:
      'Transforma informes en Excel o CSV en tablas Markdown para incluirlas en documentación técnica o informes de PR. Cada hoja del libro Excel se convierte en una tabla Markdown independiente con encabezados de columna alineados y delimitadores de barra vertical. Las fórmulas se resuelven a su valor actual. Pega directamente en comentarios de GitHub, archivos README, páginas de Confluence o documentación de APIs sin reformatear manualmente. Para informes con múltiples hojas, usa el modo "Múltiples archivos" para convertir todos los XLSX de una carpeta en un solo paso.',
    uc5Title: 'Equipos y empresas',
    uc5Tag: 'Estandarización',
    uc5Body:
      'Unifica documentos internos de múltiples formatos —Word, PDF, Excel, HTML— a un único formato de texto plano portable. No se requiere software propietario para leer el resultado. Almacena documentación en control de versiones, diferencia cambios como código y comparte en cualquier herramienta que entienda Markdown. El modo "Múltiples archivos" convierte un lote completo en una sola operación y descarga todos los .md en un ZIP listo para importar al repositorio.',
    uc6Title: 'IA y LLMs',
    uc6Tag: 'Preparación de contexto',
    uc6Body:
      'Convierte documentos a Markdown limpio para incluirlos como contexto en prompts de ChatGPT, Claude, Gemini u otros LLMs. El Markdown reduce el ruido de tokens comparado con HTML crudo o texto copiado: un documento HTML típico de 5 páginas ocupa ~8.000 tokens, el mismo contenido en Markdown ocupa ~2.200 tokens. Introduce documentación de APIs, artículos de investigación, especificaciones internas o exportaciones de datos directamente en tu flujo de trabajo de IA. Con el modo "Múltiples archivos" puedes preparar un corpus completo de documentos en una sola pasada y descargarlos como .md listos para insertarlos como contexto.',

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
    heroTagline: 'Convert DOCX, PDF, Excel, HTML and images to Markdown — free, in your browser, no upload',
    statFormats: 'supported formats',
    statMax: 'maximum',
    statServers: 'servers',
    statEdit: 'Edit, preview & download',

    // ── Tabs ──────────────────────────────────────────────────────────────
    tabFile: 'File',
    tabUrl: 'URL',
    tabMulti: 'Multiple files',

    // ── MultiBatch ────────────────────────────────────────────────────────
    multiDropTitle: 'Drop your files here',
    multiDropSubtitle: 'or click to select · multiple files · 20 MB max per file',
    multiStatusPending: 'Pending',
    multiStatusConverting: 'Converting…',
    multiStatusDone: 'Done',
    multiStatusError: 'Error',
    multiDownload: '↓ Download',
    multiDownloadAll: '↓ Download all (.zip)',
    multiReset: '← New conversion',
    multiFilesCount: 'files',
    multiDoneCount: 'completed',
    multiSuccessOf: 'converted successfully',

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
    pageHomeDesc: 'Convert DOCX, PDF, XLSX, HTML, CSV, JSON, XML, images and more to Markdown in your browser. OCR for scanned PDFs and images. Batch mode. No server.',
    pageHowTitle: 'How ConverterToMarkdown Converts Files to Markdown',
    pageHowDesc: 'Three steps from any file to Markdown in your browser. Uses mammoth, pdf.js, SheetJS, Turndown, PapaParse and Tesseract.js. No file upload, no server, no installation required.',
    pageUsecasesTitle: 'ConverterToMarkdown Use Cases — DOCX, PDF, Images to Markdown',
    pageUsecasesDesc: 'How developers, writers, students, data analysts, teams and AI workflows use ConverterToMarkdown to convert DOCX, PDF, Excel and images to Markdown without installing anything.',
    pagePrivacyTitle: 'Privacy Policy — ConverterToMarkdown',
    pagePrivacyDesc: 'No data collection, no accounts, no tracking. All file processing happens locally in your browser — your documents never leave your device or touch a server.',
    pageLicenseTitle: 'License — ConverterToMarkdown',
    pageLicenseDesc: 'ConverterToMarkdown is open source under the MIT License — use, modify and redistribute it freely, at no cost and with no restrictions. Source on GitHub.',

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
    cardsEditTag: 'Editor',
    cardsEditTitle: 'Editor .md with live preview',
    cardsEditBody:
      'Edit the resulting Markdown in "editor .md" mode or switch to "Preview" to see the rendered HTML with real formatting. Changes sync in real time between both modes. Copy to clipboard or download as .md.',
    cardsUrlTag: 'URL',
    cardsUrlTitle: 'Convert from URL',
    cardsUrlBody:
      'Paste the URL of any public file and convert it instantly, without downloading it first.',
    cardsMcpTag: 'MCP',
    cardsMcpTitle: 'Want to use it from Claude Code, Cursor or another agent?',
    cardsMcpBody:
      'A Model Context Protocol (MCP) server is available. Add npx convertertomarkdown-mcp to your client and any compatible agent can convert files to Markdown directly, without opening the browser. ⚠️ This option will consume tokens from your agent.',
    cardsMcpLink: 'View on GitHub',

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
    faqA5: 'Yes. The result appears in a built-in editor with two modes: "editor .md" to edit the raw Markdown syntax directly, and "Preview" to see the rendered output with real headings, tables and formatting. Both modes are synced in real time. You can copy to clipboard or download the .md file at any time.',
    faqQ6: 'Does it work offline?',
    faqA6: 'Yes. Once the page is loaded, the converter works fully offline. No internet connection is required to process files.',
    faqQ7: 'Does it work on mobile?',
    faqA7: 'Yes. Works in Chrome, Safari and Firefox on Android and iOS. You can select files from your device storage or from cloud apps like Google Drive or iCloud.',
    faqQ8: 'Do scanned PDFs work?',
    faqA8: 'Yes. The tool automatically detects when a PDF contains no extractable text and applies OCR page by page. PDFs with digital text are converted directly; scanned PDFs are processed with optical character recognition entirely in your browser.',
    faqQ9: 'Can I convert multiple files at once?',
    faqA9: 'Yes. The "Multiple files" mode lets you drag or select several files at once. They are converted sequentially to avoid overloading the browser, and each file gets its own download button as soon as it finishes. When all files are ready, a single button downloads all the .md files as a ZIP archive. If there is only one successful file, it downloads directly without compression.',

    // ── Author section ────────────────────────────────────────────────────
    authorTitle: 'About the creator',
    authorName: 'Francisco Valero',
    authorBio: "I'm an independent developer focused on web productivity tools. I built ConverterToMarkdown because I kept needing to convert documentation, PDFs and spreadsheets to Markdown — for GitHub repos, Obsidian notes and LLM context — and couldn't find a free, privacy-first tool that worked entirely in the browser. If you find it useful, also check out my other project,",
    authorOtherProject: 'GraphMyCode — visualize your code architecture',
    authorStar: 'If you find my work useful, you can',
    authorStarLink: 'give it a star on GitHub',
    authorStarSuffix: '— thank you.',

    // ── LandingFooter ─────────────────────────────────────────────────────
    footerHow: 'How it works',
    footerUseCases: 'Use cases',
    footerPrivacy: 'Privacy policy',
    footerLicense: 'License',

    // ── Back button ───────────────────────────────────────────────────────
    back: '← Back',

    // ── ComoFunciona page ─────────────────────────────────────────────────
    howTitle: 'How ConverterToMarkdown Works',
    howSubtitle:
      'ConverterToMarkdown converts any file to Markdown directly in your browser using specialized JavaScript libraries — no installation, no server, no upload required. Supports 15 formats: DOCX, PDF, XLSX, HTML, CSV, JSON, XML and images with automatic OCR via Tesseract.js.',
    howStep1Title: 'Choose how to convert',
    howStep1Body:
      'Three input modes: "File" to drag or select a single file from your system; "URL" to paste the link to any publicly accessible file (PDF on a CDN, DOCX on a server, etc.); and "Multiple files" to select several documents at once and convert them in batch. Supports DOCX, PDF, XLSX, XLS, HTML, TXT, MD, CSV, JSON, XML and images (JPG, PNG, WEBP, BMP, GIF) via OCR. Maximum file size: 20 MB per file.',
    howStep2Title: 'The browser processes it',
    howStep2Body:
      'The file is converted entirely in your browser using specialized JavaScript libraries: mammoth.js for DOCX, pdf.js for PDF, SheetJS for Excel, Turndown for HTML, PapaParse for CSV and Tesseract.js for images (OCR). No bytes are sent to any server. The process is instant for small files and works offline once the page is loaded.',
    howStep3Title: 'Edit, preview, copy or download',
    howStep3Body:
      'The resulting Markdown appears in the built-in editor. Switch to "editor .md" to edit raw Markdown syntax directly, or switch to "Preview" to see the rendered output — headings, bold, tables, code blocks — and edit with visual formatting. Changes sync in real time between both modes. Copy to clipboard or download as a .md file ready for GitHub, GitLab, Notion, Obsidian, Docusaurus, Jekyll, Hugo or any Markdown-aware tool.',
    howTechTitle: 'Details by format',
    techDocx:
      'Converts to intermediate HTML using mammoth.js, preserving headings (h1–h6), bold, italic, tables and lists. The HTML is then cleaned and converted to Markdown with Turndown. Images are skipped; only text content is converted.',
    techPdf:
      'Extracts text from each page using pdf.js. If the PDF contains no extractable text (scanned PDF), automatically falls back to OCR with Tesseract.js page by page — same as with image files. Headers and footers may merge with body text depending on the PDF structure.',
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
    techImg:
      'Runs OCR (optical character recognition) in the browser using Tesseract.js. Automatically detects the language from browser settings and loads the matching language model. Supports JPG, PNG, WEBP, BMP and GIF. The language model (~4 MB) is downloaded once and cached. Works well with printed text; handwritten content may have lower accuracy.',

    // ── CasosDeUso page ───────────────────────────────────────────────────
    usecasesTitle: 'ConverterToMarkdown Use Cases',
    usecasesSubtitle:
      'ConverterToMarkdown.com is useful in any workflow where you need to convert content to Markdown without installing anything or uploading files to any server.',
    uc1Title: 'Developers',
    uc1Tag: 'Documentation',
    uc1Body:
      'Convert Word or PDF specifications to Markdown to publish them on GitHub, GitLab, Docusaurus or an internal wiki. Drop the file, get Markdown instantly — preserve headings, bold, tables and lists. No Word installed required, no formatting lost in copy-paste. Useful for README files, PR descriptions, API docs and changelogs. Use "Multiple files" mode to convert an entire folder of specs in one batch and download them all as a ZIP.',
    uc2Title: 'Writers & bloggers',
    uc2Tag: 'Content migration',
    uc2Body:
      'Migrate Word articles to Markdown to publish on Jekyll, Hugo, Ghost or Astro without rewriting anything. Keeps headings, emphasis, links and paragraphs intact. Export from Google Docs or Word, drop the file and get a .md ready to commit. To migrate an entire blog, use "Multiple files" mode: select all your DOCX files at once, download the ZIP, and every article is ready as a .md file.',
    uc3Title: 'Students',
    uc3Tag: 'Notes & study',
    uc3Body:
      'Convert PDF notes, presentations or Word documents to Markdown to organize them in Obsidian or Notion. Turn lecture slides into searchable plain text, create linked notes from course PDFs, or import reading materials as structured Markdown for your knowledge management system. The automatic OCR extracts text from scanned PDFs and photographed handouts — useful for older course material that has no digital version. Everything runs in the browser without uploading your notes to any server.',
    uc4Title: 'Data analysts',
    uc4Tag: 'Tables & data',
    uc4Body:
      'Transform Excel or CSV reports into Markdown tables to include in technical documentation or PR reports. Each sheet in the workbook becomes a separate Markdown table with aligned column headers and pipe delimiters. Formulas are resolved to their current values. Paste directly into GitHub comments, README files, Confluence pages or API documentation without manual reformatting. For reports with multiple sheets, use "Multiple files" mode to convert an entire folder of XLSX files in a single operation.',
    uc5Title: 'Teams & companies',
    uc5Tag: 'Standardization',
    uc5Body:
      'Unify internal documents from multiple formats — Word, PDF, Excel, HTML — into a single portable plain-text format. No proprietary software required to read the output. Store documentation in version control, diff changes like code, and share across tools that understand Markdown. The "Multiple files" mode converts an entire batch in one operation and downloads all .md files as a ZIP ready to import into the repository.',
    uc6Title: 'AI & LLMs',
    uc6Tag: 'Context preparation',
    uc6Body:
      'Convert documents to clean Markdown to include them as context in ChatGPT, Claude, Gemini or other LLM prompts. Markdown reduces token noise compared to raw HTML or copy-pasted text: a typical 5-page HTML document uses ~8,000 tokens, while the same content in Markdown uses ~2,200 tokens. Feed API docs, research papers, internal specs or data exports directly into your AI workflow. With "Multiple files" mode you can prepare an entire corpus in one pass and download all .md files ready to paste as context.',

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

const LangContext = createContext<Translations>(translations.en)
const LangKeyContext = createContext<Lang>('en')

/** Envuelve la app — detecta el idioma una vez y lo distribuye vía Context */
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  useEffect(() => { setLang(detectLang()) }, [])
  return createElement(
    LangKeyContext.Provider,
    { value: lang },
    createElement(LangContext.Provider, { value: translations[lang] as Translations }, children)
  )
}

/** Para componentes React — lee del Context compartido, sin estado propio */
export function useT(): Translations {
  return useContext(LangContext)
}

/** Devuelve el código de idioma actual reactivo ('es' | 'en') */
export function useLang(): Lang {
  return useContext(LangKeyContext)
}

/** Para código fuera de React (converters, utils) */
export function getT(): Translations {
  return translations[detectLang()] as Translations
}
