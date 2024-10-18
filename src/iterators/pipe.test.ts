import {test, expect, describe} from "vitest"
import {pipe} from "./pipe.ts";

describe("pipe", () => {
  test("runs all passed functions sequentially", () => {
    const add5 = add(5)
    const divideBy10 = divide(10)
    const withResultPrefix = prefix("result: ")

    const input = 10
    const expectedOutput = "result: 1.5"
    const calculateResult = pipe(
      add5,
      divideBy10,
      withResultPrefix,
    )

    const actual = calculateResult(input)

    expect(actual).toEqual(expectedOutput)
  })
})

const add = (a: number) => (b: number) => a + b
const divide = (a: number) => (b: number) => b / a
const prefix = (prefix: string) => (a: number) => `${prefix}${a}`