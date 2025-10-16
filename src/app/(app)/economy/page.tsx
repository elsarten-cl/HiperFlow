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
import { Plus, Trophy, BarChart, Wallet, Target } from 'lucide-react';

const KpiCard = ({ title, value, icon: Icon }: { title: string; value: string; icon: React.ElementType; }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
);


export default function EconomyPage() {
  return (
    <>
      <PageHeader
        title="HiperFlow Economy"
        description="Gana recompensas al aprender, crear y automatizar. Tu progreso se convierte en valor."
      >
        <Button variant="outline">
          Canjear Tokens
        </Button>
      </PageHeader>
      <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
        HiperFlow Token es la energía que impulsa a la comunidad. Completa misiones, sube de nivel y desbloquea beneficios exclusivos.
      </p>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">
            <BarChart className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="wallet">
            <Wallet className="mr-2 h-4 w-4" />
            Billetera
          </TabsTrigger>
          <TabsTrigger value="missions">
            <Target className="mr-2 h-4 w-4" />
            Misiones
          </TabsTrigger>
          <TabsTrigger value="ledger">
            <Trophy className="mr-2 h-4 w-4" />
            Ranking y Logros
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard title="Tokens Acumulados (HFT)" value="325" icon={Wallet} />
                <KpiCard title="Nivel Actual" value="Pro" icon={Trophy} />
                <KpiCard title="Misiones Completadas" value="8" icon={Target} />
                <KpiCard title="Posición en Ranking" value="#42" icon={BarChart} />
            </div>
             <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Historial de Recompensas</CardTitle>
                    <CardDescription>Tus últimas actividades premiadas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground p-8">El historial de transacciones de tokens estará disponible próximamente.</p>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="wallet" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Billetera Digital (HiperWallet)</CardTitle>
              <CardDescription>
                Gestiona, canjea o transfiere tus HiperFlow Tokens (HFT).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">La funcionalidad para canjear y transferir tokens estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="missions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Centro de Misiones</CardTitle>
              <CardDescription>
                Completa desafíos semanales para ganar más tokens y experiencia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">Las misiones y desafíos semanales estarán disponibles próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ledger" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ranking y Logros (FlowRank)</CardTitle>
              <CardDescription>
                Compara tu progreso, desbloquea medallas y compite en la comunidad.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">El ranking de usuarios y el sistema de medallas estarán disponibles próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
