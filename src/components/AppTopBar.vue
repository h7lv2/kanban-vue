<script setup lang="ts">
import { ref } from 'vue'
import TopBarTaskCreate from './TopBarTaskCreate.vue'

const isModalOpened = ref(false)

const openModal = () => {
  isModalOpened.value = true
}
const closeModal = () => {
  isModalOpened.value = false
}
const modalSubmit = () => {
  closeModal()
}
</script>

<template>
  <input placeholder="Поиск по задачам..." />
  <div>
    <button>Аккаунт</button>
    <button @click="openModal">Создать задачу</button>
    <TopBarTaskCreate
      :is-open="isModalOpened"
      @modal-close="closeModal"
      @modal-submit="modalSubmit"
      name="first-modal"
    ></TopBarTaskCreate>
  </div>
</template>
