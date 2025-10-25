'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Contact, Company } from '@/lib/types';
import { WithId } from '@/firebase';
import { normalizePhoneNumber } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ContactFormProps {
  onSave: (contact: Partial<Contact> & { companyName?: string }) => void;
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
    companyName: '',
  });
  const [phoneHelperText, setPhoneHelperText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (contact) {
      const company = companies.find(c => c.id === contact.companyId);
      setFormData({
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        jobTitle: contact.jobTitle || '',
        companyId: contact.companyId || '',
        companyName: company?.name || contact.companyId || '',
      });
    } else {
        setFormData({ name: '', email: '', phone: '', jobTitle: '', companyId: '', companyName: '' });
    }
  }, [contact, companies]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const originalPhone = e.target.value;
    if (!originalPhone) {
        setPhoneHelperText('');
        return;
    }
    const normalized = normalizePhoneNumber(originalPhone);
    if (normalized) {
        setPhoneHelperText(`Se guardará como: ${normalized}`);
    } else {
        setPhoneHelperText('El número no parece tener un formato estándar. Se guardará tal cual.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
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
          onBlur={handlePhoneBlur}
          placeholder="Ej: +56 9 1234 5678"
        />
        {phoneHelperText && <p className="text-xs text-muted-foreground">{phoneHelperText}</p>}
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
