
'use client';

import React from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Bot, Zap, Beaker, GitMerge } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
          <CardTitle>Experimentación con IA (Training Sandbox)</CardTitle>
          <CardDescription>
            Prueba y compara diferentes modelos de IA, guarda prompts y prototipa funciones inteligentes en un entorno seguro.
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

export default function LabPage() {
    return (
        <>
            <PageHeader
                title="HiperFlow Lab"
                description="El espacio para la experimentación, innovación y co-creación del futuro de HiperFlow."
            >
                <Button variant="outline">Iniciar Tour Interactivo</Button>
            </PageHeader>
            <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
              Aquí puedes probar nuevas funciones en un entorno seguro (sandbox), experimentar con IA, y colaborar en el desarrollo de futuros módulos.
            </p>
            <HiperFlowLab />
        </>
    )
}
