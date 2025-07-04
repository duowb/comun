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

export type Obj<T = any> = Record<string, T>
