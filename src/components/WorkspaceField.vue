<script setup lang="ts">
import FieldCard from './FieldCard.vue'
</script>

<template>
  <FieldCard></FieldCard>

  <div class="column-container">
    <div class="column decoration">
      <div class="content"></div>
    </div>
    <div class="column"></div>
  </div>
</template>

<style lang="css" scoped>
.column-container {
  display: grid;
  padding: 20px;
}

.column {
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.2);
  border-radius: 0 10px 10px 10px;
  padding: 15px;
  height: 9000px;
  width: 200px;
}

.decoration::before {
  content: ' ';
  position: absolute;
  margin-left: 35px;
  top: 0;
  transform: translateX(-50%);
  width: 100px;
  height: 20px;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.2);
}

.content {
  margin-top: 10px;
}
</style>
