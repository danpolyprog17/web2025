import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any);
    
    console.log('Session check - Raw session:', session);
    
    if (!session?.user?.id) {
      console.log('Session check - No user ID found');
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    console.log('Session check - User found:', session.user);
    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name
      }
    });

  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json(
      { error: 'Failed to check session' },
      { status: 500 }
    );
  }
}
