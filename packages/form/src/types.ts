import { Mode, RecursiveOptional, ValueOrFunction } from '@comun-ui/types'
import type {
  InputProps,
  SelectProps,
  DatePickerProps,
  SwitchProps,
  CheckboxGroupProps,
  RadioGroupProps,
  FormProps,
  FormItemProps,
  FormItemRule,
  RowProps,
  ColProps,
} from 'element-plus'

// CFormItem 基础接口
interface BaseFormItem<TItem, TData, TMode>
  extends RecursiveOptional<FormItemProps> {
  mode?: TMode
  show?: ValueOrFunction<TData, TItem, TMode, boolean>
  span?: RecursiveOptional<ColProps>
}

type FormatterEleProps<
  TData,
  TItem,
  TMode,
  TEle,
  TValue extends any = any,
  KValues extends keyof any = 'modelValue' | 'disabled',
> = RecursiveOptional<Omit<TEle, KValues>> & {
  disabled?: ValueOrFunction<TData, TItem, TMode, boolean>
  formatter?: ValueOrFunction<TData, TItem, TMode, TValue>
}

// 具体表单项接口，通过交叉类型继承基础接口和模式覆盖接口
export interface InputFormItem<TData, TMode>
  extends BaseFormItem<InputFormItem<TData, TMode>, TData, TMode> {
  type: 'input' | 'textarea'
  props: FormatterEleProps<
    TData,
    InputFormItem<TData, TMode>,
    TMode,
    InputProps
  >
}
export interface SelectFormItem<TData, TMode>
  extends BaseFormItem<InputFormItem<TData, TMode>, TData, TMode> {
  type: 'select'
  props: FormatterEleProps<
    TData,
    InputFormItem<TData, TMode>,
    TMode,
    SelectProps
  >
}

// CFormItem 联合类型
export type CFormItem<TData, TMode> =
  | InputFormItem<TData, TMode>
  // | SelectFormItem<TData, TMode>

// CFormConfig 配置对象
export interface CFormConfig<
  TData extends Record<string, any>,
  TMode extends Mode,
> {
  mode?: TMode
  items: CFormItem<TData, TMode>[]
  formProps?: RecursiveOptional<Omit<FormProps, 'model' | 'disabled'>> & {
    disabled?: ValueOrFunction<TData, CFormConfig<TData, TMode>, TMode, boolean>
  }
  rowProps?: RecursiveOptional<RowProps>
}

// CForm 组件 Props
export interface CFormProps<
  TData extends Record<string, any>,
  TMode extends Mode,
> {
  modelValue: TData
  config: CFormConfig<TData, TMode>
}

// CForm 组件实例
export interface CFormInstance {
  validate: () => Promise<boolean>
  resetFields: () => void
  clearValidate: () => void
}
