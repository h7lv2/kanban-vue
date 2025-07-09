<script setup lang="ts">
import { ref, watch } from 'vue'
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
import type { Priority } from '../types/priority'
import { PRIORITY_OPTIONS } from '../types/priority'
import type { Task } from '../types/task'

interface Props {
  isOpen: boolean
  task?: Task | null
}

const props = defineProps<Props>()
const emit = defineEmits(['modal-close', 'modal-submit'])

// Add debugging for props
watch(
  () => props.isOpen,
  (newValue) => {
    console.log('=== TopBarTaskEdit isOpen changed ===', newValue)
  },
  { immediate: true }
)

watch(
  () => props.task,
  (newValue) => {
    console.log('=== TopBarTaskEdit task changed ===', newValue)
  },
  { immediate: true }
)

const taskName = ref('')
const taskDescription = ref('')
const deadlineDate = ref<number | null>(null)
const priority = ref<Priority>('medium')
const showDate = ref(false)
const showPriority = ref(false)

// Watch for task changes to populate form
watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      taskName.value = newTask.title
      taskDescription.value = newTask.description || ''
      priority.value = newTask.priority

      // Handle deadline
      if (newTask.deadline) {
        deadlineDate.value = new Date(newTask.deadline).getTime()
        showDate.value = true
      } else {
        deadlineDate.value = null
        showDate.value = false
      }

      // Show priority section if task has priority
      showPriority.value = !!newTask.priority
    }
  },
  { immediate: true }
)

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
  if (!taskName.value.trim() || !props.task) {
    return
  }

  const formattedDate = deadlineDate.value
    ? new Date(deadlineDate.value).toISOString().split('T')[0]
    : null

  emit('modal-submit', {
    id: props.task.id,
    taskName: taskName.value.trim(),
    taskDescription: taskDescription.value?.trim() || null,
    deadlineDate: showDate.value ? formattedDate : null,
    priority: showPriority.value ? priority.value : null,
  })
  clearForm()
}
</script>

<template>
  <n-modal
    :show="isOpen"
    :mask-closable="true"
    :close-on-esc="true"
    @update:show="(show: boolean) => !show && cancelModal()"
  >
    <n-card
      style="width: 600px"
      title="Редактирование задачи"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-form @submit.prevent="submitModal">
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
            @click.stop
            @focus.stop
          />
        </n-form-item>

        <n-form-item>
          <n-checkbox v-model:checked="showPriority"> Установить приоритет </n-checkbox>
        </n-form-item>

        <n-form-item v-if="showPriority" label="Приоритет">
          <n-select
            v-model:value="priority"
            :options="PRIORITY_OPTIONS"
            placeholder="Выберите приоритет"
            style="width: 100%"
            @click.stop
            @focus.stop
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="cancelModal"> Отмена </n-button>
          <n-button type="primary" @click="submitModal" :disabled="!taskName.trim()">
            Сохранить изменения
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>
