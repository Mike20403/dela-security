import type { systemTokens } from './tokens.ts'

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <
    Value,
  >() => Value extends Right ? 1 : 2
    ? true
    : false
type Expect<Value extends true> = Value
type ReadonlyDeep<Value> = Value extends string | number
  ? Value
  : { readonly [Key in keyof Value]: ReadonlyDeep<Value[Key]> }

type SystemTokens = typeof systemTokens
export type SystemTokensAreDeepReadonly = Expect<
  Equal<SystemTokens, ReadonlyDeep<SystemTokens>>
>
export type SystemLeafStaysLiteral = Expect<
  Equal<SystemTokens['color']['background']['canvas'], '#f8fafc'>
>
