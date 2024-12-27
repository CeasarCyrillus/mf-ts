import {Fun} from "./Fun.ts";

export const some = <TInput>(fn: Fun<TInput, boolean>, ...fns: Array<Fun<TInput, boolean>>) =>
  (arg: TInput) => [fn, ...fns].some(fn => fn(arg))