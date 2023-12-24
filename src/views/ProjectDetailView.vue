<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, RouterLink } from 'vue-router'
import { useProjects } from '@/stores/projects'
import ProjectDetail from '@/components/ProjectDetail.vue'

const props = defineProps({
  id: Number
})

const { params } = useRoute()
const store = useProjects()
const { map } = storeToRefs(store)

const id = computed(() => +(props.id ?? params?.id))
const detail = computed(() => map.value.get(id.value) ?? {})
const inList = computed(() => props.id !== undefined)

const DELAY = 100
let timer
let ctrl

const onRefresh = async (id) => {
  ctrl = new AbortController()
  await store.fetchItem({ id }, { signal: ctrl.signal })
}

onMounted(() => {
  timer = setTimeout(() => {
    if (store.itemNotReady(id.value)) {
      onRefresh(id.value)
    }
  }, DELAY)
})
onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
  // cancel
  if (ctrl) {
    ctrl.abort()
  }
})
</script>

<template>
  <ProjectDetail
    :class="{ 'in-list': inList }"
    :id="id"
    :pending="detail.pending"
    :detail="detail"
    :showMore="!inList"
    @on-refresh="onRefresh"
  >
    <RouterLink v-if="!inList" :to="{ name: 'projects' }"> &lt; back to projects </RouterLink>
  </ProjectDetail>
</template>

<style></style>
