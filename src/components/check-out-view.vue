<script setup lang="ts">
import { computed, PropType, h } from "vue";
import { Button, Modal } from "ant-design-vue";
import { UniverseTreeNode } from "../interface/universe-tree";
import HighlightjsRender from "./highlightjs-render.vue";
import { EyeOutlined } from "@ant-design/icons-vue";
import { URL_LIMIT } from "../unclassfied/var";

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

const emit = defineEmits<{}>()

const nodeHierarchical = computed(() => {
  // console.log(props.checkedTreeNodes)
  // console.log(UniverseTreeNode.link(props.checkedTreeNodes, props.rootNode!))
  return UniverseTreeNode.link(props.checkedTreeNodes, props.rootNode!)
})

const text = computed(() => {
  return UniverseTreeNode.toHierarchical(nodeHierarchical.value) + UniverseTreeNode.toString(nodeHierarchical.value)
})

const goCarbon = () => {
  let code = encodeURIComponent(text.value);
  if (code.length > URL_LIMIT) {
    code = code.slice(0, URL_LIMIT);
  }
  window.open(`https://carbon.now.sh/?code=${encodeURIComponent(code)}`)
}

</script>

<template>
  <Modal
      destroyOnClose
      :open="visible"
      @cancel="$emit('update:visible', false)"
      :footer="null"
      title="Checkout"
  >
    <div class="flex flex-col">
      <Button @click="goCarbon" :icon="h(EyeOutlined)">Check out</Button>
      <highlightjs-render :code="text"/>
    </div>
  </Modal>
</template>

<style>

.ant-modal {
    width: auto !important;
    max-width: 80vw;
}

</style>
