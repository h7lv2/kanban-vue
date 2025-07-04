<script setup lang="ts">
import { ref } from 'vue'
import { TwitterSnowflake } from '@sapphire/snowflake'

import type Card from '@/types/Card'
import type User from '@/types/User'

const deadlineNeeded = ref(true)
const deadlineDate = ref(0)
const taskName = ref('')
const taskDescription = ref('')

const dummyUser: User = {
  id: Number(TwitterSnowflake.generate()),
  userName: 'akdfjadjklfkl',
  displayName: null,
  profilePicture: null,
}

const createTask = () => {
  const newCard: Card = {
    id: Number(TwitterSnowflake.generate()),
    assignees: [dummyUser],
    dateCreated: Date.now(),
    dateCompleted: null,

    dateDeadline: deadlineDate.value,
    title: taskName.value,
    description: taskDescription.value,
  }

  fetch('http://127.0.0.1:5000/insert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newCard),
  }).then((response) => {
    if (response.ok) {
      console.log('task sent')
    }
  })
}
</script>

<template>
  <input :value="taskName" placeholder="Название задачи" />
  <input :value="taskDescription" placeholder="Описание задачи" />
  <input :value="deadlineNeeded" type="checkbox" id="deadlineCheckmark" />
  <label for="deadlineCheckmark">Имеется дедлайн</label>
  <input :value="deadlineDate" type="date" />
  <button @click="createTask">Создать задачу</button>
</template>
