import { computed, unref } from 'vue'
import type {
  BaseOption,
  DisabledValue,
  DynamicColumn,
  FormItemComponentProps,
  InternalComponents,
  keysFormItemComponents,
  Mode,
} from '../types'
import type { Obj } from '@comun-ui/types'
import type { ComputedRef } from 'vue'

export function useFormItemComponentProps<
  TMode extends Mode,
  TData extends Obj,
  TType extends keysFormItemComponents,
>(
  props: FormItemComponentProps<TMode, TData>,
  /** 组件默认的props, 用来过滤 */
  componentDefaultProps?: Obj,
): {
  /** 当前模式，默认是 edit */
  currentMode: ComputedRef<TMode>
  /** 当前列对象 */
  currentColumn: ComputedRef<DynamicColumn<TData, TMode>>
  /** 传入的所有props值 */
  currentProps: ComputedRef<
    | (InternalComponents<TData, TMode>[TType] & {
        disabled: boolean
      })
    | undefined
  >
  /** 当前组件过滤后的props值 */
  currentComponentProps: ComputedRef<
    | (InternalComponents<TData, TMode>[TType] & {
        disabled: boolean
      })
    | undefined
  >
  currentPropsOptions: ComputedRef<BaseOption[]>
} {
  const currentMode = computed(() => props.config?.mode || ('edit' as TMode))

  const currentColumn = computed(() => props.column)

  function getDisabled(disabled?: DisabledValue<TData, TMode>) {
    if (!disabled) return false
    if (typeof disabled === 'function') {
      return disabled({
        data: props.formData,
        config: props.config,
        mode: props.mode,
        column: currentColumn.value,
      })
    }
    return disabled
  }

  const currentProps = computed(() => {
    const currentModeProps =
      (currentColumn.value[`${currentMode.value}Props`] as InternalComponents<
        TData,
        TMode
      >[TType]) || currentColumn.value.props

    if (!currentModeProps) return

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

  const currentComponentProps = computed(() => {
    const localProps = unref(currentProps.value)
    if (!localProps) return
    if (!componentDefaultProps) return localProps
    return Object.keys(componentDefaultProps).reduce(
      (acc, key) => {
        if (key in localProps) {
          // TODO 不仅需要过滤掉不存在的属性,还需要校验值是否复核values要求
          acc[key as keyof typeof localProps] =
            localProps[key as keyof typeof localProps]
        }
        return acc
      },
      {} as typeof localProps,
    )
  })

  return {
    currentMode,
    currentColumn,
    currentProps,
    currentPropsOptions,
    currentComponentProps,
  }
}
