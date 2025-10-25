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
import type { Contact, Company } from '@/lib/types';
import { WithId } from '@/firebase';

interface ContactFormProps {
  onSave: (contact: Partial<Contact>) => void;
  onCancel: () => void;
  companies: WithId<Company>[];
  contact?: WithId<Contact> | null;
}

export function ContactForm({ onSave, onCancel, companies, contact }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    companyId: '',
    companyName: '', // New field for text input
  });

  useEffect(() => {
    if (contact) {
      const company = companies.find(c => c.id === contact.companyId);
      setFormData({
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        jobTitle: contact.jobTitle || '',
        companyId: contact.companyId || '',
        companyName: company?.name || '', // Populate company name
      });
    } else {
        // Reset form for new contact
        setFormData({
            name: '',
            email: '',
            phone: '',
            jobTitle: '',
            companyId: '',
            companyName: '',
        });
    }
  }, [contact, companies]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically have logic to find or create a company
    // For now, we'll just pass the name. A more robust solution would be needed.
    const contactData: Partial<Contact> & { companyName?: string } = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      jobTitle: formData.jobTitle,
      // This is a simplified logic. In a real app, you'd check if a company
      // with `formData.companyName` exists, get its ID, or create a new one.
      // For now, we are not setting companyId directly from the text input.
      companyName: formData.companyName,
    };
    onSave(contactData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Cliente</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej: Ana Contreras"
          required
        />
      </div>

       <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Ej: ana.c@ejemplo.com"
          required
        />
      </div>

       <div className="space-y-2">
        <Label htmlFor="phone">Teléfono (opcional)</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Ej: +56 9 1234 5678"
        />
      </div>

       <div className="space-y-2">
        <Label htmlFor="jobTitle">Cargo (opcional)</Label>
        <Input
          id="jobTitle"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          placeholder="Ej: Gerente de Marketing"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">Empresa (opcional)</Label>
        <Input
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Escribe para buscar o crear una empresa"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar Cliente</Button>
      </div>
    </form>
  );
}
