'use client';

import { useMemo, useState } from 'react';
import { collection, query, where, doc, updateDoc, serverTimestamp, addDoc, Timestamp, getDoc, setDoc } from 'firebase/firestore';
import {
  useCollection,
  useFirestore,
  useUser,
  useMemoFirebase,
  WithId,
  errorEmitter,
  FirestorePermissionError,
} from '@/firebase';
import { type Deal, type DealStage, type Automation } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DollarSign,
  MessageSquare,
  Clock,
  Lightbulb,
  Phone,
  FileText,
  Handshake,
  Goal,
  ArchiveX,
  AlertCircle,
} from 'lucide-react';
import { format, differenceInDays, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const stageConfig: Record<
  DealStage,
  {
    icon: React.ElementType;
    color: string;
    name: string;
    tooltip: string;
    emptyStateText: string;
  }
> = {
  potencial: {
    icon: Lightbulb,
    color: 'bg-blue-500',
    name: 'Potencial',
    tooltip:
      'Clientes o leads que mostraron interés, pero aún no se ha iniciado contacto.',
    emptyStateText:
      'Aquí aparecerán tus posibles clientes. Usa ‘+ Nueva Oportunidad’ para registrar un lead.',
  },
  contactado: {
    icon: Phone,
    color: 'bg-cyan-500',
    name: 'Contactado',
    tooltip:
      'Ya hubo contacto por WhatsApp, teléfono o correo. Seguimiento activo.',
    emptyStateText:
      'Cuando hagas tu primer contacto, arrastra la oportunidad aquí.',
  },
  propuesta: {
    icon: FileText,
    color: 'bg-yellow-500',
    name: 'Propuesta',
    tooltip: 'Cliente recibió una propuesta o cotización. Esperando respuesta.',
    emptyStateText:
      'Una vez envíes tu propuesta, muévela acá para hacerle seguimiento.',
  },
  negociacion: {
    icon: Handshake,
    color: 'bg-purple-500',
    name: 'Negociación',
    tooltip:
      'El cliente está negociando condiciones o precios. Etapa clave para el cierre.',
    emptyStateText:
      'Mantén visibles tus negociaciones para no perder el ritmo de cierre.',
  },
  ganado: {
    icon: Goal,
    color: 'bg-green-500',
    name: 'Ganado',
    tooltip: 'Venta cerrada con éxito. ¡Felicidades! Registra los detalles finales.',
    emptyStateText:
      '¡Excelente! Aquí verás tus ventas confirmadas y completadas.',
  },
  perdido: {
    icon: ArchiveX,
    color: 'bg-red-500',
    name: 'Perdido',
    tooltip:
      'Venta no concretada. Analiza los motivos para mejorar futuras oportunidades.',
    emptyStateText:
      'No te preocupes, cada oportunidad perdida enseña algo. Regístrala acá.',
  },
};

const getTimestampAsDate = (timestamp: any): Date | null => {
    if (!timestamp) return null;
    if (timestamp instanceof Date) return timestamp;
    if (typeof timestamp === 'string') {
        const d = new Date(timestamp);
        return isValid(d) ? d : null;
    }
    if (timestamp && typeof timestamp.seconds === 'number') {
        const d = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
        return isValid(d) ? d : null;
    }
    if (timestamp && typeof timestamp.toDate === 'function') {
        const d = timestamp.toDate();
        return isValid(d) ? d : null;
    }
    return null;
}

// Simple hash function for eventId
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return 'evt_' + Math.abs(hash).toString(16);
};


const DealCard = ({ deal }: { deal: WithId<Deal> }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id, data: { type: 'Deal', deal } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const contactInfo = deal.company?.name || deal.contact?.name || 'Sin contacto';
  const updatedAtDate = getTimestampAsDate(deal.updatedAt);
  const requiresFollowUp = updatedAtDate ? differenceInDays(new Date(), updatedAtDate) > 7 : false;

  const lastActivityDate = getTimestampAsDate(deal.lastActivity);


  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="mb-4 h-[180px] rounded-lg border-2 border-dashed bg-muted"
      />
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-4 touch-none bg-card/80 hover:bg-card transition-colors duration-200 cursor-grab active:cursor-grabbing border relative"
      style={{ borderColor: 'hsl(var(--border) / 0.2)' }}
    >
      {requiresFollowUp && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
                <div className="absolute top-2 right-2 text-yellow-500">
                    <AlertCircle className="h-4 w-4" />
                </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Requiere seguimiento (más de 7 días sin actualizar)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <CardHeader className="p-3">
        <CardTitle className="text-base font-semibold text-foreground pr-6">{deal.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{contactInfo}</p>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="truncate">
            {lastActivityDate && isValid(lastActivityDate) ? `Actividad: ${format(lastActivityDate, 'dd MMM', { locale: es })}` : 'Sin actividad reciente'}
          </span>
        </div>
        <div className="flex items-center gap-2 font-code">
          <DollarSign className="h-4 w-4" />
          <span className="font-semibold">
            {new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: deal.currency || 'CLP',
            }).format(deal.amount)}
          </span>
        </div>
        {deal.nextAction && (
          <div className="flex items-center gap-2 text-purple-400">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{deal.nextAction}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const KanbanColumn = ({
  stage,
  deals,
}: {
  stage: DealStage;
  deals: WithId<Deal>[];
}) => {
  const totalValue = deals.reduce((sum, deal) => sum + deal.amount, 0);
  const config = stageConfig[stage];
  const Icon = config.icon;
  const dealsIds = useMemo(() => deals.map((d) => d.id), [deals]);

  const { setNodeRef } = useSortable({
    id: stage,
    data: {
      type: 'Column',
      stage: stage,
    },
  });

  return (
    <div ref={setNodeRef} className="flex flex-col w-full shrink-0">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-between p-2 mb-4 cursor-help">
              <div className="flex items-center gap-2">
                <div className={cn('p-1 rounded-full', config.color)}>
                  <Icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <h2 className="font-semibold font-headline">{config.name}</h2>
                <Badge variant="secondary" className="rounded-full">
                  {deals.length}
                </Badge>
              </div>
              <span className="text-sm font-medium font-code text-muted-foreground">
                {new Intl.NumberFormat('es-CL', {
                  style: 'currency',
                  currency: 'CLP',
                  notation: 'compact',
                }).format(totalValue)}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{config.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex-1 p-2 bg-card/50 rounded-lg min-h-[200px] overflow-y-auto">
        <SortableContext items={dealsIds}>
          {deals.length > 0 ? (
            deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
          ) : (
            <div className="text-center text-sm italic text-muted-foreground p-4 h-full flex items-center justify-center">
              {config.emptyStateText}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

const dealStages: DealStage[] = [
  'potencial',
  'contactado',
  'propuesta',
  'negociacion',
  'ganado',
  'perdido',
];

export const KanbanBoard = () => {
  const firestore = useFirestore();
  const { user } = useUser();
  const teamId = 'team-1';

  // --- Data Fetching ---
  const dealsRef = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'deals'), where('teamId', '==', teamId))
        : null,
    [firestore, teamId]
  );
  const { data: deals, isLoading } = useCollection<Deal>(dealsRef);

  const [activeDeal, setActiveDeal] = useState<WithId<Deal> | null>(null);

  const dealsByStage = useMemo(() => {
    const grouped: Record<DealStage, WithId<Deal>[]> = {
      potencial: [],
      contactado: [],
      propuesta: [],
      negociacion: [],
      ganado: [],
      perdido: [],
    };
    deals?.forEach((deal) => {
      if (deal.stage && grouped[deal.stage]) {
        grouped[deal.stage].push(deal);
      }
    });
    return grouped;
  }, [deals]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Deal') {
      setActiveDeal(event.active.data.current.deal);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveDeal(null);
    const { active, over } = event;
    if (!over || !firestore || !user) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveADeal = active.data.current?.type === 'Deal';
    if (!isActiveADeal) return;

    const dealToMove = active.data.current?.deal as WithId<Deal>;
    
    let newStage: DealStage | undefined;
    const isOverAColumn = over.data.current?.type === 'Column';
    if (isOverAColumn) newStage = over.id as DealStage;
    
    const isOverADeal = over.data.current?.type === 'Deal';
    if (isOverADeal) newStage = (over.data.current?.deal as WithId<Deal>).stage;

    if (newStage && newStage !== dealToMove.stage) {
        const timestamp = serverTimestamp();
        const updatedAt = new Date().toISOString();
        const eventId = simpleHash(`${dealToMove.id}-${updatedAt}`);
        
        const dealRef = doc(firestore, 'deals', dealToMove.id);
        const automationOutboxRef = doc(firestore, 'automation_outbox', eventId);
        const activitiesCollection = collection(firestore, 'activities');

        // Idempotency check
        const outboxDoc = await getDoc(automationOutboxRef).catch(serverError => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: automationOutboxRef.path, operation: 'get'
            }));
            throw serverError; // Stop execution if we can't check for idempotency
        });

        if (outboxDoc.exists() && outboxDoc.data()?.status === 'sent') {
            console.log("Idempotency check: Event already sent.");
            return;
        }

        const dealUpdateData = { 
            stage: newStage,
            updatedAt: timestamp,
            lastActivity: timestamp,
        };
        const oldStageName = stageConfig[dealToMove.stage]?.name || dealToMove.stage;
        const newStageName = stageConfig[newStage]?.name || newStage;
        const activityData = {
            type: 'stageChange' as const,
            notes: `Cambio de etapa: ${oldStageName} -> ${newStageName}`,
            timestamp: timestamp,
            dealId: dealToMove.id,
            contactId: dealToMove.contact?.id || '',
            teamId: dealToMove.teamId,
            actor: user.email || user.uid,
        };
        const outboxData = {
            eventId: eventId,
            dealId: dealToMove.id,
            status: "pending",
            createdAt: timestamp
        };

        // 1. Update the deal
        updateDoc(dealRef, dealUpdateData).catch(serverError => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: dealRef.path, operation: 'update', requestResourceData: dealUpdateData
            }));
        });

        // 2. Log activity
        addDoc(activitiesCollection, activityData).catch(serverError => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: activitiesCollection.path, operation: 'create', requestResourceData: activityData
            }));
        });
        
        // 3. Prepare for webhook
        setDoc(automationOutboxRef, outboxData).catch(serverError => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: automationOutboxRef.path, operation: 'write', requestResourceData: outboxData
            }));
        });
        
        // 4. Send webhook
        const webhookUrl = "https://hook.us2.make.com/minmtau7edpwnsohplsjobkyv6fytvcg";
        const appBaseUrl = window.location.origin.includes('localhost') ? 'https://studio--crm-superflow.us-central1.hosted.app' : window.location.origin;
        const payload = {
            eventType: "saleflow.stage.changed",
            eventId: eventId,
            dealId: dealToMove.id,
            title: dealToMove.title,
            description: (dealToMove as any).description || null,
            previousStage: dealToMove.stage,
            newStage: newStage,
            value: dealToMove.amount,
            currency: dealToMove.currency,
            clientName: dealToMove.contact?.name,
            companyName: dealToMove.company?.name,
            contactEmail: dealToMove.contact?.email,
            ownerUserId: dealToMove.ownerId,
            ownerEmail: user.email,
            createdAt: getTimestampAsDate(dealToMove.createdAt)?.toISOString(),
            updatedAt: updatedAt,
            appUrl: `${appBaseUrl}/saleflow?dealId=${dealToMove.id}`
        };

        const startTime = Date.now();
        fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(async (response) => {
             const responseTimeMs = Date.now() - startTime;
             const updateData = {
                status: response.ok ? 'sent' : 'failed',
                payload: payload,
                responseStatus: response.status,
                responseTimeMs: responseTimeMs,
                lastAttempt: serverTimestamp()
            };
             updateDoc(automationOutboxRef, updateData).catch(serverError => {
                 errorEmitter.emit('permission-error', new FirestorePermissionError({
                    path: automationOutboxRef.path, operation: 'update', requestResourceData: updateData
                }));
             });
        }).catch(async (error) => {
             const errorData = {
                status: 'failed',
                lastError: error.message,
                lastAttempt: serverTimestamp()
             };
             updateDoc(automationOutboxRef, errorData).catch(serverError => {
                 errorEmitter.emit('permission-error', new FirestorePermissionError({
                    path: automationOutboxRef.path, operation: 'update', requestResourceData: errorData
                }));
             });
        });
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Cargando oportunidades...</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-start">
        <SortableContext items={dealStages}>
          {dealStages.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              deals={dealsByStage[stage] || []}
            />
          ))}
        </SortableContext>
      </div>
      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
