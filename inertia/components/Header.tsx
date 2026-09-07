import { Link, usePage } from '@inertiajs/react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Data Summary', href: '/' },
  { label: 'Scan QR Code', href: '/scan-qrcode' },
  { label: 'Master Data', href: '/master-data' },
]

export default function Header() {
  const { url } = usePage()

  return (
    <header className="border-b bg-white">
      <div className="flex items-center gap-6 px-6 py-3">
        <span className="font-semibold text-lg">IC Scan QR Code</span>

        <NavigationMenu className="max-w-none flex-none">
          <NavigationMenuList className="justify-start gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/' ? url === '/' : url.startsWith(item.href)
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
      </div>
    </header>
  )
}