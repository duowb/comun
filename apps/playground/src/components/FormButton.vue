<script
  setup
  lang="ts"
  generic="TData extends Record<string, any>, TMode extends Mode"
>
import {
  useFormItemComponentProps,
  type FormItemComponentProps,
  type Mode,
} from '@comun-ui/form'
const props = defineProps<FormItemComponentProps<TMode, TData>>()
const { currentComponentProps } = useFormItemComponentProps<TMode, TData, any>(
  props,
)
</script>

<template>
  <el-button v-bind="currentComponentProps">{{ modelValue }}</el-button>
</template>
