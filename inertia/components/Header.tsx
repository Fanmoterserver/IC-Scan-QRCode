import { Link, usePage, router } from '@inertiajs/react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

interface PageProps {
  [key: string]: unknown
  user: { id: number; fullName: string; role: 'admin' | 'user' } | null
}

export default function Header() {
  const { url, props } = usePage<PageProps>()
  const user = props.user

  const navItems = [
    { label: 'Data Summary', href: '/data-summary' },
    { label: 'Scan QR Code', href: '/scan-qrcode' },
    ...(user?.role === 'admin' ? [{ label: 'Master Data', href: '/master-data' }] : []),
  ]

  function handleLogout() {
    router.post('/logout')
  }

  return (
    <header className="sticky top-0 z-10 border-b border-black/10 bg-[#101418]">
      <div className="flex items-center gap-6 px-6 py-3">
        <span className="font-semibold text-lg tracking-tight text-white">IC Scan QR Code</span>

        <NavigationMenu className="max-w-none flex-none">
          <NavigationMenuList className="justify-start gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/data-summary'
                  ? url === '/' || url.startsWith('/data-summary')
                  : url.startsWith(item.href)
              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    render={<Link href={item.href} />}
                    className={cn(
                      'relative rounded-none border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-blue-500 bg-transparent text-white hover:bg-white/10 hover:text-white'
                        : 'border-transparent text-white/60 hover:border-white/30 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center gap-4">
          {user && (
            <span className="font-mono-data text-base text-white">
              {user.fullName.toUpperCase()}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
