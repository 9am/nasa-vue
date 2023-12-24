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
  return Object.keys(firstItem).map((key) => ({
    key,
    dataIndex: key,
    title: key
  }))
  // .filter(({ key }) => {
  //   const val = firstItem[key]
  //   return !Array.isArray(val) || typeof val !== 'object' || typeof val !== 'boolean'
  // })
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
