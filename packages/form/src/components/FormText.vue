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
  'text'
>(props)
</script>
<template>
  <el-text v-bind="currentProps"> {{ modelValue }} </el-text>
</template>
