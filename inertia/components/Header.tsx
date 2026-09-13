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
    <header className="sticky top-0 z-10 border-b bg-white">
      <div className="flex items-center gap-6 px-6 py-3">
        <span className="font-semibold text-lg">IC Scan QR Code</span>

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
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
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
            <span className="text-sm text-gray-500">
              {user.fullName} ({user.role})
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
