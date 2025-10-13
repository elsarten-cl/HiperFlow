import { type Company, type Contact, type Deal, type DealStage, type Conversation, type Activity } from '@/lib/types';
import { serverTimestamp } from 'firebase/firestore';

export const companies: Company[] = [
  { id: 'comp-1', name: 'Innovate Inc.', domain: 'innovateinc.com', industry: 'Tecnología' },
  { id: 'comp-2', name: 'Quantum Solutions', domain: 'quantumsol.com', industry: 'Consultoría' },
  { id: 'comp-3', name: 'Synergy Corp', domain: 'synergy.co', industry: 'Finanzas' },
  { id: 'comp-4', name: 'Apex Logistics', domain: 'apexlog.com', industry: 'Transporte' },
];

export const contacts: Contact[] = [
  { id: 'cont-1', name: 'Alice Johnson', email: 'alice@innovateinc.com', jobTitle: 'Desarrolladora Principal', companyId: 'comp-1', avatarUrl: 'https://picsum.photos/seed/1/40/40', lastContacted: '2024-05-20T10:00:00Z', city: 'San Francisco', country: 'EE.UU.', teamId: 'team-1', createdAt: '2024-05-20T10:00:00Z', updatedAt: '2024-05-20T10:00:00Z' },
  { id: 'cont-2', name: 'Bob Williams', email: 'bob@quantumsol.com', jobTitle: 'Jefe de Proyecto', companyId: 'comp-2', avatarUrl: 'https://picsum.photos/seed/2/40/40', lastContacted: '2024-05-22T14:30:00Z', city: 'Nueva York', country: 'EE.UU.', teamId: 'team-1', createdAt: '2024-05-22T14:30:00Z', updatedAt: '2024-05-22T14:30:00Z' },
  { id: 'cont-3', name: 'Charlie Brown', email: 'charlie@synergy.co', jobTitle: 'Analista Financiero', companyId: 'comp-3', avatarUrl: 'https://picsum.photos/seed/3/40/40', lastContacted: '2024-05-18T09:00:00Z', city: 'Londres', country: 'Reino Unido', teamId: 'team-1', createdAt: '2024-05-18T09:00:00Z', updatedAt: '2024-05-18T09:00:00Z' },
  { id: 'cont-4', name: 'Diana Prince', email: 'diana@apexlog.com', jobTitle: 'Coordinadora de Logística', companyId: 'comp-4', avatarUrl: 'https://picsum.photos/seed/4/40/40', lastContacted: '2024-05-23T11:00:00Z', city: 'Singapur', country: 'Singapur', teamId: 'team-1', createdAt: '2024-05-23T11:00:00Z', updatedAt: '2024-05-23T11:00:00Z' },
  { id: 'cont-5', name: 'Ethan Hunt', email: 'ethan@innovateinc.com', jobTitle: 'Diseñador UX', companyId: 'comp-1', avatarUrl: 'https://picsum.photos/seed/5/40/40', lastContacted: '2024-05-21T16:45:00Z', city: 'San Francisco', country: 'EE.UU.', teamId: 'team-1', createdAt: '2024-05-21T16:45:00Z', updatedAt: '2024-05-21T16:45:00Z' },
];

export const dealStages: DealStage[] = ['potencial', 'contactado', 'propuesta', 'negociacion', 'ganado', 'perdido'];

export const deals: Deal[] = [
  // This data is now fetched from Firestore. This mock data can be removed or kept for reference.
];

export const conversations: Conversation[] = [
  {
    contactId: 'cont-1',
    messages: [
      { id: 'msg-1-1', contactId: 'cont-1', content: 'Hola, ¿podemos agendar una demo para la próxima semana?', timestamp: '2024-05-23T10:00:00Z', direction: 'incoming', channel: 'Meta' },
      { id: 'msg-1-2', contactId: 'cont-1', content: 'Claro, Alice. ¿Te parece bien el martes a las 14:00?', timestamp: '2024-05-23T10:05:00Z', direction: 'outgoing', channel: 'Meta' },
    ],
  },
  {
    contactId: 'cont-2',
    messages: [
      { id: 'msg-2-1', contactId: 'cont-2', content: 'Dando seguimiento a nuestra llamada. Aquí está el documento de la propuesta.', timestamp: '2024-05-22T14:30:00Z', direction: 'outgoing', channel: 'WhatsApp' },
      { id: 'msg-2-2', contactId: 'cont-2', content: 'Gracias, Bob. Lo revisaremos y te contactaremos.', timestamp: '2024-05-22T15:00:00Z', direction: 'incoming', channel: 'WhatsApp' },
    ],
  },
  {
    contactId: 'cont-3',
    messages: [
      { id: 'msg-3-1', contactId: 'cont-3', content: 'Una pregunta rápida sobre la factura #5821.', timestamp: '2024-05-24T09:15:00Z', direction: 'incoming', channel: 'Meta' },
    ],
  },
];

export const activities: Activity[] = [
    { id: 'act-1', type: 'Email', contactId: 'cont-1', dealId: 'deal-1', timestamp: '2024-05-20T10:00:00Z', notes: 'Envié la propuesta inicial para el rediseño del sitio web.' },
    { id: 'act-2', type: 'Llamada', contactId: 'cont-2', dealId: 'deal-2', timestamp: '2024-05-22T14:30:00Z', notes: 'Discutimos los términos para la consultoría del Q3. Seguimiento la próxima semana.' },
    { id: 'act-3', type: 'Reunión', contactId: 'cont-1', dealId: 'deal-1', timestamp: '2024-05-23T11:00:00Z', notes: 'Demo de nuestra plataforma. El cliente quedó impresionado con las características.' },
    { id: 'act-4', type: 'Nota', contactId: 'cont-4', timestamp: '2024-05-23T15:00:00Z', notes: 'El contacto está de vacaciones hasta el 1 de junio.' },
    { id: 'act-5', type: 'Email', contactId: 'cont-3', dealId: 'deal-3', timestamp: '2024-05-18T09:00:00Z', notes: 'Confirmé la finalización de la auditoría anual.' },
];
