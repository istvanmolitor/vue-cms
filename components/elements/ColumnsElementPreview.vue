<script setup lang="ts">
import { computed } from 'vue'
import type { ContentElement } from '../../services/contentRegionService'

interface ColumnData {
  content_elements: ContentElement[]
  width?: string
}

interface Props {
  settings: {
    columns?: ColumnData[]
    columns_count?: number
  }
}

const props = defineProps<Props>()

const columns = computed(() => props.settings?.columns || [])
const columnsCount = computed(() => props.settings?.columns_count || 0)
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center gap-2 text-xs text-muted-foreground">
      <span class="font-medium">{{ columnsCount }} oszlop</span>
      <span v-if="columnsCount > 0">
        -
        <span class="ml-1">
          {{ columns.reduce((sum, col) => sum + (col.content_elements?.length || 0), 0) }} elem összesen
        </span>
      </span>
    </div>

    <div class="grid gap-2" :style="{ gridTemplateColumns: `repeat(${columnsCount}, 1fr)` }">
      <div
        v-for="(column, index) in columns"
        :key="index"
        class="border border-dashed rounded p-2 bg-muted/20"
      >
        <div class="text-[10px] font-bold text-muted-foreground mb-1">
          Oszlop {{ index + 1 }}
        </div>
        <div class="text-xs text-muted-foreground">
          {{ column.content_elements?.length || 0 }} elem
        </div>
      </div>
    </div>
  </div>
</template>

