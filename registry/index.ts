import { contentElementTypeRegistry } from './ContentElementTypeRegistry'
import DefaultElementEditor from '../components/elements/DefaultElementEditor.vue'
import HeadingElementEditor from '../components/elements/HeadingElementEditor.vue'
import VideoElementEditor from '../components/elements/VideoElementEditor.vue'
import { Type, Heading1, Image, Video, Code, Quote, List } from 'lucide-vue-next'

contentElementTypeRegistry.register({
  type: 'text',
  label: 'Szöveg',
  component: DefaultElementEditor,
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
  component: DefaultElementEditor,
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
  component: DefaultElementEditor,
  icon: Code
})

contentElementTypeRegistry.register({
  type: 'quote',
  label: 'Idézet',
  component: DefaultElementEditor,
  icon: Quote
})

contentElementTypeRegistry.register({
  type: 'list',
  label: 'Lista',
  component: DefaultElementEditor,
  icon: List
})

export * from './ContentElementTypeRegistry'
