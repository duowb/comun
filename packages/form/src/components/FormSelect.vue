<script
  setup
  lang="ts"
  generic="TData extends Record<string, any>, TMode extends Mode"
>
import { computed } from 'vue'
import { useFormItemComponentProps } from '../composables/useFormItem'
import type { FormItemComponentProps, Mode } from '../types'

defineOptions({
  name: 'FormSelect',
})
const props = defineProps<FormItemComponentProps<TMode, TData>>()
const { currentProps, currentPropsOptions } = useFormItemComponentProps<
  TMode,
  TData,
  'select'
>(props)

const modelValue = defineModel<any>({
  default: '',
})

const selectType = computed(() => currentProps.value?.selectType || 'select')
</script>

<template>
  <el-select
    v-if="selectType === 'select'"
    v-model="modelValue"
    v-bind="currentProps"
  >
    <el-option
      v-for="item in currentPropsOptions"
      :key="item.value"
      v-bind="item"
    />
  </el-select>
  <el-select-v2
    v-else
    v-model="modelValue"
    v-bind="currentProps"
    :options="currentPropsOptions"
  />
</template>
