
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
  Bot,
  Zap,
  Landmark,
  BookOpen,
  Handshake,
  Globe,
  Shield,
  FlaskConical,
  ShoppingCart,
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

const HiperFlowLogo = ({ className }: { className?: string }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 160 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
    >
      <g clipPath="url(#clip0_1_2)">
        <path d="M22.08 8.4H13.68V0H8.88V8.4H0.48V13.2H8.88V22.8H13.68V13.2H22.08V8.4Z" fill="url(#paint0_linear_1_2)"/>
        <path d="M30.496 2.39999C29.056 2.39999 27.856 3.03999 26.896 4.31999L24.352 7.79999L24.336 2.84L20.272 3.11999V22.8H24.336V11.52L28.096 6.47999C28.576 5.83999 29.296 5.51999 30.256 5.51999C31.696 5.51999 32.416 6.47999 32.416 8.39999V22.8H36.48V5.99999C36.48 3.59999 34.256 2.39999 30.496 2.39999Z" fill="#11E44F"/>
        <path d="M48.724 22.8H52.788V3.03999H48.724V22.8Z" fill="#11E44F"/>
        <path d="M60.1013 2.39999C56.2613 2.39999 53.6213 4.43999 53.6213 8.87999V16.92C53.6213 21.36 56.2613 23.4 60.1013 23.4C63.9413 23.4 66.5813 21.36 66.5813 16.92V8.87999C66.5813 4.43999 63.9413 2.39999 60.1013 2.39999ZM62.3813 17.04C62.3813 19.44 61.6613 20.52 60.1013 20.52C58.5413 20.52 57.8213 19.44 57.8213 17.04V8.75999C57.8213 6.35999 58.5413 5.27999 60.1013 5.27999C61.6613 5.27999 62.3813 6.35999 62.3813 8.75999V17.04Z" fill="#11E44F"/>
        <path d="M78.6521 22.8H82.7161V13.08L86.9401 22.8H91.4521L85.4041 11.28L91.0681 3.03999H86.2681L82.7161 8.87999V3.03999H78.6521V22.8Z" fill="#11E44F"/>
        <path d="M103.585 22.8H107.649V13.08L111.873 22.8H116.385L110.337 11.28L116.001 3.03999H111.201L107.649 8.87999V3.03999H103.585V22.8Z" fill="#11E44F"/>
        <path d="M129.533 2.39999H120.221V22.8H124.285V14.52H128.461L129.629 22.8H133.901L131.605 9.11999C132.845 8.15999 133.565 6.71999 133.565 5.03999C133.565 3.59999 132.605 2.39999 129.533 2.39999ZM124.285 11.64V5.27999H128.957C130.397 5.27999 130.397 6.95999 130.397 6.95999C130.397 6.95999 130.397 8.63999 128.957 8.63999H125.749L124.285 11.64Z" fill="#11E44F"/>
        <path d="M159.63 12.36L153.426 0H148.866L155.658 13.8L156.09 13.68C159.258 12.84 160.074 10.92 160.074 8.76C160.074 6.12 158.91 4.56 156.45 3.36L159.63 12.36ZM145.548 22.8L152.01 9.48L145.062 3.03999H136.95L144.15 12.6L135.39 22.8H145.548Z" fill="#1f7a3c"/>
        <path d="M22.08 8.4H13.68V0H8.88V8.4H0.48V13.2H8.88V22.8H13.68V13.2H22.08V8.4Z" fill="#11E44F"/>
        <path d="M30.496 2.39999C29.056 2.39999 27.856 3.03999 26.896 4.31999L24.352 7.79999L24.336 2.84L20.272 3.11999V22.8H24.336V11.52L28.096 6.47999C28.576 5.83999 29.296 5.51999 30.256 5.51999C31.696 5.51999 32.416 6.47999 32.416 8.39999V22.8H36.48V5.99999C36.48 3.59999 34.256 2.39999 30.496 2.39999Z" fill="#11E44F"/>
        <path d="M48.724 22.8H52.788V3.03999H48.724V22.8Z" fill="#11E44F"/>
        <path d="M60.1013 2.39999C56.2613 2.39999 53.6213 4.43999 53.6213 8.87999V16.92C53.6213 21.36 56.2613 23.4 60.1013 23.4C63.9413 23.4 66.5813 21.36 66.5813 16.92V8.87999C66.5813 4.43999 63.9413 2.39999 60.1013 2.39999ZM62.3813 17.04C62.3813 19.44 61.6613 20.52 60.1013 20.52C58.5413 20.52 57.8213 19.44 57.8213 17.04V8.75999C57.8213 6.35999 58.5413 5.27999 60.1013 5.27999C61.6613 5.27999 62.3813 6.35999 62.3813 8.75999V17.04Z" fill="#11E44F"/>
        <path d="M78.6521 22.8H82.7161V13.08L86.9401 22.8H91.4521L85.4041 11.28L91.0681 3.03999H86.2681L82.7161 8.87999V3.03999H78.6521V22.8Z" fill="#11E44F"/>
        <path d="M103.585 22.8H107.649V13.08L111.873 22.8H116.385L110.337 11.28L116.001 3.03999H111.201L107.649 8.87999V3.03999H103.585V22.8Z" fill="#11E44F"/>
        <path d="M129.533 2.39999H120.221V22.8H124.285V14.52H128.461L129.629 22.8H133.901L131.605 9.11999C132.845 8.15999 133.565 6.71999 133.565 5.03999C133.565 3.59999 132.605 2.39999 129.533 2.39999ZM124.285 11.64V5.27999H128.957C130.397 5.27999 130.397 6.95999 130.397 6.95999C130.397 6.95999 130.397 8.63999 128.957 8.63999H125.749L124.285 11.64Z" fill="#11E44F"/>
        <path d="M159.63 12.36L153.426 0H148.866L155.658 13.8L156.09 13.68C159.258 12.84 160.074 10.92 160.074 8.76C160.074 6.12 158.91 4.56 156.45 3.36L159.63 12.36ZM145.548 22.8L152.01 9.48L145.062 3.03999H136.95L144.15 12.6L135.39 22.8H145.548Z" fill="#1f7a3c"/>
      </g>
      <defs>
        <linearGradient id="paint0_linear_1_2" x1="11.28" y1="0" x2="11.28" y2="22.8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#11E44F"/>
          <stop offset="1" stopColor="#1f7a3c"/>
        </linearGradient>
        <clipPath id="clip0_1_2">
          <rect width="160" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
);


const navItems = [
  { href: '/world', label: 'World', icon: Globe },
  { href: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
  { href: '/lab', label: 'Lab', icon: FlaskConical },
  { href: '/academy', label: 'Academy', icon: BookOpen },
  { href: '/insights', label: 'Insights', icon: LineChart },
  { href: '/inbox', label: 'Inbox', icon: Mail },
  { href: '/agenda', label: 'Agenda', icon: ClipboardCheck },
  { href: '/saleflow', label: 'SaleFlow', icon: LayoutGrid },
  { href: '/customers', label: 'Clientes', icon: Users },
  { href: '/social', label: 'Social', icon: PenSquare },
  { href: '/commerce', label: 'Comercio', icon: Landmark },
  { href: '/partners', label: 'Partners', icon: Handshake },
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
                    <HiperFlowLogo className="h-6 w-auto" />
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
                            <HiperFlowLogo className="h-6 w-auto" />
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
