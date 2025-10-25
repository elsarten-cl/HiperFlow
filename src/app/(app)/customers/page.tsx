'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  WithId,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  setDocumentNonBlocking,
} from '@/firebase';
import { collection, doc, query, where, serverTimestamp, getDocs, orderBy, Timestamp, startAfter, limit, QueryConstraint, updateDoc, getDoc } from 'firebase/firestore';
import type { Contact, Company, Deal, Activity, FlowCreatedEvent } from '@/lib/types';
import { Plus, Search, Phone, Mail, FileText, Handshake, Goal, ArchiveX, Lightbulb, User, Briefcase, Calendar, MessageSquare, Pencil, MoreHorizontal, Trash2, UserCircle, ListFilter, Copy, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, normalizePhoneNumber } from '@/lib/utils';
import { DealForm } from '@/components/deal-form';
import { ContactForm } from '@/components/contact-form';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDebounce } from '@/hooks/use-debounce';
import { Textarea } from '@/components/ui/textarea';
import { simpleHash } from '@/components/kanban-board';

const WEBHOOK_URL = "https://hook.us2.make.com/minmtau7edpwnsohplsjobkyv6fytvcg";

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
    inactivo: { color: 'bg-gray-500/20 text-gray-400', name: 'Inactivo' },
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
  const { toast } = useToast();

  const getStageIcon = (stage: string) => {
    const config = stageConfig[stage];
    return config ? <config.icon className={cn("h-4 w-4", config.color)} /> : null;
  }
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado al portapapeles" });
  };

  return (
    <Sheet open={!!contact} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="sm:max-w-2xl w-full p-0" side="right">
          <ScrollArea className="h-full">
            <div className="p-6">
                <SheetHeader className="mb-6 text-left">
                    <SheetTitle className="sr-only">Detalle del Cliente</SheetTitle>
                    <SheetDescription className="sr-only">Información detallada sobre {contact.name}.</SheetDescription>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted">
                                <UserCircle className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-headline font-semibold">{contact.name}</h2>
                                <p className="text-muted-foreground">
                                    {contact.jobTitle} {company ? `en ${company.name}` : ''}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => onEditContact(contact)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="outline" size="icon" className="hover:bg-destructive hover:text-destructive-foreground"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </SheetHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
                    </div>
                    {contact.phone ? (
                         <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${contact.phoneNormalized || contact.phone}`} className="hover:underline">{contact.phone}</a>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(contact.phoneNormalized || contact.phone || '')}>
                              <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        <Button variant="link" className="p-0 h-auto justify-start" onClick={() => onEditContact(contact)}>Agregar teléfono</Button>
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

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const [filters, setFilters] = useState({
    stages: [] as string[],
    status: '',
    hasPhone: false,
    hasCompany: false,
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
  });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const teamId = 'team-1'; // Hardcoded for now

  // --- Data Fetching Logic ---
  const [contacts, setContacts] = useState<WithId<Contact>[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const companiesRef = useMemoFirebase(() => (firestore ? query(collection(firestore, 'companies'), where('teamId', '==', teamId)) : null), [firestore, teamId]);
  const { data: companies } = useCollection<Company>(companiesRef);

  const dealsRef = useMemoFirebase(
    () => selectedContact && firestore ? query(collection(firestore, 'deals'), where('contact.id', '==', selectedContact.id)) : null,
    [selectedContact, firestore]
  );
  const { data: dealsForSelectedContact } = useCollection<Deal>(dealsRef);

  const companyMap = useMemo(() => new Map(companies?.map((c) => [c.id, c.name])), [companies]);
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
  
  const getTimestampAsDate = (ts: any): Date | null => {
    if (!ts) return null;
    if (ts instanceof Timestamp) return ts.toDate();
    if (ts instanceof Date) return ts;
    if (typeof ts === 'string') return new Date(ts);
    if (ts && typeof ts.seconds === 'number') return new Date(ts.seconds * 1000);
    return null;
  }

  const fetchContacts = useCallback(async (loadMore = false) => {
    if (!firestore || (!hasMore && loadMore)) return;
    
    setIsLoading(true);
    
    const constraints: QueryConstraint[] = [where('teamId', '==', teamId)];
    if (filters.hasPhone) constraints.push(where('phone', '!=', null));
    if (filters.hasCompany) constraints.push(where('companyId', '!=', ''));

    if (filters.dateRange.from) constraints.push(where('createdAt', '>=', filters.dateRange.from));
    if (filters.dateRange.to) constraints.push(where('createdAt', '<=', filters.dateRange.to));
    
    if(loadMore && lastVisible) constraints.push(startAfter(lastVisible));
    constraints.push(limit(20));

    try {
        const q = query(collection(firestore, 'contacts'), ...constraints);

        const querySnapshot = await getDocs(q);
        const newContacts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithId<Contact>));
        const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

        setHasMore(newContacts.length === 20);
        setLastVisible(lastDoc || null);
        
        let processedContacts = newContacts;

        if (debouncedSearchTerm) {
          const lowerCaseSearch = debouncedSearchTerm.toLowerCase();
          processedContacts = processedContacts.filter(c => 
            c.name.toLowerCase().includes(lowerCaseSearch) ||
            c.email.toLowerCase().includes(lowerCaseSearch) ||
            c.phone?.includes(lowerCaseSearch) ||
            (c.companyId && companyMap.get(c.companyId)?.toLowerCase().includes(lowerCaseSearch))
          );
        }
        
        setContacts(prev => loadMore ? [...prev, ...processedContacts] : processedContacts);

    } catch (error) {
        console.error("Error fetching contacts:", error);
        if (error instanceof Error && error.message.includes('index')) {
             toast({
                title: "Error de Consulta",
                description: "La combinación de filtros actual requiere un índice de Firestore que no existe. Prueba con menos filtros o crea el índice en la consola de Firebase.",
                variant: "destructive"
            });
        } else {
             toast({
                title: "Error Inesperado",
                description: "No se pudieron cargar los clientes.",
                variant: "destructive"
            });
        }
    } finally {
        setIsLoading(false);
    }
  }, [firestore, teamId, debouncedSearchTerm, filters, lastVisible, hasMore, companyMap, toast]);


  useEffect(() => {
    setContacts([]);
    setLastVisible(null);
    setHasMore(true);
    fetchContacts(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, filters]);


  const handleRowClick = (contact: WithId<Contact>) => setSelectedContact(contact);
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
  
const handleSaveDeal = async (formData: Partial<Deal>) => {
    if (!firestore || !user || !user.uid) return;
    if (!formData.contact) {
      toast({
        title: 'Contacto Requerido',
        description: 'Por favor, selecciona un contacto para crear el flow.',
        variant: 'destructive',
      });
      return;
    }

    const dealsCollection = collection(firestore, 'deals');
    const creationDate = new Date();
    const timestamp = serverTimestamp();

    const newDealData: Omit<Deal, 'id'> = {
      title: formData.title || 'Nuevo Flow',
      description: formData.description,
      teamId,
      stage: 'potencial',
      amount: formData.amount || 0,
      currency: formData.currency || 'CLP',
      contact: formData.contact,
      company: formData.company,
      lastActivity: timestamp,
      ownerId: user.uid,
      status: 'activo',
      createdAt: creationDate,
      updatedAt: creationDate,
    };

    const newDealRef = await addDocumentNonBlocking(dealsCollection, newDealData as Deal);
    if (!newDealRef) {
       toast({ title: "Error", description: "No se pudo crear el flow.", variant: "destructive" });
       return;
    }

    toast({ title: "Flow Creado", description: "El nuevo flow ha sido añadido a tu SaleFlow." });
    setIsDealSheetOpen(false);

    // --- Dispara el webhook para 'saleflow.flow.created' ---
    const dealId = newDealRef.id;
    const eventId = `evt_${simpleHash(`${dealId}-${creationDate.toISOString()}`)}`;
    const automationOutboxRef = doc(firestore, 'automation_outbox', eventId);

    setDocumentNonBlocking(automationOutboxRef, { id: eventId, dealId, status: "pending", createdAt: serverTimestamp() }, {});

    const appBaseUrl = window.location.origin;
    const dealUrl = `${appBaseUrl}/saleflow?dealId=${dealId}`;
    
    const payload: FlowCreatedEvent = {
      eventType: "saleflow.flow.created",
      dealId: dealId,
      title: newDealData.title,
      clientName: newDealData.contact?.name || null,
      value: newDealData.amount,
      currency: newDealData.currency,
      contactEmail: newDealData.contact?.email || null,
      createdAt: creationDate.toISOString(),
      appUrl: dealUrl,
    };

    const startTime = Date.now();
    fetch(WEBHOOK_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    }).then(async (response) => {
      const responseTimeMs = Date.now() - startTime;
      const updateData = {
        status: response.ok ? 'sent' : 'failed', payload, responseStatus: response.status,
        responseTimeMs, lastAttempt: serverTimestamp(),
        ...(response.ok ? {} : { lastError: `HTTP ${response.status}. Authorized?` })
      };
      updateDoc(automationOutboxRef, updateData);
    }).catch(async (error) => {
      const errorData = {
        status: 'failed', lastError: error instanceof Error ? error.message : "Unknown fetch error", lastAttempt: serverTimestamp()
      };
      updateDoc(automationOutboxRef, errorData);
    });
  };
  
const handleSaveContact = async (formData: Partial<Contact> & { companyName?: string }) => {
    if (!firestore || !user) return;

    const phoneNormalized = normalizePhoneNumber(formData.phone);

    let companyId = '';
    const companyName = formData.companyName?.trim();

    if (companyName) {
        if (companies) {
          const existingCompany = companies.find(c => c.name.toLowerCase() === companyName.toLowerCase());
          if (existingCompany) {
            companyId = existingCompany.id;
          }
        }
        if (!companyId) {
            const companiesCollection = collection(firestore, 'companies');
            const newCompanyData = {
                name: companyName, teamId: teamId, createdAt: serverTimestamp(), updatedAt: serverTimestamp()
            } as Company;
            const newCompanyRef = await addDocumentNonBlocking(companiesCollection, newCompanyData);
            if (newCompanyRef) companyId = newCompanyRef.id;
        }
    }

    const contactData: Partial<Contact> & { searchIndex: string[] } = {
      name: formData.name, email: formData.email, phone: formData.phone, phoneNormalized,
      jobTitle: formData.jobTitle, companyId: companyId || formData.companyId, teamId: teamId,
      updatedAt: serverTimestamp(),
      searchIndex: [formData.name?.toLowerCase(), formData.email?.toLowerCase(), companyName?.toLowerCase(), formData.phone].filter(Boolean) as string[]
    };

    if (editingContact) {
      const contactRef = doc(firestore, 'contacts', editingContact.id);
      updateDocumentNonBlocking(contactRef, contactData);
      
      if(formData.phone !== editingContact.phone){
        const activityData: Omit<Activity, 'id'> = {
            contactId: editingContact.id,
            teamId,
            type: 'phone_updated',
            notes: `Teléfono actualizado a: ${formData.phone}`,
            timestamp: serverTimestamp(),
            actor: user.uid
        };
        addDocumentNonBlocking(collection(firestore, 'activities'), activityData as Activity);
        toast({ title: "Teléfono Actualizado" });
      } else {
        toast({ title: "Cliente Actualizado", description: "La información del cliente ha sido actualizada." });
      }
    } else {
      addDocumentNonBlocking(collection(firestore, 'contacts'), { ...contactData, createdAt: serverTimestamp() } as Contact);
      toast({ title: "Cliente Creado", description: "El nuevo cliente ha sido añadido." });
    }
    handleCloseContactForm();
  };

  const getLeadStatus = (contact: WithId<Contact>) => {
    const dealsForContact = dealsByContact[contact.id] || [];
    const hasWonDeal = dealsForContact.some(d => d.stage === 'ganado');
    if (hasWonDeal) return 'cliente activo';
    if (dealsForContact.length > 0) return 'en seguimiento';
    return 'nuevo';
  };
  
  const getStageDisplay = (contactId: string) => <span className="text-muted-foreground">-</span>;
  
  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setIsFilterPanelOpen(false);
  }
  
  const handleClearFilters = () => {
     setFilters({
        stages: [], status: '', hasPhone: false, hasCompany: false,
        dateRange: { from: undefined, to: undefined },
      });
  }

  const activeFiltersCount = Object.values(filters).filter(v => 
    (Array.isArray(v) && v.length > 0) ||
    (typeof v === 'string' && v !== '') ||
    (typeof v === 'boolean' && v) ||
    (typeof v === 'object' && v !== null && (v as any).from)
  ).length;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader
        title="Clientes"
        description="Centraliza la información de tus clientes en un solo lugar, con historial, contexto y acciones conectadas."
      >
        <Button onClick={() => { setEditingContact(null); setIsNewContactSheetOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
        </Button>
      </PageHeader>
      
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <div className="relative w-full md:w-auto md:flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por nombre, email, empresa o teléfono..." className="pl-8 w-full" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
                <Button variant="outline" className="w-full md:w-auto" onClick={() => setIsFilterPanelOpen(true)}>
                    <ListFilter className="mr-2 h-4 w-4" />
                    Filtrar
                    {activeFiltersCount > 0 && <Badge variant="secondary" className="ml-2">{activeFiltersCount}</Badge>}
                </Button>
            </div>
        </div>
      
      <div className="flex-1 mt-0">
        <Card className="overflow-hidden h-full flex flex-col">
          <ScrollArea className="flex-1" onScrollCapture={(e) => {
              const target = e.target as HTMLDivElement;
              if(target.scrollHeight - target.scrollTop < target.clientHeight + 200 && hasMore && !isLoading){
                  fetchContacts(true);
              }
          }}>
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Etapa SaleFlow</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead><span className="sr-only">Acciones</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.length === 0 && !isLoading ? (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center">No se encontraron clientes.</TableCell></TableRow>
                ) : (
                  contacts.map((contact) => {
                    const companyName = companyMap.get(contact.companyId) || '-';
                    const leadStatus = getLeadStatus(contact);
                    const statusInfo = leadStatusConfig[leadStatus];

                    return (
                      <TableRow key={contact.id} onClick={() => handleRowClick(contact)} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-muted-foreground">{contact.email}</div>
                        </TableCell>
                        <TableCell>{companyName}</TableCell>
                        <TableCell>{contact.phone || '-'}</TableCell>
                        <TableCell>{getStageDisplay(contact.id)}</TableCell>
                        <TableCell>
                            {statusInfo ? (
                               <Badge className={cn("text-xs", statusInfo.color)} variant="outline">{statusInfo.name}</Badge>
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
                {isLoading && (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center">Cargando más clientes...</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      </div>

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
        
        <Sheet open={isNewContactSheetOpen} onOpenChange={handleCloseContactForm}>
            <SheetContent className="sm:max-w-lg">
              <SheetHeader><SheetTitle>{editingContact ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</SheetTitle><SheetDescription>{editingContact ? 'Actualiza la información.' : 'Añade un nuevo cliente a tu base de datos.'}</SheetDescription></SheetHeader>
              <ContactForm onSave={handleSaveContact} onCancel={handleCloseContactForm} companies={companies || []} contact={editingContact}/>
            </SheetContent>
        </Sheet>
        
        <Sheet open={isFilterPanelOpen} onOpenChange={setIsFilterPanelOpen}>
            <SheetContent side="left">
                <SheetHeader><SheetTitle>Filtrar Clientes</SheetTitle></SheetHeader>
                <div className="py-4">
                  {/* Filter form would go here */}
                  <p>Panel de filtros en construcción.</p>
                </div>
            </SheetContent>
        </Sheet>

        <Sheet open={isDealSheetOpen} onOpenChange={setIsDealSheetOpen}>
            <SheetContent className="sm:max-w-lg">
              <SheetHeader><SheetTitle>Crear Nuevo Flow</SheetTitle><SheetDescription>Inicia un nuevo negocio para {dealContact?.name}.</SheetDescription></SheetHeader>
              <DealForm onSave={handleSaveDeal} onCancel={() => setIsDealSheetOpen(false)} contacts={contacts || []} companies={companies || []} deal={{ contact: dealContact ? { id: dealContact.id, name: dealContact.name, email: dealContact.email } : undefined, company: dealCompany ? { id: dealCompany.id, name: dealCompany.name } : undefined }} />
            </SheetContent>
        </Sheet>
    </div>
  );
}
