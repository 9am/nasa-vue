<script setup>
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePagination, useProjects } from '@/stores/projects'
import FilterBar from '@/components/FilterBar.vue'
import ProjectDetailView from './ProjectDetailView.vue'

const pageOptions = [10, 25, 50]
const pageStore = usePagination()
const { curr, total, size } = storeToRefs(pageStore)
const store = useProjects()
const { isEmpty, listCurr, error, pending } = storeToRefs(store)
</script>

<template>
  <FilterBar
    :pending="pending"
    :filterOnMounted="isEmpty"
    @on-filter="(date) => store.fetchList({ updatedSince: date })"
  />
  <pre v-if="error && !pending" style="color: red">{{ error }}</pre>
  <section v-if="isEmpty && !pending">No projects found. Try search with another date.</section>
  <section v-else class="list">
    <a-pagination
      v-model:current="curr"
      :total="total"
      v-model:pageSize="size"
      :page-size-options="pageOptions"
      show-less-items
    />
    <ul>
      <li v-for="item in listCurr" :key="item.id">
        <RouterLink :to="{ name: 'project', params: { id: item.id } }">
          <ProjectDetailView :id="item.id" />
        </RouterLink>
      </li>
    </ul>
    <a-pagination
      v-model:current="curr"
      :total="total"
      v-model:pageSize="size"
      :page-size-options="pageOptions"
      show-less-items
    />
  </section>
</template>

<style scoped>
.ant-pagination {
  text-align: right;
}
.list a {
  text-decoration: none;
}
</style>
