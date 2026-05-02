import { ref, watch, onMounted } from 'vue'
import type { ContentElement } from '../services/contentRegionService'

interface UseContentElementEditorOptions<T = Record<string, any>> {
  settings: Record<string, any>
  contentElements?: ContentElement[]
  emit: (event: 'update:settings' | 'update:contentElements', value: any) => void
  defaultSettings: T
}

/**
 * Composable for managing content element editor state and updates
 * Handles common patterns like:
 * - Initializing empty settings
 * - Watching for prop changes
 * - Emitting updates
 *
 * @deprecated Use useElementSettings instead for simpler API
 */
export function useContentElementEditor<T extends Record<string, any>>(
  options: UseContentElementEditorOptions<T>
) {
  const { settings, emit, defaultSettings } = options

  // Initialize settings if empty
  onMounted(() => {
    if (!settings || Object.keys(settings).length === 0) {
      emit('update:settings', defaultSettings)
    }
  })

  /**
   * Creates a reactive property that syncs with settings
   */
  function createSetting<K extends keyof T>(
    key: K,
    defaultValue: T[K]
  ) {
    return ref(settings?.[key as string] ?? defaultValue)
  }

  /**
   * Watch settings changes and update local refs
   */
  function watchSettings(callback: (newSettings: T) => void) {
    watch(() => options.settings, (newVal) => {
      if (newVal) {
        callback(newVal as T)
      }
    }, { deep: true })
  }

  /**
   * Emit settings update
   */
  function updateSettings(newSettings: Partial<T>) {
    emit('update:settings', newSettings)
  }

  /**
   * Emit content elements update
   */
  function updateContentElements(newContentElements: ContentElement[]) {
    emit('update:contentElements', newContentElements)
  }

  return {
    createSetting,
    watchSettings,
    updateSettings,
    updateContentElements
  }
}

/**
 * Simplified composable for element editors with automatic reactive settings
 *
 * Automatically handles:
 * - Creating reactive refs for each setting
 * - Initializing with defaults
 * - Syncing with prop changes
 * - Provides updateValue function to emit changes
 *
 * @example
 * ```ts
 * const { text, align, updateValue } = useElementSettings(
 *   props.settings,
 *   emit,
 *   { text: '', align: 'left' }
 * )
 *
 * watch([text, align], updateValue)
 * ```
 */
export function useElementSettings<T extends Record<string, any>>(
  settings: Record<string, any>,
  emit: (event: 'update:settings' | 'update:contentElements', value: any) => void,
  defaultSettings: T
) {
  // Initialize if empty
  onMounted(() => {
    const isEmpty = !settings || Object.keys(settings).length === 0
    const needsDefaults = Object.keys(defaultSettings).some(key => {
      return settings?.[key] === undefined && defaultSettings[key] !== undefined
    })

    if (isEmpty || needsDefaults) {
      emit('update:settings', { ...defaultSettings, ...settings })
    }
  })

  // Create reactive refs for all settings
  const localSettings = {} as Record<keyof T, any>

  Object.keys(defaultSettings).forEach(key => {
    const typedKey = key as keyof T
    localSettings[typedKey] = ref(settings?.[key] ?? defaultSettings[typedKey])
  })

  // Watch for external changes from props
  watch(() => settings, (newVal) => {
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

  return {
    ...localSettings,
    updateValue
  }
}


