
'use client';

import React from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { GraduationCap, Edit, Award, Users, BarChart, Plus } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const AcademyPage = () => {
    return (
        <>
            <PageHeader
                title="HiperFlow Academy"
                description="Aprende. Crea. Automatiza. Tu centro de formación en el ecosistema HiperFlow."
            >
                 <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Explorar Rutas de Aprendizaje
                </Button>
            </PageHeader>
             <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
                Fórmate en automatización, IA aplicada, ventas y crecimiento con cursos interactivos, rutas de aprendizaje y certificaciones avaladas por IA.
            </p>

            <Tabs defaultValue="learning-hub" className="w-full">
                <ScrollArea>
                    <TabsList className="grid w-full max-w-full grid-flow-col">
                        <TabsTrigger value="learning-hub">
                            <GraduationCap className="mr-2 h-4 w-4" />
                            Learning Hub
                        </TabsTrigger>
                        <TabsTrigger value="mentor-space">
                            <Edit className="mr-2 h-4 w-4" />
                            Mentor Space
                        </TabsTrigger>
                        <TabsTrigger value="accreditation">
                            <Award className="mr-2 h-4 w-4" />
                            Certificaciones
                        </TabsTrigger>
                        <TabsTrigger value="community">
                            <Users className="mr-2 h-4 w-4" />
                            Comunidad
                        </TabsTrigger>
                        <TabsTrigger value="dashboard">
                            <BarChart className="mr-2 h-4 w-4" />
                            Mi Progreso
                        </TabsTrigger>
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                <TabsContent value="learning-hub" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Catálogo de Cursos</CardTitle>
                            <CardDescription>Explora cursos para dominar cada rincón del ecosistema.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground p-8">Los cursos y rutas de aprendizaje estarán disponibles próximamente.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="mentor-space" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Espacio del Instructor</CardTitle>
                            <CardDescription>Crea y gestiona tus propios cursos con la ayuda de Gemini Mentor.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground p-8">El panel para instructores estará disponible próximamente.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="accreditation" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Centro de Certificaciones</CardTitle>
                            <CardDescription>Visualiza y comparte tus logros y certificaciones oficiales.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground p-8">Tu historial de certificaciones aparecerá aquí.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="community" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Comunidad de Aprendizaje</CardTitle>
                            <CardDescription>Conecta, comparte y aprende con otros miembros de HiperFlow.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground p-8">El foro de la comunidad y los retos mensuales estarán disponibles próximamente.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="dashboard" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mi Panel de Progreso</CardTitle>
                            <CardDescription>Sigue tu evolución, cursos completados y puntos obtenidos.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground p-8">Tus métricas de aprendizaje y progreso se mostrarán aquí.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    );
}

export default AcademyPage;
