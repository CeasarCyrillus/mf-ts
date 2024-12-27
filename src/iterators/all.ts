import {Fun} from "./Fun.ts";

export const all = <TInput>(fn: Fun<TInput, boolean>, ...fns: Array<Fun<TInput, boolean>>) =>
  (arg: TInput) => [fn, ...fns].every(fn => fn(arg))