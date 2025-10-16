'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, LifeBuoy, BookCopy, MessageSquare, GraduationCap } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const academyCourses = [
    { title: 'Primeros Pasos en HiperFlow', level: 'Básico', duration: '30 min', tags: ['CRM', 'Ventas'] },
    { title: 'Automatiza tu Proceso de Ventas', level: 'Intermedio', duration: '1h 15min', tags: ['IA', 'Automatización'] },
    { title: 'Conectando HiperFlow con Make.com', level: 'Intermedio', duration: '45 min', tags  : ['Make', 'API'] },
    { title: 'Desarrollo de Módulos Personalizados', level: 'Avanzado', duration: '2h 30min', tags: ['Desarrollo', 'API'] },
]

export default function HubPage() {
  return (
    <>
      <PageHeader
        title="HiperFlow Hub"
        description="Aprende, comparte y crece con la comunidad HiperFlow."
      >
         <Button>
            <Search className="mr-2 h-4 w-4" />
            Búsqueda Global
        </Button>
      </PageHeader>
      <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
       Encuentra guías paso a paso, tutoriales en video, artículos explicativos, foros y soporte técnico directo. Este es el lugar donde tu experiencia con HiperFlow evoluciona y tu negocio se potencia.
      </p>

      <Tabs defaultValue="academy" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="academy">
            <GraduationCap className="mr-2 h-4 w-4" />
            Academia
          </TabsTrigger>
          <TabsTrigger value="support">
            <LifeBuoy className="mr-2 h-4 w-4" />
            Soporte Técnico
          </TabsTrigger>
          <TabsTrigger value="docs">
            <BookCopy className="mr-2 h-4 w-4" />
            Documentación
          </TabsTrigger>
          <TabsTrigger value="community">
            <MessageSquare className="mr-2 h-4 w-4" />
            Comunidad
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="academy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>HiperFlow Academy</CardTitle>
              <CardDescription>
                Cursos y guías para dominar la plataforma, desde lo básico hasta lo más avanzado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {academyCourses.map(course => (
                    <Card key={course.title} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline">{course.level}</Badge>
                                <span>{course.duration}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                             <div className="flex flex-wrap gap-2">
                                {course.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Comenzar Curso</Button>
                        </CardFooter>
                    </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Centro de Soporte</CardTitle>
                    <CardDescription>
                        Crea un ticket o revisa el estado de tus solicitudes de soporte.
                    </CardDescription>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Ticket
                </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asunto</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Última Actualización</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No tienes tickets de soporte activos.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="docs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentación y Recursos</CardTitle>
              <CardDescription>
                Guías técnicas, referencias de API y ejemplos para desarrolladores y usuarios avanzados.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Buscar en la documentación... (Ej: 'API de Webhooks')" className="pl-10 text-lg" />
                </div>
              <p className="text-center text-muted-foreground p-8">El contenido de la documentación estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
         <TabsContent value="community" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Foro de la Comunidad</CardTitle>
                <CardDescription>
                  Comparte ideas, haz preguntas y conecta con otros usuarios de HiperFlow.
                </CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Iniciar Discusión
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-8">El foro de la comunidad estará disponible próximamente.</p>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </>
  );
}
