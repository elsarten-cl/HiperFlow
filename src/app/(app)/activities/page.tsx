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
import { activities, contacts, deals } from '@/lib/data';
import { Activity } from '@/lib/types';
import { Mail, Phone, StickyNote, Video } from 'lucide-react';

const activityIcons: Record<Activity['type'], React.ElementType> = {
  Email: Mail,
  Llamada: Phone,
  Reunión: Video,
  Nota: StickyNote,
};

export default function ActivitiesPage() {
  const contactMap = new Map(contacts.map((c) => [c.id, c.name]));
  const dealMap = new Map(deals.map((d) => [d.id, d.title]));

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
              {activities.map((activity) => {
                const Icon = activityIcons[activity.type];
                return (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline">{activity.type}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {contactMap.get(activity.contactId) || '-'}
                    </TableCell>
                    <TableCell>
                      {(activity.dealId && dealMap.get(activity.dealId)) || '-'}
                    </TableCell>
                    <TableCell>
                      <span className="truncate block max-w-xs">{activity.notes}</span>
                    </TableCell>
                    <TableCell>
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
