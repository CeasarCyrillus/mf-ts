import {Func} from "../core/Func.ts";

export const merge = <TInput, TOutput>(transform: Func<TInput, TOutput>, ...transformers: Func<TInput, Partial<TOutput> | undefined>[]) =>
  (input: TInput): TOutput => {
  const defaultValue = transform(input)
    const transformed = transformers
      .map(fn => fn(input))
      .reduce((acc, curr) => ({...acc, ...curr}), defaultValue);
    return {...defaultValue, ...transformed}
}