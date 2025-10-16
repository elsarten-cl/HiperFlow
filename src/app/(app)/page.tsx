
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Zap, BrainCircuit, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HiperFlowOSPage() {
  return (
    <>
      <PageHeader
        title="HiperFlow OS"
        description="El cerebro inteligente que coordina todo el ecosistema HiperFlow."
      />
      <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
        Desde este centro de mando, puedes visualizar, coordinar y optimizar en tiempo real cada módulo, agente IA, flujo y conexión del ecosistema. HiperFlow OS convierte tus datos en decisiones, automatiza la coordinación entre áreas y aprende de cada interacción.
      </p>

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
                <Button variant="outline" size="sm">Ver Detalles</Button>
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
            <Button className="w-full" variant="outline">Ir a Automations</Button>
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
             <Button className="w-full" variant="outline">Ir a Laboratorio IA</Button>
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
            <Button className="w-full" variant="outline">Ir a Conexiones</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
