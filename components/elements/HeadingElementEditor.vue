<script setup lang="ts">
import { computed } from 'vue'
import Label from '@admin/components/ui/Label.vue'
import Input from '@admin/components/ui/Input.vue'
import Select from '@admin/components/ui/Select.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import { useElementEditor, type ElementEditorEmits, type ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()

const { text, level: rawLevel, updateValue } = useElementEditor(props, emit, {
  text: '',
  level: 1
})

const level = computed({
  get: () => rawLevel.value,
  set: (value) => {
    rawLevel.value = parseInt(value.toString())
    updateValue()
  }
})

const levelOptions = Array.from({ length: 6 }, (_, i) => ({ value: i + 1, label: `H${i + 1}` }))
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-9">
        <Label class="text-sm font-medium mb-1 block">Szöveg</Label>
        <Input v-model="text" placeholder="Címsor szövege" />
        <FieldError :errors="props.errors?.text" />
      </div>
      <div class="col-span-3">
        <Label class="text-sm font-medium mb-1 block">Szint</Label>
        <Select v-model="level" :options="levelOptions" />
        <FieldError :errors="props.errors?.level" />
      </div>
    </div>

    <!-- Preview -->
    <div v-if="text" class="mt-4 p-4 border rounded-md bg-muted/30">
      <p class="text-xs text-muted-foreground mb-2">Előnézet:</p>
      <component :is="`h${level}`" class="heading-preview">
        {{ text }}
      </component>
    </div>
  </div>
</template>

<style scoped>
.heading-preview {
  margin: 0;
  font-weight: 700;
}

h1.heading-preview {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

h2.heading-preview {
  font-size: 1.875rem;
  line-height: 2.25rem;
}

h3.heading-preview {
  font-size: 1.5rem;
  line-height: 2rem;
}

h4.heading-preview {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

h5.heading-preview {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

h6.heading-preview {
  font-size: 1rem;
  line-height: 1.5rem;
}
</style>
