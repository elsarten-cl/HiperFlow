
'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, ShoppingCart, Handshake, ToyBrick, Package, Users, Compass, Search, Bot, Zap, BrainCircuit, Link as LinkIcon, AlertCircle, FlaskConical, Beaker, GitMerge, Projector } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// --- HiperFlow OS Component ---
const HiperFlowOS = () => {
    const router = useRouter();

    const handleGoToAutomations = () => {
        router.push('/settings?tab=automations');
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {/* Capa de Observación Global */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bot className="text-blue-400" /> Global Monitor</CardTitle>
                        <CardDescription>Vista panorámica del ecosistema en tiempo real.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold">12</p>
                            <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">8</p>
                            <p className="text-sm text-muted-foreground">Módulos en Ejecución</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">15</p>
                            <p className="text-sm text-muted-foreground">Flujos Activos</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">6</p>
                            <p className="text-sm text-muted-foreground">Integraciones</p>
                        </div>
                        </div>
                        <div className="mt-6 p-4 bg-muted/50 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 text-yellow-400" />
                                <div>
                                    <p className="font-semibold">Alerta Inteligente</p>
                                    <p className="text-sm text-muted-foreground">El flujo "Sincronizar nuevos leads" ha fallado 3 veces.</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleGoToAutomations}>Ver Detalles</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Capa de Orquestación */}
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Zap className="text-purple-400" /> Automation Control Center</CardTitle>
                    <CardDescription>Control centralizado de todas las automatizaciones.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground p-4">La gestión de flujos estará disponible aquí.</p>
                    <Button className="w-full" variant="outline" onClick={() => router.push('/settings?tab=automations')}>Ir a Automations</Button>
                </CardContent>
                </Card>

                {/* Capa de Coordinación de IA */}
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BrainCircuit className="text-green-400" /> AI Management Hub</CardTitle>
                    <CardDescription>Panel maestro para todos los agentes de IA integrados.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground p-4">La gestión de agentes IA estará disponible aquí.</p>
                    <Button className="w-full" variant="outline" onClick={() => router.push('/settings?tab=hub')}>Ir a Hub</Button>
                </CardContent>
                </Card>

                {/* Capa de Integración Universal */}
                <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><LinkIcon className="text-red-400" /> Connect & API Hub</CardTitle>
                    <CardDescription>Control centralizado de integraciones externas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground p-4">El control de conexiones estará disponible aquí.</p>
                    <Button className="w-full" variant="outline" onClick={() => router.push('/settings?tab=integrations')}>Ir a Conexiones</Button>
                </CardContent>
                </Card>
            </div>
        </>
    );
}

// --- HiperFlow Lab Component ---
const HiperFlowLab = () => (
    <Tabs defaultValue="ai-playground" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="ai-playground">
                <Bot className="mr-2 h-4 w-4" />
                AI Playground
            </TabsTrigger>
            <TabsTrigger value="automation-sandbox">
                <Zap className="mr-2 h-4 w-4" />
                Automation Sandbox
            </TabsTrigger>
            <TabsTrigger value="module-incubator">
                <Beaker className="mr-2 h-4 w-4" />
                Module Incubator
            </TabsTrigger>
            <TabsTrigger value="community-lab">
                <Users className="mr-2 h-4 w-4" />
                Open Innovation
            </TabsTrigger>
            <TabsTrigger value="roadmap">
                <GitMerge className="mr-2 h-4 w-4" />
                Roadmap Futuro
            </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-playground" className="mt-6">
            <Card>
                <CardHeader>
                <CardTitle>Experimentación con IA</CardTitle>
                <CardDescription>
                    Prueba y compara diferentes modelos de IA, guarda prompts y prototipa funciones inteligentes.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <p className="text-center text-muted-foreground p-8">El AI Playground estará disponible próximamente para experimentar con modelos de lenguaje.</p>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="automation-sandbox" className="mt-6">
            <Card>
                <CardHeader>
                <CardTitle>Sandbox de Flujos de Automatización</CardTitle>
                <CardDescription>
                    Diseña y prueba flujos de Make o n8n en un entorno seguro antes de pasarlos a producción.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <p className="text-center text-muted-foreground p-8">El sandbox para flujos de automatización estará disponible próximamente.</p>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="module-incubator" className="mt-6">
            <Card>
                <CardHeader>
                <CardTitle>Incubadora de Módulos</CardTitle>
                <CardDescription>
                    Prototipa, prueba y propone nuevos módulos para el ecosistema de HiperFlow.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <p className="text-center text-muted-foreground p-8">La incubadora de módulos para desarrollo y prototipado estará disponible próximamente.</p>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="community-lab" className="mt-6">
            <Card>
                <CardHeader>
                <CardTitle>Laboratorio de Innovación Abierta</CardTitle>
                <CardDescription>
                    Comparte ideas, vota por las mejores propuestas y colabora con la comunidad para construir el futuro.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <p className="text-center text-muted-foreground p-8">El hub de innovación comunitaria estará disponible próximamente.</p>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="mt-6">
            <Card>
                <CardHeader>
                <CardTitle>Roadmap de Desarrollo</CardTitle>
                <CardDescription>
                    Visualiza la línea de tiempo de los próximos lanzamientos, módulos y mejoras del ecosistema.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <p className="text-center text-muted-foreground p-8">El roadmap interactivo del futuro de HiperFlow estará disponible próximamente.</p>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
);


function WorldPageContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'os';
  const { toast } = useToast();

  const handleShowcase = () => {
    toast({
        title: "Próximamente: Modo Demo IA",
        description: "Esta funcionalidad está en desarrollo y pronto estará disponible.",
    });
  }

  return (
    <>
      <PageHeader
        title="HiperFlow World"
        description="Descubre, conecta y expande tu mundo HiperFlow."
      >
        <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar en el ecosistema..." className="pl-8" />
            </div>
             <Button onClick={handleShowcase}>
                <Projector className="mr-2 h-4 w-4" />
                Demo IA
            </Button>
        </div>
      </PageHeader>
      <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
        Explora un entorno unificado donde encontrarás módulos, extensiones, plantillas, partners y servicios. Instala soluciones con un clic, conecta plataformas externas y potencia tu CRM con herramientas creadas por la comunidad global de HiperFlow.
      </p>

      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="os">
            <Bot className="mr-2 h-4 w-4" />
            OS
          </TabsTrigger>
          <TabsTrigger value="lab">
            <FlaskConical className="mr-2 h-4 w-4" />
            Lab
          </TabsTrigger>
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

        <TabsContent value="os" className="mt-6">
            <HiperFlowOS />
        </TabsContent>

        <TabsContent value="lab" className="mt-6">
            <HiperFlowLab />
        </TabsContent>
        
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

export default function WorldPage() {
  return (
    <Suspense fallback={<div>Cargando HiperFlow World...</div>}>
      <WorldPageContent />
    </Suspense>
  );
}
