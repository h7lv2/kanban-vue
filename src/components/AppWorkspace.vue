<script setup lang="ts">
import { NLayout, NLayoutContent } from '@arijs/naive-ui'
import WorkspaceField from './WorkspaceField.vue'
</script>

<template>
  <n-layout class="h-screen bg-gray-50">
    <n-layout-content class="pt-20 overflow-hidden">
      <!-- Additional margines for the panel. -->
      <div class="h-12 w-full bg-transparent"></div>
      <div class="h-full overflow-x-auto overflow-y-auto custom-scrollbar">
        <div class="p-6 min-w-fit">
          <WorkspaceField />
        </div>
      </div>
    </n-layout-content>
  </n-layout>
</template>
