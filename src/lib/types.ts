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
  timestamp: string | FieldValue | Timestamp;
  notes: string;
  teamId: string;
};

export type Message = {
  id: string;
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

export type Automation = {
  id: string;
  name: string;
  teamId: string;
  platform: 'make' | 'n8n' | 'other';
  status: 'active' | 'inactive';
  webhookUrl: string;
  lastRun?: Timestamp | FieldValue;
  lastRunStatus?: 'success' | 'error';
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export type SocialPostStatus = 'draft' | 'scheduled' | 'published' | 'error';
export type SocialPostPlatform = 'Facebook' | 'Instagram' | 'LinkedIn' | 'TikTok';

export type SocialPost = {
  id: string;
  teamId: string;
  content: string;
  imageUrl?: string;
  targetPlatform: SocialPostPlatform;
  status: SocialPostStatus;
  scheduledAt: Timestamp | FieldValue;
  publishedAt?: Timestamp | FieldValue;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
};

export type ClientProfile = {
  id: string;
  contactId: string;
  teamId: string;
  theme?: 'light' | 'dark';
  language?: 'en' | 'es';
  notifications?: {
    newInvoice?: boolean;
    projectUpdate?: boolean;
  };
  lastLogin?: FieldValue | Timestamp;
  createdAt: FieldValue | Timestamp;
  updatedAt: FieldValue | Timestamp;
};

export type DaoProposal = {
    id: string;
    authorId: string;
    title: string;
    category: 'new_module_integration' | 'economy_rewards_change' | 'strategic_alliance' | 'ethical_transparency_rule';
    summary: string;
    status: 'draft' | 'pending_validation' | 'active_voting' | 'approved' | 'rejected' | 'implemented' | 'archived';
    createdAt: FieldValue | Timestamp;
    votingStartsAt?: FieldValue | Timestamp;
    votingEndsAt: FieldValue | Timestamp;
    tokensStaked?: number;
};

export type DaoVote = {
    id: string;
    proposalId: string;
    userId: string;
    vote: 'yes' | 'no' | 'abstain';
    tokensUsed: number;
    votedAt: FieldValue | Timestamp;
};

export type DaoDecision = {
    id: string;
    proposalId: string;
    result: 'approved' | 'rejected';
    implementationOwner?: string;
    decidedAt: FieldValue | Timestamp;
    totalVotes?: number;
    votesFor?: number;
    votesAgainst?: number;
};

export type InfraUsage = {
  id: string;
  service: 'firestore' | 'functions' | 'storage' | 'hosting' | 'ai';
  metric: string;
  value: number;
  environment: 'dev' | 'staging' | 'production';
  timestamp: FieldValue | Timestamp;
};

export type InfraLog = {
  id: string;
  type: 'deployment' | 'failure' | 'backup' | 'optimization';
  status: 'success' | 'error' | 'in-progress';
  message: string;
  version?: string;
  timestamp: FieldValue | Timestamp;
};
