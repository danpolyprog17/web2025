'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/login');
  }, [router]);

  // Принудительно обновляем сессию при загрузке страницы
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Перенаправление на страницу входа...</p>
      </div>
    </div>
  );
}


