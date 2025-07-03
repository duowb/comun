<script
  setup
  lang="ts"
  generic="TData extends Record<string, any>, TMode extends Mode"
>
import type { Mode } from '@comun-ui/types'
import {
  type FormItemComponentProps,
  useFormItemComponentProps,
} from '../composables/useFormItem'
const props = defineProps<FormItemComponentProps<TMode, TData>>()
const { currentProps } = useFormItemComponentProps<
  TMode,
  TData,
  'switch'
>(props)

const modelValue = defineModel<any>({
  default: '',
})

</script>
<template>
  <el-switch v-model="modelValue" v-bind="currentProps"> </el-switch>
</template>
