'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  WithId,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking
} from '@/firebase';
import { collection, doc, query, where, serverTimestamp } from 'firebase/firestore';
import type { Contact, Company, Deal } from '@/lib/types';
import { Plus, Search, Phone, Mail, FileText, Handshake, Goal, ArchiveX, Lightbulb, User, Briefcase, Calendar, MessageSquare, Pencil, MoreHorizontal, Trash2, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { DealForm } from '@/components/deal-form';
import { ContactForm } from '@/components/contact-form';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';

const stageConfig: Record<string, { icon: React.ElementType; color: string; name: string; }> = {
  potencial: { icon: Lightbulb, color: 'text-blue-400', name: 'Potencial' },
  contactado: { icon: Phone, color: 'text-cyan-400', name: 'Contactado' },
  propuesta: { icon: FileText, color: 'text-yellow-400', name: 'Propuesta' },
  negociacion: { icon: Handshake, color: 'text-purple-400', name: 'Negociación' },
  ganado: { icon: Goal, color: 'text-green-400', name: 'Ganado' },
  perdido: { icon: ArchiveX, color: 'text-red-400', name: 'Perdido' },
};

const leadStatusConfig: Record<string, { color: string; name: string; }> = {
    nuevo: { color: 'bg-blue-500/20 text-blue-300', name: 'Nuevo' },
    'en seguimiento': { color: 'bg-yellow-500/20 text-yellow-300', name: 'En Seguimiento' },
    'cliente activo': { color: 'bg-green-500/20 text-green-300', name: 'Cliente Activo' },
};


const CustomerDetailPanel = ({
  contact,
  company,
  deals,
  onClose,
  onOpenNewDeal,
  onEditContact
}: {
  contact: WithId<Contact>;
  company: WithId<Company> | undefined;
  deals: WithId<Deal>[];
  onClose: () => void;
  onOpenNewDeal: (contact: WithId<Contact>, company?: WithId<Company>) => void;
  onEditContact: (contact: WithId<Contact>) => void;
}) => {

  const getStageIcon = (stage: string) => {
    const config = stageConfig[stage];
    return config ? <config.icon className={cn("h-4 w-4", config.color)} /> : null;
  }

  return (
    <Sheet open={!!contact} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="sm:max-w-2xl w-full p-0" side="right">
          <ScrollArea className="h-full">
            <div className="p-6">
                <SheetHeader className="mb-6 text-left">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted">
                            <UserCircle className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div>
                            <SheetTitle className="text-2xl font-headline">{contact.name}</SheetTitle>
                            <SheetDescription className="text-muted-foreground">
                                {contact.jobTitle} {company ? `en ${company.name}` : ''}
                            </SheetDescription>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => onEditContact(contact)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" className="hover:bg-destructive hover:text-destructive-foreground"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                </div>
                </SheetHeader>

                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
                    </div>
                    {contact.phone && (
                         <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${contact.phone}`} className="hover:underline">{contact.phone}</a>
                        </div>
                    )}
                </div>

                <Separator />

                {/* Oportunidades Section */}
                <div className="my-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold font-headline">Oportunidades</h3>
                        <Button variant="outline" size="sm" onClick={() => onOpenNewDeal(contact, company)}>
                            <Plus className="mr-2 h-4 w-4" /> Nuevo Flow
                        </Button>
                    </div>
                    <div className="space-y-3">
                    {deals && deals.length > 0 ? deals.map(deal => (
                        <Card key={deal.id} className="p-3 bg-card/50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{deal.title}</p>
                                    <p className="text-sm text-muted-foreground font-code">{new Intl.NumberFormat('es-CL', { style: 'currency', currency: deal.currency }).format(deal.amount)}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    {getStageIcon(deal.stage)}
                                    <span>{stageConfig[deal.stage]?.name || deal.stage}</span>
                                </div>
                            </div>
                        </Card>
                    )) : <p className="text-sm text-muted-foreground italic">No hay oportunidades asociadas.</p>}
                    </div>
                </div>
                
                <Separator />

                {/* Historial de Interacciones Section */}
                <div className="my-6">
                    <h3 className="text-lg font-semibold font-headline mb-4">Historial de Interacciones</h3>
                    <div className="space-y-4">
                        {/* Placeholder for activities */}
                        <p className="text-sm text-muted-foreground italic">El historial de actividades no está implementado aún.</p>
                    </div>
                </div>

                <Separator />

                 <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold font-headline mb-4 flex items-center gap-2">
                           <Pencil className="h-5 w-5" /> Observaciones Rápidas
                        </h3>
                        <Textarea placeholder="Añade notas importantes aquí... (auto-guardado no implementado)" rows={5} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold font-headline mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5" /> Próximas Acciones
                        </h3>
                        <div className="space-y-2">
                             <p className="text-sm text-muted-foreground italic">Funcionalidad no implementada.</p>
                        </div>
                    </div>
                </div>

            </div>
          </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};


export default function CustomersPage() {
  const [selectedContact, setSelectedContact] = useState<WithId<Contact> | null>(null);
  const [editingContact, setEditingContact] = useState<WithId<Contact> | null>(null);
  const [isNewContactSheetOpen, setIsNewContactSheetOpen] = useState(false);
  const [isDealSheetOpen, setIsDealSheetOpen] = useState(false);
  const [dealContact, setDealContact] = useState<WithId<Contact> | null>(null);
  const [dealCompany, setDealCompany] = useState<WithId<Company> | undefined>(undefined);

  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const teamId = 'team-1'; // Hardcoded for now

  // Data fetching
  const contactsRef = useMemoFirebase(() => (firestore ? query(collection(firestore, 'contacts'), where('teamId', '==', teamId)) : null), [firestore, teamId]);
  const { data: contacts, isLoading: isLoadingContacts } = useCollection<Contact>(contactsRef);

  const companiesRef = useMemoFirebase(() => (firestore ? query(collection(firestore, 'companies'), where('teamId', '==', teamId)) : null), [firestore, teamId]);
  const { data: companies, isLoading: isLoadingCompanies } = useCollection<Company>(companiesRef);

  const dealsRef = useMemoFirebase(
    () =>
      selectedContact && firestore
        ? query(collection(firestore, 'deals'), where('contact.id', '==', selectedContact.id))
        : null,
    [selectedContact, firestore]
  );
  const { data: dealsForSelectedContact } = useCollection<Deal>(dealsRef);

  const companyMap = useMemo(() => {
    if (!companies) return new Map();
    return new Map(companies.map((c) => [c.id, c.name]));
  }, [companies]);

  const dealsByContact = useMemo(() => {
    if(!dealsForSelectedContact) return {};
    const map: Record<string, WithId<Deal>[]> = {};
    dealsForSelectedContact.forEach(deal => {
        if(deal.contact?.id){
            if(!map[deal.contact.id]) map[deal.contact.id] = [];
            map[deal.contact.id].push(deal);
        }
    });
    return map;
  }, [dealsForSelectedContact]);

  const handleRowClick = (contact: WithId<Contact>) => {
    setSelectedContact(contact);
  };
  
  const handleOpenNewDeal = (contact: WithId<Contact>, company?: WithId<Company>) => {
    setDealContact(contact);
    setDealCompany(company);
    setIsDealSheetOpen(true);
  };

  const handleEditContact = (contact: WithId<Contact>) => {
    setEditingContact(contact);
    setIsNewContactSheetOpen(true);
  };

  const handleCloseContactForm = () => {
    setEditingContact(null);
    setIsNewContactSheetOpen(false);
  }
  
  const handleSaveDeal = (formData: Partial<Deal>) => {
    if (!firestore || !user) return;
    const dealsCollection = collection(firestore, 'deals');
    const newDeal = {
      ...formData,
      teamId,
      stage: 'potencial',
      ownerId: user.uid,
      status: 'activo',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
    };
    addDocumentNonBlocking(dealsCollection, newDeal as Deal);
    toast({ title: "Flow Creado", description: "El nuevo flow ha sido añadido a tu SaleFlow." });
    setIsDealSheetOpen(false);
  };
  
  const handleSaveContact = (formData: Partial<Contact>) => {
    if (!firestore || !user) return;

    if (editingContact) {
      // Update existing contact
      const contactRef = doc(firestore, 'contacts', editingContact.id);
      updateDocumentNonBlocking(contactRef, { ...formData, updatedAt: serverTimestamp() });
      toast({ title: "Cliente Actualizado", description: "La información del cliente ha sido actualizada." });
    } else {
      // Create new contact
      const contactsCollection = collection(firestore, 'contacts');
      const newContact = {
        ...formData,
        teamId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      addDocumentNonBlocking(contactsCollection, newContact as Contact);
      toast({ title: "Cliente Creado", description: "El nuevo cliente ha sido añadido." });
    }
    handleCloseContactForm();
  };


  const isLoading = isLoadingContacts || isLoadingCompanies;

  const getLeadStatus = (contact: WithId<Contact>) => {
    // This is placeholder logic. A real implementation would be more robust.
    const dealsForContact = dealsByContact[contact.id] || [];
    const hasWonDeal = dealsForContact.some(d => d.stage === 'ganado');
    
    if (hasWonDeal) return 'cliente activo';
    if (dealsForContact.length > 0) return 'en seguimiento';
    return 'nuevo';
  };
  
  const getStageDisplay = (contactId: string) => {
    // This is placeholder logic.
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="Clientes"
        description="Centraliza la información de tus clientes en un solo lugar, con historial, contexto y acciones conectadas."
      >
        <Button onClick={() => { setEditingContact(null); setIsNewContactSheetOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
        </Button>
      </PageHeader>
       <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
        Cada cliente es una historia. Mantén todos sus datos, interacciones y oportunidades sincronizadas automáticamente con tu SaleFlow.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 flex-1">
        {/* Left Panel: Filters */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-headline font-semibold mb-4">Filtros</h3>
            <div className="space-y-6">
                <div>
                    <Label className="mb-2 block">Buscar por nombre o empresa</Label>
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar..." className="pl-8" />
                    </div>
                </div>
                <div>
                    <Label>Estado del Lead</Label>
                    <div className="space-y-2 mt-2">
                        {Object.entries(leadStatusConfig).map(([key, {name}]) => (
                            <div key={key} className="flex items-center space-x-2">
                                <Checkbox id={`status-${key}`} />
                                <Label htmlFor={`status-${key}`} className="font-normal">{name}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <Label>Etapa del SaleFlow</Label>
                     <div className="space-y-2 mt-2">
                        {Object.entries(stageConfig).map(([key, {name}]) => (
                            <div key={key} className="flex items-center space-x-2">
                                <Checkbox id={`stage-${key}`} />
                                <Label htmlFor={`stage-${key}`} className="font-normal">{name}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Panel: Table */}
        <Card className="overflow-hidden">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Etapa SaleFlow</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead><span className="sr-only">Acciones</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">Cargando clientes...</TableCell>
                  </TableRow>
                ) : (
                  contacts && contacts.map((contact) => {
                    const companyName = companyMap.get(contact.companyId) || 'N/A';
                    const leadStatus = getLeadStatus(contact);
                    const statusConfig = leadStatusConfig[leadStatus];

                    return (
                      <TableRow key={contact.id} onClick={() => handleRowClick(contact)} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-muted-foreground">{contact.email}</div>
                        </TableCell>
                        <TableCell>{companyName}</TableCell>
                        <TableCell>{getStageDisplay(contact.id)}</TableCell>
                        <TableCell>
                            {statusConfig ? (
                               <Badge className={cn("text-xs", statusConfig.color)} variant="outline">{statusConfig.name}</Badge>
                            ): <Badge variant="outline">Desconocido</Badge>}
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                        <span className="sr-only">Abrir menú</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                                        <Pencil className="mr-2 h-4 w-4"/>
                                        Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500 focus:text-red-500">
                                        <Trash2 className="mr-2 h-4 w-4"/>
                                        Eliminar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                })
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      </div>

        {/* Right Panel: Details */}
        {selectedContact && (
            <CustomerDetailPanel 
                contact={selectedContact}
                company={companies?.find(c => c.id === selectedContact.companyId)}
                deals={dealsByContact[selectedContact.id] || []}
                onClose={() => setSelectedContact(null)}
                onOpenNewDeal={handleOpenNewDeal}
                onEditContact={handleEditContact}
            />
        )}
        
        {/* New/Edit Contact Sheet */}
        <Sheet open={isNewContactSheetOpen} onOpenChange={handleCloseContactForm}>
            <SheetContent className="sm:max-w-lg">
            <SheetHeader>
                <SheetTitle>{editingContact ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</SheetTitle>
                <SheetDescription>
                    {editingContact ? 'Actualiza la información de tu cliente.' : 'Añade un nuevo cliente a tu base de datos.'}
                </SheetDescription>
            </SheetHeader>
            <div className="py-4">
                <ContactForm
                    onSave={handleSaveContact}
                    onCancel={handleCloseContactForm}
                    companies={companies || []}
                    contact={editingContact}
                />
            </div>
            </SheetContent>
        </Sheet>

        {/* New Deal Sheet */}
        <Sheet open={isDealSheetOpen} onOpenChange={setIsDealSheetOpen}>
            <SheetContent className="sm:max-w-lg">
            <SheetHeader>
                <SheetTitle>Crear Nuevo Flow</SheetTitle>
                <SheetDescription>
                    Inicia un nuevo negocio para {dealContact?.name}.
                </SheetDescription>
            </SheetHeader>
            <div className="py-4">
                <DealForm
                    onSave={handleSaveDeal}
                    onCancel={() => setIsDealSheetOpen(false)}
                    contacts={contacts || []}
                    companies={companies || []}
                    deal={{
                        contact: dealContact ? { id: dealContact.id, name: dealContact.name, email: dealContact.email } : undefined,
                        company: dealCompany ? { id: dealCompany.id, name: dealCompany.name } : undefined,
                    }}
                />
            </div>
            </SheetContent>
        </Sheet>
    </div>
  );
}
