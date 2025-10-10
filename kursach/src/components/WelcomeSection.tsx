'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function WelcomeSection() {
  const { data: session, update } = useSession();

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

  // Отладочная информация
  useEffect(() => {
    console.log('WelcomeSection session:', session?.user);
  }, [session]);

  if (!session?.user) return null;

  return (
    <div className="px-4 pt-4 pb-3 flex-shrink-0 animate-in fade-in slide-in-from-top-2 duration-500">
      <Link href="/dashboard/profile" className="ios-card p-4 block hover:bg-muted/50 transition-colors">
        <div className="flex items-center space-x-3">
          {/* Аватар пользователя */}
          <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-full h-full bg-primary/10 flex items-center justify-center ${session.user.image ? 'hidden' : ''}`}>
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          {/* Текст приветствия */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground mb-1">
              Добро пожаловать, {session.user.name || session.user.email}!
            </h1>
            <p className="text-sm text-muted-foreground">Ваш персональный финансовый трекер</p>
          </div>

          {/* Стрелка */}
          <svg className="w-5 h-5 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </div>
  );
}
