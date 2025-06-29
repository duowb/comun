<script
  setup
  lang="ts"
  generic="TData extends Record<string, any>, TMode extends Mode"
>
import { Mode } from '@comun-ui/types'
import type { InputFormItem } from '../types'
import { computed } from 'vue'
const props = defineProps<{
  modelValue: any
  mode: TMode
  item: InputFormItem<TData, TMode>
  formData: TData
}>()

const currentProps = computed(() => {
  return {
    ...props.item.props,
  }
})

const disabled = computed(() => {
  if (typeof currentProps.value.disabled === 'function') {
    return currentProps.value.disabled({
      data: props.formData,
      mode: props.mode,
      item: props.item,
    })
  }
  return Boolean(currentProps.value.disabled)
})
</script>
<template>
  <el-input
    v-model="modelValue"
    :type="item.type"
    :disabled="disabled"
    v-bind="currentProps"
  >
  </el-input>
</template>
