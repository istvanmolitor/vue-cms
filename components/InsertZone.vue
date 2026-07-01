<script setup lang="ts">
import Icon from '@admin/components/ui/Icon.vue'

defineProps<{ inner?: boolean }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <div :class="['group flex items-center gap-2 py-1', inner && 'px-4']">
    <div :class="['flex-1 h-px group-hover:bg-primary/40 transition-colors', inner ? 'bg-transparent' : 'bg-border']" />
    <button
      type="button"
      class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-muted-foreground hover:text-primary border border-border hover:border-primary rounded px-2 py-0.5 bg-background"
      @click="$emit('click')"
    >
      <Icon name="plus" class="w-3 h-3" />
      Elem ide
    </button>
    <div :class="['flex-1 h-px group-hover:bg-primary/40 transition-colors', inner ? 'bg-transparent' : 'bg-border']" />
  </div>
</template>
