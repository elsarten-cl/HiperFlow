
'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, ShoppingCart, Rocket, Library, Trophy } from 'lucide-react';

export default function MarketplacePage() {
  return (
    <>
      <PageHeader
        title="HiperFlow Marketplace"
        description="Convierte tus ideas en activos digitales. Adquiere o comparte cursos, plantillas, flujos y bots."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Publicar un Recurso
        </Button>
      </PageHeader>
      <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
        El Marketplace conecta conocimiento, automatización y creatividad. Instala soluciones listas para usar o monetiza tus propias creaciones.
      </p>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="catalog">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Catálogo de Recursos
          </TabsTrigger>
          <TabsTrigger value="creator-hub">
            <Rocket className="mr-2 h-4 w-4" />
            Panel de Creador
          </TabsTrigger>
          <TabsTrigger value="library">
            <Library className="mr-2 h-4 w-4" />
            Mi Biblioteca
          </TabsTrigger>
          <TabsTrigger value="economy">
            <Trophy className="mr-2 h-4 w-4" />
            Economía Flow
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="catalog" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Explora el Marketplace</CardTitle>
              <CardDescription>
                Encuentra herramientas y conocimiento para potenciar tu ecosistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">El catálogo de recursos digitales estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creator-hub" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Panel de Creador</CardTitle>
              <CardDescription>
                Publica, gestiona y monetiza tus propios productos digitales.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">El panel para creadores estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="library" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Mi Biblioteca de Activos</CardTitle>
              <CardDescription>
                Accede y gestiona todos los recursos que has adquirido.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">Tu colección de cursos, flujos y plantillas aparecerá aquí.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="economy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Economía y Reputación</CardTitle>
              <CardDescription>
                Sigue tu progreso como creador, tus ganancias y tu reputación en la comunidad.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">Los rankings y métricas de la comunidad estarán disponibles próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
