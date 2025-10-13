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
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Contact, Company } from '@/lib/types';
import { MoreHorizontal, Plus, UserCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { enrichContactData } from '@/ai/flows/enrich-contact-data';
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking, WithId } from '@/firebase';
import { collection } from 'firebase/firestore';

const contactSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido.' }),
  email: z.string().email({ message: 'El correo electrónico no es válido.' }),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  linkedinProfile: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  companyId: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = ({ contact, onSave, onCancel, companies }: { contact?: Partial<ContactFormData> | null; onSave: (contact: ContactFormData) => void; onCancel: () => void; companies: WithId<Company>[] | null; }) => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contact?.name || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      jobTitle: contact?.jobTitle || '',
      linkedinProfile: contact?.linkedinProfile || '',
      city: contact?.city || '',
      country: contact?.country || '',
      companyId: contact?.companyId || '',
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
        company: companies?.find(c => c.id === currentData.companyId)?.name,
        email: currentData.email,
      });
      if (result.enriched) {
        form.setValue('jobTitle', result.jobTitle || currentData.jobTitle);
        form.setValue('linkedinProfile', result.linkedinProfile || currentData.linkedinProfile);
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
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono / WhatsApp</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="linkedinProfile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Perfil de LinkedIn</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>País</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SheetFooter className="pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>Cancelar</Button>
          <Button type="button" variant="outline" onClick={handleEnrich} disabled={isEnriching || !form.getValues().name}>
            <Sparkles className="mr-2 h-4 w-4" /> {isEnriching ? 'Enriqueciendo...' : 'Enriquecer con IA'}
          </Button>
          <Button type="submit">Guardar</Button>
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

  const contactsRef = useMemoFirebase(() => collection(firestore, 'contacts'), [firestore]);
  const { data: contacts, isLoading: isLoadingContacts } = useCollection<Contact>(contactsRef);
  
  const companiesRef = useMemoFirebase(() => collection(firestore, 'companies'), [firestore]);
  const { data: companies, isLoading: isLoadingCompanies } = useCollection<Company>(companiesRef);

  const handleSaveContact = (formData: ContactFormData) => {
    const newContact: Omit<WithId<Contact>, 'id' | 'lastContacted'> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '',
      jobTitle: formData.jobTitle || 'N/A',
      companyId: formData.companyId || '',
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/40/40`,
      teamId: teamId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...formData,
      lastContacted: new Date().toISOString()
    };

    const contactsCollection = collection(firestore, 'contacts');
    addDocumentNonBlocking(contactsCollection, newContact);

    setIsSheetOpen(false);
    toast({ title: 'Contacto Creado', description: `${newContact.name} ha sido agregado.` });
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
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Crear Nuevo Contacto</SheetTitle>
              <SheetDescription>
                Rellena los detalles a continuación. Puedes usar la IA para enriquecer los datos.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
               <ContactForm onSave={handleSaveContact} onCancel={() => setIsSheetOpen(false)} companies={companies}/>
            </div>
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
                      <TableCell>{new Date(contact.lastContacted).toLocaleDateString()}</TableCell>
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
