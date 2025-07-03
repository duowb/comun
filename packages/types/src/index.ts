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

export type Mode = SmartLiteral<'edit' | 'view'>

export interface HelperParams<TData, TConfig, TColumn, TMode> {
  data: TData
  config: TConfig
  column: TColumn | null
  mode: TMode
}
export interface HelperFunction<TData, TConfig, TColumn, TMode, TValue> {
  (params: HelperParams<TData, TConfig, TColumn, TMode>): TValue
}

/**
 * 值或函数类型
 * TData: 表单数据类型
 * TConfig: 表单配置类型
 * TColumn: 表单列类型
 * TMode: 表单模式类型
 * TValue: 值类型
 */
export type ValueOrFunction<TData, TConfig, TColumn, TMode, TValue> =
  | HelperFunction<TData, TConfig, TColumn, TMode, TValue>
  | TValue
