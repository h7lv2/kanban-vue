<script setup lang="ts">
import { ref } from 'vue'
import {
  NModal,
  NCard,
  NInput,
  NButton,
  NCheckbox,
  NSpace,
  NForm,
  NFormItem,
} from '@arijs/naive-ui'

const userName = ref('')
const userPassword = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

defineProps({
  isOpen: Boolean,
})
const emit = defineEmits(['modal-close', 'modal-submit'])

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
      title="Настройки аккаунта"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-form @submit.prevent="submitAccountSettings">
        <n-form-item label="Имя пользователя">
          <n-input v-model:value="userName" placeholder="Введите email" clearable />
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

        <n-form-item>
          <n-checkbox v-model:checked="showPasswordChange"> Изменить пароль </n-checkbox>
        </n-form-item>

        <template v-if="showPasswordChange">
          <n-form-item label="Текущий пароль">
            <n-input
              v-model:value="currentPassword"
              type="password"
              placeholder="Введите текущий пароль"
              show-password-on="click"
              clearable
            />
          </n-form-item>

          <n-form-item label="Новый пароль">
            <n-input
              v-model:value="newPassword"
              type="password"
              placeholder="Введите новый пароль"
              show-password-on="click"
              clearable
            />
          </n-form-item>

          <n-form-item label="Подтвердите новый пароль">
            <n-input
              v-model:value="confirmPassword"
              type="password"
              placeholder="Подтвердите новый пароль"
              show-password-on="click"
              clearable
            />
          </n-form-item>
        </template>

        <template #footer>
          <n-space justify="end">
            <n-button @click="cancelSettings"> Отмена </n-button>
            <n-button type="primary" @click="submitAccountSettings"> Сохранить </n-button>
          </n-space>
        </template>
      </n-form>
    </n-card>
  </n-modal>
</template>
