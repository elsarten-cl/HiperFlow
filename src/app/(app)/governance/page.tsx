
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
import { Shield, Bot, Leaf, ListChecks } from 'lucide-react';

export default function GovernancePage() {
  return (
    <>
      <PageHeader
        title="HiperFlow Governance"
        description="Confianza, transparencia y sostenibilidad en cada interacción del ecosistema HiperFlow."
      />
      <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
        Este módulo protege el corazón del ecosistema. Supervisa el uso ético de la información, la seguridad de los datos, las políticas medioambientales digitales y el cumplimiento normativo global, garantizando una operación transparente y responsable.
      </p>

      <Tabs defaultValue="compliance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compliance">
            <Shield className="mr-2 h-4 w-4" />
            Cumplimiento y Seguridad
          </TabsTrigger>
          <TabsTrigger value="ai-ethics">
            <Bot className="mr-2 h-4 w-4" />
            Ética IA
          </TabsTrigger>
          <TabsTrigger value="sustainability">
            <Leaf className="mr-2 h-4 w-4" />
            Sostenibilidad Digital
          </TabsTrigger>
          <TabsTrigger value="audit">
            <ListChecks className="mr-2 h-4 w-4" />
            Auditoría y Transparencia
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="compliance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Panel de Cumplimiento y Seguridad</CardTitle>
              <CardDescription>
                Supervisa el cumplimiento normativo y la seguridad de los datos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">El panel de cumplimiento y logs de seguridad estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-ethics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gobernanza de IA y Ética Digital</CardTitle>
              <CardDescription>
                Gestiona los principios éticos y la transparencia de los modelos de IA.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">El hub de ética IA estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sustainability" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sostenibilidad Digital y EcoMétricas</CardTitle>
              <CardDescription>
                Mide y optimiza la huella digital y el impacto ecológico de tu operación.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">Las métricas de sostenibilidad y optimización de recursos estarán disponibles próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Monitor de Auditoría e Integridad</CardTitle>
              <CardDescription>
                Revisa un registro auditable de todos los eventos críticos del sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">El registro de auditoría global estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
