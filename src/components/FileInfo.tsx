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
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-6 gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Convirtiendo…</p>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0">📄</span>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">{file.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatSize(file.size)} · {file.type || 'tipo desconocido'}
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="flex-shrink-0 text-xs text-gray-400 hover:text-gray-600 transition-colors duration-150 flex items-center gap-1 whitespace-nowrap"
          >
            ✕ Cambiar
          </button>
        </div>
      )}
    </div>
  )
}
