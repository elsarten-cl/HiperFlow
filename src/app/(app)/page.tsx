
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new home of the OS inside World
    router.replace('/world?tab=os');
  }, [router]);

  // Render a loading state or null while redirecting
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p>Redirigiendo al centro de mando...</p>
    </div>
  );
}
