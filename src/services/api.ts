/**
 * API service for communicating with the kanban-flask backend
 */

export interface ApiTask {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  deadline?: string
  date_created: number
  date_completed?: number
  current_column: string
  created_at: string
  assignees: number[]
}

export interface ApiUser {
  id: number
  username: string
  display_name: string
  profile_picture?: string
  is_admin: boolean
  date_created: number
  created_at: string
  tasks_assigned: number[]
}

export class ApiService {
  private baseUrl: string

  constructor(baseUrl?: string) {
    // Use proxy in development, fallback to provided URL or localhost
    this.baseUrl = baseUrl || (import.meta.env.DEV ? '' : 'http://localhost:5000')
  }

  /**
   * Fetch all tasks from the backend
   */
  async getTasks(): Promise<ApiTask[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tasks`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw error
    }
  }

  /**
   * Fetch tasks for a specific column
   */
  async getTasksByColumn(column: string): Promise<ApiTask[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tasks?column=${encodeURIComponent(column)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching tasks for column ${column}:`, error)
      throw error
    }
  }

  /**
   * Fetch a specific task by ID
   */
  async getTask(taskId: string): Promise<ApiTask> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tasks/${taskId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error)
      throw error
    }
  }

  /**
   * Create a new task
   */
  async createTask(taskData: {
    title: string
    description?: string
    priority?: string
    deadline?: string
    current_column?: string
  }): Promise<ApiTask> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  /**
   * Update an existing task
   */
  async updateTask(
    taskId: string,
    taskData: Partial<{
      title: string
      description: string
      priority: string
      deadline: string
      current_column: string
    }>,
  ): Promise<ApiTask> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error)
      throw error
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tasks/${taskId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error(`Error deleting task ${taskId}:`, error)
      throw error
    }
  }

  /**
   * Fetch all users
   */
  async getUsers(): Promise<ApiUser[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/users`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }
}

// Default API service instance
export const apiService = new ApiService()
