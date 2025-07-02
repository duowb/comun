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
import { computed } from 'vue'
const props = defineProps<FormItemComponentProps<TMode, TData>>()
const { currentProps, currentPropsOptions, modelValue } =
  useFormItemComponentProps<TMode, TData, 'checkbox'>(props)

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
