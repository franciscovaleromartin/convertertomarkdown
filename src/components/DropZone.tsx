import { useRef, useState } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import { useT } from '../lib/i18n'

const ACCEPTED_EXT = ['.docx','.pdf','.xlsx','.xls','.html','.htm','.txt','.md','.csv','.json','.xml']
const ACCEPT_ATTR = ACCEPTED_EXT.join(',')
const FORMAT_CHIPS = ['DOCX','PDF','XLSX','XLS','HTML','TXT','MD','CSV','JSON','XML']

interface Props {
  onFile: (file: File) => void
}

export default function DropZone({ onFile }: Props) {
  const t = useT()
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
      aria-label={t.dropTitle}
      onClick={() => inputRef.current?.click()}
      onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      className={[
        'cursor-pointer rounded-xl border-2 p-10 text-center transition-all duration-200 select-none',
        isDragOver
          ? 'border-sky-500 bg-sky-950/30'
          : 'border-dashed border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-700',
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
      <p className="text-zinc-200 font-medium pointer-events-none">{t.dropTitle}</p>
      <p className="text-zinc-500 text-sm mt-1 pointer-events-none">{t.dropSubtitle}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-1.5 pointer-events-none">
        {FORMAT_CHIPS.map(fmt => (
          <span
            key={fmt}
            className="bg-zinc-800 text-zinc-400 border border-zinc-700/60 text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            {fmt}
          </span>
        ))}
      </div>
    </div>
  )
}
