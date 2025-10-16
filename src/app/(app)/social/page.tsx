'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { generateSocialMediaPost } from '@/ai/flows/generate-social-media-post';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Copy, CalendarPlus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SocialPage() {
  const [topic, setTopic] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGeneratePost = async () => {
    if (!topic.trim()) {
      toast({
        title: 'El tema está vacío',
        description: 'Por favor, describe el tema para tu publicación en redes sociales.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setGeneratedPost('');
    try {
      const result = await generateSocialMediaPost({ topicDescription: topic });
      setGeneratedPost(result.postContent);
      toast({ title: '¡Publicación generada con éxito!' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error al generar la publicación',
        description: 'Ocurrió un error al comunicarse con la IA.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(generatedPost);
      toast({ title: '¡Copiado al portapapeles!' });
    }
  };

  return (
    <>
      <PageHeader
        title="Social AI"
        description="Crea, programa y automatiza tus publicaciones con inteligencia artificial. Desde una idea hasta un post completo, todo dentro de HiperFlow."
      />
       <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
        Este módulo te permite generar contenido para Facebook, Instagram, LinkedIn o TikTok, programarlo, revisarlo con tu equipo y enviarlo automáticamente a tus redes mediante Make o n8n.
      </p>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generador de Contenido</CardTitle>
            <CardDescription>
              Describe tu tema y deja que la IA cree una publicación para ti.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="topic">Descripción del Tema</Label>
              <Textarea
                placeholder="Ej: Anunciar nuestra nueva integración con Stripe para pagos fluidos."
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={5}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleGeneratePost} disabled={isLoading}>
              <Sparkles className="mr-2 h-4 w-4" />
              {isLoading ? 'Generando...' : 'Generar Publicación'}
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Publicación Generada</CardTitle>
            <CardDescription>Revisa, edita y programa tu publicación.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <Textarea
                placeholder="Tu publicación generada aparecerá aquí..."
                value={generatedPost}
                onChange={(e) => setGeneratedPost(e.target.value)}
                rows={8}
                className="font-code"
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCopyToClipboard} disabled={!generatedPost}>
              <Copy className="mr-2 h-4 w-4" />
              Copiar
            </Button>
            <Button disabled={!generatedPost}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Programar Publicación
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
