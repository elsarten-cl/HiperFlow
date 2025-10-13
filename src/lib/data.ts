import { type Company, type Contact, type Deal, type DealStage, type Conversation, type Activity } from '@/lib/types';

export const companies: Company[] = [
  { id: 'comp-1', name: 'Innovate Inc.', domain: 'innovateinc.com', industry: 'Technology' },
  { id: 'comp-2', name: 'Quantum Solutions', domain: 'quantumsol.com', industry: 'Consulting' },
  { id: 'comp-3', name: 'Synergy Corp', domain: 'synergy.co', industry: 'Finance' },
  { id: 'comp-4', name: 'Apex Logistics', domain: 'apexlog.com', industry: 'Transportation' },
];

export const contacts: Contact[] = [
  { id: 'cont-1', name: 'Alice Johnson', email: 'alice@innovateinc.com', jobTitle: 'Lead Developer', companyId: 'comp-1', avatarUrl: 'https://picsum.photos/seed/1/40/40', lastContacted: '2024-05-20T10:00:00Z', city: 'San Francisco', country: 'USA' },
  { id: 'cont-2', name: 'Bob Williams', email: 'bob@quantumsol.com', jobTitle: 'Project Manager', companyId: 'comp-2', avatarUrl: 'https://picsum.photos/seed/2/40/40', lastContacted: '2024-05-22T14:30:00Z', city: 'New York', country: 'USA' },
  { id: 'cont-3', name: 'Charlie Brown', email: 'charlie@synergy.co', jobTitle: 'Financial Analyst', companyId: 'comp-3', avatarUrl: 'https://picsum.photos/seed/3/40/40', lastContacted: '2024-05-18T09:00:00Z', city: 'London', country: 'UK' },
  { id: 'cont-4', name: 'Diana Prince', email: 'diana@apexlog.com', jobTitle: 'Logistics Coordinator', companyId: 'comp-4', avatarUrl: 'https://picsum.photos/seed/4/40/40', lastContacted: '2024-05-23T11:00:00Z', city: 'Singapore', country: 'Singapore' },
  { id: 'cont-5', name: 'Ethan Hunt', email: 'ethan@innovateinc.com', jobTitle: 'UX Designer', companyId: 'comp-1', avatarUrl: 'https://picsum.photos/seed/5/40/40', lastContacted: '2024-05-21T16:45:00Z', city: 'San Francisco', country: 'USA' },
];

export const dealStages: DealStage[] = ['Lead', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Lost'];

export const deals: Deal[] = [
  { id: 'deal-1', title: 'Website Redesign Project', value: 25000, stage: 'Proposal', contactIds: ['cont-1', 'cont-5'], companyId: 'comp-1' },
  { id: 'deal-2', title: 'Q3 Management Consulting', value: 50000, stage: 'Negotiation', contactIds: ['cont-2'], companyId: 'comp-2' },
  { id: 'deal-3', title: 'Annual Financial Audit', value: 15000, stage: 'Won', contactIds: ['cont-3'], companyId: 'comp-3' },
  { id: 'deal-4', title: 'Supply Chain Optimization', value: 35000, stage: 'Contacted', contactIds: ['cont-4'], companyId: 'comp-4' },
  { id: 'deal-5', title: 'New Mobile App UI/UX', value: 42000, stage: 'Lead', contactIds: ['cont-5'], companyId: 'comp-1' },
  { id: 'deal-6', title: 'Data Analytics Platform', value: 75000, stage: 'Proposal', contactIds: ['cont-2'], companyId: 'comp-2' },
  { id: 'deal-7', title: 'Logistics Fleet Upgrade', value: 120000, stage: 'Lost', contactIds: ['cont-4'], companyId: 'comp-4' },
];

export const conversations: Conversation[] = [
  {
    contactId: 'cont-1',
    messages: [
      { id: 'msg-1-1', contactId: 'cont-1', content: 'Hi, can we schedule a demo for next week?', timestamp: '2024-05-23T10:00:00Z', direction: 'incoming', channel: 'Meta' },
      { id: 'msg-1-2', contactId: 'cont-1', content: 'Certainly, Alice. Does Tuesday at 2 PM work for you?', timestamp: '2024-05-23T10:05:00Z', direction: 'outgoing', channel: 'Meta' },
    ],
  },
  {
    contactId: 'cont-2',
    messages: [
      { id: 'msg-2-1', contactId: 'cont-2', content: 'Following up on our call. Here is the proposal document.', timestamp: '2024-05-22T14:30:00Z', direction: 'outgoing', channel: 'WhatsApp' },
      { id: 'msg-2-2', contactId: 'cont-2', content: 'Thanks, Bob. We will review it and get back to you.', timestamp: '2024-05-22T15:00:00Z', direction: 'incoming', channel: 'WhatsApp' },
    ],
  },
  {
    contactId: 'cont-3',
    messages: [
      { id: 'msg-3-1', contactId: 'cont-3', content: 'Quick question about invoice #5821.', timestamp: '2024-05-24T09:15:00Z', direction: 'incoming', channel: 'Meta' },
    ],
  },
];

export const activities: Activity[] = [
    { id: 'act-1', type: 'Email', contactId: 'cont-1', dealId: 'deal-1', timestamp: '2024-05-20T10:00:00Z', notes: 'Sent initial proposal for website redesign.' },
    { id: 'act-2', type: 'Call', contactId: 'cont-2', dealId: 'deal-2', timestamp: '2024-05-22T14:30:00Z', notes: 'Discussed terms for Q3 consulting. Follow up next week.' },
    { id: 'act-3', type: 'Meeting', contactId: 'cont-1', dealId: 'deal-1', timestamp: '2024-05-23T11:00:00Z', notes: 'Demo of our platform. Client was impressed with the features.' },
    { id: 'act-4', type: 'Note', contactId: 'cont-4', timestamp: '2024-05-23T15:00:00Z', notes: 'Contact is on vacation until June 1st.' },
    { id: 'act-5', type: 'Email', contactId: 'cont-3', dealId: 'deal-3', timestamp: '2024-05-18T09:00:00Z', notes: 'Confirmed completion of the annual audit.' },
];
