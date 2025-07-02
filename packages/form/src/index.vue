<script
  setup
  lang="ts"
  generic="TData extends Record<string, any>, TMode extends Mode"
>
import { computed, shallowRef, useTemplateRef } from 'vue'

import {
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  type FormInstance,
} from 'element-plus'
import type {
  CFormConfig,
  CFormProps,
  Column,
  InternalComponentsKey,
} from './types' // 导入更新后的类型
import type { HelperFunction, Mode } from '@comun-ui/types'
import FormInput from './components/FormInput.vue'
import FormSelect from './components/FormInput.vue'
import FormDatePicker from './components/FormInput.vue'
import FormSwitch from './components/FormInput.vue'
import FormCheckbox from './components/FormInput.vue'
import FormRadio from './components/FormInput.vue'
import formText from './components/FormInput.vue'

const props = defineProps<CFormProps<TData, TMode>>()
const formModel = defineModel<TData>({
  default: {},
})
const formRef = useTemplateRef<FormInstance>('formRef')

const internalComponents = shallowRef({
  input: FormInput,
  select: FormSelect,
  datePicker: FormDatePicker,
  switch: FormSwitch,
  checkbox: FormCheckbox,
  radio: FormRadio,
  text: formText,
})

const currentConfig = computed(() => props.config)
const currentMode = computed(
  () => currentConfig.value?.mode || ('edit' as TMode),
)
const rowProps = computed(() => currentConfig.value.rowProps || {})
const columns = computed(() => currentConfig.value.columns || [])

const formProps = computed(() => {
  const { disabled, ...otherProps } = currentConfig.value.formProps || {}
  if (typeof disabled === 'function') {
    return {
      ...otherProps,
      disabled: disabled({
        data: formModel.value,
        config: currentConfig.value,
        column: null,
        mode: currentMode.value,
      }),
    }
  }
  return {
    ...otherProps,
    disabled,
  }
})

function callFunction<
  T extends HelperFunction<
    TData,
    CFormConfig<TData, TMode>,
    Column<TData, TMode>,
    TMode,
    any
  >,
>(fn: T, column: Column<TData, TMode>): ReturnType<T> {
  return fn({
    data: formModel.value,
    config: currentConfig.value,
    mode: currentMode.value,
    column,
  })
}

function getIsShow(column: Column<TData, TMode>) {
  if (typeof column.show !== 'function') {
    return column.show
  }
  return callFunction(column.show, column)
}

function getSpanProps(column: Column<TData, TMode>) {
  if (typeof column.span !== 'function') {
    return column.span
  }
  return callFunction(column.span, column)
}

function getFormItemProps(column: Column<TData, TMode>) {
  if (typeof column.formItemProps !== 'function') {
    return column.formItemProps
  }
  return callFunction(column.formItemProps, column)
}

function getComponent(column: Column<TData, TMode>) {
  const currentModeType =
    (column[`${currentMode.value}Type`] as InternalComponentsKey) || column.type
  if (currentModeType !== 'component') {
    return internalComponents.value[currentModeType]
  }
  return column.component
}

const processedColumns = computed(() => {
  return columns.value
    .map((column) => {
      const prop = column.prop as string
      if (!prop) return false
      const isShow = getIsShow(column)
      if (!isShow) return false
      const span = getSpanProps(column)
      const formItemProps = getFormItemProps(column)
      const component = getComponent(column)
      return {
        ...column,
        prop: prop,
        show: isShow,
        span,
        formItemProps,
        component,
      }
    })
    .filter((item) => item !== false)
})
</script>

<template>
  <el-form
    ref="formRef"
    :model="formModel"
    v-bind="formProps"
    :class="{ 'pro-form--view': currentMode !== 'edit' }"
  >
    <el-row :gutter="20" v-bind="rowProps">
      <template v-for="column in processedColumns" :key="column.prop">
        <el-col :span="24" v-bind="column.span">
          <el-form-item v-bind="column.formItemProps">
            <component
              :is="column.component"
              v-model="formModel[column.prop]"
              :column="column"
              :config="currentConfig"
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
