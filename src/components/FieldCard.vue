<script setup lang="ts">
import { NCard, NButton, NIcon, NSpace, NText, NTag } from '@arijs/naive-ui'
import { EditOutlined, InfoOutlined } from '@vicons/material'
import type { Priority } from '../types/priority'
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../types/priority'

interface Props {
  title?: string
  description?: string
  priority?: Priority
  deadline?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Название задачи',
  description: 'Описание задачи',
  priority: 'medium' as Priority,
})

const emit = defineEmits(['edit', 'info'])
</script>

<template>
  <n-card size="small" class="mb-3 cursor-pointer hover:shadow-md transition-shadow">
    <template #header>
      <n-text class="font-medium">{{ props.title }}</n-text>
    </template>

    <template #header-extra>
      <n-tag :type="PRIORITY_COLORS[props.priority]" size="small" round>
        {{ PRIORITY_LABELS[props.priority] }}
      </n-tag>
    </template>

    <n-text depth="3" class="text-sm">
      {{ props.description }}
    </n-text>

    <template v-if="props.deadline" #footer>
      <n-text depth="3" class="text-xs"> Дедлайн: {{ props.deadline }} </n-text>
    </template>

    <template #action>
      <n-space>
        <n-button size="small" quaternary @click="emit('edit')" title="Редактировать задачу">
          <template #icon>
            <n-icon><EditOutlined /></n-icon>
          </template>
        </n-button>
        <n-button size="small" quaternary @click="emit('info')" title="Подробная информация">
          <template #icon>
            <n-icon><InfoOutlined /></n-icon>
          </template>
        </n-button>
      </n-space>
    </template>
  </n-card>
</template>
