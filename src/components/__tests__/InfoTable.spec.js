import { describe, it, expect } from 'vitest'
import Antd from 'ant-design-vue'

import { config, mount } from '@vue/test-utils'
import InfoTable from '../InfoTable.vue'

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

const source = Array.from({ length: 5 }).map((_, i) => ({
  id: i,
  name: `name-data-${i}`,
  desc: `desc-data-${i}`
}))

describe('InfoTable', () => {
  it('renders empty source', () => {
    const wrapper = mount(InfoTable)
    expect(wrapper.text()).toContain('No data.')
  })
  it('renders properly', () => {
    const wrapper = mount(InfoTable, { props: { source } })
    const text = wrapper.text()
    expect(text).toContain('name')
    expect(text).toContain('desc')
    expect(text).toContain('name-data-0')
    expect(text).toContain('name-data-4')
    expect(text).toContain('desc-data-0')
    expect(text).toContain('desc-data-4')
  })
})
