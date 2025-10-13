'use client';

import { useMemo } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { type Deal, type DealStage } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DollarSign, User, Building, MessageSquare, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const stageColors: Record<DealStage, string> = {
  potencial: 'bg-chart-1',
  contactado: 'bg-chart-2',
  propuesta: 'bg-chart-3',
  negociacion: 'bg-chart-4',
  ganado: 'bg-accent',
  perdido: 'bg-destructive',
};

const stageNames: Record<DealStage, string> = {
  potencial: 'Potencial',
  contactado: 'Contactado',
  propuesta: 'Propuesta',
  negociacion: 'Negociación',
  ganado: 'Ganado',
  perdido: 'Perdido',
};

const DealCard = ({ deal }: { deal: Deal }) => {
  const contactInfo = [deal.contact.name, deal.company?.name].filter(Boolean).join(' · ');
  const nextActionDate = deal.nextAction && !isNaN(new Date(deal.nextAction).getTime())
    ? format(new Date(deal.nextAction), 'dd MMM', { locale: es })
    : deal.nextAction;

  return (
    <Card className="mb-4 bg-background/50 hover:bg-background transition-colors duration-200 cursor-grab active:cursor-grabbing border border-white/20">
      <CardHeader className="p-3">
        <CardTitle className="text-base font-medium font-body">{deal.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex flex-col gap-2 text-sm">
        <div className="flex items-center text-muted-foreground gap-2">
          <User className="h-4 w-4" />
          <span>{contactInfo}</span>
        </div>
        <div className="flex items-center text-muted-foreground gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="truncate">{deal.lastActivity || 'Sin actividad reciente'}</span>
        </div>
        <div className="flex items-center text-muted-foreground gap-2">
          <DollarSign className="h-4 w-4" />
          <span>{new Intl.NumberFormat('es-CL', { style: 'currency', currency: deal.currency }).format(deal.amount)}</span>
        </div>
        {deal.nextAction && (
          <div className="flex items-center text-muted-foreground gap-2">
            <Clock className="h-4 w-4" />
            <span>{nextActionDate}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const KanbanColumn = ({ stage, deals }: { stage: DealStage; deals: Deal[] }) => {
  const totalValue = deals.reduce((sum, deal) => sum + deal.amount, 0);

  return (
    <div className="flex flex-col w-full shrink-0">
      <div className="flex items-center justify-between p-2 mb-4">
        <div className="flex items-center gap-2">
          <div className={cn('h-2.5 w-2.5 rounded-full', stageColors[stage])} />
          <h2 className="font-semibold font-headline">{stageNames[stage]}</h2>
          <Badge variant="secondary" className="rounded-full">{deals.length}</Badge>
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', notation: 'compact' }).format(totalValue)}
        </span>
      </div>
      <div className="flex-1 p-2 bg-card/50 rounded-lg min-h-[100px] overflow-y-auto">
        {deals.length > 0 ? (
          deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))
        ) : (
          <div className="text-center text-sm text-muted-foreground py-4">
            Aún no hay oportunidades en esta etapa
          </div>
        )}
      </div>
    </div>
  );
};

const dealStages: DealStage[] = ['potencial', 'contactado', 'propuesta', 'negociacion', 'ganado', 'perdido'];

export const KanbanBoard = () => {
  const firestore = useFirestore();
  // Hardcoded teamId for now
  const teamId = 'team-1';

  const dealsRef = useMemoFirebase(
    () => query(collection(firestore, 'deals'), where('teamId', '==', teamId)),
    [firestore, teamId]
  );
  const { data: deals, isLoading } = useCollection<Deal>(dealsRef);

  if (isLoading) {
    return <div>Cargando oportunidades...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {dealStages.map((stage) => {
        const stageDeals = deals?.filter((deal) => deal.stage === stage) || [];
        return <KanbanColumn key={stage} stage={stage} deals={stageDeals} />;
      })}
    </div>
  );
};
