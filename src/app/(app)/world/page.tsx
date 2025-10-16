
'use client';

import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, ShoppingCart, Handshake, ToyBrick, Package, Users, Compass, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function WorldPage() {
  return (
    <>
      <PageHeader
        title="HiperFlow World"
        description="Descubre, conecta y expande tu mundo HiperFlow."
      >
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar en el ecosistema..." className="pl-8" />
        </div>
      </PageHeader>
      <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
        Explora un entorno unificado donde encontrarás módulos, extensiones, plantillas, partners y servicios. Instala soluciones con un clic, conecta plataformas externas y potencia tu CRM con herramientas creadas por la comunidad global de HiperFlow.
      </p>

      <Tabs defaultValue="ecosystem" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="ecosystem">
            <Compass className="mr-2 h-4 w-4" />
            Ecosistema
          </TabsTrigger>
          <TabsTrigger value="marketplace">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="partners">
            <Handshake className="mr-2 h-4 w-4" />
            Partners
          </TabsTrigger>
          <TabsTrigger value="templates">
            <ToyBrick className="mr-2 h-4 w-4" />
            Plantillas
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Package className="mr-2 h-4 w-4" />
            Integraciones
          </TabsTrigger>
          <TabsTrigger value="community">
            <Users className="mr-2 h-4 w-4" />
            Comunidad
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ecosystem" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Visión General del Ecosistema</CardTitle>
              <CardDescription>
                Un resumen de tus componentes activos y las últimas novedades en HiperFlow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">El dashboard del ecosistema estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace de Módulos y Extensiones</CardTitle>
              <CardDescription>
                Explora y añade nuevas funcionalidades a tu CRM.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <p className="text-center text-muted-foreground p-8">El catálogo de herramientas y módulos estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="partners" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Red de Partners y Alianzas</CardTitle>
              <CardDescription>
                Encuentra agencias y consultores certificados para ayudarte a crecer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">El listado de partners estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Biblioteca de Plantillas</CardTitle>
              <CardDescription>
                Acelera tu trabajo con plantillas pre-diseñadas para flujos, reportes y más.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">La biblioteca de plantillas estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>

         <TabsContent value="integrations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Centro de Integraciones</CardTitle>
              <CardDescription>
                Conecta todas tus herramientas externas en un solo lugar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">El panel de integraciones estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Comunidad Global</CardTitle>
              <CardDescription>
                Conecta con otros usuarios, comparte ideas y resuelve dudas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">Los foros de la comunidad estarán disponibles próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
