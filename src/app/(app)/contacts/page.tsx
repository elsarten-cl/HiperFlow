'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { companies, contacts as initialContacts } from '@/lib/data';
import type { Contact } from '@/lib/types';
import { MoreHorizontal, Plus, UserCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { enrichContactData } from '@/ai/flows/enrich-contact-data';

const ContactForm = ({ contact, onSave, onCancel }: { contact?: Contact | null; onSave: (contact: Partial<Contact>) => void; onCancel: () => void; }) => {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    jobTitle: contact?.jobTitle || '',
    linkedinProfile: contact?.linkedinProfile || '',
    city: contact?.city || '',
    country: contact?.country || '',
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
        company: companies.find(c => c.id === contact?.companyId)?.name,
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
        toast({ title: "Contact enriched!", description: "AI has filled in missing details." });
      } else {
        toast({ title: "Enrichment failed", description: "Could not find additional information.", variant: 'destructive' });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "An error occurred", description: "Failed to enrich contact information.", variant: 'destructive' });
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
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} />
      </div>
       <div className="space-y-2">
        <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
        <Input id="linkedinProfile" name="linkedinProfile" value={formData.linkedinProfile} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" value={formData.country} onChange={handleChange} />
        </div>
      </div>
      <SheetFooter className="pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="button" variant="outline" onClick={handleEnrich} disabled={isEnriching || !formData.name}>
          <Sparkles className="mr-2 h-4 w-4" /> {isEnriching ? 'Enriching...' : 'Enrich with AI'}
        </Button>
        <Button type="submit">Save</Button>
      </SheetFooter>
    </form>
  )
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveContact = (formData: Partial<Contact>) => {
    const newContact: Contact = {
      id: `cont-${Date.now()}`,
      name: formData.name || '',
      email: formData.email || '',
      jobTitle: formData.jobTitle || 'N/A',
      companyId: 'comp-1', // Default or select
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/40/40`,
      lastContacted: new Date().toISOString(),
      ...formData
    };
    setContacts(prev => [newContact, ...prev]);
    setIsSheetOpen(false);
    toast({ title: 'Contact Created', description: `${newContact.name} has been added.` });
  };

  return (
    <>
      <PageHeader title="Contacts" description="Manage your customer and lead contacts.">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Contact
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Create New Contact</SheetTitle>
              <SheetDescription>
                Fill in the details below. You can use AI to enrich the data.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
               <ContactForm onSave={handleSaveContact} onCancel={() => setIsSheetOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Contact List</CardTitle>
          <CardDescription>A list of all contacts in your CRM.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Contacted</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => {
                const company = companies.find(c => c.id === contact.companyId);
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
                    <TableCell>{company?.name}</TableCell>
                    <TableCell>{location || 'N/A'}</TableCell>
                    <TableCell>{new Date(contact.lastContacted).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
