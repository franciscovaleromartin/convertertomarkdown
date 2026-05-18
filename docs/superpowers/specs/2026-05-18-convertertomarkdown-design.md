# ConverterToMarkdown — Design Spec
**Fecha:** 2026-05-18  
**Estado:** Aprobado

---

## 1. Objetivo

Aplicación web estática que convierte archivos a formato Markdown íntegramente en el navegador, sin backend ni llamadas a API externas. Desplegada en Vercel como SPA estática.

---

## 2. Stack

| Capa | Tecnología |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| Estilos | Tailwind CSS |
| Fuente | Inter (Google Fonts) |
| Deploy | Vercel (static) |

---

## 3. Formatos soportados y librerías

| Formato | Extensiones | Librería |
|---|---|---|
| Word | `.docx` | `mammoth` (browser build) |
| PDF | `.pdf` | `pdfjs-dist` v3.x |
| Hojas de cálculo | `.xlsx`, `.xls` | `xlsx` (SheetJS) |
| HTML | `.html`, `.htm` | `turndown` + `@types/turndown` |
| Texto plano | `.txt`, `.md` | FileReader nativo |
| CSV | `.csv` | FileReader nativo → tabla Markdown |
| JSON | `.json` | FileReader nativo → fenced code block |
| XML | `.xml` | FileReader nativo → fenced code block |

---

## 4. Arquitectura

### Estado (App.tsx)

```ts
file: File | null       // archivo seleccionado
markdown: string        // resultado de la conversión
isLoading: boolean      // true mientras convierte
error: string | null    // mensaje de error amigable
```

Patrón: `useState` en `App.tsx`. Sin Context, sin Workers, sin librerías de estado externas.

### Dispatcher (converters/index.ts)

Único punto de entrada. Recibe `File`, detecta tipo por extensión + MIME, delega al conversor correspondiente, devuelve `Promise<string>`.

```
convertFile(file: File): Promise<string>
  ├── .docx          → docxConverter.ts
  ├── .pdf           → pdfConverter.ts
  ├── .xlsx / .xls   → xlsxConverter.ts
  ├── .html / .htm   → htmlConverter.ts
  ├── .txt / .md     → textConverter.ts (FileReader)
  ├── .csv           → textConverter.ts (→ tabla Markdown)
  ├── .json          → textConverter.ts (→ ```json fenced)
  ├── .xml           → textConverter.ts (→ ```xml fenced)
  └── otro           → throw UnsupportedFormatError
```

### Componentes

Todos son **presentacionales puros**: solo reciben props y emiten callbacks. Sin estado propio.

```
App.tsx
├── DropZone.tsx       onFile(file), isLoading
├── FileInfo.tsx       file, isLoading, onClear
└── OutputPanel.tsx    markdown, fileName, onClear
```

---

## 5. Diseño visual

| Token | Valor |
|---|---|
| Fondo | `#FFFFFF` |
| Acento | `#6366f1` (indigo-500) |
| Acento hover | `#4f46e5` (indigo-600) |
| Border radius | `rounded-xl` (12px) |
| Sombra | `shadow-sm` / `shadow-md` en cards |
| Transiciones | `transition-all duration-200` |

Inspiración visual: [graphmycode.com](https://graphmycode.com) — clean, modern, developer-focused.

---

## 6. Layout (vertical / apilado)

```
┌─────────────────────────────────┐
│  ConverterToMarkdown            │  ← header/título
├─────────────────────────────────┤
│  DropZone                       │  ← drag & drop + chips de formatos
│  (→ FileInfo + spinner cuando   │
│     hay archivo seleccionado)   │
├─────────────────────────────────┤
│  OutputPanel                    │  ← solo visible si markdown !== ""
│  header: "N chars · N líneas"   │
│  [textarea editable, monospace] │
│  [Copiar] [↓ Descargar] [✕]    │
└─────────────────────────────────┘
```

Responsive: funciona en móvil y desktop. Máx-width centrado (`max-w-2xl mx-auto`).

---

## 7. Componentes — detalle

### DropZone.tsx
- Borde dashed indigo, fondo `#ede9fe` en hover/drag-over
- Al drag-over: borde sólido
- Chips de formatos aceptados: `DOCX PDF XLSX XLS HTML TXT MD CSV JSON XML`
- Valida extensión y tamaño (≤ 20 MB) antes de llamar `onFile(file)`
- Input `<input type="file" accept="...">` oculto, activado por click en la zona

### FileInfo.tsx
Reemplaza al DropZone en pantalla (DropZone se oculta) una vez que el usuario selecciona un archivo.
- Muestra: nombre archivo, tamaño (KB/MB), tipo detectado
- Botón "✕ Cambiar archivo" → resetea a DropZone (DropZone vuelve a aparecer, FileInfo se oculta)
- Si `isLoading`: spinner indigo centrado + texto "Convirtiendo…" (reemplaza el detalle del archivo temporalmente)

### OutputPanel.tsx
- Header: "Output · {chars} chars · {lines} líneas"
- `<textarea>` monospace, scrollable, sin resize horizontal, fondo blanco
- **Copiar**: llama `navigator.clipboard.writeText`, muestra toast "¡Copiado!" por 2 s
- **Descargar**: crea blob `text/markdown`, descarga como `{nombre-original}.md`
- **Limpiar (✕)**: llama `onClear()` → resetea todo a estado inicial

---

## 8. Flujo de conversión

```
1. onFile(file)
2. App: setFile, setIsLoading(true), setError(null), setMarkdown("")
3. convertFile(file) → await
4a. Éxito → setMarkdown(result), setIsLoading(false)
4b. Error → setError(mensaje), setIsLoading(false)
5. "Limpiar" → reset completo al estado inicial
```

---

## 9. Manejo de errores

| Caso | Mensaje al usuario |
|---|---|
| Formato no soportado | "Formato no soportado. Formatos aceptados: DOCX, PDF, XLSX, XLS, HTML, TXT, MD, CSV, JSON, XML." |
| Archivo > 20 MB | "El archivo supera el límite de 20 MB." |
| Error de parseo / archivo corrupto | "No se pudo convertir el archivo. Puede estar dañado o tener un formato inesperado." |
| PDF sin texto extraíble (scaneado) | "Este PDF parece ser una imagen escaneada. No se puede extraer texto directamente." |

Los errores se muestran **inline** bajo el DropZone/FileInfo en rojo, con ícono de advertencia. Sin modales.

---

## 10. Notas de implementación críticas

- **pdfjs-dist**: usar v3.x. Configurar `pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'`
- **mammoth**: importar como `import mammoth from 'mammoth'` — Vite maneja el build browser automáticamente
- **SheetJS**: iterar todas las hojas del libro, convertir cada una a tabla Markdown con `| col |` separadores
- **CSV**: split por líneas + split por coma → tabla Markdown `| header | header |` + `|---|---|`. Limitación conocida: campos con comas dentro de comillas no se parsean correctamente (aceptable para el alcance actual).
- **JSON**: envolver en ` ```json ... ``` ` fenced code block
- **XML**: envolver en ` ```xml ... ``` ` fenced code block
- **vercel.json**: solo necesario para SPA routing:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```

---

## 11. Estructura de archivos

```
convertertomarkdown/
├── public/
├── src/
│   ├── components/
│   │   ├── DropZone.tsx
│   │   ├── OutputPanel.tsx
│   │   └── FileInfo.tsx
│   ├── converters/
│   │   ├── docxConverter.ts
│   │   ├── pdfConverter.ts
│   │   ├── xlsxConverter.ts
│   │   ├── htmlConverter.ts
│   │   ├── textConverter.ts
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── vercel.json
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 12. Deployment

- Build: `vite build` → carpeta `dist/`
- Deploy en Vercel: conectar repo, build command `npm run build`, output `dist`
- No requiere variables de entorno
- No hay rutas `/api` ni runtime Node.js
