<script setup lang="ts">
import { DirectoryTree } from "ant-design-vue";
import { computed, PropType } from "vue";
import { UniverseTreeNode } from "../../interface/universe-tree";

const props = defineProps({
  universeTree: {
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

const treeData = computed(() => UniverseTreeNode.toAntTree(props.universeTree));
// if the file is 

</script>

<template>
  <directory-tree
      :expandedKeys="expandedKeys"
      :selectedKeys="selectedKeys"
      @update:expandedKeys="$emit('update:expandedKeys', $event)"
      @update:selectedKeys="$emit('update:selectedKeys', $event)"
      checkable
      multiple
      :tree-data="treeData.children"
  />
</template>

<style scoped>

</style>
