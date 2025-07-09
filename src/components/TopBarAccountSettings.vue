<script setup lang="ts">
import { ref } from 'vue'
import {
  NModal,
  NCard,
  NInput,
  NButton,
  NSpace,
  NForm,
  NFormItem,
  NTabs,
  NTabPane,
} from '@arijs/naive-ui'

const userName = ref('')
const userPassword = ref('')
const confirmPassword = ref('')
const displayName = ref('')

defineProps({
  isOpen: Boolean,
})
const emit = defineEmits(['modal-close', 'login-submit', 'register-submit'])

const activeTab = ref('login')

function clearForm() {
  userName.value = ''
  userPassword.value = ''
  confirmPassword.value = ''
  displayName.value = ''
}

function cancelSettings() {
  clearForm()
  emit('modal-close')
}

function submitLogin() {
  if (!userName.value || !userPassword.value) {
    alert('Пожалуйста, заполните все поля')
    return
  }

  emit('login-submit', {
    username: userName.value,
    password: userPassword.value,
  })
  clearForm()
}

function submitRegister() {
  // Basic validation
  if (!userName.value || !userPassword.value || !displayName.value) {
    alert('Пожалуйста, заполните все обязательные поля')
    return
  }

  if (userPassword.value !== confirmPassword.value) {
    alert('Пароли не совпадают')
    return
  }

  if (userPassword.value.length < 6) {
    alert('Пароль должен содержать минимум 6 символов')
    return
  }

  emit('register-submit', {
    username: userName.value,
    password: userPassword.value,
    display_name: displayName.value,
  })
  clearForm()
}
</script>

<template>
  <n-modal
    :show="isOpen"
    @mask-click="emit('modal-close')"
    @update:show="(show: boolean) => !show && emit('modal-close')"
  >
    <n-card
      style="width: 600px"
      title="Аккаунт"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-tabs v-model:value="activeTab" type="line" animated>
        <!-- Login Tab -->
        <n-tab-pane name="login" tab="Вход">
          <n-form @submit.prevent="submitLogin">
            <n-form-item label="Имя пользователя">
              <n-input v-model:value="userName" placeholder="Введите имя пользователя" clearable />
            </n-form-item>

            <n-form-item label="Пароль">
              <n-input
                v-model:value="userPassword"
                type="password"
                placeholder="Введите пароль"
                show-password-on="click"
                clearable
              />
            </n-form-item>
          </n-form>

          <div class="mt-6">
            <n-space justify="end">
              <n-button @click="cancelSettings"> Отмена </n-button>
              <n-button type="primary" @click="submitLogin"> Войти </n-button>
            </n-space>
          </div>
        </n-tab-pane>

        <!-- Registration Tab -->
        <n-tab-pane name="register" tab="Регистрация">
          <n-form @submit.prevent="submitRegister">
            <n-form-item label="Имя пользователя" required>
              <n-input v-model:value="userName" placeholder="Введите имя пользователя" clearable />
            </n-form-item>

            <n-form-item label="Отображаемое имя" required>
              <n-input
                v-model:value="displayName"
                placeholder="Введите отображаемое имя"
                clearable
              />
            </n-form-item>

            <n-form-item label="Пароль" required>
              <n-input
                v-model:value="userPassword"
                type="password"
                placeholder="Введите пароль (минимум 6 символов)"
                show-password-on="click"
                clearable
              />
            </n-form-item>

            <n-form-item label="Подтвердите пароль" required>
              <n-input
                v-model:value="confirmPassword"
                type="password"
                placeholder="Подтвердите пароль"
                show-password-on="click"
                clearable
              />
            </n-form-item>
          </n-form>

          <div class="mt-6">
            <n-space justify="end">
              <n-button @click="cancelSettings"> Отмена </n-button>
              <n-button type="primary" @click="submitRegister"> Зарегистрироваться </n-button>
            </n-space>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-modal>
</template>
