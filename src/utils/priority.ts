/**
 * Утилиты для работы с приоритетами
 */

import type { Priority } from '../types/priority'
import { PRIORITY_LABELS, PRIORITY_COLORS } from '../types/priority'

/**
 * Получает читаемое название приоритета
 */
export function getPriorityLabel(priority: Priority): string {
  return PRIORITY_LABELS[priority]
}

/**
 * Получает цвет для приоритета
 */
export function getPriorityColor(priority: Priority): string {
  return PRIORITY_COLORS[priority]
}

/**
 * Сортирует приоритеты по важности
 */
export function sortByPriority(priorities: Priority[]): Priority[] {
  const order: Record<Priority, number> = { high: 3, medium: 2, low: 1 }
  return priorities.sort((a, b) => order[b] - order[a])
}
