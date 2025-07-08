<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const taskName = ref('')
const taskDescription = ref('')
const deadlineDate = ref('')

defineProps({
  isOpen: Boolean,
})
const emit = defineEmits(['modal-close', 'modal-submit'])

const targetElement = ref(null)
onClickOutside(targetElement, () => emit('modal-close'))

const showDate = ref(false)
const showPriority = ref(false)

function clearForm() {
  taskName.value = ''
  taskDescription.value = ''
  deadlineDate.value = ''
  showDate.value = false
}

function cancelModal() {
  clearForm()
  emit('modal-close')
}

function submitModal() {
  emit('modal-close', {
    taskName: taskName.value,
    taskDescription: taskDescription.value ? taskDescription.value : null,
    deadlineDate: deadlineDate.value ? deadlineDate.value : null,
  })
}
</script>

<template>
  <transition name="modal">
    <div v-if="isOpen" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" ref="targetElement">
          <input v-model="taskName" type="text" placeholder="Название задачи" class="input-field" />

          <textarea
            v-model="taskDescription"
            placeholder="Описание задачи"
            class="input-field textarea-field"
            rows="3"
          ></textarea>

          <div class="checkbox-wrapper">
            <input
              v-model="showDate"
              type="checkbox"
              id="deadlineCheckmark"
              class="checkbox-input"
            />
            <label for="deadlineCheckmark">Установить дедлайн</label>
          </div>

          <input v-if="showDate" v-model="deadlineDate" type="date" class="input-field" />

          <div class="checkbox-priority">
            <input
              v-model="showPriority"
              type="checkbox"
              id="priorityCheckmark"
              class="checkbox-input"
            />
            <label for="priorityCheckmark">Приоритет</label>
          </div>

          <div class="modal-actions">
            <button @click="cancelModal" class="cancel-button">Отмена</button>
            <button @click="submitModal" class="submit-button">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="css" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}

.modal-container {
  width: 450px;
  margin: 0 20px;
  padding: 24px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-field {
  width: 95%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s;
}

.input-field::placeholder {
  color: #999;
  opacity: 1;
}

.input-field:focus {
  outline: none;
  border-color: #42b983;
}

.textarea-field {
  max-height: 100px;
  min-height: 50px;
  resize: vertical;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  accent-color: #42b983;
}

.checkbox-priority {
  display: flex;
  align-items: center;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.cancel-button,
.submit-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.cancel-button:hover {
  background-color: #eaeaea;
}

.submit-button {
  background-color: #42b983;
  color: white;
  border: none;
}

.submit-button:hover {
  background-color: #369f6e;
}

input[type='date'] {
  position: relative;
}
</style>
