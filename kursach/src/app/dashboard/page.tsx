import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';
import DashboardWithLoading from './DashboardWithLoading';
import WelcomeSection from '@/components/WelcomeSection';

export default async function Dashboard() {
	const session = await getServerSession(authOptions as any);
	if (!session) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="ios-card p-8 text-center max-w-sm mx-4">
					<div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
						<span className="text-2xl">🔐</span>
					</div>
					<h1 className="text-xl font-semibold text-foreground mb-3">Требуется вход</h1>
					<p className="text-muted-foreground mb-6">Войдите в систему для доступа к дашборду</p>
					<Link 
						href="/login" 
						className="ios-button w-full text-center"
					>
						Перейти на страницу входа
					</Link>
				</div>
			</div>
		);
	}


        return (
          <div className="h-screen bg-background flex flex-col overflow-hidden">
            {/* Welcome Section - кликабельная для профиля */}
            <WelcomeSection />

            {/* Основной контент */}
            <div className="flex-1 px-4 min-h-0 pb-6">
              <DashboardWithLoading session={session} />
            </div>
          </div>
        );
}


