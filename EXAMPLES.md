# Примеры использования типов

## Создание новой задачи

```typescript
import type { Task, Priority } from '@/types'
import { createTaskFromForm, generateTaskId } from '@/utils/task'

const newTask: Task = {
  id: generateTaskId(),
  title: 'Новая задача',
  description: 'Описание задачи',
  priority: 'high',
  deadline: '2025-07-20',
}
```

## Работа с формой создания задачи

```typescript
import type { TaskFormData } from '@/types'
import { createTaskFromForm } from '@/utils/task'

const formData: TaskFormData = {
  taskName: 'Задача из формы',
  taskDescription: 'Описание',
  deadlineDate: '2025-07-20',
  priority: 'medium',
}

const taskWithoutId = createTaskFromForm(formData)
```

## Работа с приоритетами

```typescript
import type { Priority } from '@/types'
import { getPriorityLabel, getPriorityColor, sortByPriority } from '@/utils/priority'

const priority: Priority = 'high'
const label = getPriorityLabel(priority) // 'Высокий'
const color = getPriorityColor(priority) // 'error'

const priorities: Priority[] = ['low', 'high', 'medium']
const sorted = sortByPriority(priorities) // ['high', 'medium', 'low']
```

## Работа с колонками

```typescript
import type { Column, ColumnId } from '@/types'
import { addTaskToColumn, moveTaskBetweenColumns } from '@/utils/column'
import { DEFAULT_COLUMNS } from '@/data'

let columns = [...DEFAULT_COLUMNS]

// Добавить задачу в колонку
columns = addTaskToColumn(columns, 'todo', newTask)

// Переместить задачу между колонками
columns = moveTaskBetweenColumns(columns, 'todo', 'progress', newTask.id)
```

## Константы приоритетов в компонентах

```vue
<script setup lang="ts">
import type { Priority } from '../types/priority'
import { PRIORITY_OPTIONS, PRIORITY_COLORS, PRIORITY_LABELS } from '../types/priority'

const priority = ref<Priority>('medium')
</script>

<template>
  <n-select v-model:value="priority" :options="PRIORITY_OPTIONS" />

  <n-tag :type="PRIORITY_COLORS[priority]">
    {{ PRIORITY_LABELS[priority] }}
  </n-tag>
</template>
```
