import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
	const session = await getServerSession(authOptions as any);
	if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const me = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const body = await req.json().catch(() => ({}));
	const requesterEmail = typeof body?.email === 'string' ? body.email.trim() : '';
	if (!requesterEmail) return NextResponse.json({ error: 'Email required' }, { status: 400 });
	const requester = await prisma.user.findUnique({ where: { email: requesterEmail } });
	if (!requester) return NextResponse.json({ error: 'User not found' }, { status: 404 });
	const updated = await prisma.friendship.updateMany({
		where: { requesterId: requester.id, addresseeId: me.id, status: 'PENDING' },
		data: { status: 'ACCEPTED' },
	});
	if (updated.count === 0) return NextResponse.json({ error: 'No request found' }, { status: 404 });
	return NextResponse.json({ ok: true });
}




