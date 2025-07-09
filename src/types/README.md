# Типы проекта Kanban

Этот модуль содержит все переиспользуемые типы для канбан-доски.

## Структура

### Типы (`/types`)

- **`task.ts`** - типы для задач (`Task`, `TaskFormData`)
- **`priority.ts`** - типы и константы для приоритетов (`Priority`, `PRIORITY_COLORS`, `PRIORITY_LABELS`, `PRIORITY_OPTIONS`)
- **`column.ts`** - типы для колонок канбан-доски (`Column`, `ColumnId`)
- **`index.ts`** - центральный файл экспорта всех типов

### Утилиты (`/utils`)

- **`task.ts`** - утилиты для работы с задачами
- **`priority.ts`** - утилиты для работы с приоритетами
- **`column.ts`** - утилиты для работы с колонками
- **`index.ts`** - центральный файл экспорта всех утилит

### Данные (`/data`)

- **`index.ts`** - тестовые данные и конфигурация по умолчанию

## Использование

### Импорт типов

```typescript
// Центральный импорт всех типов
import type { Task, Priority, Column } from '@/types'

// Или прямой импорт конкретных типов
import type { Task } from '@/types/task'
import type { Priority } from '@/types/priority'
import type { Column } from '@/types/column'
```

### Импорт констант и утилит

```typescript
// Константы приоритетов
import { PRIORITY_COLORS, PRIORITY_LABELS, PRIORITY_OPTIONS } from '@/types/priority'

// Утилиты
import { createTaskFromForm, validateTask } from '@/utils/task'
import { getPriorityLabel, sortByPriority } from '@/utils/priority'
import { addTaskToColumn, moveTaskBetweenColumns } from '@/utils/column'

// Тестовые данные
import { DEFAULT_COLUMNS } from '@/data'
```

## Основные типы

### Task

```typescript
interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  deadline?: string
}
```

### Priority

```typescript
type Priority = 'low' | 'medium' | 'high'
```

### Column

```typescript
interface Column {
  id: ColumnId
  title: string
  tasks: Task[]
}

type ColumnId = 'todo' | 'progress' | 'review' | 'done'
```
