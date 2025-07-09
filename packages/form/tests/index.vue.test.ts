import { config, mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import { describe, expect, it } from 'vitest'
import { allComponents, Form } from '../src/index.ts'

config.global.renderStubDefaultSlot = true
config.global.stubs = {
  ...allComponents,
}

describe('cForm.vue', () => {
  it('base render', () => {
    const wrapper = mount(Form, {
      props: {
        config: {
          mode: 'edit',
          columns: [
            {
              show: true,
              type: 'input',
              prop: 'name',
            },
            {
              show: true,
              type: 'number',
              prop: 'age',
            },
            {
              show: false,
              type: 'switch',
              prop: 'isOpen',
            },
          ],
        },
        modelValue: {
          name: 'boBo',
          age: 18,
          isOpen: false,
        },
      },
      shallow: true,
      global: {
        plugins: [ElementPlus],
      },
    })
    expect(wrapper.findComponent(allComponents.FormInput).exists()).toBeTruthy()
    expect(
      wrapper.findComponent(allComponents.FormNumber).exists(),
    ).toBeTruthy()
    expect(wrapper.findComponent(allComponents.FormSwitch).exists()).toBeFalsy()
  })

  it('set mode to view', () => {
    const wrapper = mount(Form, {
      props: {
        config: {
          mode: 'view',
          columns: [
            {
              show: true,
              type: 'input',
              prop: 'name',
              label: '姓名',
            },
            {
              show: true,
              type: 'number',
              prop: 'age',
              label: '年龄',
              viewType: 'input',
            },
            {
              show: true,
              type: 'switch',
              prop: 'isOpen',
              label: '启用',
              props: {
                activeText: '开启',
                inactiveText: '关闭',
              },
            },
          ],
        },
        modelValue: {
          name: 'boBo',
          age: 18,
          isOpen: false,
        },
      },
      shallow: true,
      global: {
        plugins: [ElementPlus],
      },
    })
    const nameComponent = wrapper
      .findComponent("[prop='name']")
      .findComponent(allComponents.FormText)
    expect(nameComponent.exists()).toBeTruthy()
    expect(nameComponent.text()).toBe('boBo')

    expect(
      wrapper
        .findComponent("[prop='age']")
        .findComponent(allComponents.FormInput)
        .exists(),
    ).toBeTruthy()

    const isOpenComponent = wrapper
      .findComponent("[prop='isOpen']")
      .findComponent(allComponents.FormText)
    expect(isOpenComponent.text()).toBe('关闭')
    expect(wrapper.findComponent(allComponents.FormSwitch).exists()).toBeFalsy()
  })
})
