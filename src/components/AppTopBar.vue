<script setup lang="ts">
import { ref } from 'vue'
import { NLayoutHeader, NInput, NButton, NSpace } from '@arijs/naive-ui'
import TopBarTaskCreate from './TopBarTaskCreate.vue'
import TopBarAccountSettings from './TopBarAccountSettings.vue'

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
const taskModalSubmit = (taskData: {
  taskName: string
  taskDescription: string | null
  deadlineDate: string | null
  priority: 'low' | 'medium' | 'high' | null
}) => {
  closeModal('taskCreate')
  fetch(`${import.meta.env.VITE_SERVER}/tasks`, {
    method: `POST`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: taskData.taskName,
      description: taskData.taskDescription,
      date_deadline: taskData.deadlineDate,
      priority: taskData.priority,
      date_completed: null,
      current_column: 'pool',
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error creating task: ${response.status} ${response.text}`)
      }
      return response.json()
    })
    .then((data) => {
      console.log('Task created:', data)
    })
    .catch((error) => {
      console.error('Error creating task:', error)
      alert('Ошибка при создании задачи')
    })
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
