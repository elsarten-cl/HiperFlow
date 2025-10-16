'use client';

import React from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CommandStep = ({ num, title, description, command, isUrl = false }: { num: number, title: string, description: string, command: string, isUrl?: boolean }) => {
  const { toast } = useToast();
  
  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    toast({ title: 'Copiado', description: 'El comando ha sido copiado al portapapeles.' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-lg">{num}</span>
            {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isUrl ? (
          <div className="space-y-2">
            <Label htmlFor={`command-${num}`}>URL de tu repositorio de GitHub</Label>
            <Input id={`command-${num}`} defaultValue="TU_URL_DE_GITHUB.git" className="font-code" />
             <p className="text-xs text-muted-foreground">Reemplaza el valor de ejemplo con la URL de tu repositorio real. La encontrarás en tu página de GitHub.</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <pre className="p-3 rounded-md bg-muted text-muted-foreground font-code flex-1 overflow-x-auto">
              <code>{command}</code>
            </pre>
            <Button variant="outline" size="icon" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
       {isUrl && (
         <CardFooter>
             <p className="text-sm text-muted-foreground">
                Después de reemplazar la URL, usa este comando completo en tu terminal: <code className="font-code bg-muted p-1 rounded-sm">{`git remote add origin TU_URL_DE_GITHUB.git`}</code>
            </p>
         </CardFooter>
      )}
    </Card>
  );
};


export default function PublishPage() {
  return (
    <>
      <PageHeader
        title="Publica tu Aplicación"
        description="Sigue estos pasos para desplegar tu aplicación en internet usando GitHub y Firebase."
      />
      <div className="space-y-8">
        <CommandStep
          num={1}
          title="Inicializa Git"
          description="Prepara tu proyecto para el control de versiones. Este comando solo se ejecuta una vez por proyecto."
          command="git init"
        />
        <CommandStep
          num={2}
          title="Nombra tu Rama Principal"
          description="Establece 'main' como el nombre de tu rama principal de trabajo. Es una convención moderna."
          command="git branch -M main"
        />
        <CommandStep
          num={3}
          title="Conecta tu Repositorio Remoto"
          description="Vincula tu proyecto local con el repositorio que creaste en GitHub."
          command="git remote add origin TU_URL_DE_GITHUB.git"
          isUrl={true}
        />
         <CommandStep
          num={4}
          title="Prepara todos los Archivos"
          description="Agrega todos los archivos de tu proyecto al área de preparación (staging) para ser guardados."
          command="git add ."
        />
         <CommandStep
          num={5}
          title="Guarda tus Cambios (Commit)"
          description='Crea una "fotografía" de tu código con un mensaje descriptivo.'
          command='git commit -m "Versión inicial de la aplicación HiperFlow"'
        />
         <CommandStep
          num={6}
          title="Sube tu Código a GitHub"
          description="Envía todos tus cambios guardados a tu repositorio remoto en GitHub."
          command="git push -u origin main"
        />

        <Card className="bg-primary/10 border-primary/40">
            <CardHeader>
                <CardTitle>¡Último Paso!</CardTitle>
                <CardDescription>Una vez que hayas subido tu código a GitHub, el proceso está casi completo.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-primary-foreground/90">Vuelve a la página de Firebase App Hosting. Ahora deberías poder seleccionar la rama <b className="text-primary-foreground">main</b> y finalizar la configuración. Tu aplicación se publicará automáticamente. ¡Felicidades!</p>
            </CardContent>
            <CardFooter>
                 <Button asChild>
                    <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">
                        Ir a Firebase <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </CardFooter>
        </Card>
      </div>
    </>
  );
}
