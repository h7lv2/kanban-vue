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
  <div class="header">
    <input placeholder="Поиск по задачам..." />
    <button>Аккаунт</button>
    <button @click="openModal">Создать задачу</button>
  </div>
  <TopBarTaskCreate
    :is-open="isModalOpened"
    @modal-close="closeModal"
    @modal-submit="modalSubmit"
    name="first-modal"
  ></TopBarTaskCreate>
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
