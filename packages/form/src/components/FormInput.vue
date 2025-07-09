<script
  setup
  lang="ts"
  generic="TData extends Record<string, any>, TMode extends Mode"
>
import { useFormItemComponentProps } from '../composables/useFormItem'
import type { FormItemComponentProps, Mode } from '../types'

defineOptions({
  name: 'FormInput',
})
const props = defineProps<FormItemComponentProps<TMode, TData>>()
const { currentProps } = useFormItemComponentProps<TMode, TData, 'input'>(props)

const modelValue = defineModel<any>({
  default: '',
})
</script>

<template>
  <el-input v-model="modelValue" v-bind="currentProps" />
</template>
