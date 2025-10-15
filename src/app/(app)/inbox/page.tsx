'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { companies, contacts, conversations } from '@/lib/data';
import type { Conversation, Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, UserCircle, MessageSquare, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const companyMap = new Map(companies.map((c) => [c.id, c.name]));

const ConversationList = ({
  onSelectConversation,
  selectedContactId,
}: {
  onSelectConversation: (contactId: string) => void;
  selectedContactId: string | null;
}) => (
  <div className="flex flex-col gap-2">
    {conversations.map((convo) => {
      const contact = contacts.find((c) => c.id === convo.contactId);
      const lastMessage = convo.messages[convo.messages.length - 1];
      if (!contact) return null;
      return (
        <button
          key={contact.id}
          onClick={() => onSelectConversation(contact.id)}
          className={cn(
            'flex items-start gap-4 rounded-lg p-3 text-left transition-colors hover:bg-muted/50 w-full',
            selectedContactId === contact.id && 'bg-muted'
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <UserCircle />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-semibold truncate">{contact.name}</p>
            <p className="text-sm text-muted-foreground truncate">
              {lastMessage.content}
            </p>
          </div>
          <span className="text-xs text-muted-foreground ml-auto">
            {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </button>
      );
    })}
  </div>
);

const MessageView = ({ conversation }: { conversation: Conversation | undefined }) => {
  const contact = contacts.find((c) => c.id === conversation?.contactId);

  if (!conversation || !contact) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No se ha seleccionado ninguna conversación</h3>
        <p className="text-muted-foreground">Selecciona una conversación de la izquierda para ver los mensajes.</p>
      </div>
    );
  }
  
  const companyName = companyMap.get(contact.companyId);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-4 p-4 border-b">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <UserCircle />
        </div>
        <div>
          <p className="font-semibold">{contact.name}</p>
          <p className="text-sm text-muted-foreground">{contact.jobTitle}{companyName && ` en ${companyName}`}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="icon"><Phone className="h-4 w-4"/></Button>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-4 overflow-y-auto">
        {conversation.messages.map((message: Message) => (
          <div
            key={message.id}
            className={cn(
              'flex max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm',
              message.direction === 'outgoing'
                ? 'ml-auto bg-primary text-primary-foreground'
                : 'bg-muted'
            )}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-center gap-2 border-t p-4">
        <Input placeholder="Escribe un mensaje..." className="flex-1" />
        <Button>
          <Send className="h-4 w-4" />
          <span className="sr-only">Enviar</span>
        </Button>
      </div>
    </div>
  );
};

export default function InboxPage() {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    conversations[0]?.contactId || null
  );

  const selectedConversation = conversations.find(
    (c) => c.contactId === selectedContactId
  );

  return (
    <>
      <PageHeader title="Bandeja de Entrada Unificada" description="Gestiona conversaciones de todos tus canales." />
      <Card className="h-[calc(100vh-12rem)]">
        <CardContent className="p-0 h-full">
          <div className="grid h-full grid-cols-1 md:grid-cols-[300px_1fr]">
            <div className="border-r p-2">
              <h2 className="p-2 text-lg font-headline font-semibold">Conversaciones</h2>
              <Separator className="my-2" />
              <ConversationList
                onSelectConversation={setSelectedContactId}
                selectedContactId={selectedContactId}
              />
            </div>
            <div className="flex flex-col">
              <MessageView conversation={selectedConversation} />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
