'use client';
import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await signIn('credentials', { email, password, callbackUrl: '/dashboard' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* iOS-style Navigation */}
      <div className="ios-navbar">
        <div></div>
        <div className="ios-navbar-title">Вход</div>
        <div></div>
      </div>

      <div className="px-4 py-8">
        <div className="ios-card p-8 max-w-sm mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">💰</span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Добро пожаловать
            </h1>
            <p className="text-muted-foreground">
              Войдите в ExpenseTracker
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="ios-input w-full"
                placeholder="Введите ваш email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="ios-input w-full"
                placeholder="Введите ваш пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="ios-button w-full"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Нет аккаунта?{' '}
                <Link href="/register" className="text-primary font-medium">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
