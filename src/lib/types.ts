import { FieldValue, Timestamp } from "firebase/firestore";

export type Contact = {
  id: string;
  name: string;
  email: string;
  jobTitle?: string;
  companyId: string;
  phone?: string;
  socials?: string[];
  lastContacted: string | Timestamp;
  city?: string;
  country?: string;
  teamId: string;
  createdAt: string | Timestamp | FieldValue;
  updatedAt: string | Timestamp | FieldValue;
  source?: string;
  mainInterest?: string;
  interestLevel?: 'bajo' | 'medio' | 'alto';
  internalNotes?: string;
  nextStep?: string;
};

export type Company = {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  teamId: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

export type DealStage = 'potencial' | 'contactado' | 'propuesta' | 'negociacion' | 'ganado' | 'perdido';

export type Deal = {
  id: string;
  title: string;
  teamId: string;
  stage: DealStage;
  amount: number;
  currency: "CLP" | "USD";
  contact?: {
    id: string;
    name: string;
    email?: string;
  };
  company?: {
    id: string;
    name: string;
  };
  lastActivity: string | Timestamp | FieldValue;
  nextAction?: string;
  priority?: "alta" | "media" | "baja";
  ownerId: string;
  status: "activo" | "cerrado" | "descartado";
  createdAt: FieldValue | Timestamp;
  updatedAt: FieldValue | Timestamp;
};


export type Activity = {
  id: string;
  type: 'Email' | 'Llamada' | 'Reunión' | 'Nota' | 'stageChange';
  contactId: string;
  dealId?: string;
  timestamp: FieldValue | Timestamp;
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

export type TaskStatus = 'pendiente' | 'en curso' | 'completada';
export type TaskPriority = 'baja' | 'media' | 'alta';

export type Task = {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string | Timestamp | FieldValue;
    contactId?: string;
    companyId?: string;
    dealId?: string;
    assignedTo: string; // userId
    teamId: string;
    createdAt: FieldValue | Timestamp;
    updatedAt: FieldValue | Timestamp;
};
