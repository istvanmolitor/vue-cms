<script setup lang="ts">
import Icon from '@admin/components/ui/Icon.vue'
import IconButton from '@admin/components/ui/button/IconButton.vue'
import { contentElementTypeRegistry } from '../registry'
import type { ContentElement } from '../services/contentRegionService'
import DefaultElementPreview from './elements/DefaultElementPreview.vue'

interface Props {
  element: ContentElement
  isFirst: boolean
  isLast: boolean
  showEditor: boolean
  errors: Record<string, string | string[]>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'move-up': []
  'move-down': []
  'remove': []
  'toggle-edit': []
  'update:settings': [value: any]
  'update:content-elements': [value: ContentElement[]]
}>()

const getPreviewComponent = (type: string) => {
  return contentElementTypeRegistry.getPreviewComponent(type) || DefaultElementPreview
}

const hasSettings = (element: ContentElement) => {
  return element.settings && Object.keys(element.settings).length > 0
}
</script>

<template>
  <div class="p-4 group relative hover:bg-muted/10 transition-colors">
    <div class="flex items-start gap-3">
      <!-- Move controls -->
      <div class="flex flex-col items-center self-stretch pt-1">
        <div class="text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors mb-2">
          <Icon name="grip-vertical" class="w-4 h-4" />
        </div>
        <div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton icon="move-up" @click="emit('move-up')" :disabled="isFirst" />
          <IconButton icon="move-down" @click="emit('move-down')" :disabled="isLast" />
        </div>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3 min-w-0">
            <div class="flex items-center min-w-0 text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase tracking-wider">
              <Icon :name="contentElementTypeRegistry.getIcon(element.type) || 'type'" class="w-3 h-3 mr-1.5 shrink-0" />
              <span class="truncate">{{ contentElementTypeRegistry.getType(element.type)?.label || element.type }}</span>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <IconButton
              v-if="hasSettings(element)"
              :icon="showEditor ? 'show' : 'edit'"
              @click="emit('toggle-edit')"
            />
            <IconButton icon="trash" @click="emit('remove')" />
          </div>
        </div>

        <div class="pl-1 text-sm">
          <div v-if="showEditor" class="bg-muted/30 rounded-lg p-3">
            <component
              :is="contentElementTypeRegistry.getComponent(element.type)"
              :settings="element.settings"
              :content-elements="element.content_elements"
              :errors="errors"
              @update:settings="emit('update:settings', $event)"
              @update:content-elements="emit('update:content-elements', $event)"
            />
          </div>
          <div v-else class="text-muted-foreground">
            <component
              :is="getPreviewComponent(element.type)"
              :settings="element.settings"
              :content-elements="element.content_elements"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
