import {Func} from "../core/Func.ts";

export function pipe<T1, T2>(fn1: Func<T1, T2>): Func<T1, T2>;
export function pipe<T1, T2, T3>(fn1: Func<T1, T2>, fn2: Func<T2, T3>): Func<T1, T3>;
export function pipe<T1, T2, T3, T4>(fn1: Func<T1, T2>, fn2: Func<T2, T3>, fn3: Func<T3, T4>): Func<T1, T4>;
export function pipe<T1, T2, T3, T4, T5>(fn1: Func<T1, T2>, fn2: Func<T2, T3>, fn3: Func<T3, T4>, fn4: Func<T4, T5>): Func<T1, T5>;

export function pipe(fn: Func<unknown, unknown>, ...fns: Array<(arg: unknown) => unknown>) {
  return (arg: unknown) => [fn, ...fns].reduce((acc, fn) => fn(acc), arg);
}