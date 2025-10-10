import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { email, password, name } = body;

		if (!email || !password) {
			return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 });
		}

		if (password.length < 6) {
			return NextResponse.json({ error: 'Пароль должен содержать минимум 6 символов' }, { status: 400 });
		}

		// Проверяем, существует ли пользователь
		const existingUser = await prisma.user.findUnique({
			where: { email }
		});

		if (existingUser) {
			return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 400 });
		}

		// Хешируем пароль
		const passwordHash = await bcrypt.hash(password, 12);

		// Создаем пользователя
		const user = await prisma.user.create({
			data: {
				email,
				passwordHash,
				name: name || null
			}
		});

		return NextResponse.json({ 
			message: 'Пользователь успешно создан',
			user: { id: user.id, email: user.email, name: user.name }
		}, { status: 201 });

	} catch (error) {
		console.error('Registration error:', error);
		return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
	}
}


