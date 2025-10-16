'use client';

import { useMemo, useState } from 'react';
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from 'recharts';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  WithId,
} from '@/firebase';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import type { Deal, Contact, Task } from '@/lib/types';
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  Users,
  CheckCircle,
  TrendingUp,
  Calendar as CalendarIcon,
  Send,
  Bot,
  Lightbulb,
  BookOpen,
} from 'lucide-react';
import { subDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const CHART_COLORS = {
  ganado: 'hsl(var(--chart-2))',
  perdido: 'hsl(var(--destructive))',
  negociacion: 'hsl(var(--chart-4))',
  propuesta: 'hsl(var(--chart-3))',
  contactado: 'hsl(var(--chart-1))',
  potencial: 'hsl(var(--muted-foreground))',
};

const KpiCard = ({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
}) => {
  const isPositive = change >= 0;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          {change !== 0 &&
            (isPositive ? (
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
            ))}
          <span
            className={
              isPositive ? 'text-green-500' : 'text-red-500'
            }
          >
            {change.toFixed(2)}%
          </span>{' '}
          vs período anterior
        </p>
      </CardContent>
    </Card>
  );
};


const FlowAICopilot = () => {
    const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hola, soy tu FlowAI Copilot. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    // Placeholder for AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: "Actualmente estoy en desarrollo, pero pronto podré ayudarte a analizar tus datos, crear tareas y mucho más." }]);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Left Panel: Learning Center */}
      <Card className="hidden lg:flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Aprende HiperFlow
          </CardTitle>
          <CardDescription>Guías y tutoriales para sacar el máximo provecho de tu CRM.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <Input placeholder="¿Cómo hago para...?" />
           <Separator />
          <p className="text-sm text-muted-foreground italic text-center py-8">
            El centro de aprendizaje se está construyendo.
          </p>
        </CardContent>
      </Card>

      {/* Center Panel: Chat */}
      <main className="lg:col-span-2 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardContent className="p-0 flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : '')}>
                    {msg.role === 'assistant' && (
                      <div className="bg-primary/20 p-2 rounded-full">
                        <Bot className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <div className={cn(
                      "rounded-lg px-4 py-2 max-w-sm",
                      msg.role === 'assistant' ? 'bg-card' : 'bg-primary text-primary-foreground'
                    )}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="border-t p-4 flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregúntame cualquier cosa sobre tus ventas, clientes o tareas..."
                className="flex-1"
              />
              <Button type="submit">
                <Send className="h-4 w-4" />
                <span className="sr-only">Enviar</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Right Panel: Recommendations (Placeholder on smaller screens) */}
      <Card className="lg:hidden">
         <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-yellow-400" />
            Sugerencias IA
          </CardTitle>
        </CardHeader>
        <CardContent>
           <p className="text-sm text-muted-foreground italic text-center py-4">
            Las sugerencias dinámicas aparecerán aquí.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const MetricsDashboard = ({ date, onDateChange }: { date: { from: Date | undefined; to: Date | undefined }, onDateChange: (date: { from: Date | undefined; to: Date | undefined }) => void}) => {
  const firestore = useFirestore();
  const teamId = 'team-1'; // Hardcoded for now

  // --- Data Fetching ---
  const dealsRef = useMemoFirebase(
    () =>
      firestore ? query(collection(firestore, 'deals'), where('teamId', '==', teamId)) : null,
    [firestore, teamId]
  );
  const { data: deals, isLoading: isLoadingDeals } = useCollection<Deal>(dealsRef);

  const contactsRef = useMemoFirebase(
    () =>
      firestore ? query(collection(firestore, 'contacts'), where('teamId', '==', teamId)) : null,
    [firestore, teamId]
  );
  const { data: contacts, isLoading: isLoadingContacts } =
    useCollection<Contact>(contactsRef);

  const tasksRef = useMemoFirebase(
    () =>
      firestore ? query(collection(firestore, 'tasks'), where('teamId', '==', teamId)) : null,
    [firestore, teamId]
  );
  const { data: tasks, isLoading: isLoadingTasks } = useCollection<Task>(tasksRef);

  // --- Data Processing ---
  const { kpis, evolutionData, stageDistribution, dateRangeText } = useMemo(() => {
    if (!deals || !contacts || !tasks) {
      return { kpis: {}, evolutionData: [], stageDistribution: [], dateRangeText: '' };
    }

    const startDate = date.from || new Date(0);
    const endDate = date.to || new Date();
    const dateRangeText = `${format(startDate, 'd LLL, y', { locale: es })} - ${format(endDate, 'd LLL, y', { locale: es })}`

    const filteredDeals = deals.filter(d => {
        const createdAt = (d.createdAt as Timestamp)?.toDate();
        return createdAt && createdAt >= startDate && createdAt <= endDate;
    });

    const wonDeals = filteredDeals.filter((d) => d.stage === 'ganado');
    const totalSales = wonDeals.reduce((sum, deal) => sum + deal.amount, 0);
    const conversionRate =
      filteredDeals.length > 0
        ? (wonDeals.length / filteredDeals.length) * 100
        : 0;

    const newContacts = contacts.filter(c => {
        const createdAt = (c.createdAt as Timestamp)?.toDate();
        return createdAt && createdAt >= startDate && createdAt <= endDate;
    }).length;

    const completedTasks = tasks.filter(t => t.status === 'completada' && 
        ((t.updatedAt as Timestamp)?.toDate() >= startDate && (t.updatedAt as Timestamp)?.toDate() <= endDate)
    ).length;

    const kpis = {
      totalSales,
      conversionRate,
      newContacts,
      completedTasks,
    };

    const evolutionData = [
      { name: 'Ganadas', value: wonDeals.length },
      { name: 'Perdidas', value: filteredDeals.filter(d => d.stage === 'perdido').length },
      { name: 'En Negociación', value: filteredDeals.filter(d => d.stage === 'negociacion').length },
    ];
    
    const stageDist = deals.reduce((acc, deal) => {
        acc[deal.stage] = (acc[deal.stage] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const stageDistribution = Object.entries(stageDist).map(([name, value]) => ({ name, value, fill: CHART_COLORS[name as keyof typeof CHART_COLORS] || '#ccc' }));

    return { kpis, evolutionData, stageDistribution, dateRangeText };
  }, [deals, contacts, tasks, date.from, date.to]);

  const isLoading = isLoadingDeals || isLoadingContacts || isLoadingTasks;

  return (
    <>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Ventas Totales"
          value={new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
          }).format(kpis.totalSales || 0)}
          change={12} // Placeholder
          icon={DollarSign}
        />
        <KpiCard
          title="Tasa de Conversión"
          value={`${(kpis.conversionRate || 0).toFixed(1)}%`}
          change={5.2} // Placeholder
          icon={TrendingUp}
        />
        <KpiCard
          title="Nuevos Clientes"
          value={`${kpis.newContacts || 0}`}
          change={20} // Placeholder
          icon={Users}
        />
        <KpiCard
          title="Actividades Completadas"
          value={`${kpis.completedTasks || 0}`}
          change={-3} // Placeholder
          icon={CheckCircle}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Evolución de Oportunidades</CardTitle>
            <CardDescription>
             {`Resumen de oportunidades ganadas, perdidas y en negociación para el período: ${dateRangeText}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={{}} className="h-[300px] w-full">
              <BarChart data={evolutionData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="value" radius={8}>
                    <Cell fill={CHART_COLORS.ganado} />
                    <Cell fill={CHART_COLORS.perdido} />
                    <Cell fill={CHART_COLORS.negociacion} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Distribución de Etapas del Flow</CardTitle>
            <CardDescription>Distribución actual de todas tus oportunidades.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={{}} className="h-[300px] w-full">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={stageDistribution} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                    {stageDistribution.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}


export default function IntelligencePage() {
    const [date, setDate] = useState<{ from: Date | undefined, to: Date | undefined }>({
      from: subDays(new Date(), 29),
      to: new Date()
    });
    
  return (
    <>
      <PageHeader
        title="HiperFlow Intelligence"
        description="Conoce el pulso real de tu negocio. Analiza, predice y decide con datos en tiempo real impulsados por IA."
      >
        <div className="flex items-center gap-4">
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    id="date-from"
                    variant={"outline"}
                    className={cn(
                    "w-[260px] justify-start text-left font-normal",
                    !date.from && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {"Desde: "}
                    {date.from ? (
                        format(date.from, "d 'de' LLL, y", { locale: es })
                        ) : (
                        <span>Elige una fecha</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    initialFocus
                    mode="single"
                    defaultMonth={date.from}
                    selected={date.from}
                    onSelect={(selectedDate) => {
                        setDate(prev => ({ ...prev, from: selectedDate }));
                    }}
                    numberOfMonths={1}
                    locale={es}
                />
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    id="date-to"
                    variant={"outline"}
                    className={cn(
                    "w-[260px] justify-start text-left font-normal",
                    !date.to && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {"Hasta: "}
                    {date.to ? (
                        format(date.to, "d 'de' LLL, y", { locale: es })
                        ) : (
                        <span>Elige una fecha</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    initialFocus
                    mode="single"
                    defaultMonth={date.to}
                    selected={date.to}
                    onSelect={(selectedDate) => {
                        setDate(prev => ({ ...prev, to: selectedDate }));
                    }}
                    numberOfMonths={1}
                    locale={es}
                />
                </PopoverContent>
            </Popover>
        </div>
      </PageHeader>
       <p className="text-muted-foreground -mt-4 mb-8 text-sm md:text-base">
        Este módulo centraliza la información clave de tu CRM: ventas, clientes, campañas y actividades. Usa IA para identificar patrones, predecir resultados y sugerir acciones que mejoren tu rendimiento comercial.
      </p>
      
      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
            <TabsTrigger value="flow-ai">FlowAI Copilot</TabsTrigger>
        </TabsList>
        <TabsContent value="metrics" className="mt-6">
            <MetricsDashboard date={date} onDateChange={setDate} />
        </TabsContent>
        <TabsContent value="flow-ai" className="mt-6 h-[calc(100vh-20rem)]">
            <FlowAICopilot />
        </TabsContent>
      </Tabs>
    </>
  );
}
