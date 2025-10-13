import { KanbanBoard } from '@/components/kanban-board';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Pipeline de Tratos" description="Visualiza y sigue tu proceso de ventas.">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Trato
        </Button>
      </PageHeader>
      <KanbanBoard />
    </>
  );
}
