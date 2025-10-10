'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useLoading } from '@/hooks/useLoading';
import LoadingScreen from '@/components/LoadingScreen';

export default function FriendsPage() {
	const { update } = useSession();
	const [email, setEmail] = useState('');

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
	const [items, setItems] = useState<any[]>([]);
	const [requests, setRequests] = useState<any>({ incoming: [], outgoing: [] });
	const [loading, setLoading] = useState(false);
	const [requestLoading, setRequestLoading] = useState(false);
	const [me, setMe] = useState<any>(null);
	const isLoading = useLoading();

	async function load() {
		const [friendsRes, requestsRes, sessionRes] = await Promise.all([
			fetch('/api/friends'),
			fetch('/api/friends/requests'),
			fetch('/api/auth/session')
		]);
		if (friendsRes.ok) setItems(await friendsRes.json());
		if (requestsRes.ok) setRequests(await requestsRes.json());
		if (sessionRes.ok) {
			const session = await sessionRes.json();
			setMe(session.user);
		}
	}
	useEffect(() => { load(); }, []);

	async function request() {
		if (!email.trim() || loading) return;
		setLoading(true);
		try {
			await fetch('/api/friends', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
			setEmail('');
			load();
		} finally {
			setLoading(false);
		}
	}

	async function respondToRequest(requestId: string, action: 'accept' | 'reject') {
		setRequestLoading(true);
		try {
			await fetch('/api/friends/respond', { 
				method: 'POST', 
				headers: { 'Content-Type': 'application/json' }, 
				body: JSON.stringify({ requestId, action }) 
			});
			load();
		} finally {
			setRequestLoading(false);
		}
	}

	if (isLoading) {
		return <LoadingScreen />;
	}

	return (
		<div className="min-h-screen bg-background animate-in fade-in slide-in-from-bottom-4 duration-700">
			<div className="px-4 py-6">
				{/* Add Friend Form */}
				<div className="ios-section">
					<div className="ios-card p-6">
						<h2 className="text-lg font-semibold text-foreground mb-4">Добавить друга</h2>
						<div className="flex gap-3">
							<input
								placeholder="Email друга"
								value={email}
								onChange={e => setEmail(e.target.value)}
								className="ios-input flex-1"
								type="email"
							/>
							<button
								onClick={request}
								disabled={loading || !email.trim()}
								className="ios-button"
							>
								{loading ? 'Отправка...' : 'Добавить'}
							</button>
						</div>
					</div>
				</div>

				{/* Friends List */}
				<div className="ios-section">
					<div className="ios-section-title">Ваши друзья</div>
					<div className="ios-card overflow-hidden">
						{items.length === 0 ? (
							<div className="text-center py-12 text-muted-foreground">
								<div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl">👥</span>
								</div>
								<p className="text-lg font-medium mb-2">Пока нет друзей</p>
								<p className="text-sm">Добавьте первого друга выше</p>
							</div>
						) : (
							items
								.filter(f => f.status === 'ACCEPTED') // Показываем только принятых друзей
								.map(f => {
									// Определяем данные друга (не текущего пользователя)
									const isRequester = f.requester.email === me?.email;
									const friend = isRequester ? f.addressee : f.requester;
									const friendId = isRequester ? f.addresseeId : f.requesterId;
									
									return (
									<Link key={f.id} href={`/dashboard/friends/${friendId}`} className="ios-list-item">
										<div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
											<svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
											</svg>
										</div>
										<div className="flex-1">
											<p className="font-medium text-foreground">
												{friend.name || friend.email}
											</p>
											<p className="text-sm text-muted-foreground">
												{friend.name ? friend.email : 'Без имени'}
											</p>
										</div>
										<div className="text-right flex items-center">
											<p className="text-sm text-muted-foreground">
												{new Date(f.createdAt).toLocaleDateString()}
											</p>
											<svg className="w-4 h-4 text-muted-foreground ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
											</svg>
										</div>
									</Link>
									);
								})
						)}
					</div>
				</div>

				{/* Входящие заявки */}
				{requests.incoming && requests.incoming.length > 0 && (
					<div className="ios-section">
						<div className="ios-section-title">Входящие заявки</div>
						<div className="ios-card overflow-hidden">
							{requests.incoming.map((req: any) => (
								<div key={req.id} className="ios-list-item">
									<div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center mr-4">
										<span className="text-lg">👤</span>
									</div>
									<div className="flex-1">
										<p className="font-medium text-foreground">
											{req.requester.name || req.requester.email}
										</p>
										<p className="text-sm text-muted-foreground">
											{req.requester.email}
										</p>
									</div>
									<div className="flex gap-2">
										<button
											onClick={() => respondToRequest(req.id, 'accept')}
											disabled={requestLoading}
											className="px-4 py-2 bg-success text-white rounded-xl hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
										>
											Принять
										</button>
										<button
											onClick={() => respondToRequest(req.id, 'reject')}
											disabled={requestLoading}
											className="px-4 py-2 bg-destructive text-white rounded-xl hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
										>
											Отклонить
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Исходящие заявки */}
				{requests.outgoing && requests.outgoing.length > 0 && (
					<div className="ios-section">
						<div className="ios-section-title">Исходящие заявки</div>
						<div className="ios-card overflow-hidden">
							{requests.outgoing.map((req: any) => (
								<div key={req.id} className="ios-list-item">
									<div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center mr-4">
										<span className="text-lg">👤</span>
									</div>
									<div className="flex-1">
										<p className="font-medium text-foreground">
											{req.addressee.name || req.addressee.email}
										</p>
										<p className="text-sm text-muted-foreground">
											{req.addressee.email}
										</p>
									</div>
									<div className="text-right">
										<p className="text-sm text-muted-foreground">
											⏳ Ожидает ответа
										</p>
										<p className="text-xs text-muted-foreground">
											{new Date(req.createdAt).toLocaleDateString()}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}


