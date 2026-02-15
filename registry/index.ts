import { contentElementTypeRegistry } from './ContentElementTypeRegistry'
import TextElementEditor from '../components/elements/TextElementEditor.vue'
import HeadingElementEditor from '../components/elements/HeadingElementEditor.vue'
import ImageElementEditor from '../components/elements/ImageElementEditor.vue'
import VideoElementEditor from '../components/elements/VideoElementEditor.vue'
import CodeElementEditor from '../components/elements/CodeElementEditor.vue'
import QuoteElementEditor from '../components/elements/QuoteElementEditor.vue'
import ListElementEditor from '../components/elements/ListElementEditor.vue'
import { Type, Heading1, Image, Video, Code, Quote, List } from 'lucide-vue-next'

contentElementTypeRegistry.register({
  type: 'text',
  label: 'Szöveg',
  component: TextElementEditor,
  icon: Type
})

contentElementTypeRegistry.register({
  type: 'heading',
  label: 'Címsor',
  component: HeadingElementEditor,
  icon: Heading1
})

contentElementTypeRegistry.register({
  type: 'image',
  label: 'Kép',
  component: ImageElementEditor,
  icon: Image
})

contentElementTypeRegistry.register({
  type: 'video',
  label: 'Videó',
  component: VideoElementEditor,
  icon: Video
})

contentElementTypeRegistry.register({
  type: 'code',
  label: 'Kód',
  component: CodeElementEditor,
  icon: Code
})

contentElementTypeRegistry.register({
  type: 'quote',
  label: 'Idézet',
  component: QuoteElementEditor,
  icon: Quote
})

contentElementTypeRegistry.register({
  type: 'list',
  label: 'Lista',
  component: ListElementEditor,
  icon: List
})

export * from './ContentElementTypeRegistry'
