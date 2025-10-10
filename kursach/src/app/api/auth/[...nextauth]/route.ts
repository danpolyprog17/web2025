import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const authOptions = {
	secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key-for-development',
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials: Record<string, string> | undefined) {
				if (!credentials?.email || !credentials?.password) return null;
				const user = await prisma.user.findUnique({ where: { email: credentials.email } });
				if (!user) return null;
				const ok = await bcrypt.compare(credentials.password, user.passwordHash);
				if (!ok) return null;
				return { id: user.id, email: user.email, name: user.name ?? null } as any;
			},
		}),
	],
	session: { strategy: 'jwt' as const },
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (token.id) {
				session.user.id = token.id as string;
				
				// Получаем актуальную информацию о пользователе из базы данных
				const user = await prisma.user.findUnique({
					where: { id: token.id as string },
					select: {
						id: true,
						email: true,
						name: true,
						image: true,
						theme: true
					}
				});
				
				if (user) {
					session.user.name = user.name;
					session.user.image = user.image;
					session.user.theme = user.theme;
				}
			}
			return session;
		},
	},
};

const handler = NextAuth({
	...authOptions,
	pages: {
		signIn: '/login',
		signUp: '/register',
		error: '/login'
	}
} as any);
export { handler as GET, handler as POST };
