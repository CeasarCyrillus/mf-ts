import {Fun} from "./Fun.ts";


// No support for recursive types yet, so these need to be hardcoded
export function pipe<T1, T2>(fn1: Fun<T1, T2>): Fun<T1, T2>;
export function pipe<T1, T2, T3>(fn1: Fun<T1, T2>, fn2: Fun<T2, T3>): Fun<T1, T3>;
export function pipe<T1, T2, T3, T4>(fn1: Fun<T1, T2>, fn2: Fun<T2, T3>, fn3: Fun<T3, T4>): Fun<T1, T4>;
export function pipe<T1, T2, T3, T4, T5>(fn1: Fun<T1, T2>, fn2: Fun<T2, T3>, fn3: Fun<T3, T4>, fn4: Fun<T4, T5>): Fun<T1, T5>;
export function pipe<T1, T2, T3, T4, T5, T6>(fn1: Fun<T1, T2>, fn2: Fun<T2, T3>, fn3: Fun<T3, T4>, fn4: Fun<T4, T5>, fn5: Fun<T5, T6>): Fun<T1, T6>;
// Can / should be extended with more overloaded func as needed
export function pipe(fn: Fun<unknown, unknown>, ...fns: Array<(arg: unknown) => unknown>) {
  return (arg: unknown) => [fn, ...fns].reduce((acc, fn) => fn(acc), arg);
}