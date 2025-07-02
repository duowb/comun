<script
  setup
  lang="ts"
  generic="TData extends Record<string, any>, TMode extends Mode"
>
import { Mode } from '@comun-ui/types'
import {
  type FormItemComponentProps,
  useFormItemComponentProps,
} from '../composables/useFormItem'
import { computed } from 'vue'
const props = defineProps<FormItemComponentProps<TMode, TData>>()
const { currentProps, currentPropsOptions, modelValue } =
  useFormItemComponentProps<TMode, TData, 'select'>(props)
const selectType = computed(() => currentProps.value?.selectType || 'select')
</script>
<template>
  <el-select
    v-model="modelValue"
    v-bind="currentProps"
    v-if="selectType === 'select'"
  >
    <el-option
      v-for="item in currentPropsOptions"
      :key="item.value"
      v-bind="item"
    ></el-option>
  </el-select>
  <el-select-v2
    v-else
    v-model="modelValue"
    v-bind="currentProps"
    :options="currentPropsOptions"
  />
</template>
