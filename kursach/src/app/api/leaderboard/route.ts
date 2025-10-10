import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
	const session = await getServerSession(authOptions as any);
	if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const me = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	// Собираем друзей (принятых)
	const friendships = await prisma.friendship.findMany({
		where: {
			OR: [
				{ requesterId: me.id, status: 'ACCEPTED' },
				{ addresseeId: me.id, status: 'ACCEPTED' },
			],
		},
	});
	const friendIds = new Set<string>([
		...friendships.filter(f => f.requesterId !== me.id).map(f => f.requesterId),
		...friendships.filter(f => f.addresseeId !== me.id).map(f => f.addresseeId),
		me.id,
	]);

	// Суммы расходов по пользователям (за все время; можно ограничить месяцем)
	const totals = await prisma.expense.groupBy({
		by: ['userId'],
		where: { userId: { in: Array.from(friendIds) } },
		_sum: { amount: true },
	});
	const users = await prisma.user.findMany({ 
		where: { id: { in: Array.from(friendIds) } },
		select: { id: true, name: true, email: true, image: true }
	});
	const mapUser: Record<string, { name: string; image?: string }> = Object.fromEntries(
		users.map(u => [u.id, { name: u.name || u.email, image: u.image || undefined }])
	);
	const board = totals
		.map(t => ({ 
			userId: t.userId as string, 
			total: t._sum.amount || 0, 
			name: mapUser[t.userId as string]?.name || 'Unknown',
			image: mapUser[t.userId as string]?.image
		}))
		.sort((a, b) => Number(a.total) - Number(b.total));

	return NextResponse.json(board);
}




