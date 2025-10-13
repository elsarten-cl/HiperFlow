'use client';

import { useState } from 'react';
import { KanbanBoard } from '@/components/kanban-board';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Plus } from 'lucide-react';
import { DealForm } from '@/components/deal-form';
import { useToast } from '@/hooks/use-toast';
import {
  useFirestore,
  useUser,
  addDocumentNonBlocking,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import type { Contact, Company, Deal } from '@/lib/types';
import { WithId } from '@/firebase';

export default function DashboardPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const contactsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'contacts') : null),
    [firestore]
  );
  const { data: contacts } = useCollection<WithId<Contact>>(contactsRef);

  const companiesRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'companies') : null),
    [firestore]
  );
  const { data: companies } = useCollection<WithId<Company>>(companiesRef);

  const handleSaveDeal = (formData: Partial<Deal>) => {
    if (!firestore || !user || !user.uid) {
      toast({
        title: 'Error',
        description: 'No se puede guardar la oportunidad. Usuario no autenticado.',
        variant: 'destructive',
      });
      return;
    }

    const dealsCollection = collection(firestore, 'deals');
    const newDeal = {
      ...formData,
      teamId: 'team-1', // Hardcoded for now
      ownerId: user.uid,
      status: 'activo',
      stage: 'potencial',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    addDocumentNonBlocking(dealsCollection, newDeal);

    toast({
      title: 'Oportunidad Creada',
      description: `${formData.title} ha sido agregada a tu flow de ventas.`,
    });
    setIsSheetOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Flow de Ventas"
        description="Visualiza y avanza tus oportunidades con claridad."
      >
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Oportunidad
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Crear Nueva Oportunidad</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <DealForm
                onSave={handleSaveDeal}
                onCancel={() => setIsSheetOpen(false)}
                contacts={contacts || []}
                companies={companies || []}
              />
            </div>
          </SheetContent>
        </Sheet>
      </PageHeader>
      <KanbanBoard />
    </>
  );
}
