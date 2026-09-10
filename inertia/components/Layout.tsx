import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      <Footer />
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </div>
  )
}