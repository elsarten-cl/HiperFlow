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
import { Switch } from '@/components/ui/switch';
import type { Automation } from '@/lib/types';
import { serverTimestamp } from 'firebase/firestore';

interface AutomationFormProps {
  onSave: (data: Partial<Automation>) => void;
  onCancel: () => void;
  automation?: Partial<Automation>;
  teamId: string;
}

export function AutomationForm({
  onSave,
  onCancel,
  automation,
  teamId,
}: AutomationFormProps) {
  const [formData, setFormData] = useState({
    name: automation?.name || '',
    platform: automation?.platform || 'make',
    webhookUrl: automation?.webhookUrl || '',
    status: automation?.status || 'inactive',
  });

  useEffect(() => {
    if (automation) {
      setFormData({
        name: automation.name || '',
        platform: automation.platform || 'make',
        webhookUrl: automation.webhookUrl || '',
        status: automation.status || 'inactive',
      });
    } else {
      // Reset for new
       setFormData({
        name: '',
        platform: 'make',
        webhookUrl: '',
        status: 'inactive',
      });
    }
  }, [automation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      teamId,
      updatedAt: serverTimestamp(),
      ...(automation?.id ? {} : { createdAt: serverTimestamp() }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Flujo</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Sincronizar nuevo lead con Google Sheets"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="platform">Plataforma</Label>
        <Select
          value={formData.platform}
          onValueChange={(value) =>
            setFormData({ ...formData, platform: value as 'make' | 'n8n' | 'other' })
          }
        >
          <SelectTrigger id="platform">
            <SelectValue placeholder="Selecciona una plataforma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="make">Make.com</SelectItem>
            <SelectItem value="n8n">n8n</SelectItem>
            <SelectItem value="other">Otro (Webhook)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="webhookUrl">URL del Webhook</Label>
        <Input
          id="webhookUrl"
          type="url"
          value={formData.webhookUrl}
          onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
          placeholder="https://hook.make.com/..."
          required
        />
      </div>
       <div className="flex items-center space-x-2">
        <Switch
            id="status"
            checked={formData.status === 'active'}
            onCheckedChange={(checked) => setFormData({...formData, status: checked ? 'active' : 'inactive'})}
        />
        <Label htmlFor="status">Activar Flujo</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar Automatización</Button>
      </div>
    </form>
  );
};
