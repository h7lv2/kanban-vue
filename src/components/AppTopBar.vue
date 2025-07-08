<script setup lang="ts">
import { ref } from 'vue'
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
const taskModalSubmit = () => {
  closeModal('taskCreate')
}

const accountModalSubmit = (accountData: {
  userName: string
  userPassword: string
  currentPassword: string | null
  newPassword: string | null
}) => {
  closeModal('accountSettings')
  if (accountData.userName && accountData.userPassword) {
    fetch(`${import.meta.env.VITE_SERVER}/api/auth/login`, {
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
  <div class="header">
    <input placeholder="Поиск по задачам..." />
    <button @click="() => openModal('accountSettings')">Аккаунт</button>
    <button @click="() => openModal('taskCreate')">Создать задачу</button>
  </div>
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

<style lang="css" scoped>
.header {
  display: flex;
  justify-content: center;
  position: fixed;
  width: 100%;
  height: 10%;
  background-color: #28b6f8;
}
.header input {
  font-size: 15px;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: auto;
  width: 30%;
  height: 30%;
  border-radius: 5px;
  border: none;
  outline-color: #1b84a7;
}
.header button {
  background-color: #ffffff;
  border: none;
  border-radius: 5px;
  height: 50%;
  width: 10%;
  margin-right: 3%;
  margin-top: 1%;
  cursor: pointer;
  transition: all 0.2s;
}

.header button:hover {
  background-color: #e6e6e6;
}
</style>
