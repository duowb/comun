<script
  setup
  lang="ts"
  generic="TData extends Record<string, any>, TMode extends Mode"
>
import { textProps } from 'element-plus'
import { computed, unref } from 'vue'
import {
  useFormItemComponentProps,
  type FormItemComponentProps,
} from '../composables/useFormItem'
import type { BaseOption, InternalComponents, Mode } from '../types'

defineOptions({
  name: 'CFormText',
})
const props = defineProps<FormItemComponentProps<TMode, TData>>()
const { currentProps, currentColumn, currentComponentProps } =
  useFormItemComponentProps<TMode, TData, 'text'>(props, textProps)

const modelValue = defineModel<any>({
  default: '',
})

const isTextArea = computed(() => {
  if (currentColumn.value._originalType !== 'input') {
    return false
  }
  return (
    (currentProps.value as InternalComponents<TData, TMode>['input'])?.type ===
    'textarea'
  )
})

function defaultFormatter() {
  if (!currentProps.value) {
    return modelValue.value
  }
  // select/radio/checkbox
  if ('options' in currentProps.value) {
    return (
      (currentProps.value.options as BaseOption[]).find(
        (item) => item.value === modelValue.value,
      )?.label || modelValue.value
    )
  }
  // switch
  if (currentColumn.value._originalType === 'switch') {
    const {
      inactiveText,
      inactiveValue = false,
      activeText,
    } = currentProps.value as InternalComponents<TData, TMode>['switch']
    return modelValue.value === inactiveValue ? inactiveText : activeText
  }

  return modelValue.value
}

const localValue = computed(() => {
  const { formatter = defaultFormatter } = unref(currentProps) || {}
  return formatter({
    data: props.formData,
    config: props.config,
    mode: props.mode,
    column: props.column,
  })
})
</script>

<template>
  <el-text v-if="!isTextArea" v-bind="currentComponentProps">
    {{ localValue }}
  </el-text>
  <el-input v-else v-model="localValue" v-bind="currentProps" readonly />
</template>
