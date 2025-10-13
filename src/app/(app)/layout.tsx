'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  Users,
  LayoutGrid,
  Mail,
  PenSquare,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const HiperFlowLogo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-primary"
  >
    <path
      d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M2 7L12 12L22 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M12 12V22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const navItems = [
  { href: '/', label: 'Tratos', icon: LayoutGrid },
  { href: '/contacts', label: 'Contactos', icon: Users },
  { href: '/companies', label: 'Empresas', icon: Briefcase },
  { href: '/activities', label: 'Actividades', icon: History },
  { href: '/inbox', label: 'Bandeja de Entrada', icon: Mail },
  { href: '/social', label: 'Redes Sociales', icon: PenSquare },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="flex min-h-screen w-full">
      <aside
        className={cn(
          'flex-col border-r bg-card transition-all duration-300 ease-in-out hidden md:flex',
          isSidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div
          className={cn(
            'flex h-16 items-center border-b px-4',
            isSidebarCollapsed ? 'justify-center' : 'justify-between'
          )}
        >
          {!isSidebarCollapsed && (
            <Link href="/" className="flex items-center gap-2 font-headline text-lg font-semibold">
              <HiperFlowLogo />
              <span>HiperFlow</span>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex">
            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
        <nav className={cn('flex-grow px-2 py-4', isSidebarCollapsed && 'px-0 items-center flex flex-col')}>
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted/50',
                pathname === href && 'bg-primary/10 text-primary',
                isSidebarCollapsed && 'justify-center'
              )}
              title={isSidebarCollapsed ? label : undefined}
            >
              <Icon className="h-5 w-5" />
              {!isSidebarCollapsed && <span className="truncate">{label}</span>}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                   <AvatarImage src="https://picsum.photos/seed/9/40/40" alt="User Avatar" />
                  <AvatarFallback>
                    <UserCircle />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuItem>Soporte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
