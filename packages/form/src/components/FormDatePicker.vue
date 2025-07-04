<script
  setup
  lang="ts"
  generic="TData extends Record<string, any>, TMode extends Mode"
>
import {
  useFormItemComponentProps,
  type FormItemComponentProps,
} from '../composables/useFormItem'
import type { Mode } from '../types'
const props = defineProps<FormItemComponentProps<TMode, TData>>()
const { currentProps } = useFormItemComponentProps<TMode, TData, 'datePicker'>(
  props,
)

const modelValue = defineModel<any>({
  default: '',
})
</script>

<template>
  <el-date-picker v-model="modelValue" v-bind="currentProps" />
</template>
