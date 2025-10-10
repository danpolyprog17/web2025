import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions as any);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Проверяем, что пользователи являются друзьями
    const friendship = await prisma.friendship.findFirst({
      where: {
        status: 'ACCEPTED',
        OR: [
          { requesterId: currentUser.id, addresseeId: id },
          { requesterId: id, addresseeId: currentUser.id }
        ]
      }
    });

    if (!friendship) {
      return NextResponse.json({ error: 'Friend not found' }, { status: 404 });
    }

    // Получаем информацию о друге
    const friend = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true
      }
    });

    if (!friend) {
      return NextResponse.json({ error: 'Friend not found' }, { status: 404 });
    }

    // Получаем статистику расходов друга
    const expenses = await prisma.expense.findMany({
      where: { userId: id },
      select: { amount: true }
    });

    const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const expenseCount = expenses.length;
    const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;

    return NextResponse.json({
      ...friend,
      totalExpenses,
      expenseCount,
      averageExpense
    });

  } catch (error) {
    console.error('Error fetching friend profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

