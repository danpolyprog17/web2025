'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function LeaderboardPage() {
	const { update } = useSession();
	const [rows, setRows] = useState<any[]>([]);

	// Принудительно обновляем сессию при загрузке страницы
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
		fetch('/api/leaderboard').then(r => r.ok ? r.json() : []).then(setRows);
	}, []);
	return (
		<div className="h-screen bg-background flex flex-col overflow-hidden">
			<div className="px-4 pt-4 pb-6 flex-1 flex flex-col">

				{/* Header */}
				<div className="ios-section flex-shrink-0">
					<div className="ios-card p-6">
						<div className="flex items-center mb-4">
							<div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center mr-3">
								<svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
								</svg>
							</div>
							<div>
								<h1 className="text-2xl font-semibold text-foreground">Лидерборд</h1>
								<p className="text-muted-foreground">Сравните успехи в экономии с друзьями</p>
							</div>
						</div>
					</div>
				</div>

				{/* Leaderboard */}
				<div className="ios-section flex-1 flex flex-col">
					<div className="ios-section-title">Рейтинг по расходам</div>
					<div className="ios-card overflow-hidden flex-1">
						{rows.length === 0 ? (
							<div className="text-center py-12 text-muted-foreground h-full flex flex-col items-center justify-center">
								<div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
									<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
									</svg>
								</div>
								<p className="text-lg font-medium mb-2">Пока нет данных</p>
								<p className="text-sm">Добавьте друзей и расходы для сравнения</p>
							</div>
						) : (
							<div className="h-full overflow-y-auto">
								{rows.map((r, index) => (
									<div key={r.userId} className={`ios-list-item ${index === rows.length - 1 ? 'border-b-0' : ''} ${
										index === 0 ? 'bg-warning/5' : 
										index === 1 ? 'bg-muted/30' : 
										index === 2 ? 'bg-orange-500/5' : ''
									}`}>
										<div className="flex items-center space-x-4">
											<div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
												index === 0 ? 'bg-warning' : 
												index === 1 ? 'bg-muted-foreground' : 
												index === 2 ? 'bg-orange-500' : 
												'bg-primary'
											}`}>
												{index + 1}
											</div>
											<div>
												<p className="font-medium text-foreground">{r.name}</p>
												<p className="text-sm text-muted-foreground">
													{Number(r.total).toLocaleString()} ₽
												</p>
											</div>
										</div>
										<div className="text-right">
											{index === 0 && <span className="text-warning text-sm font-medium">🥇 1-е место</span>}
											{index === 1 && <span className="text-muted-foreground text-sm font-medium">🥈 2-е место</span>}
											{index === 2 && <span className="text-orange-500 text-sm font-medium">🥉 3-е место</span>}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}


