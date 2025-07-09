/**
 * Данные по умолчанию для канбан-доски
 */

import type { Column } from '../types/column'

export const DEFAULT_COLUMNS: Column[] = [
  {
    id: 'todo',
    title: 'К выполнению',
    tasks: [
      {
        id: 1,
        title: 'Пример задачи 1',
        description:
          'Это примерная задача для демонстрации интерфейса lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
        priority: 'high',
        deadline: '2025-07-15',
      },
      {
        id: 2,
        title: 'Изучить Vue 3',
        description: 'Освоить основы Vue 3 и Composition API',
        priority: 'medium',
      },
    ],
  },
  {
    id: 'progress',
    title: 'В работе',
    tasks: [
      {
        id: 3,
        title: 'Разработка компонентов',
        description: 'Создание переиспользуемых компонентов для канбан-доски',
        priority: 'high',
        deadline: '2025-07-12',
      },
    ],
  },
  {
    id: 'review',
    title: 'На проверке',
    tasks: [
      {
        id: 4,
        title: 'Код-ревью',
        description: 'Проверка кода новых функций',
        priority: 'medium',
      },
    ],
  },
  {
    id: 'done',
    title: 'Выполнено',
    tasks: [
      {
        id: 5,
        title: 'Настройка проекта',
        description: 'Первоначальная настройка Vue проекта с TypeScript',
        priority: 'low',
      },
    ],
  },
]
