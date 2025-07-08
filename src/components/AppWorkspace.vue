<script setup lang="ts">
import WorkspaceField from './WorkspaceField.vue'
</script>

<template>
  <WorkspaceField></WorkspaceField>

  <div class="main-container"></div>
</template>

<style lang="css" scoped>
.main-container {
  position: fixed;
  width: 100%;
  height: 100%;
  margin-top: 110px;
  background-color: rgba(1, 1, 1, 0);
}
</style>
