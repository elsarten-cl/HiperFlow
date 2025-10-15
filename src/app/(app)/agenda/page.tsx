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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
import { Badge } from '@/components/ui/badge';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  useUser,
  WithId,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { Plus, Flag, Calendar as CalendarIcon, User as UserIcon } from 'lucide-react';
import type { Task, Contact, Deal, TaskStatus } from '@/lib/types';
import { TaskForm } from '@/components/task-form';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format, isPast, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

const statusConfig: Record<TaskStatus, { color: string; name: string }> = {
    pendiente: { color: 'bg-yellow-500/20 text-yellow-300', name: 'Pendiente' },
    'en curso': { color: 'bg-blue-500/20 text-blue-300', name: 'En Curso' },
    completada: { color: 'bg-green-500/20 text-green-300', name: 'Completada' },
};

export default function AgendaPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<WithId<Task> | null>(null);

  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const teamId = 'team-1'; // Hardcoded for now

  // Data fetching
  const tasksRef = useMemoFirebase(
    () =>
      firestore && user
        ? query(
            collection(firestore, 'tasks'),
            where('teamId', '==', teamId),
            where('assignedTo', '==', user.uid)
          )
        : null,
    [firestore, user, teamId]
  );
  const { data: tasks, isLoading: isLoadingTasks } = useCollection<Task>(tasksRef);

  const contactsRef = useMemoFirebase(() => (firestore ? collection(firestore, 'contacts') : null), [firestore]);
  const { data: contacts, isLoading: isLoadingContacts } = useCollection<Contact>(contactsRef);

  const dealsRef = useMemoFirebase(() => (firestore ? collection(firestore, 'deals') : null), [firestore]);
  const { data: deals, isLoading: isLoadingDeals } = useCollection<Deal>(dealsRef);

  const contactMap = new Map(contacts?.map((c) => [c.id, c.name]));

  const handleSaveTask = (formData: Partial<Task>) => {
    if (!firestore || !user) return;
    
    if (editingTask) {
        // Update
    } else {
        // Create
        const tasksCollection = collection(firestore, 'tasks');
        addDocumentNonBlocking(tasksCollection, formData as Task);
        toast({ title: "Tarea Creada", description: "La nueva tarea ha sido añadida a tu agenda." });
    }
    setIsSheetOpen(false);
    setEditingTask(null);
  }

  const getDueDateText = (dueDate: any) => {
    if (!dueDate) return 'Sin fecha';
    const date = (dueDate as Timestamp).toDate();
    if (isPast(date) && !isToday(date)) return <span className="text-red-400">{format(date, 'dd MMM yyyy', { locale: es })}</span>;
    if (isToday(date)) return <span className="text-yellow-400">Hoy</span>;
    return format(date, 'dd MMM yyyy', { locale: es });
  }

  const isLoading = isLoadingTasks || isLoadingContacts || isLoadingDeals;

  return (
    <>
      <PageHeader
        title="Agenda &amp; Tareas Inteligentes"
        description="Organiza tu día, da seguimiento a tus oportunidades y deja que HiperFlow te recuerde lo importante."
      >
        <Button onClick={() => { setEditingTask(null); setIsSheetOpen(true);}}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Tarea
        </Button>
      </PageHeader>
      <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
        Cada tarea está conectada a un cliente, empresa u oportunidad. Crea, completa o automatiza tus acciones diarias desde un solo lugar.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Estado</Label>
              <div className="space-y-2 mt-2">
                {Object.entries(statusConfig).map(([key, { name }]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox id={`status-${key}`} />
                    <Label htmlFor={`status-${key}`} className="font-normal">
                      {name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Prioridad</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="prio-alta" />
                  <Label htmlFor="prio-alta" className="font-normal flex items-center gap-2"><Flag className="h-4 w-4 text-red-500" /> Alta</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="prio-media" />
                  <Label htmlFor="prio-media" className="font-normal flex items-center gap-2"><Flag className="h-4 w-4 text-yellow-500" /> Media</Label>
                </div>
                 <div className="flex items-center space-x-2">
                  <Checkbox id="prio-baja" />
                  <Label htmlFor="prio-baja" className="font-normal flex items-center gap-2"><Flag className="h-4 w-4 text-gray-500" /> Baja</Label>
                </div>
              </div>
            </div>
            {/* Add more filters for assigned user and due date later */}
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
            <CardTitle>Lista de Tareas</CardTitle>
            <CardDescription>Tu lista de tareas pendientes, en curso y completadas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Vinculado a</TableHead>
                        <TableHead>Fecha Límite</TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                         <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">Cargando tareas...</TableCell>
                        </TableRow>
                    ) : (
                        tasks && tasks.map(task => (
                            <TableRow key={task.id}>
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell>
                                    <span className="font-medium">{task.title}</span>
                                </TableCell>
                                <TableCell>
                                    {task.contactId ? contactMap.get(task.contactId) : '-'}
                                </TableCell>
                                <TableCell>
                                    {getDueDateText(task.dueDate)}
                                </TableCell>
                                <TableCell>
                                    <Badge className={cn("text-xs", statusConfig[task.status]?.color)} variant="outline">
                                        {statusConfig[task.status]?.name || 'Desconocido'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

       <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent className="sm:max-w-lg">
            <SheetHeader>
                <SheetTitle>{editingTask ? 'Editar Tarea' : 'Crear Nueva Tarea'}</SheetTitle>
                <SheetDescription>
                    {editingTask ? 'Actualiza los detalles de esta tarea.' : 'Añade una nueva tarea a tu agenda y vincúlala a un contacto o negocio.'}
                </SheetDescription>
            </SheetHeader>
            <div className="py-4">
                <TaskForm
                    onSave={handleSaveTask}
                    onCancel={() => { setIsSheetOpen(false); setEditingTask(null); }}
                    contacts={contacts || []}
                    deals={deals || []}
                    task={editingTask || undefined}
                    userId={user?.uid || ''}
                />
            </div>
            </SheetContent>
        </Sheet>
    </>
  );
}
