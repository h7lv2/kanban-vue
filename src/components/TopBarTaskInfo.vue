<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { NModal, NCard, NText, NTag, NAvatar, NSpin, NDivider } from '@arijs/naive-ui'
import type { Task } from '../types/task'
import type { ApiUser } from '../services/api'
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../types/priority'
import { apiService } from '../services/api'

interface Props {
  isOpen: boolean
  task: Task | null
  assignees?: string[] // Changed from number[] to string[]
}

const props = defineProps<Props>()
const emit = defineEmits(['modal-close'])

// State for assignees data
const assigneesData = ref<ApiUser[]>([])
const loadingAssignees = ref(false)

// Computed properties
const formattedDeadline = computed(() => {
  if (!props.task?.deadline) return null
  try {
    return new Date(props.task.deadline).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return props.task.deadline
  }
})

const formattedCreatedDate = computed(() => {
  if (!props.task) return null
  // Assuming task has a created_at field from the API
  try {
    return new Date().toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return 'Неизвестно'
  }
})

// Fetch assignees data when task changes
const fetchAssignees = async () => {
  if (!props.assignees || props.assignees.length === 0) {
    assigneesData.value = []
    return
  }

  loadingAssignees.value = true
  try {
    // Fetch all users and filter by assignees
    const allUsers = await apiService.getUsers()
    assigneesData.value = allUsers.filter((user) => props.assignees!.includes(user.id))
  } catch (error) {
    console.error('Error fetching assignees:', error)
    assigneesData.value = []
  } finally {
    loadingAssignees.value = false
  }
}

// Watch for changes in assignees
const stopWatcher = ref<(() => void) | null>(null)

onMounted(() => {
  // Watch assignees prop changes
  stopWatcher.value = (() => {
    let prevAssignees = props.assignees
    const interval = setInterval(() => {
      if (JSON.stringify(props.assignees) !== JSON.stringify(prevAssignees)) {
        prevAssignees = props.assignees
        fetchAssignees()
      }
    }, 100)
    return () => clearInterval(interval)
  })()
})

onUnmounted(() => {
  if (stopWatcher.value) {
    stopWatcher.value()
  }
})

// Fetch assignees when modal opens
// Watch for modal open state
onMounted(() => {
  const checkModalState = () => {
    if (props.isOpen && props.task) {
      fetchAssignees()
    }
  }

  // Check immediately and set up interval
  checkModalState()
  const intervalId = setInterval(checkModalState, 200)

  onUnmounted(() => {
    clearInterval(intervalId)
  })
})
</script>

<template>
  <n-modal
    :show="isOpen"
    @mask-click="emit('modal-close')"
    @update:show="(show: boolean) => !show && emit('modal-close')"
  >
    <n-card
      v-if="task"
      style="width: 700px; height: 600px; display: flex; flex-direction: column"
      :title="task.title"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-tag :type="PRIORITY_COLORS[task.priority]" size="medium" round>
          {{ PRIORITY_LABELS[task.priority] }}
        </n-tag>
      </template>

      <div class="modal-body">
        <div class="content-scroll">
          <!-- Description -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Описание</h3>
            <n-text class="text-base leading-relaxed">
              {{ task.description || 'Описание отсутствует' }}
            </n-text>
          </div>

          <n-divider />

          <!-- Task Details -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Детали задачи</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <n-text depth="3" class="text-sm font-medium">Приоритет:</n-text>
                <div class="mt-1">
                  <n-tag :type="PRIORITY_COLORS[task.priority]" size="small">
                    {{ PRIORITY_LABELS[task.priority] }}
                  </n-tag>
                </div>
              </div>

              <div v-if="formattedDeadline">
                <n-text depth="3" class="text-sm font-medium">Дедлайн:</n-text>
                <div class="mt-1">
                  <n-text class="text-sm">{{ formattedDeadline }}</n-text>
                </div>
              </div>

              <div>
                <n-text depth="3" class="text-sm font-medium">Дата создания:</n-text>
                <div class="mt-1">
                  <n-text class="text-sm">{{ formattedCreatedDate }}</n-text>
                </div>
              </div>

              <div>
                <n-text depth="3" class="text-sm font-medium">ID задачи:</n-text>
                <div class="mt-1">
                  <n-text class="text-sm font-mono">{{ task.id }}</n-text>
                </div>
              </div>
            </div>
          </div>

          <n-divider />

          <!-- Assignees -->
          <div>
            <h3 class="text-lg font-semibold mb-3">
              Исполнители
              <span class="text-sm font-normal text-gray-500">
                ({{ assignees?.length || 0 }})
              </span>
            </h3>

            <div v-if="loadingAssignees" class="flex justify-center py-4">
              <n-spin size="medium" />
            </div>

            <div v-else-if="assigneesData.length === 0" class="text-center py-6">
              <n-text depth="3">Задача не назначена</n-text>
            </div>

            <div v-else class="assignees-static">
              <div v-for="assignee in assigneesData" :key="assignee.id" class="assignee-item">
                <n-avatar
                  round
                  size="medium"
                  :src="assignee.profile_picture"
                  :fallback-src="`https://api.dicebear.com/7.x/initials/svg?seed=${assignee.display_name}`"
                >
                  {{ assignee.display_name.charAt(0).toUpperCase() }}
                </n-avatar>

                <div class="assignee-info">
                  <n-text class="font-medium">{{ assignee.display_name }}</n-text>
                  <br />
                  <n-text depth="3" class="text-sm">@{{ assignee.username }}</n-text>
                  <n-tag v-if="assignee.is_admin" type="warning" size="small" class="ml-2">
                    Админ
                  </n-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </n-card>
  </n-modal>
</template>

<style scoped>
.modal-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.assignees-static {
  border: 1px solid #e0e0e6;
  border-radius: 6px;
  background: #fff;
}

.assignee-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f2;
  gap: 12px;
}

.assignee-item:last-child {
  border-bottom: none;
}

.assignee-info {
  flex: 1;
}

/* Custom scrollbar styling */
.content-scroll::-webkit-scrollbar {
  width: 6px;
}

.content-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.content-scroll::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.content-scroll::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-4 {
  gap: 1rem;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}
</style>
