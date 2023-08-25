<script setup lang="ts">
import { DirectoryTree } from "ant-design-vue";
import { computed, PropType } from "vue";
import { UniverseTreeNode } from "../../interface/universe-tree";

const props = defineProps({
  rootNode: {
    type: Object as PropType<UniverseTreeNode>,
    required: true,
  },
  expandedKeys: {
    type: Array as PropType<string[]>,
    required: true,
  },
  selectedKeys: {
    type: Array as PropType<string[]>,
    required: true,
  },
});

const emit = defineEmits<{
  "node-selected": [node: UniverseTreeNode],
  'check-nodes-changed': [nodes: UniverseTreeNode[]],
  'update:expandedKeys': any,
  'update:selectedKeys': any,
}>()

const treeData = computed(() => UniverseTreeNode.toAntTree(props.rootNode));

const onNodeSelect = (selectedKeys: any[], {node}: any) => {
  const universeTreeNode = node.universeTreeNode as UniverseTreeNode;
  emit("node-selected", universeTreeNode)
}

const onChecked = (selectedKeys: any[], {checkedNodes}: any) => {
  const nodes: UniverseTreeNode[] = checkedNodes
    .map((i: any) => i.universeTreeNode)
    .filter((i: UniverseTreeNode) => i.type === "file")
  emit("check-nodes-changed", nodes)
}

</script>

<template>
  <directory-tree
      :expandedKeys="expandedKeys"
      :selectedKeys="selectedKeys"
      @update:expandedKeys="emit('update:expandedKeys', $event)"
      @update:selectedKeys="emit('update:selectedKeys', $event)"
      @select="onNodeSelect"
      @check="onChecked"
      checkable
      multiple
      :tree-data="treeData.children"
      show-line
  />
</template>

