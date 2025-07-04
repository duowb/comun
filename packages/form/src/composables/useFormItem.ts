import { computed, unref } from 'vue'
import type {
  BaseOption,
  CFormConfig,
  DisabledValue,
  DynamicColumn,
  InternalComponents,
  InternalComponentsKey,
  Mode,
} from '../types'
import type { Obj } from '@comun-ui/types'
import type { ComputedRef } from 'vue'

export type FormItemComponentProps<TMode extends Mode, TData extends Obj> = {
  modelValue: any
  mode: TMode
  config: CFormConfig<TData, TMode>
  column: DynamicColumn<TData, TMode>
  formData: TData
}

type keysFormItemComponents = Exclude<InternalComponentsKey, 'component'>

export function useFormItemComponentProps<
  TMode extends Mode,
  TData extends Obj,
  TType extends keysFormItemComponents,
>(
  props: FormItemComponentProps<TMode, TData>,
): {
  currentMode: ComputedRef<TMode>
  currentProps: ComputedRef<
    | (InternalComponents<TData, TMode>[TType] & {
        disabled: boolean
      })
    | undefined
  >
  currentPropsOptions: ComputedRef<BaseOption[]>
} {
  const currentMode = computed(() => props.config?.mode || ('edit' as TMode))

  function getDisabled(disabled?: DisabledValue<TData, TMode>) {
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
      (props.column[`${currentMode.value}Props`] as InternalComponents<
        TData,
        TMode
      >[TType]) || props.column.props

    if (!currentModeProps) return
    delete currentModeProps.formatter
    return {
      ...currentModeProps,
      disabled: getDisabled(currentModeProps.disabled),
    }
  })

  const currentPropsOptions = computed(() => {
    const unCurrentProps = unref(currentProps.value)
    if (!unCurrentProps) return []
    if ('options' in unCurrentProps) {
      return unCurrentProps.options || []
    }
    return []
  })

  return {
    currentMode,
    currentProps,
    currentPropsOptions,
  }
}
