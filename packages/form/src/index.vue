<script
  setup
  lang="ts"
  generic="TData extends Record<string, any>, TMode extends Mode"
>
import { computed, shallowRef, useTemplateRef, type Component } from 'vue'
import {
  ElText,
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  type FormInstance,
} from 'element-plus'
import type { CFormProps, CFormItem, CFormInstance } from './types' // 导入更新后的类型
import { Mode } from '@comun-ui/types'
import FormInput from './components/FormInput.vue'

const props = defineProps<CFormProps<TData, TMode>>()
const formModel = defineModel<TData>({
  default: {},
})
const formRef = useTemplateRef<FormInstance>('formRef')
const handleFieldChange = (prop: keyof TData, value: any) => {
  const newData = { ...props.modelValue }
  newData[prop] = value
  formModel.value = newData
}

const componentMap = shallowRef({
  static: ElText,
  input: FormInput,
  textarea: FormInput,
})

const currentConfig = computed(() => props.config)

const currentMode = computed(
  () => currentConfig.value?.mode || ('edit' as TMode),
)

const formProps = computed(() => {
  const { disabled, ...otherProps } = currentConfig.value.formProps || {}
  if (typeof disabled === 'function') {
    return {
      ...otherProps,
      disabled: disabled({
        data: formModel.value,
        item: currentConfig.value,
        mode: currentMode.value,
      }),
    }
  }
  return {
    ...otherProps,
    disabled,
  }
})
const formRules = computed(() => currentConfig.value.formProps?.rules)
const rowProps = computed(() => currentConfig.value.rowProps || {})
const items = computed(() => currentConfig.value.items || [])

const processedItems = computed(() => {
  return items.value
    .map((item) => {
      const prop = item.prop as string
      if (!prop) return false
      const newItem = { ...item, prop: prop }
      if (typeof item.show === 'function') {
        const isShow = item.show({
          data: formModel.value,
          item,
          mode: currentMode.value,
        })
        if (!isShow) return false
      }
      return newItem
    })
    .filter((item) => item !== false)
})

const sharkFormItemProps = (item: (typeof processedItems.value)[0]) => {
  console.log('ElFormItem', ElFormItem)
  return item
}
</script>

<template>
  <el-form
    ref="formRef"
    :model="formModel"
    :rules="formRules"
    v-bind="formProps"
    :class="{ 'pro-form--view': currentMode !== 'edit' }"
  >
    <el-row :gutter="20" v-bind="rowProps">
      <template v-for="item in processedItems" :key="item.prop">
        <el-col :span="24" v-bind="item.span">
          <el-form-item v-bind="sharkFormItemProps(item)">
            <component
              :is="componentMap[item.type]"
              v-model="formModel[item.prop]"
              :item="item"
              :form-data="formModel"
              :mode="currentMode"
            >
            </component>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>
