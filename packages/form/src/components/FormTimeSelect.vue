<script
  setup
  lang="ts"
  generic="TData extends Record<string, any>, TMode extends Mode"
>
import { useFormItemComponentProps } from '../composables/useFormItem'
import type { FormItemComponentProps, Mode } from '../types'

defineOptions({
  name: 'FormTimeSelect',
})
const props = defineProps<FormItemComponentProps<TMode, TData>>()
const { currentProps } = useFormItemComponentProps<TMode, TData, 'timeSelect'>(
  props,
)

const modelValue = defineModel<any>({
  default: '',
})
</script>

<template>
  <el-time-select v-model="modelValue" v-bind="currentProps" />
</template>
