'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CategoriesPage() {
	const { update } = useSession();
	const [items, setItems] = useState<any[]>([]);
	const [name, setName] = useState('');
	const [color, setColor] = useState('#3B82F6');

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
	const [loading, setLoading] = useState(false);

	async function load() {
		const res = await fetch('/api/categories');
		if (res.ok) setItems(await res.json());
	}
	useEffect(() => { load(); }, []);

	async function add() {
		if (!name.trim() || loading) return;
		setLoading(true);
		try {
			await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, color }) });
			setName('');
			setColor('#3B82F6');
			load();
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="px-4 py-6">

				{/* Header */}
				<div className="ios-section">
					<div className="ios-card p-6">
						<div className="flex items-center mb-4">
							<div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mr-3">
								<svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
								</svg>
							</div>
							<div>
								<h1 className="text-2xl font-semibold text-foreground">Категории расходов</h1>
								<p className="text-muted-foreground">Создавайте и управляйте категориями</p>
							</div>
						</div>
					</div>
				</div>

				{/* Add Category Form */}
				<div className="ios-section">
					<div className="ios-card p-6">
						<h2 className="text-lg font-semibold text-foreground mb-4">Добавить категорию</h2>
						<div className="flex gap-3">
							<input
								placeholder="Название категории"
								value={name}
								onChange={e => setName(e.target.value)}
								className="ios-input flex-1"
								onKeyPress={e => e.key === 'Enter' && add()}
							/>
							<div className="flex items-center space-x-2">
								<label className="text-sm font-medium text-foreground">Цвет:</label>
								<input
									type="color"
									value={color}
									onChange={e => setColor(e.target.value)}
									className="w-12 h-10 border border-border rounded-xl cursor-pointer"
								/>
							</div>
							<button
								onClick={add}
								disabled={loading || !name.trim()}
								className="ios-button"
							>
								{loading ? 'Добавление...' : 'Добавить'}
							</button>
						</div>
					</div>
				</div>

				{/* Categories List */}
				<div className="ios-section">
					<div className="ios-section-title">Ваши категории</div>
					<div className="ios-card overflow-hidden">
						{items.length === 0 ? (
							<div className="text-center py-12 text-muted-foreground">
								<div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
									<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
									</svg>
								</div>
								<p className="text-lg font-medium mb-2">Пока нет категорий</p>
								<p className="text-sm">Добавьте первую категорию выше</p>
							</div>
						) : (
							items.map((c, index) => (
								<div key={c.id} className={`ios-list-item ${index === items.length - 1 ? 'border-b-0' : ''}`}>
									<div className="flex items-center space-x-3">
										<div
											className="w-4 h-4 rounded-full"
											style={{ backgroundColor: c.color }}
										/>
										<span className="font-medium text-foreground">{c.name}</span>
									</div>
									<span className="text-xs text-muted-foreground">
										{new Date(c.createdAt).toLocaleDateString()}
									</span>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
}


