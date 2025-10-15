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
    avatarUrl: 'https://picsum.photos/seed/10/40/40' // default
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        jobTitle: contact.jobTitle || '',
        companyId: contact.companyId || '',
        avatarUrl: contact.avatarUrl || 'https://picsum.photos/seed/10/40/40'
      });
    } else {
        // Reset form for new contact
        setFormData({
            name: '',
            email: '',
            phone: '',
            jobTitle: '',
            companyId: '',
            avatarUrl: `https://picsum.photos/seed/${Math.floor(Math.random() * 100)}/40/40`
        });
    }
  }, [contact]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value === 'ninguna' ? '' : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contactData: Partial<Contact> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      jobTitle: formData.jobTitle,
      companyId: formData.companyId,
      avatarUrl: formData.avatarUrl,
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
        <Label htmlFor="companyId">Empresa (opcional)</Label>
        <Select
          name="companyId"
          value={formData.companyId || 'ninguna'}
          onValueChange={(value) => handleSelectChange('companyId', value)}
        >
          <SelectTrigger id="companyId">
            <SelectValue placeholder="Selecciona una empresa" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="ninguna">Ninguna</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
