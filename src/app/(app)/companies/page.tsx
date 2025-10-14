'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MoreHorizontal, Plus, Briefcase, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  WithId,
  errorEmitter,
  FirestorePermissionError,
} from '@/firebase';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { Company } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

const companySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  industry: z.string().optional(),
  domain: z.string().url('Debe ser una URL válida (ej: https://dominio.com)').optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

const CompanyForm = ({
  company,
  onSave,
  onCancel,
}: {
  company?: WithId<Company>;
  onSave: (data: CompanyFormData) => void;
  onCancel: () => void;
}) => {
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company?.name || '',
      industry: company?.industry || '',
      domain: company?.domain || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Empresa</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: Innovate Inc." required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industria</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: Tecnología" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sitio Web (Dominio)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://innovateinc.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SheetFooter className="pt-8">
          <Button variant="ghost" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Guardar Empresa
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
};


export default function CompaniesPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<WithId<Company> | undefined>(undefined);
  const { toast } = useToast();
  const firestore = useFirestore();
  const teamId = 'team-1'; // Hardcoded for now

  const companiesRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'companies') : null),
    [firestore]
  );
  const { data: companies, isLoading } = useCollection<Company>(companiesRef);

  const handleSaveCompany = (formData: CompanyFormData) => {
    if (!firestore) return;

    const companyData = {
      ...formData,
      teamId: teamId,
      updatedAt: serverTimestamp(),
    };

    if (editingCompany) {
      const companyRef = doc(firestore, 'companies', editingCompany.id);
      setDoc(companyRef, { ...companyData, createdAt: editingCompany.createdAt }, { merge: true })
        .then(() => {
          toast({ title: 'Empresa Actualizada' });
        })
        .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: companyRef.path,
                operation: 'update',
                requestResourceData: companyData,
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({ title: 'Error al Actualizar', variant: 'destructive' });
        });
    } else {
      const newCompanyData = { ...companyData, createdAt: serverTimestamp() };
      const companiesCollection = collection(firestore, 'companies');
      addDoc(companiesCollection, newCompanyData)
        .then(() => {
          toast({ title: 'Empresa Creada' });
        })
        .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: companiesCollection.path,
                operation: 'create',
                requestResourceData: newCompanyData,
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({ title: 'Error al Crear', variant: 'destructive' });
        });
    }
    closeSheet();
  };

  const openNewSheet = () => {
    setEditingCompany(undefined);
    setIsSheetOpen(true);
  };

  const openEditSheet = (company: WithId<Company>) => {
    setEditingCompany(company);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setEditingCompany(undefined);
  };

  return (
    <>
      <PageHeader
        title="Empresas"
        description="Gestiona perfiles de empresas y sus contactos y tratos asociados."
      >
        <Button onClick={openNewSheet}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Empresa
        </Button>
      </PageHeader>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" onInteractOutside={closeSheet}>
            <SheetHeader>
            <SheetTitle>{editingCompany ? 'Editar Empresa' : 'Crear Nueva Empresa'}</SheetTitle>
            <SheetDescription>
                Completa los datos para registrar una nueva empresa en tu CRM.
            </SheetDescription>
            </SheetHeader>
            <div className="py-6">
                <CompanyForm
                    company={editingCompany}
                    onSave={handleSaveCompany}
                    onCancel={closeSheet}
                />
            </div>
        </SheetContent>
      </Sheet>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Empresas</CardTitle>
          <CardDescription>
            Un listado de todas las empresas en tu CRM.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Industria</TableHead>
                <TableHead>Dominio</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Cargando empresas...</TableCell>
                </TableRow>
              ) : (
                companies && companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-md">
                          <Briefcase className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="font-medium">{company.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {company.industry && <Badge variant="outline">{company.industry}</Badge>}
                    </TableCell>
                    <TableCell>
                      <a href={company.domain} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {company.domain}
                      </a>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditSheet(company)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" disabled>
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
