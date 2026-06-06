import type { ReactNode } from 'react'
import { TopBar } from './TopBar'
import { LandingFooter } from './LandingFooter'

interface Props {
  navigate: (path: string) => void
  children: ReactNode
}

export function PageShell({ navigate, children }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
      <TopBar />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 24px 0' }}>
        {children}
      </div>
      <LandingFooter navigate={navigate} />
    </div>
  )
}
