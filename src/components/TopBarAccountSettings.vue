<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const userName = ref('')
const userPassword = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

defineProps({
  isOpen: Boolean,
})
const emit = defineEmits(['modal-close', 'modal-submit'])

const targetElement = ref(null)
onClickOutside(targetElement, () => emit('modal-close'))

const showPasswordChange = ref(false)

function clearForm() {
  userName.value = ''
  userPassword.value = ''
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  showPasswordChange.value = false
}

function cancelSettings() {
  clearForm()
  emit('modal-close')
}

function submitAccountSettings() {
  // Basic validation
  if (showPasswordChange.value && newPassword.value !== confirmPassword.value) {
    alert('Новый пароль и подтверждение пароля не совпадают')
    return
  }

  emit('modal-submit', {
    userName: userName.value,
    userPassword: userPassword.value,
    currentPassword: currentPassword.value ? currentPassword.value : null,
    newPassword: showPasswordChange.value ? newPassword.value : null,
  })
}
</script>

<template>
  <transition name="modal">
    <div v-if="isOpen" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" ref="targetElement">
          <h3 class="modal-title">Настройки аккаунта</h3>

          <input
            v-model="userName"
            type="email"
            placeholder="Имя пользователя"
            class="input-field"
          />

          <input v-model="userPassword" type="password" placeholder="Пароль" class="input-field" />

          <div class="checkbox-wrapper">
            <input
              v-model="showPasswordChange"
              type="checkbox"
              id="passwordChangeCheckmark"
              class="checkbox-input"
            />
            <label for="passwordChangeCheckmark">Изменить пароль</label>
          </div>

          <div v-if="showPasswordChange" class="password-section">
            <input
              v-model="currentPassword"
              type="password"
              placeholder="Текущий пароль"
              class="input-field"
            />
            <input
              v-model="newPassword"
              type="password"
              placeholder="Новый пароль"
              class="input-field"
            />
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Подтвердите новый пароль"
              class="input-field"
            />
          </div>

          <div class="modal-actions">
            <button @click="cancelSettings" class="cancel-button">Отмена</button>
            <button @click="submitAccountSettings" class="submit-button">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="css" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}

.modal-container {
  width: 450px;
  margin: 0 20px;
  padding: 24px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-title {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
}

.input-field {
  width: 95%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s;
}

.input-field::placeholder {
  color: #999;
  opacity: 1;
}

.input-field:focus {
  outline: none;
  border-color: #42b983;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  accent-color: #42b983;
}

.password-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #42b983;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.cancel-button,
.submit-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.cancel-button:hover {
  background-color: #eaeaea;
}

.submit-button {
  background-color: #42b983;
  color: white;
  border: none;
}

.submit-button:hover {
  background-color: #369f6e;
}
</style>
