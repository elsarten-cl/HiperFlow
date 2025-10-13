export type Contact = {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  companyId: string;
  avatarUrl: string;
  linkedinProfile?: string;
  lastContacted: string;
  city?: string;
  country?: string;
};

export type Company = {
  id: string;
  name: string;
  domain: string;
  industry: string;
};

export type DealStage = 'Potencial' | 'Contactado' | 'Propuesta' | 'Negociación' | 'Ganado' | 'Perdido';

export type Deal = {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  contactIds: string[];
  companyId: string;
};

export type Activity = {
  id: string;
  type: 'Email' | 'Llamada' | 'Reunión' | 'Nota';
  contactId: string;
  dealId?: string;
  timestamp: string;
  notes: string;
};

export type Message = {
  id: string;
  contactId: string;
  content: string;
  timestamp: string;
  direction: 'incoming' | 'outgoing';
  channel: 'Meta' | 'WhatsApp';
};

export type Conversation = {
  contactId: string;
  messages: Message[];
};
