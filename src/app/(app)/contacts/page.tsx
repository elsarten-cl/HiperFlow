'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Contact, Company } from '@/lib/types';
import { MoreHorizontal, Plus, UserCircle, BrainCircuit, Rocket, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { enrichContactData } from '@/ai/flows/enrich-contact-data';
import { useCollection, useFirestore, useMemoFirebase, WithId, errorEmitter, FirestorePermissionError } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const contactSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido.' }),
  email: z.string().email({ message: 'El correo electrónico no es válido.' }),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  socials: z.string().optional(),
  source: z.string().optional(),
  mainInterest: z.string().optional(),
  interestLevel: z.enum(['bajo', 'medio', 'alto']).optional(),
  internalNotes: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  nextStep: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = ({ onSave, onSaveAndCreateOpportunity, onCancel, companies }: { onSave: (contact: ContactFormData) => void; onSaveAndCreateOpportunity: (contact: ContactFormData) => void; onCancel: () => void; companies: WithId<Company>[] | null; }) => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      jobTitle: '',
      companyName: '',
      socials: '',
      source: '',
      mainInterest: '',
      internalNotes: '',
      city: '',
      country: '',
      nextStep: '',
    },
  });
  
  const [isEnriching, setIsEnriching] = useState(false);
  const { toast } = useToast();

  const handleEnrich = async () => {
    setIsEnriching(true);
    const currentData = form.getValues();
    try {
      const result = await enrichContactData({
        name: currentData.name,
        company: currentData.companyName,
        email: currentData.email,
        linkedinProfile: currentData.socials,
      });
      if (result.enriched) {
        form.setValue('jobTitle', result.jobTitle || currentData.jobTitle);
        form.setValue('socials', result.linkedinProfile || currentData.socials);
        form.setValue('email', result.email || currentData.email);
        form.setValue('city', result.city || currentData.city);
        form.setValue('country', result.country || currentData.country);
        toast({ title: "¡Contacto enriquecido!", description: "La IA ha rellenado los detalles que faltaban." });
      } else {
        toast({ title: "Falló el enriquecimiento", description: "No se pudo encontrar información adicional.", variant: 'destructive' });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Ocurrió un error", description: "No se pudo enriquecer la información del contacto.", variant: 'destructive' });
    } finally {
      setIsEnriching(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        
        {/* Section 1: Identidad */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">Identidad del Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} placeholder="Ej: Carla Hernández" required className="bg-background/80 focus:border-primary" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} placeholder="Ej: carla@empresa.com" required className="bg-background/80 focus:border-primary" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="jobTitle" render={({ field }) => (
              <FormItem><FormLabel>Cargo</FormLabel><FormControl><Input {...field} placeholder="Ej: Directora de Marketing" className="bg-background/80 focus:border-primary" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="companyName" render={({ field }) => (
              <FormItem><FormLabel>Empresa</FormLabel><FormControl><Input {...field} placeholder="Ej: Agencia Creativa Horizonte" className="bg-background/80 focus:border-primary" /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
           <FormField control={form.control} name="socials" render={({ field }) => (
              <FormItem><FormLabel>Redes Sociales</FormLabel><FormControl><Textarea {...field} placeholder="Pega aquí las URLs de los perfiles, una por línea..." className="bg-background/80 focus:border-primary" /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        
        <Separator />

        {/* Section 2: Contexto */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">Contexto de Relación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>WhatsApp</FormLabel><FormControl><Input {...field} placeholder="+56 9 1234 5678" className="bg-background/80 focus:border-primary" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="source" render={({ field }) => (
              <FormItem><FormLabel>Origen del contacto</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="bg-background/80 focus:border-primary"><SelectValue placeholder="Selecciona un origen" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="formulario-web">Formulario Web</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="llamada">Llamada</SelectItem>
                    <SelectItem value="evento">Evento</SelectItem>
                    <SelectItem value="referencia">Referencia</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              <FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="interestLevel" render={({ field }) => (
              <FormItem><FormLabel>Nivel de interés</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger className="bg-background/80 focus:border-primary"><SelectValue placeholder="Selecciona un nivel" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="bajo">Bajo</SelectItem>
                  <SelectItem value="medio">Medio</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="mainInterest" render={({ field }) => (
            <FormItem><FormLabel>Interés principal</FormLabel><FormControl><Input {...field} placeholder="Ej: diseño web, campañas publicitarias..." className="bg-background/80 focus:border-primary" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="internalNotes" render={({ field }) => (
            <FormItem><FormLabel>Notas internas</FormLabel><FormControl><Textarea {...field} placeholder="Añade comentarios, contexto o información adicional..." className="bg-background/80 focus:border-primary" /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <Separator />

        {/* Section 3: Ubicación y Seguimiento */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">Ubicación y Seguimiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="city" render={({ field }) => (
              <FormItem><FormLabel>Ciudad</FormLabel><FormControl><Input {...field} className="bg-background/80 focus:border-primary"/></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="country" render={({ field }) => (
              <FormItem><FormLabel>País</FormLabel><FormControl><Input {...field} className="bg-background/80 focus:border-primary"/></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="nextStep" render={({ field }) => (
              <FormItem><FormLabel>Próximo paso sugerido</FormLabel><FormControl><Input {...field} placeholder="Ej: Enviar correo de presentación" className="bg-background/80 focus:border-primary"/></FormControl><FormMessage /></FormItem>
            )} />
        </div>

        <SheetFooter className="pt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
             <Button variant="outline" type="button" onClick={handleEnrich} disabled={isEnriching || !form.getValues().name}>
              <BrainCircuit className="mr-2 h-4 w-4" /> {isEnriching ? 'Analizando...' : 'Enriquecer con IA'}
            </Button>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
            <Button type="button" onClick={() => onSaveAndCreateOpportunity(form.getValues())} variant="secondary">
                <Rocket className="mr-2 h-4 w-4" /> Guardar y Crear Oportunidad
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4"/> Guardar Contacto
            </Button>
          </div>
        </SheetFooter>
      </form>
    </Form>
  )
}

export default function ContactsPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  // Hardcoded teamId for now
  const teamId = 'team-1';

  const contactsRef = useMemoFirebase(() => firestore ? collection(firestore, 'contacts') : null, [firestore]);
  const { data: contacts, isLoading: isLoadingContacts } = useCollection<Contact>(contactsRef);
  
  const companiesRef = useMemoFirebase(() => firestore ? collection(firestore, 'companies') : null, [firestore]);
  const { data: companies, isLoading: isLoadingCompanies } = useCollection<Company>(companiesRef);

  const saveContact = (formData: ContactFormData) => {
    if (!firestore) {
      toast({ title: 'Error', description: 'La base de datos no está disponible.', variant: 'destructive' });
      return;
    }
  
    const company = companies?.find(c => c.name.toLowerCase() === formData.companyName?.toLowerCase());
    const companyId = company ? company.id : '';
      
    const newContactData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        jobTitle: formData.jobTitle || '',
        companyId: companyId,
        socials: formData.socials?.split('\n') || [],
        source: formData.source || 'desconocido',
        interestLevel: formData.interestLevel,
        mainInterest: formData.mainInterest || '',
        internalNotes: formData.internalNotes || '',
        city: formData.city || '',
        country: formData.country || '',
        nextStep: formData.nextStep || '',
        avatarUrl: `https://picsum.photos/seed/${Date.now()}/40/40`,
        teamId: teamId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastContacted: serverTimestamp(),
    };
  
    const contactsCollection = collection(firestore, 'contacts');
    
    addDoc(contactsCollection, newContactData)
      .then(() => {
        toast({ title: 'Contacto Creado', description: `${newContactData.name} ha sido agregado y sincronizado en HiperFlow.` });
      })
      .catch(serverError => {
        const permissionError = new FirestorePermissionError({
          path: contactsCollection.path,
          operation: 'create',
          requestResourceData: newContactData,
        });
        errorEmitter.emit('permission-error', permissionError);
        // Optional: you can still show a generic toast here if you want, but the main error is now being thrown for Next.js to catch.
        toast({ title: 'Error al Guardar', description: 'No se pudo crear el contacto. Comprueba los permisos.', variant: 'destructive' });
      });
  };


  const handleSaveContact = (formData: ContactFormData) => {
    saveContact(formData);
    setIsSheetOpen(false);
  };

  const handleSaveAndCreateOpportunity = (formData: ContactFormData) => {
    saveContact(formData);
    setIsSheetOpen(false);
    // Here you would typically open the "New Opportunity" sheet/modal,
    // potentially pre-filling it with the new contact's data.
    // For now, we'll just show a toast.
    toast({
      title: "Próximo Paso: Crear Oportunidad",
      description: "Funcionalidad para abrir el formulario de oportunidad no implementada aún.",
    });
  };

  return (
    <>
      <PageHeader title="Contactos" description="Gestiona los contactos de tus clientes y potenciales clientes.">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Contacto
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="sm:max-w-4xl w-full">
            <SheetHeader className="text-left pr-6">
              <SheetTitle>Crear Nuevo Contacto</SheetTitle>
              <SheetDescription>
                Completa los datos de tu cliente o lead. Puedes usar la IA para enriquecer automáticamente información como cargo, empresa o redes sociales.
              </SheetDescription>
              <p className="text-xs text-muted-foreground pt-2 italic">
                Un contacto es el punto de partida de toda relación comercial. Cuanto más contexto registres, más inteligente será tu flujo de ventas.
              </p>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-10rem)] pr-6">
               <div className="py-6">
                 <ContactForm onSave={handleSaveContact} onSaveAndCreateOpportunity={handleSaveAndCreateOpportunity} onCancel={() => setIsSheetOpen(false)} companies={companies}/>
               </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contactos</CardTitle>
          <CardDescription>Un listado de todos los contactos en tu CRM.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Último Contacto</TableHead>
                <TableHead><span className="sr-only">Acciones</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingContacts || isLoadingCompanies ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Cargando contactos...</TableCell>
                </TableRow>
              ) : (
                contacts && contacts.map((contact) => {
                  const company = companies?.find(c => c.id === contact.companyId);
                  const location = [contact.city, contact.country].filter(Boolean).join(', ');
                  return (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                            <AvatarFallback><UserCircle /></AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-sm text-muted-foreground">{contact.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{company?.name || 'N/A'}</TableCell>
                      <TableCell>{location || 'N/A'}</TableCell>
                      <TableCell>{contact.lastContacted && new Date((contact.lastContacted as any).seconds * 1000).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Ver</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
