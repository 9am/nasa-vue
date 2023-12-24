<script setup>
import { computed } from 'vue'
import pick from 'lodash.pick'
import InfoTable from './InfoTable.vue'

const props = defineProps({
  showMore: Boolean,
  pending: Boolean,
  id: Number,
  detail: {
    title: String,
    endDateString: String,
    startDateString: String,
    statusDescription: String,
    // org
    leadOrganization: Array,
    supportingOrganizations: Array,
    // contact
    programDirectors: Array,
    programExecutives: Array,
    programManagers: Array,
    projectManagers: Array
  }
})

const formatContact = (list = []) =>
  list.map((item) => pick(item, ['fullNameInverted', 'primaryEmail']))

const moreData = computed(() => [
  {
    name: 'Contact',
    data: [
      {
        name: 'Program Directors',
        data: formatContact(props.detail?.programDirectors)
      },
      {
        name: 'Program Executives',
        data: formatContact(props.detail?.programExecutives)
      },
      {
        name: 'Program Managers',
        data: formatContact(props.detail?.programManagers)
      },
      {
        name: 'Project Managers',
        data: formatContact(props.detail?.projectManagers)
      }
    ]
  },
  {
    name: 'Organization',
    data: [
      {
        name: 'Lead',
        data: [props.detail?.leadOrganization]
      },
      {
        name: 'Supporting',
        data: props.detail?.supportingOrganizations
      }
    ]
  }
])

const statusColor = computed(() => {
  switch (props.detail?.statusDescription) {
    case 'Active':
      return 'cyan'
    case 'Completed':
      return 'green'
    case 'Canceled':
      return 'red'
    default:
      return 'grey'
  }
})

const emit = defineEmits(['onRefresh'])
</script>

<template>
  <div class="project">
    <slot></slot>
    <a-card class="base" hoverable>
      <template #title>
        <div class="info">
          <a-tag class="id">ID: {{ detail?.id }}</a-tag>
          <h3 class="title" :title="detail?.title">{{ detail?.title }}</h3>
          <code class="date">{{ detail?.startDateString }}-{{ detail?.endDateString }}</code>
          <a-tag class="status" :color="statusColor">{{ detail?.statusDescription }}</a-tag>
        </div>
      </template>
      <template #extra>
        <a-button
          :loading="props.pending"
          :disabled="props.pending"
          @click.prevent.stop="emit('onRefresh', props.id)"
          >refresh</a-button
        >
      </template>
    </a-card>
    <a-card v-if="showMore" class="more">
      <fieldset v-for="more in moreData" :key="more.name">
        <legend>{{ more.name }}</legend>
        <dl v-for="item in more.data" :key="item.name">
          <dt>{{ item.name }}</dt>
          <dd><InfoTable :source="item.data" /></dd>
        </dl>
      </fieldset>
    </a-card>
  </div>
</template>

<style scoped>
.project > * {
  margin: 2rem 0;
}
.info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: nowrap;
  gap: 1rem;
  padding: 1rem 0;
}
.title {
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}
.in-list .info {
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0;
}
.in-list .title {
  max-width: 100%;
}
.in-list .date {
  margin-left: auto;
}
.in-list .status {
  min-width: 80px;
  text-align: center;
}
fieldset:not(:nth-child(1)) {
  margin-top: 2rem;
}
</style>
