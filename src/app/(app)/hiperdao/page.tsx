
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
import { Plus, Archive, ShieldCheck, Trophy, List, Bot } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const HiperDAOPage = () => {
    return (
        <>
            <PageHeader
                title="HiperDAO"
                description="La voz colectiva del ecosistema. Aquí la comunidad decide qué crear, mejorar o financiar, transformando la colaboración en gobernanza real."
            >
                 <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Propuesta
                </Button>
            </PageHeader>
             <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
                Decidir juntos el futuro de HiperFlow.
            </p>

            <Tabs defaultValue="proposals" className="w-full">
                <ScrollArea>
                    <TabsList className="grid w-full max-w-full grid-flow-col">
                        <TabsTrigger value="proposals">
                            <List className="mr-2 h-4 w-4" />
                            Propuestas
                        </TabsTrigger>
                        <TabsTrigger value="voting">
                            <Trophy className="mr-2 h-4 w-4" />
                            Votaciones
                        </TabsTrigger>
                        <TabsTrigger value="ethics">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Consejo Ético
                        </TabsTrigger>
                        <TabsTrigger value="ledger">
                            <Archive className="mr-2 h-4 w-4" />
                            HiperLedger
                        </TabsTrigger>
                        <TabsTrigger value="rewards">
                            <Bot className="mr-2 h-4 w-4" />
                            Recompensas
                        </TabsTrigger>
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                <TabsContent value="proposals" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Proposals Hub</CardTitle>
                            <CardDescription>Panel de propuestas activas, aprobadas y archivadas.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground p-8">El panel de propuestas estará disponible próximamente.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="voting" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Voting Arena</CardTitle>
                            <CardDescription>Usa tus tokens HFT para votar en las propuestas activas.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground p-8">El sistema de votación estará disponible próximamente.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="ethics" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ethics Council & Validation</CardTitle>
                            <CardDescription>Evaluación automatizada y humana de las propuestas antes de la votación.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground p-8">El consejo ético y el sistema de validación estarán disponibles próximamente.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ledger" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>HiperLedger</CardTitle>
                            <CardDescription>Registro auditable de todas las decisiones tomadas por el DAO.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground p-8">El registro de decisiones estará disponible próximamente.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="rewards" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Flow Impact Rewards</CardTitle>
                            <CardDescription>Sigue tu participación, votos y recompensas obtenidas.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground p-8">El panel de recompensas y participación estará disponible próximamente.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    );
}

export default HiperDAOPage;
