<script setup lang="ts">
import { h, PropType } from "vue";
import { EyeOutlined, LinkOutlined } from "@ant-design/icons-vue";
import { Button } from "ant-design-vue";
import { UniverseTreeNode } from "../interface/universe-tree";

const props = defineProps({
  currentTreeNode: {
    type: Object as PropType<UniverseTreeNode>,
    required: false,
  },
})

const emit = defineEmits<{
  "reset": [],
  "check-out": [],
}>()

const goFile = () => {
  window.open(props.currentTreeNode!.content!.url)
}

</script>

<template>
  <div class="flex flex-row items-center gap-4">
    <Button :disabled="!currentTreeNode" @click="goFile" :icon="h(LinkOutlined)">Go File</Button>
    <Button :disabled="!currentTreeNode" @click="emit('reset')" :icon="h(LinkOutlined)">Reset</Button>
    <Button @click="emit('check-out')" :icon="h(EyeOutlined)">Check out</Button>
  </div>
</template>

<style scoped>

</style>
