'use client';
import { useEffect, useState } from 'react';
import Onboarding from '@/components/Onboarding';
import { useSession } from 'next-auth/react';

type Category = { id: string; name: string; color: string };
type Expense = { id: string; amount: number; currency: string; category?: Category; spentAt: string; note?: string };

export default function DashboardClient() {
  const { update } = useSession();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showExpensesModal, setShowExpensesModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showExpenseDetailsModal, setShowExpenseDetailsModal] = useState(false);
  const [showCategoryExpensesModal, setShowCategoryExpensesModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(true);

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

  // Логирование изменений состояния
  useEffect(() => {
    console.log('Onboarding state changed:', { showOnboarding, onboardingCompleted });
  }, [showOnboarding, onboardingCompleted]);
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    note: ''
  });
  const [categoryData, setCategoryData] = useState({
    name: '',
    color: '#3B82F6'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
    // Проверяем статус обучения с повторными попытками
    checkOnboardingWithRetry();
  }, []);

  async function checkOnboardingWithRetry(retries = 0) {
    try {
      console.log(`Checking session (attempt ${retries + 1})...`);
      
      // Сначала проверяем сессию
      const sessionResponse = await fetch('/api/auth/session');
      console.log('Session API response:', sessionResponse.status);
      
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        console.log('Session data:', sessionData);
        
        if (sessionData.authenticated) {
          // Если авторизован, проверяем статус обучения
          console.log('User authenticated, checking onboarding status...');
          const onboardingResponse = await fetch('/api/user/onboarding');
          console.log('Onboarding API response:', onboardingResponse.status);
          
          if (onboardingResponse.ok) {
            const onboardingData = await onboardingResponse.json();
            console.log('Onboarding data:', onboardingData);
            setOnboardingCompleted(onboardingData.onboardingCompleted);
            if (!onboardingData.onboardingCompleted) {
              console.log('Showing onboarding modal');
              setShowOnboarding(true);
            }
          } else {
            console.log('Onboarding API error:', onboardingResponse.status, await onboardingResponse.text());
          }
        } else {
          console.log('User not authenticated, retrying in 1 second...');
          if (retries < 5) {
            setTimeout(() => checkOnboardingWithRetry(retries + 1), 1000);
          }
        }
      } else {
        console.log('Session API error:', sessionResponse.status, await sessionResponse.text());
        if (retries < 5) {
          setTimeout(() => checkOnboardingWithRetry(retries + 1), 1000);
        }
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      if (retries < 5) {
        setTimeout(() => checkOnboardingWithRetry(retries + 1), 1000);
      }
    }
  }


  async function loadData() {
    const [expensesRes, categoriesRes, leaderboardRes] = await Promise.all([
      fetch('/api/expenses'),
      fetch('/api/categories'),
      fetch('/api/leaderboard')
    ]);
    if (expensesRes.ok) setExpenses(await expensesRes.json());
    if (categoriesRes.ok) {
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData);
      
      // Если у пользователя нет категорий, создаем базовые
      if (categoriesData.length === 0) {
        try {
          await fetch('/api/categories/seed', { method: 'POST' });
          // Перезагружаем данные после создания категорий
          const newCategoriesRes = await fetch('/api/categories');
          if (newCategoriesRes.ok) {
            setCategories(await newCategoriesRes.json());
          }
        } catch (error) {
          console.error('Error creating default categories:', error);
        }
      }
    }
    if (leaderboardRes.ok) setLeaderboard(await leaderboardRes.json());
  }

  async function addExpense() {
    const amount = Number(formData.amount);
    if (!Number.isFinite(amount) || amount <= 0 || loading) return;
    
    setLoading(true);
    try {
      await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          categoryId: formData.categoryId || undefined,
          note: formData.note || undefined
        })
      });
      setFormData({ amount: '', categoryId: '', note: '' });
      setShowAddForm(false);
      setShowAddMenu(false);
      loadData();
    } finally {
      setLoading(false);
    }
  }

  async function addCategory() {
    if (!categoryData.name.trim() || loading) return;
    
    setLoading(true);
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryData.name,
          color: categoryData.color
        })
      });
      setCategoryData({ name: '', color: '#3B82F6' });
      setShowCategoryForm(false);
      setShowAddMenu(false);
      loadData();
    } finally {
      setLoading(false);
    }
  }

  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  
  // Группируем расходы по категориям для диаграммы
  const categoryTotals = expenses.reduce((acc, exp) => {
    const categoryName = exp.category?.name || 'Без категории';
    acc[categoryName] = (acc[categoryName] || 0) + Number(exp.amount);
    return acc;
  }, {} as Record<string, number>);

  const colors = [
    'url(#gradient1)', 'url(#gradient2)', 'url(#gradient3)', 'url(#gradient4)', 
    'url(#gradient5)', 'url(#gradient6)', 'url(#gradient7)', 'url(#gradient8)'
  ];
  
  const solidColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  // Данные для круговой диаграммы
  const pieData = Object.entries(categoryTotals).map(([name, value], index) => {
    const category = categories.find(cat => cat.name === name);
    const categoryColor = category?.color || solidColors[index % solidColors.length];
    return {
      name,
      value,
      color: categoryColor,
      gradient: colors[index % colors.length]
    };
  });


  async function deleteExpense(expenseId: string) {
    if (!confirm('Удалить этот расход?')) return;
    
    try {
      await fetch(`/api/expenses/${expenseId}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  }

  function openExpenseDetails(expense: Expense) {
    setSelectedExpense(expense);
    setShowExpenseDetailsModal(true);
  }

  function openCategoryExpenses(category: Category) {
    setSelectedCategory(category);
    setShowCategoryExpensesModal(true);
  }

  async function completeOnboarding() {
    try {
      await fetch('/api/user/onboarding', { method: 'POST' });
      setOnboardingCompleted(true);
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  }

  return (
        <div className="flex flex-col h-full min-h-0">
      {/* Виджет с общими тратами и историей */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 animate-in fade-in slide-in-from-top-4 duration-500 delay-100 flex-shrink-0">
        {/* Общие траты с историей */}
        <div className="ios-card overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border flex-shrink-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Общие расходы</h2>
                <p className="text-sm text-muted-foreground">История ваших трат</p>
              </div>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3 flex-shrink-0">
                  <div>
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {total.toLocaleString()} ₽
                    </div>
                    <div className="text-sm text-muted-foreground">
            {expenses.length} {expenses.length === 1 ? 'транзакция' : 'транзакций'}
                    </div>
                  </div>

                  {/* Кнопка добавления */}
                  <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className={`w-10 h-10 bg-primary text-primary-foreground rounded-2xl shadow-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center transform hover:scale-110 active:scale-95 ${
                      showAddMenu ? 'rotate-45' : 'rotate-0'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
            
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground flex-1 flex flex-col justify-center">
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <p className="text-base font-medium mb-1">Пока нет расходов</p>
                <p className="text-sm">Добавьте первый расход с помощью кнопки +</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Последние траты - занимают доступное место */}
                <div className="flex-1 min-h-0 space-y-2">
                  {expenses.slice(0, 3).map(expense => (
                    <div key={expense.id} className="flex items-center justify-between p-3 border border-border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group" onClick={() => openExpenseDetails(expense)}>
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-destructive/20 transition-colors">
                          <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground text-sm truncate">
                            {Number(expense.amount).toLocaleString()} {expense.currency}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {expense.category?.name || 'Без категории'}
                            {expense.note && ` • ${expense.note}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {new Date(expense.spentAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteExpense(expense.id);
                          }}
                          className="w-6 h-6 bg-destructive/10 rounded-lg flex items-center justify-center hover:bg-destructive/20 transition-colors"
                          title="Удалить расход"
                        >
                          <svg className="w-3 h-3 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Кнопка просмотра всех трат - внизу */}
                {expenses.length > 3 && (
                  <div className="mt-3 pt-3 border-t border-border flex-shrink-0">
                    <button
                      onClick={() => setShowExpensesModal(true)}
                      className="w-full flex items-center justify-center space-x-2 py-2 text-primary hover:bg-primary/10 rounded-xl transition-colors"
                    >
                      <span className="font-medium text-sm">
                        Показать все траты
                      </span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Расходы по категориям - Красивый дизайн */}
        <div className="ios-card overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-success/10 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Расходы по категориям</h2>
                  <p className="text-sm text-muted-foreground">Распределение ваших трат</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            {pieData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground flex-1 flex flex-col justify-center">
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-base font-medium mb-1">Пока нет расходов</p>
                <p className="text-sm">Добавьте первый расход</p>
              </div>
            ) : (
            <div className="p-4">
              {/* Красивые карточки категорий с горизонтальной прокруткой на мобильных */}
              <div className="flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-2 lg:gap-4 lg:overflow-visible">
                {pieData
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 4)
                  .map((category, index) => {
                    const percentage = total > 0 ? ((category.value / total) * 100).toFixed(1) : 0;
                    return (
                      <div 
                        key={category.name} 
                        className="flex-shrink-0 w-64 lg:w-auto p-4 rounded-2xl border border-border hover:bg-muted/30 transition-all duration-200 group cursor-pointer"
                        onClick={() => openCategoryExpenses({ id: category.name, name: category.name, color: category.color })}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{ backgroundColor: `${category.color}20` }}
                            >
                              <div 
                                className="w-6 h-6 rounded-lg"
                                style={{ backgroundColor: category.color }}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground text-base">
                                {category.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {percentage}% от общих трат
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-foreground">
                              {Number(category.value).toLocaleString()} ₽
                            </span>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">
                                {expenses.filter(exp => exp.category?.name === category.name).length} трат
                              </div>
                            </div>
                          </div>
                          
                          {/* Прогресс-бар */}
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-2 rounded-full transition-all duration-700 ease-out group-hover:scale-y-110"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: category.color
                              }}
                            />
                          </div>
                        </div>
                  </div>
                    );
                  })}
              </div>

              {/* Кнопка "Все категории" если их больше 4 */}
              {pieData.length > 4 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <button
                    onClick={() => setShowCategoriesModal(true)}
                    className="w-full flex items-center justify-center space-x-2 py-2 text-primary hover:bg-primary/10 rounded-xl transition-colors"
                  >
                    <span className="font-medium text-sm">
                      Все категории ({pieData.length})
                    </span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Лидерборд друзей */}
      <div className="ios-card overflow-hidden flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <div className="px-4 py-3 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-warning/10 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Лидерборд друзей</h2>
                <p className="text-sm text-muted-foreground">Кто тратит больше всех</p>
              </div>
            </div>

            {/* Кнопка друзей */}
            <a 
              href="/dashboard/friends" 
              className="flex items-center space-x-2 px-3 py-2 bg-success/10 text-success rounded-xl hover:bg-success/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-medium">Друзья</span>
            </a>
          </div>
        </div>
        <div className="px-4 pt-4 pb-6 flex-1 flex flex-col min-h-0">
          {leaderboard.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground flex-1 flex flex-col justify-center">
              <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-base font-medium mb-1">Нет друзей для сравнения</p>
              <p className="text-sm">Добавьте друзей, чтобы увидеть лидерборд</p>
            </div>
          ) : (
            <div className="space-y-2 flex-1 min-h-0 overflow-y-auto">
              {leaderboard.map((user, index) => {
                const rank = index + 1;

                return (
                  <div
                    key={user.userId}
                    className="flex items-center p-3 rounded-xl transition-all duration-200 hover:bg-muted/50"
                  >
                    {/* Ранг */}
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center mr-3">
                      {rank <= 3 ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                          rank === 2 ? 'bg-gray-100 text-gray-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm font-semibold text-muted-foreground">{rank}</span>
                        </div>
                      )}
                    </div>

                    {/* Аватар */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden mr-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full bg-primary/10 flex items-center justify-center ${user.image ? 'hidden' : ''}`}>
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Информация */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-foreground text-sm truncate">
                          {user.name}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {user.total.toLocaleString()} ₽
                      </p>
                    </div>

                    {/* Прогресс-бар */}
                    <div className="flex-shrink-0 w-20 ml-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            rank === 1 ? 'bg-yellow-500' :
                            rank === 2 ? 'bg-gray-400' :
                            rank === 3 ? 'bg-orange-500' :
                            'bg-primary'
                          }`}
                          style={{
                            width: `${Math.min(100, (user.total / (leaderboard[0]?.total || 1)) * 100)}%`
                          }}
                        />
                  </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>


          {/* Контекстное меню */}
          {showAddMenu && (
            <>
              {/* Затемнение фона */}
              <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 animate-in fade-in duration-200"
                onClick={() => setShowAddMenu(false)}
              />
              
              {/* Меню */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div 
              className="ios-card p-6 w-full max-w-md animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Добавить</h3>
                  <button
                    onClick={() => setShowAddMenu(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {!showAddForm && !showCategoryForm ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left text-foreground hover:bg-primary/10 rounded-xl transition-colors group"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Добавить расход</div>
                        <div className="text-sm text-muted-foreground">Быстро добавить новую трату</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setShowCategoryForm(true)}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left text-foreground hover:bg-warning/10 rounded-xl transition-colors group"
                    >
                      <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center group-hover:bg-warning/20 transition-colors">
                        <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Добавить категорию</div>
                        <div className="text-sm text-muted-foreground">Создать новую категорию расходов</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setShowAddMenu(false)}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left text-foreground hover:bg-muted rounded-xl transition-colors group"
                    >
                      <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                        <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Отмена</div>
                        <div className="text-sm text-muted-foreground">Закрыть меню</div>
                      </div>
                    </button>
                  </div>
                ) : showAddForm ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Сумма (₽)
                      </label>
                      <input
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        className="ios-input w-full text-lg"
                        type="number"
                        step="0.01"
                        autoFocus
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Категория
                      </label>
                      <select
                        value={formData.categoryId}
                        onChange={e => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                        className="ios-input w-full"
                      >
                        <option value="">Без категории</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Заметка (необязательно)
                      </label>
                      <input
                        placeholder="Описание расхода..."
                        value={formData.note}
                        onChange={e => setFormData(prev => ({ ...prev, note: e.target.value }))}
                        className="ios-input w-full"
                      />
                    </div>
                    
                    <div className="flex space-x-3 pt-2">
                      <button
                        onClick={addExpense}
                        disabled={loading || !formData.amount || Number(formData.amount) <= 0}
                        className="flex-1 ios-button"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Добавление...</span>
                          </div>
                        ) : (
                          'Добавить расход'
                        )}
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-colors font-medium"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : showCategoryForm ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Название категории
                      </label>
                      <input
                        placeholder="Например: Продукты"
                        value={categoryData.name}
                        onChange={e => setCategoryData(prev => ({ ...prev, name: e.target.value }))}
                        className="ios-input w-full"
                        autoFocus
                      />
              </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Цвет
                      </label>
                      <div className="flex space-x-2">
                        {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'].map(color => (
          <button
                            key={color}
                            onClick={() => setCategoryData(prev => ({ ...prev, color }))}
                            className={`w-8 h-8 rounded-full border-2 ${
                              categoryData.color === color ? 'border-foreground' : 'border-border'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 pt-2">
                      <button
                        onClick={addCategory}
                        disabled={loading || !categoryData.name.trim()}
                        className="flex-1 ios-button"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Добавление...</span>
                          </div>
                        ) : (
                          'Добавить категорию'
                        )}
                      </button>
                      <button
                        onClick={() => setShowCategoryForm(false)}
                        className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-colors font-medium"
                      >
                        Отмена
          </button>
        </div>
      </div>
                ) : null}
            </div>
          </div>
        </>
          )}

          {/* Модальное окно со всеми тратами */}
          {showExpensesModal && (
            <>
              {/* Затемнение фона */}
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 animate-in fade-in duration-200"
                onClick={() => setShowExpensesModal(false)}
              />

              {/* Модальное окно */}
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div
                  className="ios-card w-full max-w-2xl max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Заголовок */}
                  <div className="px-6 py-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-foreground">Все расходы</h2>
                          <p className="text-sm text-muted-foreground">История всех ваших трат</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowExpensesModal(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Список трат */}
                  <div className="p-6 max-h-96 overflow-y-auto">
                    {expenses.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <p className="text-lg font-medium mb-2">Пока нет расходов</p>
                        <p className="text-sm">Добавьте первый расход с помощью кнопки +</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {expenses.map(expense => (
                          <div key={expense.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group" onClick={() => openExpenseDetails(expense)}>
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                                <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <p className="font-semibold text-foreground text-lg">
                                    {Number(expense.amount).toLocaleString()} {expense.currency}
                                  </p>
                                  {expense.category && (
                                    <span 
                                      className="px-2 py-1 rounded-lg text-xs font-medium"
                                      style={{ 
                                        backgroundColor: `${expense.category.color}20`,
                                        color: expense.category.color
                                      }}
                                    >
                                      {expense.category.name}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <span>{new Date(expense.spentAt).toLocaleDateString()}</span>
                                  {expense.note && (
                                    <>
                                      <span>•</span>
                                      <span className="truncate max-w-48">{expense.note}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteExpense(expense.id);
                              }}
                              className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center hover:bg-destructive/20 transition-colors"
                              title="Удалить расход"
                            >
                              <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
        </div>
      </div>
    </>
          )}

          {/* Модальное окно со всеми категориями */}
          {showCategoriesModal && (
            <>
              {/* Затемнение фона */}
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 animate-in fade-in duration-200"
                onClick={() => setShowCategoriesModal(false)}
              />

              {/* Модальное окно */}
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div
                  className="ios-card w-full max-w-4xl max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Заголовок */}
                  <div className="px-6 py-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-foreground">Все категории</h2>
                          <p className="text-sm text-muted-foreground">Полный список ваших категорий расходов</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowCategoriesModal(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Список категорий */}
                  <div className="p-6 max-h-96 overflow-y-auto">
                    {pieData.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <p className="text-lg font-medium mb-2">Пока нет категорий</p>
                        <p className="text-sm">Добавьте первую категорию</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pieData
                          .sort((a, b) => b.value - a.value)
                          .map((category, index) => {
                            const percentage = total > 0 ? ((category.value / total) * 100).toFixed(1) : 0;
                            return (
                              <div 
                                key={category.name} 
                                className="p-5 rounded-2xl border border-border hover:bg-muted/30 transition-all duration-200 group cursor-pointer"
                                onClick={() => openCategoryExpenses({ id: category.name, name: category.name, color: category.color })}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-3">
                                    <div 
                                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                                      style={{ backgroundColor: `${category.color}20` }}
                                    >
                                      <div 
                                        className="w-6 h-6 rounded-lg"
                                        style={{ backgroundColor: category.color }}
                                      />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-foreground text-base">
                                        {category.name}
                                      </h3>
                                      <p className="text-sm text-muted-foreground">
                                        {percentage}% от общих трат
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-foreground">
                                      {Number(category.value).toLocaleString()} ₽
                                    </span>
                                    <div className="text-right">
                                      <div className="text-sm text-muted-foreground">
                                        {expenses.filter(exp => exp.category?.name === category.name).length} трат
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Прогресс-бар */}
                                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                    <div 
                                      className="h-2 rounded-full transition-all duration-700 ease-out group-hover:scale-y-110"
                                      style={{ 
                                        width: `${percentage}%`,
                                        backgroundColor: category.color
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Модальное окно с деталями расхода */}
          {showExpenseDetailsModal && selectedExpense && (
            <>
              {/* Затемнение фона */}
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 animate-in fade-in duration-200"
                onClick={() => setShowExpenseDetailsModal(false)}
              />

              {/* Модальное окно */}
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div
                  className="ios-card w-full max-w-md animate-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Заголовок */}
                  <div className="px-6 py-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-foreground">Детали расхода</h2>
                          <p className="text-sm text-muted-foreground">Подробная информация о трате</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowExpenseDetailsModal(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Содержимое */}
                  <div className="p-6 space-y-6">
                    {/* Сумма */}
                    <div className="text-center">
                      <div className="text-4xl font-bold text-foreground mb-2">
                        {Number(selectedExpense.amount).toLocaleString()} {selectedExpense.currency}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Сумма расхода
                      </div>
                    </div>

                    {/* Категория */}
                    {selectedExpense.category && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-foreground">Категория</h3>
                        <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl">
                          <div 
                            className="w-8 h-8 rounded-lg"
                            style={{ backgroundColor: selectedExpense.category.color }}
                          />
                          <span className="font-medium text-foreground">{selectedExpense.category.name}</span>
                        </div>
                      </div>
                    )}

                    {/* Заметка */}
                    {selectedExpense.note && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-foreground">Заметка</h3>
                        <div className="p-3 bg-muted/30 rounded-xl">
                          <p className="text-foreground">{selectedExpense.note}</p>
                        </div>
                      </div>
                    )}

                    {/* Дата */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-foreground">Дата</h3>
                      <div className="p-3 bg-muted/30 rounded-xl">
                        <p className="text-foreground">
                          {new Date(selectedExpense.spentAt).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'long'
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedExpense.spentAt).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Действия */}
                    <div className="flex space-x-3 pt-4 border-t border-border">
                      <button
                        onClick={() => {
                          setShowExpenseDetailsModal(false);
                          deleteExpense(selectedExpense.id);
                        }}
                        className="flex-1 px-4 py-3 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-colors font-medium"
                      >
                        Удалить расход
                      </button>
                      <button
                        onClick={() => setShowExpenseDetailsModal(false)}
                        className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-colors font-medium"
                      >
                        Закрыть
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Модальное окно с расходами по категории */}
          {showCategoryExpensesModal && selectedCategory && (
            <>
              {/* Затемнение фона */}
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 animate-in fade-in duration-200"
                onClick={() => setShowCategoryExpensesModal(false)}
              />

              {/* Модальное окно */}
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div
                  className="ios-card w-full max-w-2xl max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Заголовок */}
                  <div className="px-6 py-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                          style={{ backgroundColor: `${selectedCategory.color}20` }}
                        >
                          <div 
                            className="w-6 h-6 rounded-lg"
                            style={{ backgroundColor: selectedCategory.color }}
                          />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-foreground">Расходы по категории</h2>
                          <p className="text-sm text-muted-foreground">{selectedCategory.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowCategoryExpensesModal(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Список расходов */}
                  <div className="p-6 max-h-96 overflow-y-auto">
                    {(() => {
                      const categoryExpenses = expenses.filter(exp => exp.category?.name === selectedCategory.name);
                      const categoryTotal = categoryExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
                      
                      return categoryExpenses.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <p className="text-lg font-medium mb-2">Нет расходов в этой категории</p>
                          <p className="text-sm">Добавьте первый расход в категорию "{selectedCategory.name}"</p>
                        </div>
                      ) : (
                        <>
                          {/* Статистика */}
                          <div className="mb-6 p-4 bg-muted/30 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">Всего расходов</p>
                                <p className="text-2xl font-bold text-foreground">
                                  {categoryTotal.toLocaleString()} ₽
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Количество</p>
                                <p className="text-lg font-semibold text-foreground">
                                  {categoryExpenses.length} {categoryExpenses.length === 1 ? 'расход' : 'расходов'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Список расходов */}
                          <div className="space-y-3">
                            {categoryExpenses.map(expense => (
                              <div key={expense.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group" onClick={() => openExpenseDetails(expense)}>
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                                    <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <p className="font-semibold text-foreground text-lg">
                                        {Number(expense.amount).toLocaleString()} {expense.currency}
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                      <span>{new Date(expense.spentAt).toLocaleDateString()}</span>
                                      {expense.note && (
                                        <>
                                          <span>•</span>
                                          <span className="truncate max-w-48">{expense.note}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteExpense(expense.id);
                                  }}
                                  className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center hover:bg-destructive/20 transition-colors"
                                  title="Удалить расход"
                                >
                                  <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Компонент обучения */}
          <Onboarding 
            isVisible={showOnboarding}
            onComplete={completeOnboarding}
          />

    </div>
  );
}
