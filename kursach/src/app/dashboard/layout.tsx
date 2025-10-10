'use client';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Принудительно обновляем сессию при загрузке layout
  useEffect(() => {
    const updateSession = async () => {
      try {
        const { update } = await import('next-auth/react');
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    };
    
    updateSession();
  }, []);

  // Принудительно обновляем сессию каждые 5 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { update } = await import('next-auth/react');
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
