<script setup lang="ts">
import { NCard, NButton, NIcon, NSpace, NText, NTag } from '@arijs/naive-ui'
import {
  EditOutlined,
  InfoOutlined,
  ArrowForwardOutlined,
  PersonAddOutlined,
  PersonRemoveOutlined,
} from '@vicons/material'
import type { Priority } from '../types/priority'
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../types/priority'

interface Props {
  title?: string
  description?: string
  priority?: Priority
  deadline?: string
  currentColumn?: string
  assignees?: number[]
  currentUserId?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Название задачи',
  description: 'Описание задачи',
  priority: 'medium' as Priority,
  assignees: () => [],
})

const emit = defineEmits(['edit', 'info', 'moveNext', 'assignSelf', 'unassignSelf'])
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

        <!-- Assignment button - only show if user is logged in -->
        <template v-if="props.currentUserId">
          <n-button
            v-if="!props.assignees.includes(props.currentUserId)"
            size="small"
            quaternary
            @click="emit('assignSelf')"
            title="Назначить себя на задачу"
          >
            <template #icon>
              <n-icon><PersonAddOutlined /></n-icon>
            </template>
          </n-button>
          <n-button
            v-else
            size="small"
            quaternary
            @click="emit('unassignSelf')"
            title="Снять себя с задачи"
          >
            <template #icon>
              <n-icon><PersonRemoveOutlined /></n-icon>
            </template>
          </n-button>
        </template>

        <n-button
          size="small"
          quaternary
          @click="emit('moveNext')"
          :title="
            props.currentColumn === 'done' ? 'Удалить задачу' : 'Переместить в следующую колонку'
          "
        >
          <template #icon>
            <n-icon>
              <ArrowForwardOutlined v-if="props.currentColumn !== 'done'" />
              <span v-else>🗑️</span>
            </n-icon>
          </template>
        </n-button>
      </n-space>
    </template>
  </n-card>
</template>
