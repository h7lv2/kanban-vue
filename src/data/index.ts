/**
 * Данные для разработки и демонстрации
 */

import type { Column } from '../types/column'

export const DEFAULT_COLUMNS: Column[] = [
  {
    title: 'К выполнению',
    id: 'todo',
    tasks: [
      {
        id: 1,
        title: 'Создать дизайн макет',
        description: 'Разработать макеты для главной страницы приложения',
        priority: 'high',
        deadline: '2025-07-15',
      },
      {
        id: 2,
        title: 'Настроить базу данных',
        description: 'Создать схему БД и настроить подключение',
        priority: 'medium',
      },
    ],
  },
  {
    title: 'В процессе',
    id: 'progress',
    tasks: [
      {
        id: 3,
        title: 'Разработка API',
        description: 'Создание REST API для управления задачами',
        priority: 'high',
        deadline: '2025-07-12',
      },
    ],
  },
  {
    title: 'На проверке',
    id: 'review',
    tasks: [
      {
        id: 4,
        title: 'Тестирование компонентов',
        description: 'Написание unit тестов для Vue компонентов',
        priority: 'low',
      },
    ],
  },
  {
    title: 'Выполнено',
    id: 'done',
    tasks: [
      {
        id: 5,
        title: 'Настройка проекта',
        description: 'Инициализация Vue проекта с Naive UI',
        priority: 'medium',
      },
    ],
  },
]
