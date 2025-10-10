import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
	const session = await getServerSession(authOptions as any);
	if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	
	const me = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	// Получаем входящие заявки (где я - получатель)
	const incomingRequests = await prisma.friendship.findMany({
		where: {
			addresseeId: me.id,
			status: 'PENDING'
		},
		include: {
			requester: { select: { id: true, email: true, name: true } }
		},
		orderBy: { createdAt: 'desc' }
	});

	// Получаем исходящие заявки (где я - отправитель)
	const outgoingRequests = await prisma.friendship.findMany({
		where: {
			requesterId: me.id,
			status: 'PENDING'
		},
		include: {
			addressee: { select: { id: true, email: true, name: true } }
		},
		orderBy: { createdAt: 'desc' }
	});

	return NextResponse.json({
		incoming: incomingRequests,
		outgoing: outgoingRequests
	});
}


