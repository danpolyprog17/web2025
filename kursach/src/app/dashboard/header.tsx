'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function DashboardHeader() {
  const { data: session, update } = useSession();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  // Принудительно обновляем сессию каждые 10 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [update]);

  if (!session) return null;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Логотип/Название */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Финансы</h1>
              <p className="text-xs text-muted-foreground">Трекер расходов</p>
            </div>
          </div>

          {/* Профиль пользователя */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-muted/50 transition-colors"
            >
              {/* Аватар */}
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                {session.user?.image ? (
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
                <div className={`w-full h-full bg-primary/10 flex items-center justify-center ${session.user?.image ? 'hidden' : ''}`}>
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              
              {/* Информация */}
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">
                  {session.user?.name || session.user?.email}
                </p>
                <p className="text-xs text-muted-foreground">Аккаунт</p>
              </div>

              {/* Стрелка */}
              <svg 
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  showProfileMenu ? 'rotate-180' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Выпадающее меню */}
            {showProfileMenu && (
              <>
                {/* Затемнение фона */}
                <div 
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                
                {/* Меню */}
                <div className="absolute right-0 top-full mt-2 w-64 ios-card overflow-hidden z-50">
                  {/* Заголовок профиля */}
                  <div className="px-4 py-3 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden">
                        {session.user?.image ? (
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
                        <div className={`w-full h-full bg-primary/10 flex items-center justify-center ${session.user?.image ? 'hidden' : ''}`}>
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {session.user?.name || 'Пользователь'}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Пункты меню */}
                  <div className="py-2">
                    <Link 
                      href="/dashboard/profile" 
                      className="ios-list-item"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Профиль</p>
                        <p className="text-sm text-muted-foreground">Управление аккаунтом</p>
                      </div>
                    </Link>

                    <Link 
                      href="/dashboard/friends" 
                      className="ios-list-item"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Друзья</p>
                        <p className="text-sm text-muted-foreground">Управление друзьями</p>
                      </div>
                    </Link>

                    <Link 
                      href="/dashboard/categories" 
                      className="ios-list-item"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Категории</p>
                        <p className="text-sm text-muted-foreground">Управление категориями</p>
                      </div>
                    </Link>

                    <Link 
                      href="/dashboard/leaderboard" 
                      className="ios-list-item"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Лидерборд</p>
                        <p className="text-sm text-muted-foreground">Сравнение с друзьями</p>
                      </div>
                    </Link>
                  </div>

                  {/* Разделитель */}
                  <div className="border-t border-border"></div>

                  {/* Выход */}
                  <div className="py-2">
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center px-4 py-3 text-left hover:bg-destructive/10 transition-colors"
                    >
                      <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-destructive">Выйти</p>
                        <p className="text-sm text-muted-foreground">Завершить сессию</p>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

