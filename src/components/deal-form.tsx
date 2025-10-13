'use client';

import { useState } from 'react';
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
import type { Deal, Contact, Company } from '@/lib/types';
import { WithId } from '@/firebase';

interface DealFormProps {
  onSave: (deal: Partial<Deal>) => void;
  onCancel: () => void;
  contacts: WithId<Contact>[];
  companies: WithId<Company>[];
  deal?: Partial<Deal>;
}

export function DealForm({ onSave, onCancel, contacts, companies, deal }: DealFormProps) {
  const [formData, setFormData] = useState({
    title: deal?.title || '',
    contactId: deal?.contact?.id || '',
    companyId: deal?.company?.id || '',
    amount: deal?.amount || 0,
    currency: deal?.currency || 'CLP',
    nextAction: deal?.nextAction || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedContact = contacts.find((c) => c.id === formData.contactId);
    const selectedCompany = companies.find((c) => c.id === formData.companyId);

    const dealData: Partial<Deal> = {
      title: formData.title,
      amount: Number(formData.amount),
      currency: formData.currency as 'CLP' | 'USD',
      nextAction: formData.nextAction,
      contact: selectedContact ? { id: selectedContact.id, name: selectedContact.name, email: selectedContact.email } : undefined,
      company: selectedCompany ? { id: selectedCompany.id, name: selectedCompany.name } : undefined,
    };
    onSave(dealData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Nombre del Proyecto o Servicio</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ej: Desarrollo de nuevo e-commerce"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactId">Contacto</Label>
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
        <Label htmlFor="companyId">Empresa (opcional)</Label>
        <Select
          name="companyId"
          value={formData.companyId}
          onValueChange={(value) => handleSelectChange('companyId', value)}
        >
          <SelectTrigger id="companyId">
            <SelectValue placeholder="Selecciona una empresa" />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Monto Estimado</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            placeholder="2,500,000"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Moneda</Label>
          <Select
            name="currency"
            value={formData.currency}
            onValueChange={(value) => handleSelectChange('currency', value)}
          >
            <SelectTrigger id="currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CLP">CLP</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nextAction">Próxima Acción (opcional)</Label>
        <Textarea
          id="nextAction"
          name="nextAction"
          value={formData.nextAction}
          onChange={handleChange}
          placeholder="Ej: Llamada de seguimiento el 25 de Oct"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar Oportunidad</Button>
      </div>
    </form>
  );
}
