import { describe, it, expect } from 'vitest'
import Antd from 'ant-design-vue'
import dayjs from 'dayjs'

import { mount, config } from '@vue/test-utils'
import FilterBar from '../FilterBar.vue'

config.global = {
  plugins: [Antd]
}

describe('FilterBar', () => {
  it('renders properly', () => {
    const date = '2023-12-24'
    const wrapper = mount(FilterBar, {
      props: { defaultDate: dayjs(date) }
    })
    expect(wrapper.find(`input[title="${date}"]`).exists()).toBe(true)
    expect(wrapper.find('[type=button]').exists()).toBe(true)
    expect(wrapper.find('[type=button]').text()).toContain('filter')
  })

  it('disabled when pending', () => {
    const wrapper = mount(FilterBar, {
      props: { pending: true }
    })
    expect(wrapper.find('[type=button]').attributes('disabled')).toBe('')
  })

  it('emit onFilter when click', async () => {
    const date = '2023-12-24'
    const wrapper = mount(FilterBar, {
      props: { defaultDate: dayjs(date) }
    })
    await wrapper.find('[type=button]').trigger('click')
    expect(wrapper.emitted().onFilter).toBeTruthy()
    expect(wrapper.emitted().onFilter[0]).toEqual([date])
  })

  it('not emit onFilter default', async () => {
    const wrapper = mount(FilterBar)
    expect(wrapper.emitted().onFilter).toBeFalsy()
  })

  it('emit onFilter if filterOnMounted', async () => {
    const wrapper = mount(FilterBar, {
      props: { filterOnMounted: true }
    })
    expect(wrapper.emitted().onFilter).toBeTruthy()
  })
})
