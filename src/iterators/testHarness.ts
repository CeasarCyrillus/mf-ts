export const add = (a: number) => (b: number) => a + b
export const divide = (a: number) => (b: number) => b / a
export const prefix = (prefix: string) => (a: number) => `${prefix}${a}`
export const returnTrue = <TInput>(_: TInput) => true
export const returnFalse = <TInput>(_: TInput) => false