<script lang="ts" setup>
import { NConfigProvider } from '@arijs/naive-ui'
import AppTopBar from './components/AppTopBar.vue'
import AppWorkspace from './components/AppWorkspace.vue'
</script>

<template>
  <n-config-provider>
    <div class="h-screen bg-gray-50">
      <AppTopBar />
      <AppWorkspace />
    </div>
  </n-config-provider>
</template>
