'use client';
import { useState, useEffect } from 'react';

const tips = [
  "💡 Регулярно отслеживайте свои расходы для лучшего контроля бюджета",
  "📊 Анализируйте траты по категориям, чтобы найти возможности для экономии",
  "🎯 Ставьте финансовые цели и отслеживайте прогресс",
  "💰 Создавайте резервный фонд на случай непредвиденных расходов",
  "📱 Используйте мобильное приложение для быстрого добавления трат",
  "🔍 Просматривайте историю расходов, чтобы выявить паттерны трат",
  "👥 Сравнивайте свои расходы с друзьями для мотивации",
  "📈 Отслеживайте изменения в расходах по месяцам",
  "💳 Разделяйте траты на необходимые и желательные",
  "🎉 Празднуйте достижение финансовых целей!"
];

export default function LoadingScreen() {
  const [currentTip, setCurrentTip] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Смена советов каждые 3 секунды
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);

    // Анимация прогресса
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 50);

    return () => {
      clearInterval(tipInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      {/* Логотип и заголовок */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Финансовый Трекер</h1>
        <p className="text-muted-foreground">Загружаем ваш персональный дашборд...</p>
      </div>

      {/* Прогресс-бар */}
      <div className="w-80 max-w-sm mb-8">
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className="h-2 bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center mt-2">
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
      </div>

      {/* Полезные советы */}
      <div className="w-80 max-w-sm">
        <div className="ios-card p-6 text-center">
          <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Полезный совет</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tips[currentTip]}
          </p>
        </div>
      </div>

      {/* Анимация загрузки */}
      <div className="mt-8 flex space-x-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
