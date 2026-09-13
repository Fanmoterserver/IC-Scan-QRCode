import { ReactNode, useEffect } from 'react'
import { router } from '@inertiajs/react'
import toast, { Toaster } from 'react-hot-toast'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const removeListener = router.on('success', (event) => {
      const props = event.detail.page.props as { error?: string; success?: string }
      if (props.error) toast.error(props.error, { id: 'flash-error' })
      if (props.success) toast.success(props.success, { id: 'flash-success' })
    })

    return () => removeListener()
  }, [])
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      <Footer />
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </div>
  )
}
