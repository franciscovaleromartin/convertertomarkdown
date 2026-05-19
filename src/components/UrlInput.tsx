import { useState } from 'react'
import type { FormEvent } from 'react'
import { useT } from '../lib/i18n'

interface Props {
  onUrl: (url: string) => void
  isLoading: boolean
}

export default function UrlInput({ onUrl, isLoading }: Props) {
  const t = useT()
  const [url, setUrl] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = url.trim()
    if (trimmed) onUrl(trimmed)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900/30 p-10 text-center"
    >
      <div className="text-4xl mb-3">🔗</div>
      <p className="text-zinc-300 font-medium mb-1">{t.urlTitle}</p>
      <p className="text-zinc-600 text-sm mb-6">{t.urlSubtitle}</p>
      <div className="flex gap-2 max-w-md mx-auto">
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder={t.urlPlaceholder}
          className="flex-1 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-600 transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!url.trim() || isLoading}
          className="bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 whitespace-nowrap"
        >
          {isLoading ? '…' : t.urlButton}
        </button>
      </div>
    </form>
  )
}
