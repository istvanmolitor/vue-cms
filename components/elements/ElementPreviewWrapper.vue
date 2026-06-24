<script setup lang="ts">
import Icon from '@admin/components/ui/Icon.vue'

defineProps<{
  hasContent: boolean
}>()
</script>

<template>
  <div v-if="hasContent" class="mt-2">
    <slot />
  </div>
  <div v-else class="text-xs italic">
    Nincsenek beállítások - kattints a <Icon name="edit" class="inline w-3 h-3" /> ikonra a szerkesztéshez
  </div>
</template>
