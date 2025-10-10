export { default } from 'next-auth/middleware';

export const config = {
	matcher: ['/dashboard'],
};

// Принудительно обновляем сессию при каждом запросе
export async function middleware(request: NextRequest) {
  // Middleware не может использовать клиентские хуки NextAuth
  return;
}




