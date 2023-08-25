<template>
  <pre>
    <code contenteditable @input="onCodeChanged" :class="className" v-html="highlightedCode" tabindex="0"/>
  </pre>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css'

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  'code-changed': [code: string],
}>()

const language = ref('')

const className = computed(() => {
  return `hljs ${language.value}`
})

const highlightedCode = computed(() => {
  const result = hljs.highlightAuto(props.code)
  language.value = result.language ?? ''
  return result.value
})

const onCodeChanged = (e: InputEvent & { target: HTMLElement }) => {
  emit('code-changed', e.target!.innerText)
}

</script>

<style>
pre {
    display: flex;
    height: auto;
    padding: 0;
    margin: 0;
}
</style>