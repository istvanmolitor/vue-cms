<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@admin/components/ui/Icon.vue'

interface Props {
  settings: Record<string, any>
}

const props = defineProps<Props>()

const hasSettings = computed(() => Object.keys(props.settings).length > 0)
</script>

<template>
  <div v-if="hasSettings" class="space-y-1">
    <div v-for="(value, key) in settings" :key="key" class="text-xs">
      <span class="font-medium">{{ key }}:</span>
      <span class="ml-1">{{ typeof value === 'object' ? JSON.stringify(value).substring(0, 50) : String(value).substring(0, 50) }}</span>
      <span v-if="String(value).length > 50">...</span>
    </div>
  </div>
  <div v-else class="text-xs italic">
    Nincsenek beállítások - kattints a <Icon name="settings" class="w-3 h-3 inline" /> ikonra a szerkesztéshez
  </div>
</template>

