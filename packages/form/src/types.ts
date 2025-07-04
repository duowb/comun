import type { Obj, RecursiveOptional, SmartLiteral } from '@comun-ui/types'
import type {
  CheckboxGroupProps,
  ColProps,
  DatePickerProps,
  FormItemProps,
  FormProps,
  InputNumberProps,
  InputProps,
  InputTagProps,
  MentionProps,
  RadioGroupProps,
  RadioProps,
  RateProps,
  RowProps,
  SelectProps,
  SliderProps,
  SwitchProps,
  TextProps,
  TimePickerDefaultProps,
  TimeSelectProps,
  TreeComponentProps,
} from 'element-plus'
import type { Component } from 'vue'

export type Mode = SmartLiteral<'edit' | 'view'>

// 简化的基础上下文类型
export type FormFunctionParams<TData, TMode extends Mode> = {
  data: TData
  config: CFormConfig<TData, TMode>
  column: DynamicColumn<TData, TMode> | null
  mode: TMode
}

/**
 * 值或函数类型
 * TData: 表单数据类型
 * TMode: 表单模式类型
 * TValue: 值类型
 */
export type ValueOrFunction<TData, TMode extends Mode, TValue> =
  | ((params: FormFunctionParams<TData, TMode>) => TValue)
  | TValue

export type DisabledValue<TData, TMode extends Mode> = ValueOrFunction<
  TData,
  TMode,
  boolean
>

type Common = {
  class?: string | string[]
  style?: string | Obj<string>
}

export type ColumnCommonProps<TData, TMode extends Mode> = {
  disabled?: DisabledValue<TData, TMode>
  formatter?: ValueOrFunction<TData, TMode, any>
} & Common

type FormatterEleProps<
  TData,
  TMode extends Mode,
  TEle,
  KValues extends keyof any = 'modelValue' | 'disabled',
> = RecursiveOptional<Omit<TEle, KValues>> & ColumnCommonProps<TData, TMode>

export type BaseOption = {
  label: string | number | boolean
  value: string | number | boolean | object
  disabled?: boolean
}

export type RadioOption = BaseOption & RecursiveOptional<RadioProps>

export type InternalComponents<TData, TMode extends Mode> = {
  checkbox: FormatterEleProps<TData, TMode, CheckboxGroupProps> & {
    options?: BaseOption[]
    checkboxType?: 'button' | 'checkbox'
  }
  datePicker: FormatterEleProps<TData, TMode, DatePickerProps>
  input: FormatterEleProps<TData, TMode, InputProps>
  inputTag: FormatterEleProps<TData, TMode, InputTagProps>
  mention: FormatterEleProps<
    TData,
    TMode,
    MentionProps,
    'modelValue' | 'disabled' | 'options'
  > & { options?: BaseOption[] }
  // TODO 支持单位?
  number: FormatterEleProps<TData, TMode, InputNumberProps>
  radio: FormatterEleProps<TData, TMode, RadioGroupProps> & {
    options?: RadioOption[]
    radioType?: 'button' | 'radio'
  }
  rate: FormatterEleProps<TData, TMode, RateProps>
  select: FormatterEleProps<
    TData,
    TMode,
    SelectProps,
    'modelValue' | 'disabled' | 'options'
  > & { options?: BaseOption[]; selectType: 'selectV2' | 'select' }
  slider: FormatterEleProps<TData, TMode, SliderProps>
  switch: FormatterEleProps<TData, TMode, SwitchProps>
  text: FormatterEleProps<TData, TMode, TextProps>
  timePicker: FormatterEleProps<TData, TMode, TimePickerDefaultProps>
  timeSelect: FormatterEleProps<TData, TMode, TimeSelectProps>
  treeSelect: FormatterEleProps<TData, TMode, SelectProps> &
    FormatterEleProps<TData, TMode, TreeComponentProps>
  component: Obj
}
export type InternalComponentsKey = keyof InternalComponents<any, any>

// 根据组件类型获取对应的Props类型
type GetPropsType<
  T extends keyof InternalComponents<TData, TMode>,
  TData,
  TMode extends Mode,
> = InternalComponents<TData, TMode>[T]

export type Show<TData, TMode extends Mode> = ValueOrFunction<
  TData,
  TMode,
  boolean
>
export type Span<TData, TMode extends Mode> = ValueOrFunction<
  TData,
  TMode,
  RecursiveOptional<ColProps>
>
export type LocalFormItemProps<TData, TMode extends Mode> = ValueOrFunction<
  TData,
  TMode,
  RecursiveOptional<FormItemProps>
>

export type DynamicColumn<TData, TMode extends Mode> = {
  prop: string
  show: Show<TData, TMode>
  span?: Span<TData, TMode>
  formItemProps?: LocalFormItemProps<TData, TMode>
  component?: Component
} & {
  [K in `${TMode}Prop`]?: string
} & {
    [TType in InternalComponentsKey]: {
      type: TType
      props: GetPropsType<TType, TData, TMode>
    } & {
      [TModeType in InternalComponentsKey]: {
        [K in `${TMode}Type`]?: TModeType
      } & {
        [K in `${TMode}Props`]?: GetPropsType<TModeType, any, any>
      }
    }[InternalComponentsKey]
  }[InternalComponentsKey]

export type LocalFormProps<TData, TMode extends Mode> = RecursiveOptional<
  Omit<FormProps, 'model' | 'disabled'>
> & {
  disabled?: ValueOrFunction<TData, TMode, boolean>
} & Common

export type LocalRowProps = RecursiveOptional<RowProps> & Common

export type LocalColumn<TData, TMode extends Mode> = DynamicColumn<TData, TMode>

export interface CFormConfig<TData, TMode extends Mode> {
  mode?: TMode
  columns: LocalColumn<TData, TMode>[]
  formProps?: LocalFormProps<TData, TMode>
  rowProps?: LocalRowProps
}

export interface CFormProps<TData extends Obj, TMode extends Mode> {
  modelValue: TData
  config: CFormConfig<TData, TMode>
}
