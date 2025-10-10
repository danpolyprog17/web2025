'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function SessionUpdater() {
  const { update } = useSession();

  useEffect(() => {
    // Обновляем сессию каждые 5 секунд
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [update]);

  return null; // Этот компонент не рендерит ничего
}

