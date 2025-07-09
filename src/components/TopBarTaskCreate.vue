<script setup lang="ts">
import { ref } from 'vue'
import {
  NModal,
  NCard,
  NInput,
  NButton,
  NCheckbox,
  NDatePicker,
  NSpace,
  NForm,
  NFormItem,
  NSelect,
} from '@arijs/naive-ui'

const taskName = ref('')
const taskDescription = ref('')
const deadlineDate = ref<number | null>(null)
const priority = ref<'low' | 'medium' | 'high'>('medium')

defineProps({
  isOpen: Boolean,
})
const emit = defineEmits(['modal-close', 'modal-submit'])

const showDate = ref(false)
const showPriority = ref(false)

const priorityOptions = [
  { label: 'Низкий', value: 'low' },
  { label: 'Средний', value: 'medium' },
  { label: 'Высокий', value: 'high' },
]

function clearForm() {
  taskName.value = ''
  taskDescription.value = ''
  deadlineDate.value = null
  priority.value = 'medium'
  showDate.value = false
  showPriority.value = false
}

function cancelModal() {
  clearForm()
  emit('modal-close')
}

function submitModal() {
  // Простая валидация
  if (!taskName.value.trim()) {
    return // Кнопка уже отключена, но на всякий случай
  }

  const formattedDate = deadlineDate.value
    ? new Date(deadlineDate.value).toISOString().split('T')[0]
    : null

  emit('modal-submit', {
    taskName: taskName.value.trim(),
    taskDescription: taskDescription.value?.trim() || null,
    deadlineDate: formattedDate,
    priority: showPriority.value ? priority.value : null,
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
      title="Создание задачи"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-form @submit.prevent="submitModal" @keydown.enter="submitModal">
        <n-form-item label="Название задачи" required>
          <n-input
            v-model:value="taskName"
            placeholder="Введите название задачи"
            clearable
            maxlength="100"
            show-count
            @keydown.enter="submitModal"
          />
        </n-form-item>

        <n-form-item label="Описание">
          <n-input
            v-model:value="taskDescription"
            type="textarea"
            placeholder="Описание задачи (необязательно)"
            :rows="3"
            clearable
            maxlength="500"
            show-count
          />
        </n-form-item>

        <n-form-item>
          <n-checkbox v-model:checked="showDate"> Установить дедлайн </n-checkbox>
        </n-form-item>

        <n-form-item v-if="showDate" label="Дедлайн">
          <n-date-picker
            v-model:value="deadlineDate"
            type="date"
            placeholder="Выберите дату"
            clearable
            style="width: 100%"
          />
        </n-form-item>

        <n-form-item>
          <n-checkbox v-model:checked="showPriority"> Установить приоритет </n-checkbox>
        </n-form-item>

        <n-form-item v-if="showPriority" label="Приоритет">
          <n-select
            v-model:value="priority"
            :options="priorityOptions"
            placeholder="Выберите приоритет"
            style="width: 100%"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="cancelModal"> Отмена </n-button>
          <n-button type="primary" @click="submitModal" :disabled="!taskName.trim()">
            Сохранить
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>
