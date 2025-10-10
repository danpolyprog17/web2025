import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
	const session = await getServerSession(authOptions as any);
	if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	
	const me = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const body = await req.json();
		const { requestId, action } = body; // action: 'accept' | 'reject'

		if (!requestId || !action) {
			return NextResponse.json({ error: 'Request ID and action required' }, { status: 400 });
		}

		if (!['accept', 'reject'].includes(action)) {
			return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
		}

		// Проверяем, что заявка существует и адресована мне
		const request = await prisma.friendship.findFirst({
			where: {
				id: requestId,
				addresseeId: me.id,
				status: 'PENDING'
			}
		});

		if (!request) {
			return NextResponse.json({ error: 'Request not found or already processed' }, { status: 404 });
		}

		// Обновляем статус заявки
		const newStatus = action === 'accept' ? 'ACCEPTED' : 'BLOCKED';
		
		await prisma.friendship.update({
			where: { id: requestId },
			data: { status: newStatus }
		});

		return NextResponse.json({ 
			message: `Request ${action === 'accept' ? 'accepted' : 'rejected'}`,
			status: newStatus
		});

	} catch (error) {
		console.error('Friend request response error:', error);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}


