'use client';
import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Contact, Company } from '@/lib/types';
import { MoreHorizontal, Plus, UserCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { enrichContactData } from '@/ai/flows/enrich-contact-data';
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking, WithId } from '@/firebase';
import { collection } from 'firebase/firestore';

const ContactForm = ({ contact, onSave, onCancel, companies }: { contact?: Partial<Contact> | null; onSave: (contact: Partial<Contact>) => void; onCancel: () => void; companies: WithId<Company>[] | null; }) => {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    jobTitle: contact?.jobTitle || '',
    linkedinProfile: contact?.linkedinProfile || '',
    city: contact?.city || '',
    country: contact?.country || '',
    companyId: contact?.companyId || '',
  });
  const [isEnriching, setIsEnriching] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleEnrich = async () => {
    setIsEnriching(true);
    try {
      const result = await enrichContactData({
        name: formData.name,
        company: companies?.find(c => c.id === formData.companyId)?.name,
        email: formData.email,
      });
      if (result.enriched) {
        setFormData(prev => ({
          ...prev,
          jobTitle: result.jobTitle || prev.jobTitle,
          linkedinProfile: result.linkedinProfile || prev.linkedinProfile,
          email: result.email || prev.email,
          city: result.city || prev.city,
          country: result.country || prev.country,
        }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="jobTitle">Cargo</Label>
        <Input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} />
      </div>
       <div className="space-y-2">
        <Label htmlFor="linkedinProfile">Perfil de LinkedIn</Label>
        <Input id="linkedinProfile" name="linkedinProfile" value={formData.linkedinProfile} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">País</Label>
          <Input id="country" name="country" value={formData.country} onChange={handleChange} />
        </div>
      </div>
      <SheetFooter className="pt-4">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="button" variant="outline" onClick={handleEnrich} disabled={isEnriching || !formData.name}>
          <Sparkles className="mr-2 h-4 w-4" /> {isEnriching ? 'Enriqueciendo...' : 'Enriquecer con IA'}
        </Button>
        <Button type="submit">Guardar</Button>
      </SheetFooter>
    </form>
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

  const handleSaveContact = (formData: Partial<Contact>) => {
    const newContact: Omit<WithId<Contact>, 'id'> = {
      name: formData.name || '',
      email: formData.email || '',
      jobTitle: formData.jobTitle || 'N/A',
      companyId: formData.companyId || '',
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/40/40`,
      lastContacted: new Date().toISOString(),
      teamId: teamId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...formData
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
