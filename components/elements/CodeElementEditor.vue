<script setup lang="ts">
import Label from '@admin/components/ui/Label.vue'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()

const { code, language } = useElementEditor(props, emit, {
  code: '',
  language: 'javascript'
})
</script>

<template>
  <div class="space-y-4">
    <div>
      <Label class="text-sm font-medium mb-1 block">Nyelv</Label>
      <select
        v-model="language"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="php">PHP</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="bash">Bash</option>
        <option value="sql">SQL</option>
        <option value="json">JSON</option>
      </select>
    </div>
    <div>
      <Label class="text-sm font-medium mb-1 block">Kód</Label>
      <textarea
        v-model="code"
        rows="10"
        class="flex min-h-[240px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="// Írd be a kódot..."
      ></textarea>
    </div>
  </div>
</template>
