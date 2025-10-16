'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

const integrations = [
  {
    name: 'Google Workspace',
    description: 'Sincroniza tu Calendario, Drive y Gmail.',
    logo: '/google-logo.svg', // Placeholder
    status: 'disconnected',
  },
  {
    name: 'Meta Business Suite',
    description: 'Conecta Facebook, Instagram y WhatsApp.',
    logo: '/meta-logo.svg', // Placeholder
    status: 'disconnected',
  },
  {
    name: 'Shopify',
    description: 'Importa clientes y pedidos de tu e-commerce.',
    logo: '/shopify-logo.svg', // Placeholder
    status: 'disconnected',
  },
  {
    name: 'WooCommerce',
    description: 'Sincroniza tu tienda online con HiperFlow.',
    logo: '/woocommerce-logo.svg', // Placeholder
    status: 'disconnected',
  },
  {
    name: 'HubSpot',
    description: 'Sincronización bidireccional de contactos.',
    logo: '/hubspot-logo.svg', // Placeholder
    status: 'disconnected',
  },
  {
    name: 'Kommo CRM',
    description: 'Conecta tus embudos de Kommo.',
    logo: '/kommo-logo.svg', // Placeholder
    status: 'disconnected',
  },
];

const LogoPlaceholder = ({ name }: { name: string }) => (
  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
    <span className="text-xs font-bold">{name.split(' ').map(n => n[0]).join('')}</span>
  </div>
);


export default function IntegrationsPage() {
  return (
    <>
      <PageHeader
        title="Centro de Integraciones"
        description="Conecta HiperFlow con tus plataformas favoritas. Sincroniza datos, automatiza campañas y gestiona todo tu ecosistema digital desde un solo lugar."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Integración
        </Button>
      </PageHeader>
       <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
        Este módulo permite conectar tus cuentas de Google Ads, Meta Business, Shopify, WooCommerce, Kommo, HubSpot, Google Workspace, WhatsApp Business API y otras herramientas compatibles.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.name}>
            <CardHeader className="flex flex-row items-center gap-4">
               <LogoPlaceholder name={integration.name} />
              <div>
                <CardTitle>{integration.name}</CardTitle>
                 <Badge variant={integration.status === 'connected' ? 'default' : 'outline'} className={integration.status === 'connected' ? 'bg-green-500/80' : ''}>
                    {integration.status === 'connected' ? 'Conectado' : 'Desconectado'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{integration.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                {integration.status === 'connected' ? 'Administrar' : 'Conectar'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
