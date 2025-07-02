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
  'timeSelect'
>(props)
</script>
<template>
  <el-rate v-model="modelValue" v-bind="currentProps"> </el-rate>
</template>
