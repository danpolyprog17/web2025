'use client';
import { useTheme } from './ThemeProvider';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { update } = useSession();

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

  const themes = [
    { value: 'light', label: 'Светлая', icon: '☀️' },
    { value: 'dark', label: 'Темная', icon: '🌙' },
    { value: 'system', label: 'Системная', icon: '💻' }
  ] as const;

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-foreground">Тема:</span>
      <div className="flex bg-muted/50 rounded-lg p-1">
        {themes.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value as any)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              theme === value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title={label}
          >
            <span className="mr-1">{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
