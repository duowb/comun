<script
  setup
  lang="ts"
  generic="TData extends Record<string, any>, TMode extends Mode"
>
import { computed } from 'vue'
import {
  useFormItemComponentProps,
  type FormItemComponentProps,
} from '../composables/useFormItem'
import type { Mode } from '../types'

defineOptions({
  name: 'CFormCheckbox',
})
const props = defineProps<FormItemComponentProps<TMode, TData>>()
const { currentProps, currentPropsOptions } = useFormItemComponentProps<
  TMode,
  TData,
  'checkbox'
>(props)

const modelValue = defineModel<any>({
  default: '',
})

const type = computed(() => currentProps.value?.checkboxType || 'checkbox')
</script>

<template>
  <el-checkbox-group v-model="modelValue" v-bind="currentProps">
    <template v-if="type === 'button'">
      <el-checkbox-button
        v-for="item in currentPropsOptions"
        :key="item.value"
        v-bind="item"
      >
        {{ item.label }}
      </el-checkbox-button>
    </template>
    <template v-else>
      <el-checkbox
        v-for="item in currentPropsOptions"
        :key="item.value"
        v-bind="item"
      >
        {{ item.label }}
      </el-checkbox>
    </template>
  </el-checkbox-group>
</template>
