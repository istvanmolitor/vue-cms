import { defineAsyncComponent, type Component } from 'vue'

export interface ContentElementType {
  type: string
  label: string
  component: Component
  icon: Component
}

class ContentElementTypeRegistry {
  private types: Map<string, ContentElementType> = new Map()

  register(type: ContentElementType) {
    this.types.set(type.type, type)
  }

  getTypes(): ContentElementType[] {
    return Array.from(this.types.values())
  }

  getType(type: string): ContentElementType | undefined {
    return this.types.get(type)
  }

  getComponent(type: string): Component | undefined {
    return this.types.get(type)?.component
  }

  getIcon(type: string): Component | undefined {
    return this.types.get(type)?.icon
  }
}

export const contentElementTypeRegistry = new ContentElementTypeRegistry()
