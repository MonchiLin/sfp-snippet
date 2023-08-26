<script setup lang="ts">
import {computed, h, PropType, ref, watch} from "vue";
import {Button, ButtonGroup, Modal} from "ant-design-vue";
import {UniverseTreeNode} from "../interface/universe-tree";
import HighlightjsRender from "./highlightjs-render.vue";
import {CopyOutlined, GlobalOutlined, CloseOutlined} from "@ant-design/icons-vue";
import {Constants} from "../constants";
import copy from 'copy-to-clipboard';

const props = defineProps({
  checkedTreeNodes: {
    type: Array as PropType<UniverseTreeNode[]>,
    required: true,
  },
  rootNode: {
    type: Object as PropType<UniverseTreeNode | undefined>,
    required: false,
  },
  visible: {
    type: Boolean,
    required: true,
  }
})

const copied = ref(false)

const nodeHierarchical = computed(() => {
  // console.log(props.checkedTreeNodes)
  // console.log(UniverseTreeNode.link(props.checkedTreeNodes, props.rootNode!))
  return UniverseTreeNode.link(props.checkedTreeNodes!, props.rootNode!)
})

const text = computed(() => {
  return UniverseTreeNode.toHierarchical(nodeHierarchical.value) + "\n" + UniverseTreeNode.plain(nodeHierarchical.value)
})

const goCarbon = () => {
  let code = encodeURIComponent(text.value);
  if (code.length > Constants.URL_LIMIT) {
    code = code.slice(0, Constants.URL_LIMIT);
  }
  window.open(`https://carbon.now.sh/?code=${encodeURIComponent(code)}`)
}

const handleCopy = () => {
  copy(text.value);
  copied.value = true;
}

watch(() => props.visible, (newVal) => {
  if (!newVal) {
    copied.value = false;
  }
})

</script>

<template>
  <Modal
    destroyOnClose
    :open="visible"
    :footer="null"
    title="Checkout"
  >
    <div class="flex flex-col gap-2">
      <ButtonGroup>
        <Button @click="goCarbon" :icon="h(GlobalOutlined)">Carbon</Button>
        <Button @click="handleCopy" :icon="h(CopyOutlined)">{{ copied ? 'Copied' : 'Copy' }}</Button>
      </ButtonGroup>
      <highlightjs-render :code="text"/>
    </div>
    <template #closeIcon>
      <div class="flex flex-row items-center justify-end">
        <span class="pr-1 text-gray-300">Length: {{ text.length }}</span>
        <CloseOutlined @click="$emit('update:visible', false)"/>
      </div>
    </template>
  </Modal>
</template>

<style>

.ant-modal {
  width: auto !important;
  max-width: 80vw;
}

.ant-modal-close {
  width: 300px !important;
  background: white !important;
  cursor: auto;
}

</style>
