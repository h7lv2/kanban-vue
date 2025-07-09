/**
 * Утилиты для работы с задачами
 */

import type { Task, TaskFormData } from '../types/task'

/**
 * Создает новую задачу из формы
 */
export function createTaskFromForm(formData: TaskFormData): Omit<Task, 'id'> {
  return {
    title: formData.taskName,
    description: formData.taskDescription || '',
    priority: formData.priority || 'medium',
    deadline: formData.deadlineDate || undefined,
  }
}

/**
 * Валидирует данные задачи
 */
export function validateTask(task: Partial<Task>): boolean {
  return !!(task.title && task.title.trim() && task.description)
}

/**
 * Генерирует новый ID для задачи
 */
export function generateTaskId(): number {
  return Date.now() + Math.random()
}
