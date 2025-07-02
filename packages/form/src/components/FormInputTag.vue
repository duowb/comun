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
const { currentProps, modelValue } = useFormItemComponentProps<
  TMode,
  TData,
  'inputTag'
>(props)
</script>
<template>
  <el-input-tag v-model="modelValue" v-bind="currentProps"> </el-input-tag>
</template>
