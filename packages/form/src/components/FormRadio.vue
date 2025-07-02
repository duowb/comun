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
  useFormItemComponentProps<TMode, TData, 'radio'>(props)

const type = computed(() => currentProps.value?.radioType || 'radio')
</script>
<template>
  <el-radio-group v-model="modelValue" v-bind="currentProps">
    <template v-if="type === 'button'">
      <el-radio-button
        v-for="item in currentPropsOptions"
        :key="item.value"
        v-bind="item"
      >
        {{ item.label }}
      </el-radio-button>
    </template>
    <template v-else>
      <el-radio
        v-for="item in currentPropsOptions"
        :key="item.value"
        v-bind="item"
      >
        {{ item.label }}
      </el-radio>
    </template>
  </el-radio-group>
</template>
