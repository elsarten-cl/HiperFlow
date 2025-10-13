import { KanbanBoard } from '@/components/kanban-board';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Deal Pipeline" description="Visualize and track your sales process.">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Deal
        </Button>
      </PageHeader>
      <KanbanBoard />
    </>
  );
}
