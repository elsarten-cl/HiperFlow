'use client';

import { PageHeader } from '@/components/page-header';
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
import type { Activity, Contact, Deal } from '@/lib/types';
import { Mail, Phone, StickyNote, Video } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, WithId } from '@/firebase';
import { collection } from 'firebase/firestore';

const activityIcons: Record<string, React.ElementType> = {
  Email: Mail,
  Llamada: Phone,
  Reunión: Video,
  Nota: StickyNote,
  stageChange: StickyNote,
};

export default function ActivitiesPage() {
  const firestore = useFirestore();

  const activitiesRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'activities') : null),
    [firestore]
  );
  const { data: activities, isLoading: isLoadingActivities } = useCollection<Activity>(activitiesRef);

  const contactsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'contacts') : null),
    [firestore]
  );
  const { data: contacts, isLoading: isLoadingContacts } = useCollection<WithId<Contact>>(contactsRef);

  const dealsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'deals') : null),
    [firestore]
  );
  const { data: deals, isLoading: isLoadingDeals } = useCollection<WithId<Deal>>(dealsRef);


  const contactMap = new Map(contacts?.map((c) => [c.id, c.name]));
  const dealMap = new Map(deals?.map((d) => [d.id, d.title]));

  const getTimestamp = (activity: WithId<Activity>) => {
    if (!activity.timestamp) return '';
    if (typeof activity.timestamp === 'string') {
      return new Date(activity.timestamp).toLocaleDateString();
    }
    // Handle Firestore Timestamp object
    if ('seconds' in activity.timestamp && typeof activity.timestamp.seconds === 'number') {
      return new Date(activity.timestamp.seconds * 1000).toLocaleDateString();
    }
    return '';
  }


  return (
    <>
      <PageHeader
        title="Registro de Actividad"
        description="Un registro cronológico de todas las interacciones con tus contactos."
      />
      <Card>
        <CardHeader>
          <CardTitle>Todas las Actividades</CardTitle>
          <CardDescription>
            Navega a través de correos, llamadas, reuniones y notas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Trato</TableHead>
                <TableHead>Notas</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingActivities || isLoadingContacts || isLoadingDeals ? (
                 <TableRow>
                    <TableCell colSpan={5} className="text-center">Cargando actividades...</TableCell>
                 </TableRow>
              ) : (
                activities && activities.map((activity) => {
                const Icon = activity.type ? activityIcons[activity.type] : StickyNote;
                return (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline">{activity.type}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {activity.contactId ? contactMap.get(activity.contactId) : '-'}
                    </TableCell>
                    <TableCell>
                      {(activity.dealId && dealMap.get(activity.dealId)) || '-'}
                    </TableCell>
                    <TableCell>
                      <span className="truncate block max-w-xs">{activity.notes}</span>
                    </TableCell>
                    <TableCell>
                      {getTimestamp(activity)}
                    </TableCell>
                  </TableRow>
                );
              }))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
