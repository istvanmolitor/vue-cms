<script setup lang="ts">
interface Props {
  settings: {
    page_group_id?: number | null
    limit?: number
  }
}

defineProps<Props>()
</script>

<template>
  <div class="p-3 bg-muted/50 rounded border border-dashed text-xs">
    <div v-if="settings.page_group_id" class="flex items-center justify-between">
      <span>Oldal csoport azonosító: <strong>{{ settings.page_group_id }}</strong></span>
      <span>Limit: <strong>{{ settings.limit || 5 }}</strong></span>
    </div>
    <div v-else class="text-muted-foreground italic">
      Nincs kiválasztva oldal csoport
    </div>
  </div>
</template>
