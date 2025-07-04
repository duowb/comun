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
const props = defineProps<FormItemComponentProps<TMode, TData>>()
const { currentProps, currentPropsOptions } = useFormItemComponentProps<
  TMode,
  TData,
  'radio'
>(props)

const modelValue = defineModel<any>({
  default: '',
})

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
