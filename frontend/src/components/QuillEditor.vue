<template>
  <div class="quill-editor-wrapper">
    <div ref="editorContainer" class="h-64 sm:h-80 md:h-96"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Nhập nội dung...'
  }
})

const emit = defineEmits(['update:modelValue'])

const editorContainer = ref(null)
let quill = null

onMounted(() => {
  if (window.Quill) {
    quill = new window.Quill(editorContainer.value, {
      theme: 'snow',
      placeholder: props.placeholder,
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link', 'image'],
          ['clean']
        ]
      }
    })

    // Set initial content
    if (props.modelValue) {
      quill.root.innerHTML = props.modelValue
    }

    // Update model on change
    quill.on('text-change', () => {
      const html = quill.root.innerHTML
      // Avoid infinite loop if content is empty or just <p><br></p>
      if (html === '<p><br></p>') {
        emit('update:modelValue', '')
      } else {
        emit('update:modelValue', html)
      }
    })
  } else {
    console.error('Quill library not loading from CDN yet.')
  }
})

// Watch external changes
watch(() => props.modelValue, (newVal) => {
  if (quill && newVal !== quill.root.innerHTML) {
    // Only update if content is different to avoid cursor jumping
    // Simple check, perfectly fine for this use case
    const currentContent = quill.root.innerHTML
    if (newVal !== currentContent) {
      quill.root.innerHTML = newVal || ''
    }
  }
})

onBeforeUnmount(() => {
  quill = null
})
</script>

<style>
/* Custom styles to match the theme */
.ql-toolbar.ql-snow {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border-color: var(--color-border, #e5e7eb) !important;
  font-family: inherit;
}
.ql-container.ql-snow {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border-color: var(--color-border, #e5e7eb) !important;
  font-family: inherit;
  font-size: 1rem;
}
.ql-editor {
  min-height: 200px;
}
</style>
