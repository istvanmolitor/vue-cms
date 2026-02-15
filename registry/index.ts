import { contentElementTypeRegistry } from './ContentElementTypeRegistry'
import TextElementEditor from '../components/elements/TextElementEditor.vue'
import HeadingElementEditor from '../components/elements/HeadingElementEditor.vue'
import ImageElementEditor from '../components/elements/ImageElementEditor.vue'
import VideoElementEditor from '../components/elements/VideoElementEditor.vue'
import CodeElementEditor from '../components/elements/CodeElementEditor.vue'
import QuoteElementEditor from '../components/elements/QuoteElementEditor.vue'
import ListElementEditor from '../components/elements/ListElementEditor.vue'

contentElementTypeRegistry.register({
  type: 'text',
  label: 'Szöveg',
  component: TextElementEditor,
  icon: 'type'
})

contentElementTypeRegistry.register({
  type: 'heading',
  label: 'Címsor',
  component: HeadingElementEditor,
  icon: 'heading'
})

contentElementTypeRegistry.register({
  type: 'image',
  label: 'Kép',
  component: ImageElementEditor,
  icon: 'image'
})

contentElementTypeRegistry.register({
  type: 'video',
  label: 'Videó',
  component: VideoElementEditor,
  icon: 'video'
})

contentElementTypeRegistry.register({
  type: 'code',
  label: 'Kód',
  component: CodeElementEditor,
  icon: 'code'
})

contentElementTypeRegistry.register({
  type: 'quote',
  label: 'Idézet',
  component: QuoteElementEditor,
  icon: 'quote'
})

contentElementTypeRegistry.register({
  type: 'list',
  label: 'Lista',
  component: ListElementEditor,
  icon: 'list'
})

export * from './ContentElementTypeRegistry'
