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

defineOptions({
  name: 'CFormRate',
})
const props = defineProps<FormItemComponentProps<TMode, TData>>()
const { currentProps } = useFormItemComponentProps<TMode, TData, 'rate'>(props)

const modelValue = defineModel<any>({
  default: '',
})
</script>

<template>
  <el-rate v-model="modelValue" v-bind="currentProps" />
</template>
