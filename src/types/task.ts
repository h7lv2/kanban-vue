/**
 * Типы для задач
 */

import type { Priority } from './priority'

export interface Task {
  id: number
  title: string
  description: string
  priority: Priority
  deadline?: string
}

export interface TaskFormData {
  taskName: string
  taskDescription?: string | null
  deadlineDate?: string | null
  priority?: Priority | null
}
