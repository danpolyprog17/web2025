'use client';
import { useLoading } from '@/hooks/useLoading';
import LoadingScreen from '@/components/LoadingScreen';
import DashboardClient from './dashboard-client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface DashboardWithLoadingProps {
  session: any;
}

export default function DashboardWithLoading({ session }: DashboardWithLoadingProps) {
  const { update } = useSession();
  const isLoading = useLoading();
  const [showContent, setShowContent] = useState(false);

  // Принудительно обновляем сессию при загрузке компонента
  useEffect(() => {
    const updateSession = async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    };
    
    updateSession();
  }, [update]);

  // Принудительно обновляем сессию каждые 5 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [update]);

  useEffect(() => {
    if (!isLoading) {
      // Небольшая задержка для плавного перехода
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`h-full flex flex-col transition-all duration-700 ease-out ${
      showContent 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 translate-y-4'
    }`}>
      <DashboardClient />
    </div>
  );
}
