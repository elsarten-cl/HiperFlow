
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Upload, Plus, MoreHorizontal, Zap, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// --- Components ---
const AppearanceSettings = () => {
  const [primaryColor, setPrimaryColor] = useState('139 89% 48%');
  const [accentColor, setAccentColor] = useState('141 57% 45%');
  
  const handleColorChange = (variable: string, value: string) => {
    document.documentElement.style.setProperty(variable, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalización Visual (Branding)</CardTitle>
        <CardDescription>
          Adapta la apariencia de HiperFlow a la identidad de tu marca.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Color Primario (Verde Eléctrico)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                defaultValue={'#11E44F'}
                className="w-12 h-10 p-1"
                onChange={(e) => handleColorChange('--primary', hexToHsl(e.target.value))}
              />
               <Input
                id="primaryColor"
                placeholder="Ej: #11E44F"
                defaultValue={'#11E44F'}
                 onChange={(e) => handleColorChange('--primary', hexToHsl(e.target.value))}
              />
            </div>
            <p className="text-xs text-muted-foreground">Usado para botones, enlaces y acciones principales.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accentColor">Color de Acento (Verde Profundo)</Label>
             <div className="flex items-center gap-2">
                <Input
                    type="color"
                    defaultValue={'#0FAF3A'}
                    className="w-12 h-10 p-1"
                    onChange={(e) => handleColorChange('--accent', hexToHsl(e.target.value))}
                />
                <Input
                    id="accentColor"
                    placeholder="Ej: #0FAF3A"
                    defaultValue={'#0FAF3A'}
                    onChange={(e) => handleColorChange('--accent', hexToHsl(e.target.value))}
                />
            </div>
            <p className="text-xs text-muted-foreground">Usado para estados activos, hovers y elementos secundarios.</p>
          </div>
        </div>

        <div className="space-y-2">
            <Label>Logo de la Empresa</Label>
            <div className="flex items-center gap-4">
                <div className="w-24 h-24 border-dashed border-2 rounded-lg flex items-center justify-center bg-muted/50">
                    <span className="text-sm text-muted-foreground">Logo</span>
                </div>
                 <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Subir Logo
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">Recomendado: PNG o SVG con fondo transparente.</p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label>Modo Oscuro</Label>
                <p className="text-xs text-muted-foreground">
                    Activa o desactiva el tema oscuro para toda la aplicación.
                </p>
            </div>
            <Switch defaultChecked disabled />
        </div>
         <div className="space-y-2">
            <Label htmlFor="lema">Lema o Frase Corporativa</Label>
            <Input id="lema" placeholder="Tu lema aquí..."/>
            <p className="text-xs text-muted-foreground">Aparecerá en la parte superior del Dashboard.</p>
        </div>
      </CardContent>
    </Card>
  );
};


// Helper function to convert HEX to HSL string for CSS variables
function hexToHsl(hex: string): string {
    if (!hex.startsWith('#')) return hex;
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return `${h} ${s}% ${l}%`;
}


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


const IntegrationsSettings = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Centro de Integraciones</CardTitle>
                <CardDescription>
                Conecta HiperFlow con tus plataformas favoritas. Sincroniza datos, automatiza campañas y gestiona todo tu ecosistema digital desde un solo lugar.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((integration) => (
                <Card key={integration.name}>
                    <CardHeader className="flex flex-row items-center gap-4">
                    <LogoPlaceholder name={integration.name} />
                    <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge variant={integration.status === 'connected' ? 'default' : 'outline'} className={integration.status === 'connected' ? 'bg-green-500/80' : ''}>
                            {integration.status === 'connected' ? 'Conectado' : 'Desconectado'}
                        </Badge>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <p className="text-sm text-muted-foreground h-10">{integration.description}</p>
                    </CardContent>
                    <CardFooter>
                    <Button variant="outline" className="w-full">
                        {integration.status === 'connected' ? 'Administrar' : 'Conectar'}
                    </Button>
                    </CardFooter>
                </Card>
                ))}
            </div>
            </CardContent>
             <CardFooter className="border-t pt-6">
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Solicitar Nueva Integración
                </Button>
            </CardFooter>
        </Card>
    )
}


export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Control Center"
        description="Adapta HiperFlow a tu forma de trabajar. Configura roles, permisos, notificaciones y estilo visual desde un solo lugar."
      />

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="appearance">Apariencia</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="users">Usuarios & Roles</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>
                Gestiona la información de tu cuenta personal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Aquí irá la configuración del perfil del usuario.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>
        <TabsContent value="notifications">
           <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>
                Configura cómo y cuándo quieres recibir alertas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Aquí irá la configuración de notificaciones.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
           <Card>
            <CardHeader>
              <CardTitle>Usuarios y Roles</CardTitle>
              <CardDescription>
                Gestiona el acceso de tu equipo a HiperFlow.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Aquí irá la gestión de usuarios y roles.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integrations">
            <IntegrationsSettings />
        </TabsContent>
      </Tabs>
    </>
  );
}
