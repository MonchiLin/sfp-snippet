<script setup lang="ts">
import { GithubDriver } from "./drivers/github/github.driver";
import { onMounted, ref } from 'vue';
import TreeX from "./components/extends/tree-x.vue";
import { UniverseTreeNode } from "./interface/universe-tree";
import SpinX from "./components/extends/spin-x";

const owner = 'Path-Of-Exile-Vela';
const repo = 'L10N';
const tree = ref<UniverseTreeNode | null>(null);
const spinning = ref(false);

onMounted(() => {
  spinning.value = true;
  GithubDriver.tree(owner, repo, "master")
    .then(res => {
      tree.value = res.data;
      // GithubDriver.content(owner, repo, res.data.tree[0].path)
      //   .then(res => {
      //     console.log(res.data)
      //     console.log(atob(res.data.content))
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
    })
    .finally(() => {
      spinning.value = false;
    })
})

const expandedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);

</script>

<template>
  <div>
    <spin-x tip="Loading..." :spinning="spinning">
      <tree-x
          v-model:expanded-keys="expandedKeys"
          v-model:selected-keys="selectedKeys"
          :universe-tree="tree"
          v-if="tree"
      />
    </spin-x>
    <div contenteditable>
      
    </div>
  </div>
</template>

<style scoped>

</style>
