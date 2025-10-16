
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Zap } from 'lucide-react';
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

export default function AutomationsPage() {
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
            <PageHeader
                title="Automator"
                description="Automatiza tus procesos, entrena tus asistentes y conecta HiperFlow con el mundo sin escribir una sola línea de código."
            >
                <Button onClick={() => { setEditingAutomation(null); setIsSheetOpen(true);}}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Flujo
                </Button>
            </PageHeader>

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
