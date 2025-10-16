
'use client';

import React from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Circle, Map, GitBranch, Bell, Shield, CloudCog, HardDrive, Cpu, Database, Wallet, GitPullRequest, ArrowRight } from 'lucide-react';

const KpiCard = ({ title, value, icon: Icon, status }: { title: string; value: string; icon: React.ElementType; status?: 'ok' | 'warn' | 'error' }) => {
  const statusColors = {
    ok: 'text-green-400',
    warn: 'text-yellow-400',
    error: 'text-red-400',
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-muted-foreground ${status ? statusColors[status] : ''}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

const InfrastructureStatus = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <KpiCard title="Entorno Principal" value="Producción" icon={CloudCog} status="ok" />
        <KpiCard title="Uso de Firestore" value="78%" icon={Database} status="warn" />
        <KpiCard title="Cloud Functions" value="99.8% OK" icon={Cpu} status="ok" />
        <KpiCard title="Uso de Storage" value="45%" icon={HardDrive} status="ok" />
        <KpiCard title="Coste Proyectado" value="$125" icon={Wallet} status="ok" />
    </div>
);

const HiperFlowCloudPage = () => {
    return (
        <>
            <PageHeader
                title="HiperFlow Cloud"
                description="Gestión global, control de costos y escalabilidad inteligente en tiempo real."
            >
                 <Button variant="outline">
                    <Bell className="mr-2 h-4 w-4" />
                    Ver Alertas (2)
                </Button>
            </PageHeader>
             <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
                HiperFlow Cloud es el cerebro operativo que mantiene en marcha toda la infraestructura. Supervisa, optimiza y escala cada componente del ecosistema con precisión milimétrica y sin intervención manual.
            </p>

            <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="dashboard">Panel Global</TabsTrigger>
                    <TabsTrigger value="costs">Control de Costos</TabsTrigger>
                    <TabsTrigger value="cicd">CI/CD</TabsTrigger>
                    <TabsTrigger value="security">Seguridad y Backups</TabsTrigger>
                    <TabsTrigger value="scaling">Escalabilidad</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Panel Global de Infraestructura</CardTitle>
                            <CardDescription>Vista panorámica del ecosistema en tiempo real.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <InfrastructureStatus />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Map className="h-5 w-5" /> Latencia por Región</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground p-8">El mapa de latencia global estará disponible próximamente.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="costs" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cost Intelligence (Gemini Cloud Optimizer)</CardTitle>
                            <CardDescription>Análisis, predicción y optimización de gastos en la nube.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground p-8">El panel de optimización de costos estará disponible próximamente.</p>
                        </CardContent>
                         <CardFooter>
                            <Button>
                                <ArrowRight className="mr-2 h-4 w-4" />
                                Activar Optimización Automática
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="cicd" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>CI/CD Pipeline (GitHub Actions & Firebase)</CardTitle>
                            <CardDescription>Control de versiones y despliegue para todos los entornos.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <p className="text-center text-muted-foreground p-8">El panel de CI/CD estará disponible próximamente.</p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                             <Button variant="outline"><GitPullRequest className="mr-2 h-4 w-4" /> Desplegar Nueva Versión</Button>
                             <Button variant="destructive" className="bg-red-800/50 text-red-300">Rollback a Versión Anterior</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Seguridad, Monitoreo y Backups</CardTitle>
                            <CardDescription>Gestión centralizada de la seguridad y las copias de seguridad.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground p-8">El centro de seguridad y backups estará disponible próximamente.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="scaling" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Escalabilidad Inteligente (Gemini Scale Manager)</CardTitle>
                            <CardDescription>Análisis de demanda y ajuste dinámico de recursos.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground p-8">El panel de escalabilidad automática estará disponible próximamente.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    );
}

export default HiperFlowCloudPage;
