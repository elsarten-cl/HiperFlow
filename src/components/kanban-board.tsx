'use client';

import { useMemo } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase, WithId } from '@/firebase';
import { type Deal, type DealStage } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DollarSign,
  User,
  MessageSquare,
  Clock,
  Lightbulb,
  Phone,
  FileText,
  Handshake,
  Goal,
  ArchiveX,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    tooltip: 'Clientes o leads que mostraron interés, pero aún no se ha iniciado contacto.',
    emptyStateText: 'Aquí aparecerán tus posibles clientes. Usa ‘+ Nueva Oportunidad’ para registrar un lead.',
  },
  contactado: {
    icon: Phone,
    color: 'bg-cyan-500',
    name: 'Contactado',
    tooltip: 'Ya hubo contacto por WhatsApp, teléfono o correo. Seguimiento activo.',
    emptyStateText: 'Cuando hagas tu primer contacto, arrastra la oportunidad aquí.',
  },
propuesta: {
    icon: FileText,
    color: 'bg-yellow-500',
    name: 'Propuesta',
    tooltip: 'Cliente recibió una propuesta o cotización. Esperando respuesta.',
    emptyStateText: 'Una vez envíes tu propuesta, muévela acá para hacerle seguimiento.',
  },
  negociacion: {
    icon: Handshake,
    color: 'bg-purple-500',
    name: 'Negociación',
    tooltip: 'El cliente está negociando condiciones o precios. Etapa clave para el cierre.',
    emptyStateText: 'Mantén visibles tus negociaciones para no perder el ritmo de cierre.',
  },
  ganado: {
    icon: Goal,
    color: 'bg-green-500',
    name: 'Ganado',
    tooltip: 'Venta cerrada con éxito. ¡Felicidades! Registra los detalles finales.',
    emptyStateText: '¡Excelente! Aquí verás tus ventas confirmadas y completadas.',
  },
  perdido: {
    icon: ArchiveX,
    color: 'bg-red-500',
    name: 'Perdido',
    tooltip: 'Venta no concretada. Analiza los motivos para mejorar futuras oportunidades.',
    emptyStateText: 'No te preocupes, cada oportunidad perdida enseña algo. Regístrala acá.',
  },
};

const DealCard = ({ deal }: { deal: WithId<Deal> }) => {
  const contactInfo = [deal.contact?.name, deal.company?.name].filter(Boolean).join(' · ');
  const nextActionDate = deal.nextAction && !isNaN(new Date(deal.nextAction).getTime())
    ? format(new Date(deal.nextAction), 'dd MMM', { locale: es })
    : deal.nextAction;

  return (
    <Card className="mb-4 bg-card/80 hover:bg-card transition-colors duration-200 cursor-grab active:cursor-grabbing border" style={{ borderColor: 'hsl(var(--border) / 0.2)'}}>
      <CardHeader className="p-3">
        <CardTitle className="text-base font-medium">{deal.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex flex-col gap-2 text-sm text-muted-foreground">
        {contactInfo && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{contactInfo}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="truncate">{deal.lastActivity || 'Sin actividad reciente'}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <span>{new Intl.NumberFormat('es-CL', { style: 'currency', currency: deal.currency || 'CLP' }).format(deal.amount)}</span>
        </div>
        {deal.nextAction && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{nextActionDate}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const KanbanColumn = ({ stage, deals }: { stage: DealStage; deals: WithId<Deal>[] }) => {
  const totalValue = deals.reduce((sum, deal) => sum + deal.amount, 0);
  const config = stageConfig[stage];
  const Icon = config.icon;

  return (
    <div className="flex flex-col w-full shrink-0">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-between p-2 mb-4 cursor-help">
              <div className="flex items-center gap-2">
                <div className={cn('p-1 rounded-full', config.color)}>
                  <Icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <h2 className="font-semibold font-headline">{config.name}</h2>
                <Badge variant="secondary" className="rounded-full">{deals.length}</Badge>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', notation: 'compact' }).format(totalValue)}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{config.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex-1 p-2 bg-card/50 rounded-lg min-h-[100px] overflow-y-auto">
        {deals.length > 0 ? (
          deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))
        ) : (
          <div className="text-center text-sm italic text-muted-foreground p-4">
            {config.emptyStateText}
          </div>
        )}
      </div>
    </div>
  );
};

const dealStages: DealStage[] = ['potencial', 'contactado', 'propuesta', 'negociacion', 'ganado', 'perdido'];

export const KanbanBoard = () => {
  const firestore = useFirestore();
  const teamId = 'team-1'; // Hardcoded for now

  const dealsRef = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'deals'), where('teamId', '==', teamId)) : null),
    [firestore, teamId]
  );
  const { data: deals, isLoading } = useCollection<Deal>(dealsRef);

  if (isLoading) {
    return <div className="text-center py-10">Cargando oportunidades...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-start">
      {dealStages.map((stage) => {
        const stageDeals = deals?.filter((deal) => deal.stage === stage) || [];
        return <KanbanColumn key={stage} stage={stage} deals={stageDeals} />;
      })}
    </div>
  );
};
