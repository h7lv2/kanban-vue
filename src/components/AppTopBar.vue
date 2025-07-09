<script setup lang="ts">
import { ref } from 'vue'
import { NLayoutHeader, NInput, NButton, NSpace } from '@arijs/naive-ui'
import TopBarTaskCreate from './TopBarTaskCreate.vue'
import TopBarAccountSettings from './TopBarAccountSettings.vue'
import { useKanbanTasks } from '../composables/useKanbanTasks'
import { useAuth } from '../composables/useAuth'
import { apiService } from '../services/api'

// Use the kanban tasks composable for task management
const { createTask, refreshTasks } = useKanbanTasks()

// Use authentication composable
const { isLoggedIn, userDisplayName, saveUserToCookie, logout } = useAuth()

// Modal state management
const modals = ref({
  taskCreate: false,
  accountSettings: false,
})

// Generic modal functions
const openModal = (modalName: keyof typeof modals.value) => {
  modals.value[modalName] = true
}

const closeModal = (modalName: keyof typeof modals.value) => {
  modals.value[modalName] = false
}

// Specific modal handlers
const taskModalSubmit = async (taskData: {
  taskName: string
  taskDescription: string | null
  deadlineDate: string | null
  priority: 'low' | 'medium' | 'high' | null
}) => {
  closeModal('taskCreate')

  try {
    await createTask({
      title: taskData.taskName,
      description: taskData.taskDescription || '',
      priority: taskData.priority || 'medium',
      deadline: taskData.deadlineDate || undefined,
      current_column: 'todo', // Default to todo column
    })
    console.log('Task created successfully')
    // Refresh the board to ensure it's up to date
    await refreshTasks()
  } catch (error) {
    console.error('Error creating task:', error)
    alert('Ошибка при создании задачи')
  }
}

const handleLogin = async (credentials: { username: string; password: string }) => {
  closeModal('accountSettings')
  try {
    const result = await apiService.loginUser(credentials)
    console.log('Login successful:', result)
    saveUserToCookie(result.user)
    alert(`Добро пожаловать, ${result.user.display_name}!`)
  } catch (error) {
    console.error('Login failed:', error)
    alert(`Ошибка входа: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
  }
}

const handleRegister = async (userData: {
  username: string
  password: string
  display_name: string
}) => {
  closeModal('accountSettings')
  try {
    const newUser = await apiService.createUser(userData)
    console.log('Registration successful:', newUser)
    alert(`Регистрация прошла успешно! Добро пожаловать, ${newUser.display_name}!`)

    // Automatically log in the user after registration
    await handleLogin({ username: userData.username, password: userData.password })
  } catch (error) {
    console.error('Registration failed:', error)
    alert(`Ошибка регистрации: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
  }
}
</script>

<template>
  <n-layout-header
    class="fixed top-0 w-full h-16 bg-blue-500 shadow-lg border-b-2 border-blue-600 z-50"
  >
    <div class="flex items-center h-full px-4 gap-4">
      <n-input placeholder="Поиск по задачам..." class="flex-1 max-w-md" clearable />

      <n-space class="ml-auto" align="center">
        <span class="text-white font-medium">Проекты</span>
        <n-button type="primary" @click="() => openModal('taskCreate')"> Создать задачу </n-button>

        <!-- Show different buttons based on login state -->
        <template v-if="isLoggedIn">
          <span class="text-white font-medium">{{ userDisplayName }}</span>
          <n-button @click="logout"> Выйти </n-button>
        </template>
        <template v-else>
          <n-button @click="() => openModal('accountSettings')"> Аккаунт </n-button>
        </template>
      </n-space>
    </div>
  </n-layout-header>

  <!-- Дополнительный разделитель для лучшего визуального отделения -->
  <div class="fixed top-16 w-full h-1 bg-gradient-to-b from-blue-200 to-transparent z-40"></div>

  <TopBarTaskCreate
    :is-open="modals.taskCreate"
    @modal-close="() => closeModal('taskCreate')"
    @modal-submit="taskModalSubmit"
    name="first-modal"
  ></TopBarTaskCreate>

  <TopBarAccountSettings
    :is-open="modals.accountSettings"
    @modal-close="() => closeModal('accountSettings')"
    @login-submit="handleLogin"
    @register-submit="handleRegister"
    name="account-modal"
  ></TopBarAccountSettings>
</template>
