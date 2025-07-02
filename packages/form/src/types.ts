import type { Mode, RecursiveOptional, ValueOrFunction } from '@comun-ui/types'
import type {
  InputProps,
  SelectProps,
  DatePickerProps,
  SwitchProps,
  CheckboxGroupProps,
  RadioGroupProps,
  FormProps,
  FormItemProps,
  RowProps,
  ColProps,
  TextProps,
  RadioProps,
  InputNumberProps,
  InputTagProps,
  MentionProps,
  TreeComponentProps,
  RateProps,
  TimePickerDefaultProps,
  TimeSelectProps,
  SliderProps,
} from 'element-plus'
import type { Component } from 'vue'

type Common = {
  class?: string | string[]
  style?: string | Record<string, string>
}

export type ColumnCommonProps<TData, TConfig, TColumn, TMode, TValue = any> = {
  disabled?: ValueOrFunction<TData, TConfig, TColumn, TMode, boolean>
  formatter?: ValueOrFunction<TData, TConfig, TColumn, TMode, TValue>
} & Common

type FormatterEleProps<
  TData,
  TConfig,
  TColumn,
  TMode,
  TValue,
  TEle,
  KValues extends keyof any = 'modelValue' | 'disabled',
> = RecursiveOptional<Omit<TEle, KValues>> &
  ColumnCommonProps<TData, TConfig, TColumn, TMode, TValue>

export type BaseOption = {
  label: string | number | boolean
  value: string | number | boolean | object
  disabled?: boolean
}

export type RadioOption = BaseOption & RadioProps

export type InternalComponents<TData, TConfig, TColumn, TMode, TValue = any> = {
  checkbox: FormatterEleProps<
    TData,
    TConfig,
    TColumn,
    TMode,
    TValue,
    CheckboxGroupProps
  > & { option?: BaseOption[]; checkboxType?: 'button' | 'checkbox' }
  datePicker: FormatterEleProps<
    TData,
    TConfig,
    TColumn,
    TMode,
    TValue,
    DatePickerProps
  >
  input: FormatterEleProps<TData, TConfig, TColumn, TMode, TValue, InputProps>
  inputTag: FormatterEleProps<
    TData,
    TConfig,
    TColumn,
    TMode,
    TValue,
    InputTagProps
  >
  mention: FormatterEleProps<
    TData,
    TConfig,
    TColumn,
    TMode,
    TValue,
    MentionProps
  >
  // TODO 支持单位?
  number: FormatterEleProps<
    TData,
    TConfig,
    TColumn,
    TMode,
    TValue,
    InputNumberProps
  >
  radio: FormatterEleProps<
    TData,
    TConfig,
    TColumn,
    TMode,
    TValue,
    RadioGroupProps
  > & { option?: RadioOption[]; radioType?: 'button' | 'radio' }
  rate: FormatterEleProps<TData, TConfig, TColumn, TMode, TValue, RateProps>
  select: FormatterEleProps<
    TData,
    TConfig,
    TColumn,
    TMode,
    TValue,
    SelectProps
  > & { option?: BaseOption[]; selectType: 'selectV2' | 'select' }
  slider: FormatterEleProps<TData, TConfig, TColumn, TMode, TValue, SliderProps>
  switch: FormatterEleProps<TData, TConfig, TColumn, TMode, TValue, SwitchProps>
  text: FormatterEleProps<TData, TConfig, TColumn, TMode, TValue, TextProps>
  timePicker: FormatterEleProps<
    TData,
    TConfig,
    TColumn,
    TMode,
    TValue,
    TimePickerDefaultProps
  >
  timeSelect: FormatterEleProps<
    TData,
    TConfig,
    TColumn,
    TMode,
    TValue,
    TimeSelectProps
  >
  treeSelect: FormatterEleProps<
    TData,
    TConfig,
    TColumn,
    TMode,
    TValue,
    SelectProps
  > &
    FormatterEleProps<
      TData,
      TConfig,
      TColumn,
      TMode,
      TValue,
      TreeComponentProps
    >
  component: Record<string, any>
}

export type InternalComponentsKey = keyof InternalComponents<any, any, any, any>

// 根据组件类型获取对应的Props类型
type GetPropsType<
  T extends keyof InternalComponents<TData, TConfig, TColumn, TMode>,
  TData,
  TConfig,
  TColumn,
  TMode,
> = InternalComponents<TData, TConfig, TColumn, TMode>[T]

export type Show<TMode extends Mode, TData, TConfig> = ValueOrFunction<
  TData,
  TConfig,
  DynamicColumn<TMode, TData, TConfig>,
  TMode,
  boolean
>
export type Span<TMode extends Mode, TData, TConfig> = ValueOrFunction<
  TData,
  TConfig,
  DynamicColumn<TMode, TData, TConfig>,
  TMode,
  RecursiveOptional<ColProps>
>
export type LocalFormItemProps<
  TMode extends Mode,
  TData,
  TConfig,
> = ValueOrFunction<
  TData,
  TConfig,
  DynamicColumn<TMode, TData, TConfig>,
  TMode,
  RecursiveOptional<FormItemProps>
>

export type DynamicColumn<TMode extends Mode, TData, TConfig> = {
  prop: string
  show: Show<TMode, TData, TConfig>
  span?: Span<TMode, TData, TConfig>
  formItemProps?: LocalFormItemProps<TMode, TData, TConfig>
  component?: Component
} & {
  [K in `${TMode}Prop`]?: string
} & {
    [TType in InternalComponentsKey]: {
      type: TType
      props: GetPropsType<
        TType,
        TData,
        TConfig,
        DynamicColumn<TMode, TData, TConfig>,
        TMode
      >
    } & {
      [TModeType in InternalComponentsKey]: {
        [K in `${TMode}Type`]?: TModeType
      } & {
        [K in `${TMode}Props`]?: GetPropsType<TModeType, any, any, any, any>
      }
    }[InternalComponentsKey]
  }[InternalComponentsKey]

export type LocalFormProps<TData, TConfig, TMode> = RecursiveOptional<
  Omit<FormProps, 'model' | 'disabled'>
> & {
  disabled?: ValueOrFunction<TData, TConfig, null, TMode, boolean>
} & Common

export type Column<
  TData extends Record<string, any>,
  TMode extends Mode,
> = DynamicColumn<TMode, TData, CFormConfig<TData, TMode>>

// CFormConfig 配置对象
export interface CFormConfig<
  TData extends Record<string, any>,
  TMode extends Mode,
> {
  mode?: TMode
  columns: Column<TData, TMode>[]
  formProps?: LocalFormProps<TData, CFormConfig<TData, TMode>, TMode>
  rowProps?: RecursiveOptional<RowProps> & Common
}

export interface CFormProps<
  TData extends Record<string, any>,
  TMode extends Mode,
> {
  modelValue: TData
  config: CFormConfig<TData, TMode>
}
