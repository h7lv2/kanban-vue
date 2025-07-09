<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { NCard } from '@arijs/naive-ui'
import FieldCard from './FieldCard.vue'
import type { Column } from '../types/column'
import { DEFAULT_COLUMNS } from '../data'

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

const columns: Column[] = DEFAULT_COLUMNS

// Find how many columns can fit based on available width
const availableWidth = computed(() => windowWidth.value - containerPadding)
const totalColumnsWidth = columns.length * columnWidth + (columns.length - 1) * gapWidth
const allColumnsFit = computed(() => availableWidth.value >= totalColumnsWidth)

// Switch to column mode only if:
// 1. Aspect ratio is suitable (landscape orientation)
// 2. All columns fit without scrolling OR the screen is wide enough for comfortable scrolling
const isWideScreen = computed(
  () => aspectRatio.value > 1.3 && (allColumnsFit.value || windowWidth.value >= 1400),
)
</script>

<template>
  <div class="relative">
    <!-- TODO: Fix titles getting cut off -->
    <!-- For some reason without a top element here, things are getting cut off. -->
    <div class="h-24 w-full bg-red-100 opacity-50 border border-red-300">
      <div class="text-xs text-red-600 p-1">DEBUG: Отступ для заголовков (96px)</div>
    </div>

    <!-- Column UI for wide displays -->
    <div v-if="isWideScreen" class="flex gap-6 overflow-x-auto pb-4">
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
