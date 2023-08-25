<script setup lang="ts">
import {Button, Form, FormItem, Input, Select, SelectOption} from "ant-design-vue";
import {PropType} from "vue";
import {Repo} from "../interface/universe-tree";

const props = defineProps({
  owner: {
    type: String,
    required: true,
  },
  repo: {
    type: String,
    required: true,
  },
  repos: {
    type: Array as PropType<Repo[]>,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  repoFetchLoading: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  'fetch-repo': [],
  'update:owner': [string],
  'update:repo': [string],
  'update:branch': [string],
  'owner-changed': [string],
  'repo-changed': [string],
  'branch-changed': [string],
}>()

const onOwnerChanged = e => {
  emit('update:owner', e.target.value)
  emit('owner-changed', e.target.value)
}

const onRepoChanged = e => {
  emit('update:repo', e)
  emit('repo-changed', e)
}

const onBranchChanged = e => {
  emit('update:branch', e.target.value)
  emit('branch-changed', e.target.value)
}

</script>

<template>
  <div class="flex flex-row items-center justify-center">
    <Form layout="inline">
      <FormItem label="Source">
        <Select value="Github" style="width: 90px">
          <SelectOption value="Github">Github</SelectOption>
          <SelectOption value="Gitlab" disabled>Gitlab</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="Owner">
        <Input placeholder="Please input repo owner" @change="onOwnerChanged" :value="owner" class="w-[200px]" />
      </FormItem>
      <FormItem label="Repo">
        <Select @change="onRepoChanged" :loading="repoFetchLoading" placeholder="Please select repo" :value="repo">
          <SelectOption v-for="item of repos" :value="item.name">{{ item.name }}</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="Branch">
        <Input @change="onBranchChanged" placeholder="Please input branch" :value="branch" class="w-[80px]" />
      </FormItem>
      <FormItem>
        <Button @click="$emit('fetch-repo')">Enjoy</Button>
      </FormItem>
    </Form>
  </div>
</template>

<style>

</style>
