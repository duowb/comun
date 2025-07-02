import type { Mode, ValueOrFunction } from '@comun-ui/types'
import type {
  CFormConfig,
  DynamicColumn,
  InternalComponents,
} from '../types'
import { computed } from 'vue'

export type FormItemComponentProps<
  TMode extends Mode,
  TData extends Record<string, any>,
> = {
  modelValue: any
  mode: TMode
  config: CFormConfig<TData, TMode>
  column: DynamicColumn<TMode, TData, CFormConfig<TData, TMode>>
  formData: TData
}

type FormItemComponents = Omit<
  InternalComponents<any, any, any, any>,
  'component'
>
type keysFormItemComponents = keyof FormItemComponents

export function useFormItemComponentProps<
  TMode extends Mode,
  TData extends Record<string, any>,
  TType extends keysFormItemComponents,
>(props: FormItemComponentProps<TMode, TData>) {
  const currentMode = computed(() => props.config?.mode || ('edit' as TMode))

  const modelValue = defineModel<any>({
    default: '',
  })

  function getDisabled(
    disabled?: ValueOrFunction<
      TData,
      CFormConfig<TData, TMode>,
      DynamicColumn<TMode, TData, CFormConfig<TData, TMode>>,
      TMode,
      boolean
    >,
  ) {
    if (!disabled) return false
    if (typeof disabled === 'function') {
      return disabled({
        data: props.formData,
        config: props.config,
        mode: props.mode,
        column: props.column,
      })
    }
    return disabled
  }

  const currentProps = computed(() => {
    const currentModeProps =
      (props.column[
        `${currentMode.value}Props`
      ] as FormItemComponents[TType]) || props.column.props

    if (!currentModeProps) return
    delete currentModeProps['formatter']
    return {
      ...currentModeProps,
      disabled: getDisabled(currentModeProps['disabled']),
    }
  })

  const currentPropsOptions = computed(() => {
    if (!currentProps.value) return []
    if ('option' in currentProps.value) {
      return currentProps.value.option
    }
    return []
  })

  return {
    modelValue,
    currentMode,
    currentProps,
    currentPropsOptions
  }
}
