<script setup lang="ts">
import Label from '@admin/components/ui/Label.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import PostSelector from '../PostSelector.vue'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()

const { post_id } = useElementEditor(props, emit, {
  post_id: null
})
</script>

<template>
  <div class="space-y-4">
    <div>
      <Label class="text-sm font-medium mb-1 block">Post</Label>
      <PostSelector v-model="post_id" />
      <FieldError :errors="props.errors?.post_id" />
    </div>
  </div>
</template>
