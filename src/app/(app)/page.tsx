import { KanbanBoard } from '@/components/kanban-board';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Flow de Ventas"
        description="Visualiza y avanza tus oportunidades con claridad."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Oportunidad
        </Button>
      </PageHeader>
      <KanbanBoard />
    </>
  );
}
