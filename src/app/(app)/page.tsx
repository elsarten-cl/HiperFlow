
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

const HiperFlowLogo = ({ className }: { className?: string }) => (
    <Image
      src="http://hiperflow.app.elsartenpro.com/wp-content/uploads/2025/10/5-1.png"
      alt="HiperFlow Logo"
      width={280}
      height={80}
      className={cn("w-auto", className)}
      priority
    />
);

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
        <HiperFlowLogo className="h-16 w-auto mb-8" />
      <h1 className="text-4xl font-bold font-headline tracking-tight text-white sm:text-5xl md:text-6xl">
        Bienvenido a HiperFlow OS
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        El centro de mando de tu ecosistema. Observa, orquesta y optimiza todos tus módulos, flujos y agentes de IA desde un único lugar.
      </p>
      <div className="mt-10">
        <Button size="lg" onClick={() => router.push('/world?tab=os')}>
          <LogIn className="mr-2 h-5 w-5" />
          Acceder al Centro de Mando
        </Button>
      </div>
    </div>
  );
}
