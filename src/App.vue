<script setup lang="ts">
import {GithubDriver} from "./drivers/github/github.driver";
import {onMounted, ref, watch} from 'vue';
import TreeX from "./components/extends/tree-x.vue";
import {Spin} from "ant-design-vue";
import {Repo, UniverseTreeNode} from "./interface/universe-tree";
import CodeToolbar from "./components/code-toolbar.vue";
import HighlightjsRender from "./components/highlightjs-render.vue";
import CheckOutView from "./components/check-out-view.vue";
import VariantInput from "./components/variant-input.vue";

const spinning = ref(false);
const checkOutModalVisible = ref(false);
const owner = ref('MonchiLin');
const repo = ref('sfp-snippet');
const branch = ref('master');
const expandedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const currentNode = ref<UniverseTreeNode | undefined>(undefined)
const rootNode = ref<UniverseTreeNode | undefined>(undefined);
const universeTreeNodes = ref<UniverseTreeNode[]>([]);
const repos = ref<Repo[]>([])
const repoFetchLoading = ref(false);

watch(owner, () => {
  repoFetchLoading.value = true;
  GithubDriver.repos(owner.value!)
    .then(res => {
      repos.value = res.data
    })
    .finally(() => {
      repoFetchLoading.value = false;
    })
}, {immediate: true})

const onNodeSelected = (node: UniverseTreeNode) => {
  if (node.type === "file") {
    currentNode.value = node;
  }
}

const getTree = () => {
  spinning.value = true;
  GithubDriver.tree(owner.value, repo.value, "master")
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
  GithubDriver.content(owner.value, repo.value, newValue.path)
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

const handleCheckOut = async () => {
  spinning.value = true;
  await Promise.all(universeTreeNodes.value.map(node => {
        if (node.content) {
          return Promise.resolve()
        }

        return GithubDriver.content(owner.value, repo.value, node.path)
            .then(res => {
              node.content = res.data;
            })
      })
  )
  spinning.value = false;
  checkOutModalVisible.value = true;
}

const handleFetchRepo = () => {
  getTree();
}

</script>

<template>
  <Spin :spinning="spinning">
    <div class="flex flex-col gap-1">
      <variant-input
          v-model:owner="owner"
          v-model:repo="repo"
          :repos="repos"
          v-model:branch="branch"
          :repoFetchLoading="repoFetchLoading"
          @fetch-repo="handleFetchRepo"
      />
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
    </div>
  </Spin>
</template>

<style scoped>

</style>
