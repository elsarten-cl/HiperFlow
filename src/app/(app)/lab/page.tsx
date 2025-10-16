
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
import { FlaskConical, Bot, Zap, Beaker, Users, GitMerge, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function LabPage() {
  return (
    <>
      <PageHeader
        title="HiperFlow Lab"
        description="Explora, prototipa y crea el futuro de HiperFlow."
      >
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar experimentos..." className="pl-8" />
        </div>
      </PageHeader>
      <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
        Este laboratorio es el espacio donde las ideas se transforman en soluciones. Experimenta con inteligencia artificial, automatizaciones, flujos, prototipos y nuevos módulos que pueden convertirse en parte del futuro del ecosistema HiperFlow.
      </p>

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
    </>
  );
}
