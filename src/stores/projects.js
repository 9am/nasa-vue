import axios from 'axios'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

axios.defaults.baseURL = 'https://nasa-api-proxy.deno.dev'

const fetchProjects = ({ updatedSince = '' }) =>
  axios.get('/api/projects', {
    params: { updatedSince }
  })

const fetchProjectByID = ({ id = '0' }, options = {}) => axios.get(`/api/projects/${id}`, options)

export const usePagination = defineStore('projectsPagination', () => {
  const curr = ref(1)
  const size = ref(10)
  const total = computed(() => {
    const projects = useProjects()
    return projects.len
  })
  const start = computed(() => (curr.value - 1) * size.value)
  const end = computed(() => start.value + size.value)
  function $reset() {
    curr.value = 1
  }
  return {
    curr,
    size,
    total,
    start,
    end,
    $reset
  }
})

export const useProjects = defineStore('projects', () => {
  const ids = ref([])
  const map = ref(new Map())
  const error = ref(null)
  const pending = ref(false)

  const len = computed(() => ids.value.length)
  const isEmpty = computed(() => len.value === 0)

  const listCurr = computed(() => {
    const pa = usePagination()
    const currPage = ids.value.slice(pa.start, pa.end)
    return currPage.map((id) => {
      return map.value.get(id) ?? null
    })
  })

  function $reset() {
    ids.value = []
    map.value = new Map()
    error.value = null
    pending.value = false
  }

  async function fetchList(params) {
    const pa = usePagination()
    pending.value = true
    try {
      const res = await fetchProjects(params)
      ids.value =
        res.data?.projects.map((item) => {
          setItem(item)
          return item.projectId
        }) ?? []
      pa.$reset()
      error.value = null
    } catch (err) {
      error.value = err
    } finally {
      pending.value = false
    }
  }

  async function fetchItem({ id }, options = {}) {
    if (!map.value.has(id)) {
      map.value.set(id, {})
    }
    map.value.get(id).pending = true
    try {
      const res = await fetchProjectByID({ id }, options)
      setItem(res.data?.project)
    } finally {
      map.value.get(id).pending = false
    }
  }

  function setItem(next) {
    const id = next.projectId
    const prev = map.value.get(id) ?? {}
    map.value.set(id, { id, ...prev, ...next })
  }

  function itemNotReady(id) {
    const item = map.value.get(id) ?? {}
    return !item.title && !item.pending
  }

  return {
    // state
    map,
    len,
    isEmpty,
    listCurr,
    error,
    pending,
    // actions
    fetchList,
    fetchItem,
    setItem,
    itemNotReady,
    $reset
  }
})
