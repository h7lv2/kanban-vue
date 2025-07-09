<script setup lang="ts">
import { ref } from 'vue'
import { NLayoutHeader, NInput, NButton, NSpace } from '@arijs/naive-ui'
import TopBarTaskCreate from './TopBarTaskCreate.vue'
import TopBarAccountSettings from './TopBarAccountSettings.vue'
import { useKanbanTasks } from '../composables/useKanbanTasks'

// Use the kanban tasks composable for task management
const { createTask, refreshTasks } = useKanbanTasks()

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

const accountModalSubmit = (accountData: {
  userName: string
  userPassword: string
  currentPassword: string | null
  newPassword: string | null
}) => {
  closeModal('accountSettings')
  if (accountData.userName && accountData.userPassword) {
    fetch(`${import.meta.env.VITE_SERVER}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: accountData.userName,
        password: accountData.userPassword,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          alert(`Ошибка: ${response.status} ${response.statusText}`)
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((body) => {
        console.log(body)
        document.cookie = `user=${JSON.stringify(body.user)}`
      })
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
        <n-button @click="() => openModal('accountSettings')"> Аккаунт </n-button>
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
    @modal-submit="accountModalSubmit"
    name="account-modal"
  ></TopBarAccountSettings>
</template>
