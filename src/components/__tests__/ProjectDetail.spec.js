import { describe, it, expect } from 'vitest'
import Antd from 'ant-design-vue'

import { config, mount } from '@vue/test-utils'
import Detail from '../ProjectDetail.vue'

config.global = {
  plugins: [Antd]
}

// mock for antd table
Object.defineProperty(window, 'matchMedia', {
  value: () => {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {}
    }
  }
})

const basicInfo = {
  id: 1,
  detail: {
    id: 1,
    title: 'title-val',
    startDateString: 'start-date-val',
    endDateString: 'end-date-val',
    statusDescription: 'status-val'
  }
}

const moreInfo = {
  ...basicInfo,
  detail: {
    ...basicInfo.detail,
    leadOrganization: { name: 'lead org' },
    supportingOrganizations: [{ name: 'supporting org' }],
    programDirectors: [{ fullNameInverted: 'program director' }],
    programExecutives: [{ fullNameInverted: 'program executive' }],
    programManagers: [{ fullNameInverted: 'program manager' }],
    projectManagers: [{ fullNameInverted: 'project manager' }]
  }
}

describe('ProjectDetail', () => {
  it('renders basic', () => {
    const wrapper = mount(Detail, { props: basicInfo })
    const text = wrapper.text()
    expect(text).toContain('ID: 1')
    expect(text).toContain('title-val')
    expect(text).toContain('start-date-val')
    expect(text).toContain('end-date-val')
    expect(text).toContain('status-val')
    expect(wrapper.find('[type=button]').exists()).toBe(true)
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('renders more', () => {
    const wrapper = mount(Detail, { props: { ...moreInfo, showMore: true } })
    const text = wrapper.text()
    expect(text).toContain('ID: 1')
    expect(text).toContain('title-val')
    expect(text).toContain('start-date-val')
    expect(text).toContain('end-date-val')
    expect(text).toContain('status-val')
    expect(wrapper.find('[type=button]').exists()).toBe(true)
    expect(wrapper.find('table').exists()).toBe(true)

    expect(text).toContain('Contact')
    expect(text).toContain('Organization')
    expect(text).toContain('lead org')
    expect(text).toContain('supporting org')
    expect(text).toContain('program director')
    expect(text).toContain('program executive')
    expect(text).toContain('program manager')
    expect(text).toContain('project manager')
  })

  it('disabled when pending', () => {
    const wrapper = mount(Detail, {
      props: { pending: true }
    })
    expect(wrapper.find('[type=button]').attributes('disabled')).toBe('')
  })

  it('emit onRefresh when click', async () => {
    const wrapper = mount(Detail, { props: basicInfo })
    await wrapper.find('[type=button]').trigger('click')
    expect(wrapper.emitted().onRefresh).toBeTruthy()
    expect(wrapper.emitted().onRefresh[0]).toEqual([basicInfo.id])
  })
})
