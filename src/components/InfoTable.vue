<script setup>
import { computed } from 'vue'

const props = defineProps({
  source: {
    type: Array,
    default: () => []
  }
})

const columns = computed(() => {
  const firstItem = props.source?.[0] ?? {}
  return Object.keys(firstItem)
    .filter((key) => {
      const val = firstItem[key]
      return !Array.isArray(val) && typeof val !== 'object' && typeof val !== 'boolean'
    })
    .sort((a, b) => a - b)
    .map((key) => ({
      key,
      dataIndex: key,
      title: key
    }))
})
</script>

<template>
  <p v-if="source.length === 0">No data.</p>
  <a-table
    v-else
    :columns="columns"
    :data-source="source"
    :pagination="false"
    :scroll="{ x: true }"
    size="small"
  />
</template>

<style>
.ant-table-wrapper .ant-table-thead > tr > th {
  color: darkgrey;
}
</style>
