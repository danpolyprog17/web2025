import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

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

async function seedCategories() {
  try {
    // Получаем всех пользователей
    const users = await prisma.user.findMany();
    
    if (users.length === 0) {
      console.log('Нет пользователей для добавления категорий');
      return;
    }

    for (const user of users) {
      console.log(`Добавляем категории для пользователя: ${user.email}`);
      
      for (const category of defaultCategories) {
        try {
          await prisma.category.upsert({
            where: {
              userId_name: {
                userId: user.id,
                name: category.name
              }
            },
            update: {
              color: category.color
            },
            create: {
              name: category.name,
              color: category.color,
              userId: user.id
            }
          });
          console.log(`  ✓ ${category.name}`);
        } catch (error) {
          console.log(`  ✗ Ошибка с ${category.name}:`, error);
        }
      }
    }
    
    console.log('Базовые категории добавлены!');
  } catch (error) {
    console.error('Ошибка при добавлении категорий:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories();

