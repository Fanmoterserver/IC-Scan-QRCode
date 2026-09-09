import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      <Footer />
    </div>
  )
}