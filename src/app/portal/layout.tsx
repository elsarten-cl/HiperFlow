'use client';

import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase/client-provider';

// This is a minimal layout for the customer portal.
// It does not include the main app's navigation or header.
export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FirebaseClientProvider>
        <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            {children}
        </main>
        <Toaster />
    </FirebaseClientProvider>
  );
}
