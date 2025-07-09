/**
 * Типы для колонок канбан-доски
 */

import type { Task } from './task'

export type ColumnId = 'todo' | 'progress' | 'review' | 'done'

export interface Column {
  id: ColumnId
  title: string
  tasks: Task[]
}
