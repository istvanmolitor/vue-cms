<script setup lang="ts">
import { nextTick, watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Label from '@admin/components/ui/Label.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import type { ElementEditorEmits, ElementEditorProps } from '../../composables/useElementEditor'

const props = defineProps<ElementEditorProps>()
const emit = defineEmits<ElementEditorEmits>()

let isUpdating = false

const editor = useEditor({
  content: props.settings?.content || '',
  extensions: [
    StarterKit,
    Link.configure({ openOnClick: false, autolink: false }),
  ],
  editorProps: {
    handleClick: (_view, _pos, event) => {
      if ((event.target as HTMLElement).closest('a')) {
        event.preventDefault()
        return true
      }
      return false
    },
  },
  onUpdate: ({ editor }) => {
    isUpdating = true
    emit('update:settings', { ...props.settings, content: editor.getHTML() })
    nextTick(() => { isUpdating = false })
  },
})

watch(() => props.settings?.content, (newContent) => {
  if (isUpdating || !editor.value) return
  const editorContent = editor.value.getHTML()
  if (newContent !== editorContent) {
    editor.value.commands.setContent(newContent || '')
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const preventLinkNavigation = (event: MouseEvent) => {
  if ((event.target as HTMLElement).closest('a')) {
    event.preventDefault()
  }
}

const setLink = () => {
  if (!editor.value) return
  const previousUrl = editor.value.getAttributes('link').href ?? ''
  const url = window.prompt('Link URL:', previousUrl)

  if (url === null) return

  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const removeLink = () => {
  editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
}
</script>

<template>
  <div class="space-y-2">
    <Label class="text-sm font-medium block">Tartalom</Label>

    <div class="border rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-ring">
      <!-- Toolbar -->
      <div class="flex items-center gap-0.5 border-b bg-muted/50 px-2 py-1">
        <button
          type="button"
          :class="['p-1.5 rounded text-sm font-bold leading-none transition-colors hover:bg-muted', editor?.isActive('bold') ? 'bg-muted text-foreground' : 'text-muted-foreground']"
          title="Félkövér (Ctrl+B)"
          @click="editor?.chain().focus().toggleBold().run()"
        >
          B
        </button>
        <button
          type="button"
          :class="['p-1.5 rounded text-sm italic leading-none transition-colors hover:bg-muted', editor?.isActive('italic') ? 'bg-muted text-foreground' : 'text-muted-foreground']"
          title="Dőlt (Ctrl+I)"
          @click="editor?.chain().focus().toggleItalic().run()"
        >
          I
        </button>
        <div class="w-px h-4 bg-border mx-1" />
        <button
          type="button"
          :class="['p-1.5 rounded leading-none transition-colors hover:bg-muted', editor?.isActive('link') ? 'bg-muted text-foreground' : 'text-muted-foreground']"
          title="Link beszúrása/szerkesztése"
          @click="setLink"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </button>
      </div>

      <!-- Link bubble menu -->
      <BubbleMenu
        v-if="editor"
        :editor="editor"
        :should-show="({ editor }: { editor: import('@tiptap/core').Editor }) => editor.isActive('link')"
        :tippy-options="{ duration: 100, placement: 'bottom' }"
      >
        <div class="flex items-center gap-2 bg-popover border rounded-md shadow-md px-2 py-1.5 text-sm">
          <span class="text-muted-foreground max-w-[200px] truncate text-xs">
            {{ editor?.getAttributes('link').href }}
          </span>
          <div class="w-px h-4 bg-border" />
          <button
            type="button"
            class="text-xs text-primary hover:underline whitespace-nowrap"
            @click="setLink"
          >
            Szerkesztés
          </button>
          <button
            type="button"
            class="text-xs text-destructive hover:underline whitespace-nowrap"
            @click="removeLink"
          >
            Eltávolítás
          </button>
        </div>
      </BubbleMenu>

      <!-- Editor area -->
      <div @click.capture="preventLinkNavigation">
        <EditorContent :editor="editor" class="wysiwyg-editor" />
      </div>
    </div>

    <FieldError :errors="props.errors?.content" />
  </div>
</template>

<style scoped>
.wysiwyg-editor :deep(.tiptap) {
  min-height: 120px;
  padding: 0.625rem 0.75rem;
  outline: none;
  font-size: 0.875rem;
  line-height: 1.6;
}

.wysiwyg-editor :deep(.tiptap p) {
  margin: 0 0 0.5em;
}

.wysiwyg-editor :deep(.tiptap p:last-child) {
  margin-bottom: 0;
}

.wysiwyg-editor :deep(.tiptap strong) {
  font-weight: 600;
}

.wysiwyg-editor :deep(.tiptap em) {
  font-style: italic;
}

.wysiwyg-editor :deep(.tiptap a) {
  color: hsl(var(--primary));
  text-decoration: underline;
  cursor: pointer;
}

.wysiwyg-editor :deep(.tiptap.ProseMirror-focused) {
  outline: none;
}
</style>
