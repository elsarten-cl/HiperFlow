'use client';

import { contacts, deals, dealStages } from '@/lib/data';
import { type Deal, type DealStage } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DollarSign, UserCircle } from 'lucide-react';

const stageColors: Record<DealStage, string> = {
  'Potencial': 'bg-chart-1',
  'Contactado': 'bg-chart-2',
  'Propuesta': 'bg-chart-3',
  'Negociación': 'bg-chart-4',
  'Ganado': 'bg-accent',
  'Perdido': 'bg-destructive',
};

const DealCard = ({ deal }: { deal: Deal }) => {
  const dealContacts = contacts.filter((c) => deal.contactIds.includes(c.id));
  return (
    <Card className="mb-4 bg-background/50 hover:bg-background transition-colors duration-200 cursor-grab active:cursor-grabbing">
      <CardHeader className="p-4">
        <CardTitle className="text-base font-medium">{deal.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <DollarSign className="mr-1.5 h-4 w-4" />
          <span>{new Intl.NumberFormat('es-CL').format(deal.value)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex -space-x-2">
          {dealContacts.map((contact) => (
            <Avatar key={contact.id} className="h-6 w-6 border-2 border-card">
              <AvatarImage src={contact.avatarUrl} alt={contact.name} />
              <AvatarFallback><UserCircle /></AvatarFallback>
            </Avatar>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

const KanbanColumn = ({ stage, deals }: { stage: DealStage; deals: Deal[] }) => {
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div className="flex flex-col w-full md:w-80 shrink-0">
      <div className="flex items-center justify-between p-2 mb-4">
        <div className="flex items-center gap-2">
          <div className={cn('h-2.5 w-2.5 rounded-full', stageColors[stage])} />
          <h2 className="font-semibold font-headline">{stage}</h2>
          <Badge variant="secondary" className="rounded-full">{deals.length}</Badge>
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          ${new Intl.NumberFormat('es-CL', { notation: 'compact' }).format(totalValue)}
        </span>
      </div>
      <div className="flex-1 p-2 bg-card/50 rounded-lg min-h-[200px] overflow-y-auto">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
};

export const KanbanBoard = () => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {dealStages.map((stage) => {
        const stageDeals = deals.filter((deal) => deal.stage === stage);
        return <KanbanColumn key={stage} stage={stage} deals={stageDeals} />;
      })}
    </div>
  );
};
