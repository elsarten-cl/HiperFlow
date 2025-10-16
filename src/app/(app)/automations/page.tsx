
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, MoreHorizontal, Zap, ExternalLink } from 'lucide-react';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  useUser,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  WithId,
} from '@/firebase';
import { collection, query, where, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { Automation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// --- Components ---

const AutomationForm = ({
  onSave,
  onCancel,
  automation,
  teamId,
}: {
  onSave: (data: Partial<Automation>) => void;
  onCancel: () => void;
  automation?: Partial<Automation>;
  teamId: string;
}) => {
  const [formData, setFormData] = useState({
    name: automation?.name || '',
    platform: automation?.platform || 'make',
    webhookUrl: automation?.webhookUrl || '',
    status: automation?.status || 'inactive',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      teamId,
      updatedAt: serverTimestamp(),
      ...(automation?.id ? {} : { createdAt: serverTimestamp() }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Flujo</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Sincronizar nuevo lead con Google Sheets"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="platform">Plataforma</Label>
        <Select
          value={formData.platform}
          onValueChange={(value) =>
            setFormData({ ...formData, platform: value as 'make' | 'n8n' | 'other' })
          }
        >
          <SelectTrigger id="platform">
            <SelectValue placeholder="Selecciona una plataforma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="make">Make.com</SelectItem>
            <SelectItem value="n8n">n8n</SelectItem>
            <SelectItem value="other">Otro (Webhook)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="webhookUrl">URL del Webhook</Label>
        <Input
          id="webhookUrl"
          type="url"
          value={formData.webhookUrl}
          onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
          placeholder="https://hook.make.com/..."
          required
        />
      </div>
       <div className="flex items-center space-x-2">
        <Switch
            id="status"
            checked={formData.status === 'active'}
            onCheckedChange={(checked) => setFormData({...formData, status: checked ? 'active' : 'inactive'})}
        />
        <Label htmlFor="status">Activar Flujo</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar Automatización</Button>
      </div>
    </form>
  );
};


export default function AutomationsPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<WithId<Automation> | null>(null);

  const { toast } = useToast();
  const firestore = useFirestore();
  const teamId = 'team-1'; // Hardcoded for now

  // Data fetching
  const automationsRef = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'automations'), where('teamId', '==', teamId)) : null),
    [firestore, teamId]
  );
  const { data: automations, isLoading } = useCollection<Automation>(automationsRef);

  const handleSaveAutomation = (formData: Partial<Automation>) => {
     if (!firestore) return;
    
    if (editingAutomation) {
        // Update
    } else {
        // Create
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
      <PageHeader
        title="Centro de Automatizaciones"
        description="Conecta tu CRM con el mundo. Automatiza tareas, sincroniza plataformas y haz que HiperFlow trabaje por ti."
      >
        <Button onClick={() => { setEditingAutomation(null); setIsSheetOpen(true);}}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Automatización
        </Button>
      </PageHeader>
        <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
            Cada flujo representa una acción automatizada. Define los disparadores, las acciones y el canal, y HiperFlow se encargará del resto.
        </p>
      <Card>
        <CardHeader>
          <CardTitle>Flujos de Automatización</CardTitle>
          <CardDescription>
            Gestiona tus flujos de trabajo automatizados con Make, n8n y otros webhooks.
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
                            <Button variant="ghost" size="icon">
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
}
