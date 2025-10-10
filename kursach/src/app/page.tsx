import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* iOS-style Navigation */}
      <div className="ios-navbar">
        <div></div>
        <div className="ios-navbar-title">ExpenseTracker</div>
        <div></div>
      </div>

      <div className="px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">💰</span>
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-3">
            Управляйте финансами
          </h1>
          <p className="text-lg text-muted-foreground mb-8 px-4">
            Отслеживайте расходы, сравнивайте с друзьями и достигайте финансовых целей
          </p>
          <div className="flex flex-col gap-3 px-4">
            <Link 
              href="/register"
              className="ios-button w-full text-center"
            >
              Начать бесплатно
            </Link>
            <Link 
              href="/login"
              className="text-primary font-medium text-lg"
            >
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </div>

        {/* Features List */}
        <div className="ios-section">
          <div className="ios-section-title">Возможности</div>
          <div className="ios-card overflow-hidden">
            <div className="ios-list-item">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                <span className="text-lg">📊</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">Аналитика расходов</div>
                <div className="text-sm text-muted-foreground">Детальная статистика и диаграммы</div>
              </div>
            </div>
            <div className="ios-list-item">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center mr-4">
                <span className="text-lg">👥</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">Друзья и сравнения</div>
                <div className="text-sm text-muted-foreground">Сравнивайте успехи с друзьями</div>
              </div>
            </div>
            <div className="ios-list-item">
              <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center mr-4">
                <span className="text-lg">🏆</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">Лидерборд</div>
                <div className="text-sm text-muted-foreground">Соревнуйтесь в экономии</div>
              </div>
            </div>
            <div className="ios-list-item">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mr-4">
                <span className="text-lg">📱</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">Простой интерфейс</div>
                <div className="text-sm text-muted-foreground">Интуитивно понятное управление</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="ios-section">
          <div className="ios-section-title">Статистика</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="ios-card p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">1000+</div>
              <div className="text-sm text-muted-foreground">Пользователей</div>
            </div>
            <div className="ios-card p-6 text-center">
              <div className="text-2xl font-bold text-success mb-1">₽50M+</div>
              <div className="text-sm text-muted-foreground">Отслежено расходов</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="ios-section">
          <div className="ios-card p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Готовы начать?
            </h2>
            <p className="text-muted-foreground mb-6">
              Присоединяйтесь к сообществу людей, которые контролируют свои финансы
            </p>
            <Link 
              href="/register"
              className="ios-button inline-block"
            >
              Создать аккаунт
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
