
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, useUser, initiateAnonymousSignIn } from '@/firebase';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

const HiperFlowLogo = ({ className }: { className?: string }) => (
    <Image
      src="http://hiperflow.app.elsartenpro.com/wp-content/uploads/2025/10/Logo-HipeFLow-Banner.png"
      alt="HiperFlow Logo"
      width={140}
      height={40}
      className={cn("w-auto", className)}
      priority
    />
);


export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleAnonymousSignIn = () => {
    initiateAnonymousSignIn(auth);
  };
  
  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center gap-4 mb-8">
        <HiperFlowLogo className="h-12 w-auto" />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Bienvenido</CardTitle>
          <CardDescription>Inicia sesión para continuar en tu espacio de trabajo.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Aquí podrías agregar campos de email/contraseña en el futuro */}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleAnonymousSignIn}>
            <User className="mr-2 h-4 w-4" />
            Ingresar como Anónimo
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
