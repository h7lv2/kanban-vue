<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const deadlineNeeded = ref(true)
const deadlineDate = ref(0)
const taskName = ref('')
const taskDescription = ref('')

defineProps({
  isOpen: Boolean,
})
const emit = defineEmits(['modal-close', 'modal-submit'])

const targetElement = ref(null)
onClickOutside(targetElement, () => emit('modal-close'))
</script>

<template>
  <div v-if="isOpen" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container" ref="targetElement">
        <input :value="taskName" placeholder="Название задачи" />
        <input :value="taskDescription" placeholder="Описание задачи" />
        <input :value="deadlineNeeded" type="checkbox" id="deadlineCheckmark" />
        <label for="deadlineCheckmark">Имеется дедлайн</label>
        <input :value="deadlineDate" type="date" />
        <button @click="emit('modal-submit')">Подтвердить</button>
        <button @click.stop="emit('modal-submit')">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.model-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.model-container {
  width: 300px;
  margin: 150px auto;
  padding: 20px 30px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}
</style>
