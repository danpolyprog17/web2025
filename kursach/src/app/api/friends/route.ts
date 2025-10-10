import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
	const session = await getServerSession(authOptions as any);
	if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const me = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const friends = await prisma.friendship.findMany({
		where: {
			OR: [
				{ requesterId: me.id, status: 'ACCEPTED' },
				{ addresseeId: me.id, status: 'ACCEPTED' },
			],
		},
		include: { requester: true, addressee: true },
	});
	return NextResponse.json(friends);
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions as any);
	if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const me = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const body = await req.json().catch(() => ({}));
	const email = typeof body?.email === 'string' ? body.email.trim() : '';
	if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
	const other = await prisma.user.findUnique({ where: { email } });
	if (!other) return NextResponse.json({ error: 'User not found' }, { status: 404 });
	if (other.id === me.id) return NextResponse.json({ error: 'Cannot friend yourself' }, { status: 400 });
	const fr = await prisma.friendship.upsert({
		where: { requesterId_addresseeId: { requesterId: me.id, addresseeId: other.id } },
		create: { requesterId: me.id, addresseeId: other.id, status: 'PENDING' },
		update: {},
	});
	return NextResponse.json(fr, { status: 201 });
}




