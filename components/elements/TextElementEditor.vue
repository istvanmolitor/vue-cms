<script setup lang="ts">
import Label from '@admin/components/ui/Label.vue'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()
const { text, align } = useElementEditor(props, emit, {
  text: '',
  align: 'left'
})
</script>

<template>
  <div class="space-y-4">
    <div>
      <Label class="text-sm font-medium mb-1 block">Tartalom</Label>
      <textarea
        v-model="text"
        rows="5"
        class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Szöveg tartalom..."
      ></textarea>
    </div>

    <div>
      <Label class="text-sm font-medium mb-1 block">Igazítás</Label>
      <select
        v-model="align"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="left">Balra</option>
        <option value="center">Középre</option>
        <option value="right">Jobbra</option>
        <option value="justify">Sorkizárt</option>
      </select>
    </div>

    <!-- Preview -->
    <div v-if="text" class="mt-4 p-4 border rounded-md bg-muted/30">
      <p class="text-xs text-muted-foreground mb-2">Előnézet:</p>
      <p :class="`text-${align}`" class="text-preview">
        {{ text }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.text-preview {
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>
