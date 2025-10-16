'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Users,
  LayoutGrid,
  Mail,
  PenSquare,
  UserCircle,
  History,
  Menu,
  LogOut,
  ClipboardCheck,
  LineChart,
  Settings,
  Zap,
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth, useUser } from '@/firebase';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

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
  { href: '/insights', label: 'Insights', icon: LineChart },
  { href: '/inbox', label: 'Inbox', icon: Mail },
  { href: '/agenda', label: 'Agenda', icon: ClipboardCheck },
  { href: '/', label: 'SaleFlow', icon: LayoutGrid, exact: true },
  { href: '/customers', label: 'Clientes', icon: Users },
  { href: '/activities', label: 'Actividades', icon: History },
  { href: '/social', label: 'Social', icon: PenSquare },
  { href: '/automations', label: 'Automatizaciones', icon: Zap },
  { href: '/settings', label: 'Configuración', icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = () => {
    if (auth) {
      auth.signOut();
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }
  
  const NavLink = ({ href, label, exact = false }: { href: string, label: string, exact?: boolean }) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return (
        <Link
          href={href}
          className={cn(
            'transition-colors hover:text-primary text-sm font-medium',
             isActive ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {label}
        </Link>
    );
  }

  const MobileNavLink = ({ href, label, icon: Icon, exact = false }: { href: string, label: string, icon: React.ElementType, exact?: boolean }) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return (
         <Link
            href={href}
            className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                isActive ? 'text-primary bg-muted' : 'text-muted-foreground'
            )}
            >
            <Icon className="h-5 w-5" />
            {label}
        </Link>
    );
  }


  return (
    <div className="flex min-h-screen w-full flex-col">
       <FirebaseErrorListener />
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
           <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link href="/" className="flex items-center gap-2 font-semibold font-headline text-lg md:text-base">
                    <HiperFlowLogo />
                    <span className="mr-4">HiperFlow</span>
                </Link>
                 {navItems.map(({ href, label, exact }) => (
                    <NavLink key={href} href={href} label={label} exact={exact} />
                ))}
           </nav>
           <Sheet>
                <SheetTrigger asChild>
                    <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                    >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-base font-medium">
                        <Link
                            href="#"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <HiperFlowLogo />
                            <span>HiperFlow</span>
                        </Link>
                        {navItems.map(({ href, label, icon, exact }) => (
                            <MobileNavLink key={href} href={href} label={label} icon={icon} exact={exact} />
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <div className="ml-auto flex-1 sm:flex-initial">
                    {/* Optional Search Bar */}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <UserCircle className="h-6 w-6" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{user.isAnonymous ? "Usuario Anónimo" : user.email}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push('/settings')}>Configuración</DropdownMenuItem>
                        <DropdownMenuItem>Soporte</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Cerrar Sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {children}
        </main>
    </div>
  );
}
