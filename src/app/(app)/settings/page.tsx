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
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  WithId,
} from '@/firebase';
import { collection, query, where, serverTimestamp, Timestamp, doc } from 'firebase/firestore';
import type { Automation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { AutomationForm } from '@/components/automation-form';


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
  { name: 'Google Workspace', description: 'Sincroniza Calendario, Drive y Gmail.', status: 'disconnected', category: 'Comunicación' },
  { name: 'Meta Business Suite', description: 'Conecta Facebook, Instagram y WhatsApp.', status: 'disconnected', category: 'Redes Sociales' },
  { name: 'Shopify', description: 'Importa clientes y pedidos de tu e-commerce.', status: 'disconnected', category: 'Pagos y Facturación' },
  { name: 'WooCommerce', description: 'Sincroniza tu tienda online con HiperFlow.', status: 'disconnected', category: 'Pagos y Facturación' },
  { name: 'HubSpot', description: 'Sincronización bidireccional de contactos.', status: 'disconnected', category: 'CRMs y ERPs' },
  { name: 'Kommo CRM', description: 'Conecta tus embudos de Kommo.', status: 'disconnected', category: 'CRMs y ERPs' },
  { name: 'Stripe', description: 'Procesa pagos y gestiona suscripciones.', status: 'connected', category: 'Pagos y Facturación' },
  { name: 'Slack', description: 'Envía notificaciones y alertas a tus canales.', status: 'disconnected', category: 'Comunicación' },
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
                <CardTitle>Centro de Conexiones</CardTitle>
                <CardDescription>
                Conecta HiperFlow con tus herramientas favoritas. Sincroniza datos, mensajes y flujos en un solo lugar.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((integration) => (
                    <Card key={integration.name} className="flex flex-col">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <LogoPlaceholder name={integration.name} />
                            <div>
                                <CardTitle className="text-lg">{integration.name}</CardTitle>
                                <Badge variant={integration.status === 'connected' ? 'default' : 'outline'} className={cn(integration.status === 'connected' && 'bg-green-500/20 text-green-300 border-green-500/40', integration.status === 'disconnected' && 'border-dashed')}>
                                    {integration.status === 'connected' ? 'Conectado' : 'Desconectado'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground h-10">{integration.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">
                                {integration.status === 'connected' ? 'Administrar' : 'Conectar'}
                                <ExternalLink className="ml-2 h-4 w-4" />
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

const AutomationsSettings = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingAutomation, setEditingAutomation] = useState<WithId<Automation> | null>(null);

    const { toast } = useToast();
    const firestore = useFirestore();
    const teamId = 'team-1'; // Hardcoded for now

    const automationsRef = useMemoFirebase(
        () => (firestore ? query(collection(firestore, 'automations'), where('teamId', '==', teamId)) : null),
        [firestore, teamId]
    );
    const { data: automations, isLoading } = useCollection<Automation>(automationsRef);

    const handleSaveAutomation = (formData: Partial<Automation>) => {
        if (!firestore) return;
        
        if (editingAutomation) {
            const automationRef = doc(firestore, 'automations', editingAutomation.id);
            updateDocumentNonBlocking(automationRef, formData);
             toast({ title: 'Automatización Actualizada', description: 'El flujo de automatización ha sido actualizado.' });
        } else {
            const automationsCollection = collection(firestore, 'automations');
            addDocumentNonBlocking(automationsCollection, formData as Automation);
            toast({ title: 'Automatización Creada', description: 'El nuevo flujo de automatización ha sido añadido.' });
        }
        setIsSheetOpen(false);
        setEditingAutomation(null);
    }

    const handleStatusToggle = (automation: WithId<Automation>) => {
        if (!firestore) return;
        const automationRef = doc(firestore, 'automations', automation.id);
        const newStatus = automation.status === 'active' ? 'inactive' : 'active';
        updateDocumentNonBlocking(automationRef, { status: newStatus, updatedAt: serverTimestamp() });
        toast({
            title: `Flujo ${newStatus === 'active' ? 'Activado' : 'Desactivado'}`,
            description: `${automation.name} ha sido actualizado.`
        });
    }
    
    const getPlatformLogo = (platform: string) => {
        switch(platform) {
            case 'make':
                return 'https://cdn.worldvectorlogo.com/logos/make-com.svg';
            case 'n8n':
                return 'https://cdn.worldvectorlogo.com/logos/n8n.svg';
            default:
                return null;
        }
    }

    const formatLastRun = (timestamp: any) => {
        if (!timestamp) return 'Nunca';
        const date = (timestamp as Timestamp).toDate();
        return formatDistanceToNow(date, { addSuffix: true, locale: es });
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Centro de Automatizaciones (AutoFlow)</CardTitle>
                    <CardDescription>
                        Conecta tu CRM con el mundo. Gestiona tus flujos con Make, n8n y otros webhooks.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Estado</TableHead>
                        <TableHead>Nombre del Flujo</TableHead>
                        <TableHead>Plataforma</TableHead>
                        <TableHead>Última Ejecución</TableHead>
                        <TableHead>Resultado</TableHead>
                        <TableHead><span className="sr-only">Acciones</span></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            Cargando automatizaciones...
                          </TableCell>
                        </TableRow>
                      ) : automations && automations.length > 0 ? (
                        automations.map((automation) => {
                          const platformLogo = getPlatformLogo(automation.platform);
                          return (
                            <TableRow key={automation.id}>
                                <TableCell>
                                    <Switch
                                        checked={automation.status === 'active'}
                                        onCheckedChange={() => handleStatusToggle(automation)}
                                        aria-label="Activar o desactivar flujo"
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{automation.name}</div>
                                    <div className="text-xs text-muted-foreground font-code truncate max-w-xs">{automation.webhookUrl}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {platformLogo ? (
                                            <img src={platformLogo} alt={automation.platform} className="h-5 w-5"/>
                                        ) : (
                                            <Zap className="h-5 w-5" />
                                        )}
                                        <span className="capitalize">{automation.platform}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{formatLastRun(automation.lastRun)}</TableCell>
                                <TableCell>
                                     {automation.lastRunStatus ? (
                                        <Badge variant={automation.lastRunStatus === 'success' ? 'default' : 'destructive'} className={cn(automation.lastRunStatus === 'success' && 'bg-green-500/80')}>
                                            {automation.lastRunStatus === 'success' ? 'Éxito' : 'Error'}
                                        </Badge>
                                    ) : <span className="text-muted-foreground">-</span>}
                                </TableCell>
                                <TableCell>
                                     <Button variant="ghost" size="icon" onClick={() => { setEditingAutomation(automation); setIsSheetOpen(true);}}>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No se encontraron automatizaciones. ¡Crea la primera!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                 <CardFooter className="border-t pt-6">
                    <Button onClick={() => { setEditingAutomation(null); setIsSheetOpen(true);}}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Flujo
                    </Button>
                </CardFooter>
            </Card>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>{editingAutomation ? 'Editar Automatización' : 'Crear Nueva Automatización'}</SheetTitle>
                    <SheetDescription>
                        Conecta un nuevo flujo para automatizar tareas entre HiperFlow y servicios externos.
                    </SheetDescription>
                </SheetHeader>
                <AutomationForm 
                    onSave={handleSaveAutomation}
                    onCancel={() => { setIsSheetOpen(false); setEditingAutomation(null); }}
                    automation={editingAutomation || undefined}
                    teamId={teamId}
                />
                </SheetContent>
            </Sheet>
        </>
    );
};


export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Control Center"
        description="Adapta HiperFlow a tu forma de trabajar. Configura roles, permisos, notificaciones y estilo visual desde un solo lugar."
      />

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="appearance">Apariencia</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="users">Usuarios & Roles</TabsTrigger>
          <TabsTrigger value="integrations">Conexiones</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
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
         <TabsContent value="automations">
            <AutomationsSettings />
        </TabsContent>
      </Tabs>
    </>
  );
}

    