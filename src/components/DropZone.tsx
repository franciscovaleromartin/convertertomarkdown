import { useRef, useState } from 'react'
import type { DragEvent, ChangeEvent } from 'react'

const ACCEPTED_EXT = ['.docx','.pdf','.xlsx','.xls','.html','.htm','.txt','.md','.csv','.json','.xml']
const ACCEPT_ATTR = ACCEPTED_EXT.join(',')
const FORMAT_CHIPS = ['DOCX','PDF','XLSX','XLS','HTML','TXT','MD','CSV','JSON','XML']

interface Props {
  onFile: (file: File) => void
}

export default function DropZone({ onFile }: Props) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    e.target.value = ''
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Zona de carga de archivos"
      onClick={() => inputRef.current?.click()}
      onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      className={[
        'cursor-pointer rounded-xl border-2 p-10 text-center transition-all duration-200 select-none',
        isDragOver
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-dashed border-indigo-300 bg-white hover:bg-indigo-50 hover:border-indigo-400',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={handleChange}
      />
      <div className="text-4xl mb-3 pointer-events-none">☁️</div>
      <p className="text-gray-700 font-medium pointer-events-none">
        Arrastra tu archivo aquí
      </p>
      <p className="text-gray-400 text-sm mt-1 pointer-events-none">
        o haz clic para seleccionar
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-1.5 pointer-events-none">
        {FORMAT_CHIPS.map(fmt => (
          <span
            key={fmt}
            className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full"
          >
            {fmt}
          </span>
        ))}
      </div>
    </div>
  )
}
