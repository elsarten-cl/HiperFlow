'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Task, Contact, Deal } from '@/lib/types';
import { WithId } from '@/firebase';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { serverTimestamp } from 'firebase/firestore';

interface TaskFormProps {
  onSave: (task: Partial<Task>) => void;
  onCancel: () => void;
  contacts: WithId<Contact>[];
  deals: WithId<Deal>[];
  task?: Partial<Task>;
  userId: string;
}

export function TaskForm({ onSave, onCancel, contacts, deals, task, userId }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    contactId: task?.contactId || '',
    dealId: task?.dealId || '',
    priority: task?.priority || 'media',
    dueDate: task?.dueDate ? new Date(task.dueDate as any) : undefined,
  });

  useEffect(() => {
    if (task) {
        setFormData({
            title: task.title || '',
            description: task.description || '',
            contactId: task.contactId || '',
            dealId: task.dealId || '',
            priority: task.priority || 'media',
            dueDate: task.dueDate ? new Date(task.dueDate as any) : undefined,
        });
    }
  }, [task]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({...prev, dueDate: date}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData: Partial<Task> = {
      ...formData,
      status: 'pendiente',
      assignedTo: userId,
      teamId: 'team-1', // Hardcoded for now
      updatedAt: serverTimestamp(),
      ...(task?.id ? {} : { createdAt: serverTimestamp() }),
    };
    onSave(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título de la Tarea</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ej: Llamada de seguimiento"
          required
        />
      </div>

       <div className="space-y-2">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Ej: Discutir propuesta y próximos pasos."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contactId">Contacto (opcional)</Label>
        <Select
          name="contactId"
          value={formData.contactId}
          onValueChange={(value) => handleSelectChange('contactId', value)}
        >
          <SelectTrigger id="contactId">
            <SelectValue placeholder="Selecciona un contacto" />
          </SelectTrigger>
          <SelectContent>
            {contacts.map((contact) => (
              <SelectItem key={contact.id} value={contact.id}>
                {contact.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

       <div className="space-y-2">
        <Label htmlFor="dealId">Oportunidad (opcional)</Label>
        <Select
          name="dealId"
          value={formData.dealId}
          onValueChange={(value) => handleSelectChange('dealId', value)}
        >
          <SelectTrigger id="dealId">
            <SelectValue placeholder="Selecciona una oportunidad" />
          </SelectTrigger>
          <SelectContent>
            {deals.map((deal) => (
              <SelectItem key={deal.id} value={deal.id}>
                {deal.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Prioridad</Label>
          <Select
            name="priority"
            value={formData.priority}
            onValueChange={(value) => handleSelectChange('priority', value)}
          >
            <SelectTrigger id="priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baja">Baja</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="dueDate">Fecha Límite</Label>
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Elige una fecha</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={handleDateChange}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar Tarea</Button>
      </div>
    </form>
  );
}
