import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
	const session = await getServerSession(authOptions as any);
	if (!session?.user?.email) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
	const user = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const categories = await prisma.category.findMany({ where: { userId: user.id }, orderBy: { name: 'asc' } });
	return NextResponse.json(categories);
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions as any);
	if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const user = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	const body = await req.json().catch(() => ({}));
	const name = typeof body?.name === 'string' ? body.name.trim() : '';
	const color = typeof body?.color === 'string' ? body.color : '#3B82F6';
	if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
	try {
		const created = await prisma.category.create({ data: { name, color, userId: user.id } });
		return NextResponse.json(created, { status: 201 });
	} catch (e: any) {
		return NextResponse.json({ error: 'Category exists or invalid' }, { status: 400 });
	}
}



