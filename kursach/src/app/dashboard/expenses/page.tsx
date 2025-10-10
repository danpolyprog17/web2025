'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

type Category = { id: string; name: string };

export default function ExpensesPage() {
	const { update } = useSession();
	const [items, setItems] = useState<any[]>([]);
	const [cats, setCats] = useState<Category[]>([]);
	const [amount, setAmount] = useState('');
	const [categoryId, setCategoryId] = useState<string>('');
	const [note, setNote] = useState('');
	const [loading, setLoading] = useState(false);

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

	async function load() {
		const [e, c] = await Promise.all([
			fetch('/api/expenses'),
			fetch('/api/categories'),
		]);
		if (e.ok) setItems(await e.json());
		if (c.ok) setCats(await c.json());
	}
	useEffect(() => { load(); }, []);

	async function add() {
		const amt = Number(amount);
		if (!Number.isFinite(amt) || amt <= 0 || loading) return;
		setLoading(true);
		try {
			await fetch('/api/expenses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: amt, categoryId: categoryId || undefined, note }) });
			setAmount(''); setNote(''); setCategoryId('');
			load();
		} finally {
			setLoading(false);
		}
	}

	const total = items.reduce((sum, item) => sum + Number(item.amount), 0);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="mb-6">
					<Link href="/dashboard" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
						← Назад к дашборду
					</Link>
					<h1 className="text-3xl font-bold text-gray-900 mt-4">Расходы</h1>
					<p className="text-gray-600 mt-2">Отслеживайте ваши траты по категориям</p>
				</div>

				{/* Статистика */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					<div className="bg-white rounded-lg shadow-sm border p-6">
						<div className="flex items-center">
							<div className="p-2 bg-red-100 rounded-lg">
								<span className="text-2xl">💰</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Общие расходы</p>
								<p className="text-2xl font-bold text-gray-900">{total.toLocaleString()} ₽</p>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-lg shadow-sm border p-6">
						<div className="flex items-center">
							<div className="p-2 bg-blue-100 rounded-lg">
								<span className="text-2xl">📊</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Всего записей</p>
								<p className="text-2xl font-bold text-gray-900">{items.length}</p>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-lg shadow-sm border p-6">
						<div className="flex items-center">
							<div className="p-2 bg-green-100 rounded-lg">
								<span className="text-2xl">📁</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Категорий</p>
								<p className="text-2xl font-bold text-gray-900">{cats.length}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Форма добавления */}
				<div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Добавить расход</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<input
							placeholder="Сумма (₽)"
							value={amount}
							onChange={e => setAmount(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							type="number"
							step="0.01"
						/>
						<select
							value={categoryId}
							onChange={e => setCategoryId(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="">Без категории</option>
							{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
						</select>
						<input
							placeholder="Заметка (необязательно)"
							value={note}
							onChange={e => setNote(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						<button
							onClick={add}
							disabled={loading || !amount || Number(amount) <= 0}
							className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{loading ? 'Добавление...' : 'Добавить'}
						</button>
					</div>
				</div>

				{/* Список расходов */}
				<div className="bg-white rounded-lg shadow-sm border">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900">История расходов</h2>
					</div>
					<div className="p-6">
						{items.length === 0 ? (
							<div className="text-center py-8 text-gray-500">
								<span className="text-4xl mb-4 block">💰</span>
								<p>Пока нет расходов</p>
								<p className="text-sm">Добавьте первый расход выше</p>
							</div>
						) : (
							<div className="space-y-3">
								{items.map(e => (
									<div key={e.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
										<div className="flex items-center space-x-4">
											<div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
												<span className="text-lg">💸</span>
											</div>
											<div>
												<p className="font-medium text-gray-900">
													{Number(e.amount).toLocaleString()} {e.currency}
												</p>
												<p className="text-sm text-gray-600">
													{e.category?.name || 'Без категории'}
													{e.note && ` • ${e.note}`}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-sm text-gray-500">
												{new Date(e.spentAt).toLocaleDateString()}
											</p>
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


