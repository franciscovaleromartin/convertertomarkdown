interface Props {
  file: File
  isLoading: boolean
  onClear: () => void
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileInfo({ file, isLoading, onClear }: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-6 gap-3">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-400">Convirtiendo…</p>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0">📄</span>
            <div className="min-w-0">
              <p className="font-medium text-zinc-100 text-sm truncate">{file.name}</p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {formatSize(file.size)} · {file.type || 'tipo desconocido'}
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="flex-shrink-0 text-xs text-zinc-500 hover:text-zinc-300 transition-colors duration-150 flex items-center gap-1 whitespace-nowrap"
          >
            ✕ Cambiar
          </button>
        </div>
      )}
    </div>
  )
}
