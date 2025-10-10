import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
	const session = await getServerSession(authOptions as any);
	if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const user = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const expenses = await prisma.expense.findMany({
		where: { userId: user.id },
		include: { category: true },
		orderBy: { spentAt: 'desc' },
	});
	return NextResponse.json(expenses);
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions as any);
	if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const user = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const body = await req.json().catch(() => ({}));
	const amount = Number(body?.amount);
	const currency = typeof body?.currency === 'string' ? body.currency : 'RUB';
	const note = typeof body?.note === 'string' ? body.note : undefined;
	const categoryId = typeof body?.categoryId === 'string' ? body.categoryId : undefined;
	if (!Number.isFinite(amount) || amount <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
	const created = await prisma.expense.create({
		data: {
			userId: user.id,
			categoryId,
			amount: amount as any,
			currency,
			note,
		},
	});
	return NextResponse.json(created, { status: 201 });
}




