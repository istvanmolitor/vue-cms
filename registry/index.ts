import { contentElementTypeRegistry } from './ContentElementTypeRegistry'
import TextElementEditor from '../components/elements/TextElementEditor.vue'
import HeadingElementEditor from '../components/elements/HeadingElementEditor.vue'
import ImageElementEditor from '../components/elements/ImageElementEditor.vue'
import VideoElementEditor from '../components/elements/VideoElementEditor.vue'
import IframeElementEditor from '../components/elements/IframeElementEditor.vue'
import CodeElementEditor from '../components/elements/CodeElementEditor.vue'
import QuoteElementEditor from '../components/elements/QuoteElementEditor.vue'
import ListElementEditor from '../components/elements/ListElementEditor.vue'

import TextElementPreview from '../components/elements/TextElementPreview.vue'
import HeadingElementPreview from '../components/elements/HeadingElementPreview.vue'
import ImageElementPreview from '../components/elements/ImageElementPreview.vue'
import VideoElementPreview from '../components/elements/VideoElementPreview.vue'
import IframeElementPreview from '../components/elements/IframeElementPreview.vue'
import CodeElementPreview from '../components/elements/CodeElementPreview.vue'
import QuoteElementPreview from '../components/elements/QuoteElementPreview.vue'
import ListElementPreview from '../components/elements/ListElementPreview.vue'

contentElementTypeRegistry.register({
  type: 'text',
  label: 'Szöveg',
  component: TextElementEditor,
  previewComponent: TextElementPreview,
  icon: 'type'
})

contentElementTypeRegistry.register({
  type: 'heading',
  label: 'Címsor',
  component: HeadingElementEditor,
  previewComponent: HeadingElementPreview,
  icon: 'heading'
})

contentElementTypeRegistry.register({
  type: 'image',
  label: 'Kép',
  component: ImageElementEditor,
  previewComponent: ImageElementPreview,
  icon: 'image'
})

contentElementTypeRegistry.register({
  type: 'video',
  label: 'Videó',
  component: VideoElementEditor,
  previewComponent: VideoElementPreview,
  icon: 'video'
})

contentElementTypeRegistry.register({
  type: 'iframe',
  label: 'Iframe',
  component: IframeElementEditor,
  previewComponent: IframeElementPreview,
  icon: 'box'
})

contentElementTypeRegistry.register({
  type: 'code',
  label: 'Kód',
  component: CodeElementEditor,
  previewComponent: CodeElementPreview,
  icon: 'code'
})

contentElementTypeRegistry.register({
  type: 'quote',
  label: 'Idézet',
  component: QuoteElementEditor,
  previewComponent: QuoteElementPreview,
  icon: 'quote'
})

contentElementTypeRegistry.register({
  type: 'list',
  label: 'Lista',
  component: ListElementEditor,
  previewComponent: ListElementPreview,
  icon: 'list'
})

export * from './ContentElementTypeRegistry'
