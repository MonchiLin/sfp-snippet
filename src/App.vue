<script setup lang="ts">
import { GithubDriver } from "./drivers/github/github.driver";
import { onMounted, ref, watch } from 'vue';
import TreeX from "./components/extends/tree-x.vue";
import { Spin } from "ant-design-vue";
import { UniverseTreeNode } from "./interface/universe-tree";
import CodeToolbar from "./components/code-toolbar.vue";
import HighlightjsRender from "./components/highlightjs-render.vue";
import CheckOutView from "./components/check-out-view.vue";

const spinning = ref(false);
const checkOutModalVisible = ref(false);
const owner = 'Path-Of-Exile-Vela';
const repo = 'L10N';
const expandedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const currentNode = ref<UniverseTreeNode | undefined>(undefined)
const rootNode = ref<UniverseTreeNode | undefined>(undefined);
const universeTreeNodes = ref<UniverseTreeNode[]>([]);

onMounted(() => {
  getTree()
})

const onNodeSelected = (node: UniverseTreeNode) => {
  if (node.type === "file") {
    currentNode.value = node;
  }
}

const getTree = () => {
  spinning.value = true;
  GithubDriver.tree(owner, repo, "master")
    .then(res => {
      rootNode.value = res.data;
    })
    .finally(() => {
      spinning.value = false;
    })
}

watch(currentNode, (newValue) => {
  if (!newValue) {
    return
  }
  if (newValue.content) {
    return;
  }

  spinning.value = true;
  GithubDriver.content(owner, repo, newValue.path)
    .then(res => {
      newValue.content = res.data;
    })
    .finally(() => {
      spinning.value = false;
    })
})

const onCodeChanged = (code: string) => {
  currentNode.value!.content!.text = code;
}

const onCheckNodesChanged = (nodes: UniverseTreeNode[]) => {
  universeTreeNodes.value = nodes;
}

const handleCheckOut = async  () => {
  spinning.value = true;
  await Promise.all(universeTreeNodes.value.map(node => {
      if (node.content) {
        return Promise.resolve()
      }
      
      return GithubDriver.content(owner, repo, node.path)
        .then(res => {
          node.content = res.data;
        })
    })
  )
  spinning.value = false;
  checkOutModalVisible.value = true;
}

</script>

<template>
  <Spin :spinning="spinning">
    <div class="flex flex-row">
      <div class="shrink-0">
        <tree-x
            v-model:expanded-keys="expandedKeys"
            v-model:selected-keys="selectedKeys"
            :rootNode="rootNode"
            v-if="rootNode"
            @node-selected="onNodeSelected"
            @check-nodes-changed="onCheckNodesChanged"
        />
      </div>
      <div class="flex-1 flex flex-col">
        <code-toolbar
            :currnet-tree-node="currentNode"
            @check-out="handleCheckOut"
        />
        <highlightjs-render
            v-if="currentNode?.content?.text"
            :code="currentNode.content.text"
            @code-changed="onCodeChanged"
        />
      </div>
    </div>

    <check-out-view
        v-model:visible="checkOutModalVisible"
        :checked-tree-nodes="universeTreeNodes"
        :root-node="rootNode"
    />
  </Spin>
</template>

<style scoped>

</style>
