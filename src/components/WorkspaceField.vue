<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { NCard, NSpin, NResult, NButton } from '@arijs/naive-ui'
import FieldCard from './FieldCard.vue'
import TopBarTaskEdit from './TopBarTaskEdit.vue'
import { useKanbanTasks } from '../composables/useKanbanTasks'
import { useAuth } from '../composables/useAuth'
import type { Task } from '../types/task'

// Use kanban tasks composable
const {
  columns,
  isLoading,
  error,
  refreshTasks,
  updateTask,
  moveTaskNext,
  assignUserToTask,
  unassignUserFromTask,
  tasks,
} = useKanbanTasks()

// Use authentication composable
const { userId } = useAuth()

// Edit modal state
const isEditModalOpen = ref(false)
const editingTask = ref<Task | null>(null)

// Handle edit task
function handleEditTask(task: Task) {
  editingTask.value = task
  isEditModalOpen.value = true
}

// Handle edit modal close
function handleEditModalClose() {
  isEditModalOpen.value = false
  editingTask.value = null
}

// Handle edit modal submit
async function handleEditModalSubmit(formData: {
  id: number
  taskName: string
  taskDescription?: string | null
  deadlineDate?: string | null
  priority?: string | null
}) {
  try {
    await updateTask(formData.id.toString(), {
      title: formData.taskName,
      description: formData.taskDescription || '',
      deadline: formData.deadlineDate || undefined,
      priority: formData.priority as 'low' | 'medium' | 'high' | undefined,
    })
    isEditModalOpen.value = false
    editingTask.value = null
  } catch (error) {
    console.error('Failed to update task:', error)
  }
}

// Handle move task to next column
async function handleMoveTaskNext(task: Task, currentColumn: string) {
  try {
    await moveTaskNext(task.id, currentColumn)
  } catch (error) {
    console.error('Failed to move task:', error)
  }
}

// Handle assign user to task
async function handleAssignSelf(task: Task) {
  if (!userId.value) {
    alert('Необходимо войти в систему для назначения на задачу')
    return
  }

  try {
    await assignUserToTask(task.id, userId.value)
  } catch (error) {
    console.error('Failed to assign user to task:', error)
    alert('Ошибка при назначении на задачу')
  }
}

// Handle unassign user from task
async function handleUnassignSelf(task: Task) {
  if (!userId.value) {
    return
  }

  try {
    await unassignUserFromTask(task.id, userId.value)
  } catch (error) {
    console.error('Failed to unassign user from task:', error)
    alert('Ошибка при снятии с задачи')
  }
}

// Отслеживание размера окна
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

const updateWindowSize = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

onMounted(() => {
  window.addEventListener('resize', updateWindowSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowSize)
})

// Caclulate aspect ratio and determine layout mode
const aspectRatio = computed(() => windowWidth.value / windowHeight.value)
const columnWidth = 320
const gapWidth = 24 //
const containerPadding = 48

// Find how many columns can fit based on available width
const availableWidth = computed(() => windowWidth.value - containerPadding)
const totalColumnsWidth = computed(
  () => columns.value.length * columnWidth + (columns.value.length - 1) * gapWidth,
)
const allColumnsFit = computed(() => availableWidth.value >= totalColumnsWidth.value)

// Switch to column mode only if:
// 1. Aspect ratio is suitable (landscape orientation)
// 2. All columns fit without scrolling OR the screen is wide enough for comfortable scrolling
const isWideScreen = computed(
  () => aspectRatio.value > 1.3 && (allColumnsFit.value || windowWidth.value >= 1400),
)
</script>

<template>
  <div class="relative">
    <!-- Debug info and refresh button -->
    <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex justify-between items-center">
        <div class="text-sm text-blue-700">
          <span>Состояние: </span>
          <span v-if="isLoading" class="font-semibold">Загрузка...</span>
          <span v-else-if="error" class="font-semibold text-red-600">Ошибка: {{ error }}</span>
          <span v-else class="font-semibold text-green-600"
            >Загружено {{ columns.reduce((sum, col) => sum + col.tasks.length, 0) }} задач</span
          >
        </div>
        <n-button size="small" @click="refreshTasks" :loading="isLoading"> Обновить </n-button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <n-spin size="large" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex justify-center items-center h-64">
      <n-result status="error" title="Ошибка загрузки" :description="error">
        <template #footer>
          <n-button @click="refreshTasks" type="primary">Попробовать снова</n-button>
        </template>
      </n-result>
    </div>

    <!-- Column UI for wide displays -->
    <div v-else-if="isWideScreen" class="flex gap-6 overflow-x-auto pb-4">
      <div v-for="column in columns" :key="column.id" class="flex-none w-80 min-h-[600px] mt-4">
        <n-card
          :title="column.title"
          size="small"
          class="h-full shadow-lg border-0 bg-white rounded-lg"
          :bordered="false"
          header-style="padding: 16px 16px 8px 16px; font-weight: 600; font-size: 16px;"
        >
          <div class="space-y-4 p-2">
            <FieldCard
              v-for="task in column.tasks"
              :key="task.id"
              :title="task.title"
              :description="task.description"
              :priority="task.priority"
              :deadline="task.deadline"
              :current-column="column.id"
              :assignees="tasks.find((t: any) => t.id === task.id)?.assignees || []"
              :current-user-id="userId"
              @edit="() => handleEditTask(task)"
              @info="() => console.log('Show task info', task.id)"
              @move-next="() => handleMoveTaskNext(task, column.id)"
              @assign-self="() => handleAssignSelf(task)"
              @unassign-self="() => handleUnassignSelf(task)"
            />

            <div v-if="column.tasks.length === 0" class="text-gray-400 text-center py-12 text-sm">
              Перетащите задачи сюда
            </div>
          </div>
        </n-card>
      </div>
    </div>

    <!-- List UI for tall displays -->
    <div v-else class="space-y-6">
      <div v-for="column in columns" :key="column.id" class="w-full mt-4">
        <n-card
          :title="column.title"
          size="small"
          class="shadow-lg border-0 bg-white rounded-lg"
          :bordered="false"
          header-style="padding: 16px 16px 8px 16px; font-weight: 600; font-size: 16px;"
        >
          <div class="space-y-4 p-2">
            <FieldCard
              v-for="task in column.tasks"
              :key="task.id"
              :title="task.title"
              :description="task.description"
              :priority="task.priority"
              :deadline="task.deadline"
              :current-column="column.id"
              :assignees="tasks.find((t: any) => t.id === task.id)?.assignees || []"
              :current-user-id="userId"
              @edit="() => handleEditTask(task)"
              @info="() => console.log('Show task info', task.id)"
              @move-next="() => handleMoveTaskNext(task, column.id)"
              @assign-self="() => handleAssignSelf(task)"
              @unassign-self="() => handleUnassignSelf(task)"
            />

            <div v-if="column.tasks.length === 0" class="text-gray-400 text-center py-12 text-sm">
              Перетащите задачи сюда
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>

  <!-- Edit Task Modal -->
  <TopBarTaskEdit
    :is-open="isEditModalOpen"
    :task="editingTask"
    @modal-close="handleEditModalClose"
    @modal-submit="handleEditModalSubmit"
  />
</template>
