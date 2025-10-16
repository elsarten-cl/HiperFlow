'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const HiperFlowLogo = () => (
  <svg
    width="48"
    height="48"
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

export default function CustomerPortalLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for login logic
    toast({
      title: 'Función no implementada',
      description: 'El inicio de sesión para clientes se habilitará próximamente.',
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center gap-4 mb-8">
        <HiperFlowLogo />
        <h1 className="text-4xl font-headline font-bold">Portal de Clientes</h1>
      </div>
       <p className="text-muted-foreground mb-8 max-w-md text-center">
        Tu espacio personal. Consulta avances, gestiona pagos y mantente conectado.
      </p>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa a tu portal para ver tus proyectos y facturas.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit">Ingresar</Button>
            <p className="text-xs text-muted-foreground">O continúa con</p>
            <Button variant="outline" className="w-full" type="button">
                {/* Placeholder for Google Icon */}
                <span className="mr-2 h-4 w-4">G</span>
                Google
            </Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
