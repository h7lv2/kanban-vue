/**
 * Composable for managing kanban tasks and columns
 */

import { ref, computed, onMounted } from 'vue'
import type { Column } from '../types/column'
import type { Task } from '../types/task'
import { apiService, type ApiTask } from '../services/api'

// Define the default columns based on the backend column types
const DEFAULT_COLUMN_DEFINITIONS = [
  { id: 'todo', title: 'К выполнению' },
  { id: 'progress', title: 'В работе' },
  { id: 'review', title: 'На проверке' },
  { id: 'done', title: 'Выполнено' },
] as const

export function useKanbanTasks() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const tasks = ref<ApiTask[]>([])

  /**
   * Convert API task to frontend task format
   */
  const convertApiTaskToTask = (apiTask: ApiTask): Task => ({
    id: apiTask.id,
    title: apiTask.title,
    description: apiTask.description,
    priority: apiTask.priority,
    deadline: apiTask.deadline,
  })

  /**
   * Computed columns with tasks organized by current_column
   */
  const columns = computed((): Column[] => {
    return DEFAULT_COLUMN_DEFINITIONS.map((columnDef) => ({
      id: columnDef.id,
      title: columnDef.title,
      tasks: tasks.value
        .filter((task) => task.current_column === columnDef.id)
        .map(convertApiTaskToTask),
    }))
  })

  /**
   * Get all tasks from the backend
   */
  const fetchTasks = async () => {
    isLoading.value = true
    error.value = null

    try {
      console.log('Fetching tasks from API...')
      const fetchedTasks = await apiService.getTasks()
      console.log('Fetched tasks:', fetchedTasks)
      tasks.value = fetchedTasks
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch tasks'
      console.error('Error fetching tasks:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create a new task
   */
  const createTask = async (taskData: {
    title: string
    description?: string
    priority?: 'low' | 'medium' | 'high'
    deadline?: string
    current_column?: string
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const newTask = await apiService.createTask(taskData)
      tasks.value.push(newTask)
      return newTask
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create task'
      console.error('Error creating task:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update an existing task
   */
  const updateTask = async (
    taskId: string,
    taskData: Partial<{
      title: string
      description: string
      priority: 'low' | 'medium' | 'high'
      deadline: string
      current_column: string
    }>,
  ) => {
    isLoading.value = true
    error.value = null

    try {
      const updatedTask = await apiService.updateTask(taskId, taskData)
      const index = tasks.value.findIndex((task) => task.id === taskId)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      return updatedTask
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update task'
      console.error('Error updating task:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete a task
   */
  const deleteTask = async (taskId: string) => {
    isLoading.value = true
    error.value = null

    try {
      await apiService.deleteTask(taskId)
      tasks.value = tasks.value.filter((task) => task.id !== taskId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete task'
      console.error('Error deleting task:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Move a task to a different column
   */
  const moveTask = async (taskId: string, newColumn: string) => {
    await updateTask(taskId, { current_column: newColumn })
  }

  /**
   * Move a task to the next column, or delete it if it's already in the last column
   */
  const moveTaskNext = async (taskId: string, currentColumn: string) => {
    const columnOrder = ['todo', 'progress', 'review', 'done']
    const currentIndex = columnOrder.indexOf(currentColumn)

    if (currentIndex === -1) {
      throw new Error('Invalid current column')
    }

    // If task is in the last column ('done'), delete it
    if (currentIndex === columnOrder.length - 1) {
      await deleteTask(taskId)
    } else {
      // Move to next column
      const nextColumn = columnOrder[currentIndex + 1]
      await moveTask(taskId, nextColumn)
    }
  }

  /**
   * Assign current user to a task
   */
  const assignUserToTask = async (taskId: string, userId: string) => {
    isLoading.value = true
    error.value = null

    try {
      await apiService.assignUserToTask(taskId, userId)
      // Refresh tasks to show updated assignments
      await fetchTasks()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to assign user to task'
      console.error('Error assigning user to task:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Unassign current user from a task
   */
  const unassignUserFromTask = async (taskId: string, userId: string) => {
    isLoading.value = true
    error.value = null

    try {
      await apiService.unassignUserFromTask(taskId, userId)
      // Refresh tasks to show updated assignments
      await fetchTasks()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to unassign user from task'
      console.error('Error unassigning user from task:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Refresh tasks from the backend
   */
  const refreshTasks = () => {
    return fetchTasks()
  }

  // Load tasks on mount
  onMounted(() => {
    fetchTasks()
  })

  return {
    // State
    isLoading,
    error,
    tasks,
    columns,

    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    moveTaskNext,
    assignUserToTask,
    unassignUserFromTask,
    refreshTasks,
  }
}
