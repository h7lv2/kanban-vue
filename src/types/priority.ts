/**
 * Типы для определения приоритетов задач
 */

export type Priority = 'low' | 'medium' | 'high'

export const PRIORITY_COLORS = {
  low: 'success',
  medium: 'warning',
  high: 'error',
} as const

export const PRIORITY_LABELS = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
} as const

export const PRIORITY_OPTIONS = [
  { label: 'Низкий', value: 'low' as Priority },
  { label: 'Средний', value: 'medium' as Priority },
  { label: 'Высокий', value: 'high' as Priority },
]
