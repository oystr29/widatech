import { ChevronRight } from 'lucide-react'
import { Outlet, useLocation } from 'react-router'
import { Header } from '~/components/header'
import { Toaster } from '~/components/ui/sonner'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from '~/components/ui/sidebar'
import { Link } from '~/router'
import { cn } from '~/lib/utils'

const links: {
  title: string
  href: '/' | '/invoices/create' | '/invoices/timeseries'
}[] = [
  {
    title: 'Timeseries',
    href: '/invoices/timeseries',
  },
  {
    title: 'List Invoices',
    href: '/',
  },
  {
    title: 'Add Invoices',
    href: '/invoices/create',
  },
]

export default function App() {
  const location = useLocation()

  return (
    <>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <Header />
          <div className="flex flex-1">
            <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
              <SidebarHeader />
              <SidebarContent>
                <SidebarGroup>
                  <SidebarMenu>
                    <Collapsible asChild defaultOpen>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <div className="group flex items-center justify-between">
                            <SidebarMenuButton asChild tooltip={'Invoices'}>
                              <div className="flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M13.5 9.75a.75.75 0 0 0-.75-.75h-6a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 .75-.75m-1 3a.75.75 0 0 0-.75-.75h-5a.75.75 0 1 0 0 1.5h5a.75.75 0 0 0 .75-.75m.25 2.25a.75.75 0 1 1 0 1.5h-6a.75.75 0 0 1 0-1.5z"
                                  />
                                  <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="M6 21.75h13A2.75 2.75 0 0 0 21.75 19v-5.5a.75.75 0 0 0-.75-.75h-3.25V4.943c0-1.423-1.609-2.251-2.767-1.424l-.175.125a2.26 2.26 0 0 1-2.622-.004a3.77 3.77 0 0 0-4.372 0a2.26 2.26 0 0 1-2.622.004l-.175-.125c-1.158-.827-2.767 0-2.767 1.424V18A3.75 3.75 0 0 0 6 21.75M8.686 4.86a2.27 2.27 0 0 1 2.628 0a3.76 3.76 0 0 0 4.366.005l.175-.125a.25.25 0 0 1 .395.203V19c0 .45.108.875.3 1.25H6A2.25 2.25 0 0 1 3.75 18V4.943a.25.25 0 0 1 .395-.203l.175.125a3.76 3.76 0 0 0 4.366-.005M17.75 19v-4.75h2.5V19a1.25 1.25 0 0 1-2.5 0"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>Invoices</span>
                              </div>
                            </SidebarMenuButton>
                            <SidebarMenuAction className="group-data-[state=open]:rotate-90">
                              <ChevronRight />
                              <span className="sr-only">Toggle</span>
                            </SidebarMenuAction>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {links.map((link) => (
                              <SidebarMenuSubItem key={link.title}>
                                <SidebarMenuSubButton
                                  className={cn(
                                    location.pathname === link.href &&
                                      'bg-blue-600 text-white hover:bg-blue-500 hover:text-white'
                                  )}
                                  asChild
                                >
                                  <Link to={link.href}>
                                    <span>{link.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
            {/* <AppSidebar /> */}
            <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 p-4">
                <Outlet />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      <Toaster theme="light" richColors closeButton />
    </>
  )
}
