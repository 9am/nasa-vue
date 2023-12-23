<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  pending: Boolean,
  filterOnMounted: Boolean
})

const emit = defineEmits(['onFilter'])

const format = 'YYYY-MM-DD'
const date = ref(dayjs().subtract(2, 'days'))

const onFilter = () => emit('onFilter', date.value.format(format))

onMounted(() => {
  if (props.filterOnMounted) {
    onFilter()
  }
})
</script>

<template>
  <section>
    <a-date-picker
      :disabled="props.pending"
      v-model:value="date"
      :format="format"
      :disabled-date="(curr) => curr > dayjs().endOf('day')"
    />
    <i class="space"></i>
    <a-button type="primary" :loading="props.pending" :disabled="props.pending" @click="onFilter">
      filter
    </a-button>
  </section>
</template>

<style scoped>
section {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.space {
  flex: 1;
  margin: 0 auto;
  height: 1px;
  background: lightgrey;
}
</style>
