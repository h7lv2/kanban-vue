/**
 * Simple test to verify the backend integration
 */

import { apiService } from '../services/api'

// Test the API connection
async function testApiConnection() {
  console.log('🧪 Testing API connection...')

  try {
    // Test fetching tasks
    console.log('📥 Fetching tasks...')
    const tasks = await apiService.getTasks()
    console.log(
      `✅ Successfully fetched ${tasks.length} tasks:`,
      tasks.map((t) => t.title),
    )

    // Test creating a task
    console.log('📤 Creating a test task...')
    const newTask = await apiService.createTask({
      title: 'Test Task from Vue',
      description: 'This task was created from the Vue frontend',
      priority: 'low',
      current_column: 'todo',
    })
    console.log('✅ Successfully created task:', newTask)

    // Test fetching tasks again to verify the new task was added
    console.log('📥 Fetching tasks again...')
    const updatedTasks = await apiService.getTasks()
    console.log(`✅ Now have ${updatedTasks.length} tasks`)

    console.log('🎉 All API tests passed!')
    return true
  } catch (error) {
    console.error('❌ API test failed:', error)
    return false
  }
}

// Export for manual testing in browser console
declare global {
  interface Window {
    testApiConnection: () => Promise<boolean>
  }
}

window.testApiConnection = testApiConnection

export { testApiConnection }
