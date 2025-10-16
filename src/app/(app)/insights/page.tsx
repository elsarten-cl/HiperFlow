'use client';

import { useMemo, useState } from 'react';
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
} from 'lucide-react';
import { subDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { es } from 'date-fns/locale';

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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

export default function InsightsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });
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

    const startDate = dateRange?.from || new Date();
    const endDate = dateRange?.to || new Date();
    const dateRangeText = `${format(startDate, 'LLL dd, y')} - ${format(endDate, 'LLL dd, y')}`

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
  }, [deals, contacts, tasks, dateRange]);

  const isLoading = isLoadingDeals || isLoadingContacts || isLoadingTasks;

  return (
    <>
      <PageHeader
        title="HiperFlow Insights"
        description="Convierte los datos de tu CRM en conocimiento. Visualiza tu progreso, mide tu rendimiento y optimiza tus resultados."
      >
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Elige una fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
      </PageHeader>

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
