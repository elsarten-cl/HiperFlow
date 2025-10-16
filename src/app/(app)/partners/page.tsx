
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
import { Plus, Users, Award, Briefcase, Network, TrendingUp, DollarSign } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

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

export default function PartnersPage() {
  return (
    <>
      <PageHeader
        title="HiperFlow Partners"
        description="Conecta, colabora y crece con el ecosistema global de aliados HiperFlow."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Referido
        </Button>
      </PageHeader>
      <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
        Desde este módulo podrás unirte como partner, gestionar tus referidos, monitorear tus comisiones, acceder a materiales promocionales y establecer alianzas estratégicas con otras empresas del ecosistema.
      </p>

      <Tabs defaultValue="dashboard" className="w-full">
        <ScrollArea>
            <TabsList className="grid w-full max-w-full grid-flow-col">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="referrals">Referidos</TabsTrigger>
              <TabsTrigger value="program">Programas</TabsTrigger>
              <TabsTrigger value="toolkit">Recursos</TabsTrigger>
              <TabsTrigger value="network">Red de Partners</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
        
        <TabsContent value="dashboard" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard title="Referidos Activos" value="12" icon={Users} />
            <KpiCard title="Ventas Generadas" value="$45,231" icon={TrendingUp} />
            <KpiCard title="Comisiones Acumuladas" value="$4,523" icon={DollarSign} />
            <KpiCard title="Nivel de Partner" value="Plata" icon={Award} />
          </div>
          <Card className="mt-8">
            <CardHeader>
                <CardTitle>Rendimiento Mensual</CardTitle>
                <CardDescription>Evolución de tus referidos y comisiones.</CardDescription>
            </CardHeader>
            <CardContent>
                 <p className="text-center text-muted-foreground p-8">Los gráficos de rendimiento estarán disponibles próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Referidos</CardTitle>
              <CardDescription>
                Haz seguimiento de todos los clientes que has referido y su estado actual.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha de Registro</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Valor Generado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No hay referidos para mostrar.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="program" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Programas y Beneficios</CardTitle>
              <CardDescription>
                Conoce los niveles del programa y los beneficios que puedes obtener.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">La información sobre los programas y beneficios estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="toolkit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Materiales y Recursos (Partner Toolkit)</CardTitle>
              <CardDescription>
                Accede a presentaciones, plantillas y otros recursos para potenciar tus ventas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">La biblioteca de recursos estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>

         <TabsContent value="network" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Red de Colaboración</CardTitle>
              <CardDescription>
                Conecta con otros partners de HiperFlow, busca por especialidad o país.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">El mapa de partners estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
