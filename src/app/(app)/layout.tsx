'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Trophy,
  Group,
  Cloud,
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useAuth, useUser } from '@/firebase';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

const HiperFlowLogo = ({ className }: { className?: string }) => (
    <Image
      src="http://hiperflow.app.elsartenpro.com/wp-content/uploads/2025/10/Logo-HipeFLow-Banner.png"
      alt="HiperFlow Logo"
      width={100}
      height={24}
      className={cn("w-auto", className)}
      priority
    />
);


const navItems = [
  { href: '/world', label: 'World', icon: Globe },
  { href: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
  { href: '/economy', label: 'Economía', icon: Trophy },
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
  { href: '/hiperdao', label: 'HiperDAO', icon: Group },
  { href: '/cloud', label: 'Cloud', icon: Cloud },
  { href: '/settings', label: 'Configuración', icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
  
  const MobileNavLink = ({ href, label, icon: Icon, exact = false, onClick }: { href: string, label: string, icon: React.ElementType, exact?: boolean, onClick: () => void }) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return (
         <Link
            href={href}
            onClick={onClick}
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
       <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6 z-50">
            <div className="flex items-center gap-4">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                        >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col p-0">
                        <SheetHeader className="p-6 pb-0">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-lg font-semibold mb-4"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <HiperFlowLogo className="h-10 w-auto" />
                            </Link>
                        </SheetHeader>
                        <ScrollArea className="flex-1">
                            <nav className="grid gap-2 text-base font-medium p-6">
                                {navItems.map(({ href, label, icon, exact }) => (
                                    <MobileNavLink 
                                        key={href} 
                                        href={href} 
                                        label={label} 
                                        icon={icon} 
                                        exact={exact}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    />
                                ))}
                            </nav>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>

                <Link href="/" className="flex items-center gap-2 font-semibold font-headline text-lg md:text-base">
                    <HiperFlowLogo className="h-10 w-auto" />
                </Link>
            </div>
            
            <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
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
