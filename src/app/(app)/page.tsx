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
  WithId,
} from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import type { Contact, Company, Deal } from '@/lib/types';

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
    const newDeal: Omit<Deal, 'id'> = {
      title: formData.title || 'Nueva Oportunidad',
      teamId: 'team-1',
      stage: 'potencial',
      amount: formData.amount || 0,
      currency: formData.currency || 'CLP',
      contact: formData.contact,
      company: formData.company,
      lastActivity: serverTimestamp(),
      ownerId: user.uid,
      status: 'activo',
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
        title="SaleFlow"
        description="Gestiona, visualiza y acelera tus oportunidades comerciales con claridad y precisión."
      >
        <Button onClick={() => setIsSheetOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          NuevoFlow
        </Button>
      </PageHeader>
      <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
        Cada oportunidad representa un posible negocio. Muévela entre etapas según su avance y mantén el control total de tu SaleFlow.
      </p>
      
      <KanbanBoard />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
    </>
  );
}
