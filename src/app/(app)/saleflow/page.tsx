'use client';

import { useState } from 'react';
import { KanbanBoard } from '@/components/kanban-board';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
  setDocumentNonBlocking,
} from '@/firebase';
import { collection, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import type { Contact, Company, Deal } from '@/lib/types';
import { getTimestampAsDate, simpleHash } from '@/components/kanban-board';

export default function SaleFlowPage() {
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

  const handleSaveDeal = async (formData: Partial<Deal>) => {
    if (!firestore || !user || !user.uid) {
      toast({
        title: 'Error',
        description: 'No se puede guardar el flow. Usuario no autenticado.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.contact) {
      toast({
        title: 'Contacto Requerido',
        description: 'Por favor, selecciona un contacto para crear el flow.',
        variant: 'destructive',
      });
      return;
    }

    const dealsCollection = collection(firestore, 'deals');
    const timestamp = serverTimestamp();
    const updatedAt = new Date().toISOString();

    const newDealData: Omit<Deal, 'id'> = {
      title: formData.title || 'Nuevo Flow',
      teamId: 'team-1',
      stage: 'potencial',
      amount: formData.amount || 0,
      currency: formData.currency || 'CLP',
      contact: formData.contact,
      company: formData.company,
      lastActivity: timestamp,
      ownerId: user.uid,
      status: 'activo',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const newDealRef = await addDocumentNonBlocking(dealsCollection, newDealData);
    
    if (!newDealRef) {
       toast({ title: "Error", description: "No se pudo crear el flow.", variant: "destructive" });
       return;
    }
    
    toast({
      title: 'Flow Creado',
      description: `${formData.title} ha sido agregado a tu flow de ventas.`,
    });
    setIsSheetOpen(false);


    // --- Disparar Webhook para nueva oportunidad ---
    const dealId = newDealRef.id;
    const eventId = simpleHash(`${dealId}-${updatedAt}`);
    const automationOutboxRef = doc(firestore, 'automation_outbox', eventId);
    
    const outboxData = {
        eventId: eventId,
        dealId: dealId,
        status: "pending",
        createdAt: timestamp
    };
    setDocumentNonBlocking(automationOutboxRef, outboxData, {});

    const webhookUrl = "https://hook.us2.make.com/mjxphljdr72s3w6x7cqr2eb3av6955iu";
    const appBaseUrl = window.location.origin.includes('localhost') ? 'https://studio--crm-superflow.us-central1.hosted.app' : window.location.origin;

    const payload = {
      eventType: "saleflow.deal.created",
      eventId: eventId,
      dealId: dealId,
      title: newDealData.title,
      description: (newDealData as any).description || null,
      stage: newDealData.stage,
      value: newDealData.amount,
      currency: newDealData.currency,
      clientName: newDealData.contact?.name,
      companyName: newDealData.company?.name,
      contactEmail: newDealData.contact?.email,
      ownerUserId: newDealData.ownerId,
      ownerEmail: user.email,
      createdAt: updatedAt, // Using current time as serverTimestamp isn't resolved yet
      updatedAt: updatedAt,
      appUrl: `${appBaseUrl}/saleflow?dealId=${dealId}`
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
      updateDoc(automationOutboxRef, updateData);
    }).catch(async (error) => {
      const errorData = {
        status: 'failed',
        lastError: error.message,
        lastAttempt: serverTimestamp()
      };
      updateDoc(automationOutboxRef, errorData);
    });
  };

  return (
    <>
      <PageHeader
        title="SaleFlow"
        description="Gestiona, visualiza y acelera tus oportunidades comerciales con claridad y precisión."
      >
        <Button onClick={() => setIsSheetOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Flow
        </Button>
      </PageHeader>
      <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
        Cada oportunidad representa un posible negocio. Muévela entre etapas según su avance y mantén el control total de tu SaleFlow.
      </p>
      
      <KanbanBoard />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Crear Nuevo Flow</SheetTitle>
            <SheetDescription>Inicia un nuevo negocio para añadir a tu pipeline.</SheetDescription>
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
