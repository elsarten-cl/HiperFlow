
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
import { Plus, FileText, Receipt, CreditCard } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function CommercePage() {
  return (
    <>
      <PageHeader
        title="Centro de Comercio"
        description="Crea, cobra y factura sin salir de HiperFlow. Conecta tus ventas con tus sistemas tributarios y pasarelas de pago."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Documento
        </Button>
      </PageHeader>
      <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
        Este módulo centraliza la gestión comercial: genera cotizaciones, emite documentos electrónicos, registra pagos y sincroniza automáticamente con plataformas como Stripe, PayPal o tu sistema tributario local.
      </p>

      <Tabs defaultValue="quotes" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quotes">
            <FileText className="mr-2 h-4 w-4" />
            Cotizaciones
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <Receipt className="mr-2 h-4 w-4" />
            Facturas y Boletas
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="mr-2 h-4 w-4" />
            Pagos
          </TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quotes">
          <Card>
            <CardHeader>
              <CardTitle>Cotizaciones</CardTitle>
              <CardDescription>
                Documentos de propuestas comerciales enviadas a tus clientes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha Emisión</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No hay cotizaciones para mostrar.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Facturas y Boletas</CardTitle>
              <CardDescription>
                Documentos tributarios emitidos y pendientes de pago.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha Emisión</TableHead>
                    <TableHead>Fecha Vencimiento</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No hay facturas ni boletas para mostrar.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
            <Card>
                <CardHeader>
                    <CardTitle>Pagos Recibidos</CardTitle>
                    <CardDescription>Historial de todas las transacciones y pagos registrados.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Monto Pagado</TableHead>
                        <TableHead>Fecha de Pago</TableHead>
                        <TableHead>Método de Pago</TableHead>
                        <TableHead>Documento Asociado</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                        No hay pagos registrados.
                        </TableCell>
                    </TableRow>
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Comercio</CardTitle>
              <CardDescription>
                Conecta tus pasarelas de pago y configura los datos de facturación de tu empresa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">La configuración de comercio estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </>
  );
}
