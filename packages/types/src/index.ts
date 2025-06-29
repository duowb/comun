import type { InputProps, SelectProps, RadioProps } from 'element-plus'

/**
 * 将对象类型的所有属性（包括嵌套属性）转换为可选
 */
export type RecursiveOptional<T> = {
  [P in keyof T]?: T[P] extends object ? RecursiveOptional<T[P]> : T[P]
}
/**
 * 将字符串字面量类型转换为智能联合，允许额外的字符串值。
 */
export type SmartLiteral<T extends keyof any> = T | (string & {})

interface ComponentPropsMap {
  input: InputProps
  select: SelectProps
  radio: RadioProps
}
// 从 ComponentPropsMap 派生出的辅助类型
type ComponentType = keyof ComponentPropsMap
type AllComponentProps = ComponentPropsMap[ComponentType]

/**
 * 基础列的判别联合类型定义
 */
type BaseColumn = {
  [T in ComponentType]: {
    prop: string
    type: T
    props: ComponentPropsMap[T]
  }
}[ComponentType]

/**
 * 模式特定重载的映射类型定义
 */
type ModeSpecificOverrides<TMode extends string> = {
  [K in TMode as `${K}Prop`]?: string
} & {
  [K in TMode as `${K}Type`]?: ComponentType
} & {
  [K in TMode as `${K}Props`]?: AllComponentProps
}

/**
 * 最终的、组合后的列类型
 */
export type ConfigColumn<TMode extends string> = BaseColumn &
  ModeSpecificOverrides<TMode>

export type Mode = SmartLiteral<'edit' | 'view'>

export interface HelperParams<TData, TItem, TMode> {
  data: TData
  item: TItem
  mode: TMode
}
export interface HelperFunction<TData, TItem, TMode, TValue> {
  (params: HelperParams<TData, TItem, TMode>): TValue
}

/** 可能是方法，也可能是值 */
export type ValueOrFunction<TData, TItem, TMode, TValue> =
  | HelperFunction<TData, TItem, TMode, TValue>
  | TValue
