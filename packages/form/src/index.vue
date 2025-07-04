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
import FormCheckbox from './components/FormCheckbox.vue'
import FormDatePicker from './components/FormDatePicker.vue'
import FormInput from './components/FormInput.vue'
import FormInputTag from './components/FormInputTag.vue'
import FormMention from './components/FormMention.vue'
import FormNumber from './components/FormNumber.vue'
import FormRadio from './components/FormRadio.vue'
import FormRate from './components/FormRate.vue'
import FormSelect from './components/FormSelect.vue'
import FormSlider from './components/FormSlider.vue'
import FormSwitch from './components/FormSwitch.vue'
import FormText from './components/FormText.vue'
import FormTimePicker from './components/FormTimePicker.vue'
import FormTimeSelect from './components/FormTimeSelect.vue'
import FormTreeSelect from './components/FormTreeSelect.vue'
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

const internalComponents = shallowRef({
  input: FormInput,
  select: FormSelect,
  datePicker: FormDatePicker,
  switch: FormSwitch,
  checkbox: FormCheckbox,
  radio: FormRadio,
  text: FormText,
  inputTag: FormInputTag,
  mention: FormMention,
  number: FormNumber,
  rate: FormRate,
  slider: FormSlider,
  timePicker: FormTimePicker,
  timeSelect: FormTimeSelect,
  treeSelect: FormTreeSelect,
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
    return column.formItemProps
  }
  return callFunction(column.formItemProps, column)
}

/**
 * 如果 currentMode = view,默认将所有的type转换成text,如果type是component,则使用column.component
 * @param column
 */
function getComponentType(column: LocalColumn<TData, TMode>) {
  if (currentMode.value === 'view') {
    if (column.type === 'component') {
      return 'component'
    }
    return 'text'
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
      }
    })
    .filter((item) => item !== false)
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
