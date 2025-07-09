<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { NCard } from '@arijs/naive-ui'
import FieldCard from './FieldCard.vue'

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

// Вычисление соотношения сторон и режима отображения
const aspectRatio = computed(() => windowWidth.value / windowHeight.value)
const isWideScreen = computed(() => aspectRatio.value > 1.5 && windowWidth.value >= 1200)

interface Task {
  id: number
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  deadline?: string
}

const columns = [
  {
    title: 'К выполнению',
    id: 'todo',
    tasks: [
      {
        id: 1,
        title: 'Создать дизайн макет',
        description: 'Разработать макеты для главной страницы приложения',
        priority: 'high' as const,
        deadline: '2025-07-15',
      },
      {
        id: 2,
        title: 'Настроить базу данных',
        description: 'Создать схему БД и настроить подключение',
        priority: 'medium' as const,
      },
    ] as Task[],
  },
  {
    title: 'В процессе',
    id: 'progress',
    tasks: [
      {
        id: 3,
        title: 'Разработка API',
        description: 'Создание REST API для управления задачами',
        priority: 'high' as const,
        deadline: '2025-07-12',
      },
    ] as Task[],
  },
  {
    title: 'На проверке',
    id: 'review',
    tasks: [
      {
        id: 4,
        title: 'Тестирование компонентов',
        description: 'Написание unit тестов для Vue компонентов',
        priority: 'low' as const,
      },
    ] as Task[],
  },
  {
    title: 'Выполнено',
    id: 'done',
    tasks: [
      {
        id: 5,
        title: 'Настройка проекта',
        description: 'Инициализация Vue проекта с Naive UI',
        priority: 'medium' as const,
      },
    ] as Task[],
  },
]
</script>

<template>
  <div class="relative max-w-7xl mx-auto">
    <!-- Колоночный вид для широких экранов -->
    <div v-if="isWideScreen" class="flex gap-6 overflow-x-auto pb-4">
      <div v-for="column in columns" :key="column.id" class="flex-none w-80 min-h-[600px]">
        <n-card
          :title="column.title"
          size="small"
          class="h-full shadow-lg border-0 bg-white rounded-lg"
          :bordered="false"
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

    <!-- Списочный вид для узких экранов -->
    <div v-else class="space-y-6">
      <div v-for="column in columns" :key="column.id" class="w-full">
        <n-card
          :title="column.title"
          size="small"
          class="shadow-lg border-0 bg-white rounded-lg"
          :bordered="false"
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
