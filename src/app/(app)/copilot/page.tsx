'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, Lightbulb, BookOpen } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function CopilotPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hola, soy tu HiperFlow Copilot. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    // Placeholder for AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: "Actualmente estoy en desarrollo, pero pronto podré ayudarte a analizar tus datos, crear tareas y mucho más." }]);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
      {/* Left Panel: Learning Center */}
      <Card className="hidden lg:flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Aprende HiperFlow
          </CardTitle>
          <CardDescription>Guías y tutoriales para sacar el máximo provecho de tu CRM.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <Input placeholder="¿Cómo hago para...?" />
           <Separator />
          <p className="text-sm text-muted-foreground italic text-center py-8">
            El centro de aprendizaje se está construyendo.
          </p>
        </CardContent>
      </Card>

      {/* Center Panel: Chat */}
      <main className="lg:col-span-2 flex flex-col">
        <PageHeader
          title="HiperFlow Copilot"
          description="Tu copiloto digital. Aprende, pregunta y automatiza con ayuda inteligente."
          className="mb-4"
        />
        <Card className="flex-1 flex flex-col">
          <CardContent className="p-0 flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : '')}>
                    {msg.role === 'assistant' && (
                      <div className="bg-primary/20 p-2 rounded-full">
                        <Bot className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <div className={cn(
                      "rounded-lg px-4 py-2 max-w-sm",
                      msg.role === 'assistant' ? 'bg-card' : 'bg-primary text-primary-foreground'
                    )}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="border-t p-4 flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregúntame cualquier cosa sobre tus ventas, clientes o tareas..."
                className="flex-1"
              />
              <Button type="submit">
                <Send className="h-4 w-4" />
                <span className="sr-only">Enviar</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Right Panel: Recommendations (Placeholder on smaller screens) */}
      <Card className="lg:hidden">
         <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-yellow-400" />
            Sugerencias IA
          </CardTitle>
        </CardHeader>
        <CardContent>
           <p className="text-sm text-muted-foreground italic text-center py-4">
            Las sugerencias dinámicas aparecerán aquí.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}