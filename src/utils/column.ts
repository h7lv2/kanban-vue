/**
 * Утилиты для работы с колонками
 */

import type { Column, ColumnId } from '../types/column'
import type { Task } from '../types/task'

/**
 * Находит колонку по ID
 */
export function findColumnById(columns: Column[], id: ColumnId): Column | undefined {
  return columns.find((column) => column.id === id)
}

/**
 * Добавляет задачу в колонку
 */
export function addTaskToColumn(columns: Column[], columnId: ColumnId, task: Task): Column[] {
  return columns.map((column) =>
    column.id === columnId ? { ...column, tasks: [...column.tasks, task] } : column,
  )
}

/**
 * Удаляет задачу из колонки
 */
export function removeTaskFromColumn(
  columns: Column[],
  columnId: ColumnId,
  taskId: string,
): Column[] {
  return columns.map((column) =>
    column.id === columnId
      ? { ...column, tasks: column.tasks.filter((task) => task.id !== taskId) }
      : column,
  )
}

/**
 * Перемещает задачу между колонками
 */
export function moveTaskBetweenColumns(
  columns: Column[],
  fromColumnId: ColumnId,
  toColumnId: ColumnId,
  taskId: string,
): Column[] {
  let taskToMove: Task | undefined

  // Найти и удалить задачу из исходной колонки
  let updatedColumns = columns.map((column) => {
    if (column.id === fromColumnId) {
      const task = column.tasks.find((t) => t.id === taskId)
      if (task) {
        taskToMove = task
        return { ...column, tasks: column.tasks.filter((t) => t.id !== taskId) }
      }
    }
    return column
  })

  // Добавить задачу в целевую колонку
  if (taskToMove) {
    updatedColumns = updatedColumns.map((column) =>
      column.id === toColumnId ? { ...column, tasks: [...column.tasks, taskToMove!] } : column,
    )
  }

  return updatedColumns
}
