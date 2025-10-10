'use client';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './ThemeProvider';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Принудительно обновляем сессию при загрузке приложения
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
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}


