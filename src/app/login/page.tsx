
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, useUser, initiateAnonymousSignIn } from '@/firebase';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

const HiperFlowLogo = ({ className }: { className?: string }) => (
    <svg
      width="48"
      height="48"
      viewBox="0 0 160 48"
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
