import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

const defaultCategories = [
  { name: 'Продукты', color: '#10B981' },
  { name: 'Транспорт', color: '#3B82F6' },
  { name: 'Развлечения', color: '#F59E0B' },
  { name: 'Здоровье', color: '#EF4444' },
  { name: 'Одежда', color: '#8B5CF6' },
  { name: 'Коммунальные услуги', color: '#06B6D4' },
  { name: 'Образование', color: '#84CC16' },
  { name: 'Подарки', color: '#F97316' },
  { name: 'Кафе и рестораны', color: '#EC4899' },
  { name: 'Жилье', color: '#6366F1' },
  { name: 'Спорт', color: '#14B8A6' },
  { name: 'Техника', color: '#F59E0B' },
  { name: 'Красота', color: '#EC4899' },
  { name: 'Путешествия', color: '#06B6D4' },
  { name: 'Домашние животные', color: '#84CC16' },
  { name: 'Без категории', color: '#6B7280' }
];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Проверяем, есть ли уже категории у пользователя
    const existingCategories = await prisma.category.findMany({
      where: { userId: session.user.id }
    });

    if (existingCategories.length > 0) {
      return NextResponse.json({ 
        message: 'Categories already exist',
        count: existingCategories.length 
      });
    }

    // Добавляем базовые категории
    const createdCategories = await Promise.all(
      defaultCategories.map(category =>
        prisma.category.create({
          data: {
            name: category.name,
            color: category.color,
            userId: session.user.id
          }
        })
      )
    );

    return NextResponse.json({ 
      message: 'Default categories created successfully',
      count: createdCategories.length,
      categories: createdCategories
    });

  } catch (error) {
    console.error('Error creating default categories:', error);
    return NextResponse.json(
      { error: 'Failed to create default categories' },
      { status: 500 }
    );
  }
}

