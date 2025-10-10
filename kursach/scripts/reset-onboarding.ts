import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function resetOnboarding() {
  try {
    // Сбрасываем статус обучения для всех пользователей
    const result = await prisma.user.updateMany({
      data: { onboardingCompleted: false }
    });
    
    console.log(`Сброшен статус обучения для ${result.count} пользователей`);
    
    // Показываем список пользователей
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, onboardingCompleted: true }
    });
    
    console.log('\nПользователи:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.name || 'Без имени'}) - Обучение: ${user.onboardingCompleted ? 'Завершено' : 'Не завершено'}`);
    });
    
  } catch (error) {
    console.error('Ошибка при сбросе статуса обучения:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetOnboarding();

