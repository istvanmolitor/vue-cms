import { onMounted, ref, watch } from 'vue'
import type { ContentElement } from '../services/contentRegionService'

export interface ElementEditorProps {
  settings: Record<string, any>
  contentElements?: ContentElement[]
}

export interface ElementEditorEmits {
  'update:settings': [value: Record<string, any>]
  'update:contentElements': [value: ContentElement[]]
}

export interface ElementEditorEmit {
  (event: 'update:settings', value: Record<string, any>): void
  (event: 'update:contentElements', value: ContentElement[]): void
}

/**
 * Complete element editor setup composable
 * Handles all common patterns for content element editors
 *
 * @example
 * ```ts
 * const { text, align } = useElementEditor(props, emit, {
 *   text: '',
 *   align: 'left'
 * })
 * ```
 */
export function useElementEditor<T extends Record<string, any>>(
  props: ElementEditorProps,
  emit: ElementEditorEmit,
  defaultSettings: T
) {
  // Initialize if empty
  onMounted(() => {
    const isEmpty = !props.settings || Object.keys(props.settings).length === 0
    const needsDefaults = Object.keys(defaultSettings).some(key => {
      return props.settings?.[key] === undefined && defaultSettings[key] !== undefined
    })

    if (isEmpty || needsDefaults) {
      emit('update:settings', { ...defaultSettings, ...props.settings })
    }
  })

  // Create reactive refs for all settings
  const localSettings = {} as Record<keyof T, any>

  Object.keys(defaultSettings).forEach(key => {
    const typedKey = key as keyof T
    localSettings[typedKey] = ref(props.settings?.[key] ?? defaultSettings[typedKey])
  })

  // Watch for external changes from props
  watch(() => props.settings, (newVal) => {
    if (newVal) {
      Object.keys(defaultSettings).forEach(key => {
        const typedKey = key as keyof T
        if (localSettings[typedKey]) {
          localSettings[typedKey].value = newVal[key] ?? defaultSettings[typedKey]
        }
      })
    }
  }, { deep: true })

  // Create update function to emit changes
  const updateValue = () => {
    const updated = {} as T
    Object.keys(defaultSettings).forEach(key => {
      const typedKey = key as keyof T
      updated[typedKey] = localSettings[typedKey].value
    })
    emit('update:settings', updated)
  }

  // Auto-watch all settings and emit changes
  const allRefs = Object.values(localSettings)
  watch(allRefs, updateValue, { deep: true })

  return {
    ...localSettings,
    updateValue,
    updateContentElements: (elements: ContentElement[]) => {
      emit('update:contentElements', elements)
    }
  }
}
