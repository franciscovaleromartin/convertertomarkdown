import { useT } from '../lib/i18n'

interface Props {
  navigate: (path: string) => void
}

const style = {
  background: 'none', border: 'none', color: '#64748b', fontSize: '13px',
  cursor: 'pointer', marginBottom: '32px', padding: 0,
  display: 'flex', alignItems: 'center', gap: '6px',
}

export function BackButton({ navigate }: Props) {
  const t = useT()
  return (
    <button
      style={style}
      onClick={() => navigate('/')}
      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#94a3b8')}
      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#64748b')}
    >
      {t.back}
    </button>
  )
}
