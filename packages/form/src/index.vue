<script
  setup
  lang="ts"
  generic="TData extends Record<string, any>, TMode extends Mode"
>
import {
  ElCol,
  ElForm,
  ElFormItem,
  ElRow,
  type FormInstance,
} from 'element-plus'

import { computed, shallowRef, useTemplateRef } from 'vue'
import { aliasComponents } from './components/index'
import type {
  CFormProps,
  FormFunctionParams,
  InternalComponentsKey,
  LocalColumn,
  Mode,
} from './types' // 导入更新后的类型

const props = defineProps<CFormProps<TData, TMode>>()
const formModel = defineModel<TData>({
  default: {},
})
const formRef = useTemplateRef<FormInstance>('formRef')

const internalComponents = shallowRef(aliasComponents)

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
  T extends (params: FormFunctionParams<TData, TMode>) => any,
>(fn: T, column: LocalColumn<TData, TMode>): ReturnType<T> {
  return fn({
    data: formModel.value,
    config: currentConfig.value,
    mode: currentMode.value,
    column,
  })
}

function getIsShow(column: LocalColumn<TData, TMode>) {
  if (typeof column.show !== 'function') {
    return column.show
  }
  return callFunction(column.show, column)
}

function getSpanProps(column: LocalColumn<TData, TMode>) {
  if (typeof column.span !== 'function') {
    return column.span
  }
  return callFunction(column.span, column)
}

function getFormItemProps(column: LocalColumn<TData, TMode>) {
  if (typeof column.formItemProps !== 'function') {
    return {
      prop: column.prop,
      label: column.label,
      ...(column.formItemProps || {}),
    }
  }
  return {
    prop: column.prop,
    label: column.label,
    ...(callFunction(column.formItemProps, column) || {}),
  }
}

/**
 * 如果 currentMode = view,默认将所有的type转换成text,如果type是component,则使用column.component
 * @param column
 */
function getComponentType(column: LocalColumn<TData, TMode>) {
  if (currentMode.value === 'view') {
    return column.type === 'component' ? 'component' : 'text'
  }
  return column.type
}

function getComponent(column: LocalColumn<TData, TMode>) {
  const currentModeType =
    (column[`${currentMode.value}Type`] as InternalComponentsKey) ||
    getComponentType(column)
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
        prop,
        show: isShow,
        span,
        formItemProps,
        component,
        _originalType: column.type,
      }
    })
    .filter((item) => item !== false)
})

defineOptions({
  name: 'CForm',
})
</script>

<template>
  <el-form ref="formRef" :model="formModel" v-bind="formProps">
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
            />
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>
