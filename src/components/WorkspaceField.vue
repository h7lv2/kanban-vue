<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { NCard, NSpin, NResult, NButton } from '@arijs/naive-ui'
import FieldCard from './FieldCard.vue'
import { useKanbanTasks } from '../composables/useKanbanTasks'

// Use kanban tasks composable
const { columns, isLoading, error, refreshTasks } = useKanbanTasks()

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
              @edit="() => console.log('Edit task', task.id)"
              @info="() => console.log('Show task info', task.id)"
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
              @edit="() => console.log('Edit task', task.id)"
              @info="() => console.log('Show task info', task.id)"
            />

            <div v-if="column.tasks.length === 0" class="text-gray-400 text-center py-12 text-sm">
              Перетащите задачи сюда
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>
