'use client';
import { useState, useEffect } from 'react';

interface OnboardingProps {
  isVisible: boolean;
  onComplete: () => void;
}

export default function Onboarding({ isVisible, onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      title: "Добро пожаловать в ExpenseTracker!",
      description: "Давайте быстро изучим основные возможности приложения",
      icon: "👋",
      highlight: null
    },
    {
      title: "Добавление расходов",
      description: "Нажмите на синюю кнопку + чтобы добавить свой первый расход",
      icon: "💰",
      highlight: "add-button"
    },
    {
      title: "Категории расходов",
      description: "Ваши расходы автоматически группируются по категориям для удобного анализа",
      icon: "📊",
      highlight: "categories-section"
    },
    {
      title: "Лидерборд с друзьями",
      description: "Пригласите друзей и соревнуйтесь в экономии! Кто тратит меньше всех?",
      icon: "🏆",
      highlight: "leaderboard-section"
    },
    {
      title: "Готово к использованию!",
      description: "Теперь вы знаете основы. Начните отслеживать свои расходы!",
      icon: "🎉",
      highlight: null
    }
  ];

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, currentStep]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  if (!isVisible) {
    console.log('Onboarding not visible');
    return null;
  }
  
  console.log('Onboarding is visible, current step:', currentStep);

  const currentStepData = steps[currentStep];

  return (
    <>
      {/* Затемнение фона */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
      
      {/* Модальное окно обучения */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className={`ios-card w-full max-w-md animate-in zoom-in-95 duration-300 ${
          isAnimating ? 'scale-105' : 'scale-100'
        } transition-transform`}>
          {/* Заголовок */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-2xl">{currentStepData.icon}</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Обучение</h2>
                  <p className="text-sm text-muted-foreground">
                    Шаг {currentStep + 1} из {steps.length}
                  </p>
                </div>
              </div>
              <button
                onClick={skipOnboarding}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Содержимое */}
          <div className="p-6 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">{currentStepData.icon}</span>
            </div>
            
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {currentStepData.title}
            </h3>
            
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {currentStepData.description}
            </p>

            {/* Прогресс-бар */}
            <div className="w-full bg-muted rounded-full h-2 mb-8">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            {/* Кнопки навигации */}
            <div className="flex space-x-3">
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-colors font-medium"
                >
                  Назад
                </button>
              )}
              
              <button
                onClick={nextStep}
                className="flex-1 px-4 py-3 ios-button"
              >
                {currentStep === steps.length - 1 ? 'Начать!' : 'Далее'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Подсветка элементов */}
      {currentStepData.highlight && (
        <div 
          className={`fixed z-40 pointer-events-none ${
            currentStepData.highlight === 'add-button' ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' :
            currentStepData.highlight === 'categories-section' ? 'top-1/4 right-4 w-80 h-40' :
            'bottom-1/4 left-4 right-4 h-32'
          }`}
        >
          <div className="w-full h-full border-4 border-primary rounded-2xl animate-pulse shadow-lg shadow-primary/20" />
        </div>
      )}
    </>
  );
}
