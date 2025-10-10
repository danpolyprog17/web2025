import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getToken } from 'next-auth/jwt';

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, image, theme } = body;

    console.log('Profile update request:', { name, image, theme });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Found user:', { id: user.id, name: user.name, theme: user.theme });

    const updateData: any = {};
    if (name !== undefined) updateData.name = name || null;
    if (image !== undefined) updateData.image = image || null;
    if (theme !== undefined) updateData.theme = theme || 'system';

    console.log('Updating user with data:', updateData);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    return NextResponse.json({
      message: 'Profile updated',
      user: { 
        id: updatedUser.id, 
        email: updatedUser.email, 
        name: updatedUser.name,
        image: updatedUser.image,
        theme: updatedUser.theme
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


