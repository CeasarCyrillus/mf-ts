import {test, expect, describe} from "vitest"
import {returnFalse, returnTrue} from "./testHarness.ts";
import {some} from "./some.ts";
describe("some", () => {
  test("returns true if some functions return true for given argument", () => {
    const expected = true
    const flow = some(
      returnFalse,
      returnFalse,
      returnFalse,
      returnTrue,
      returnFalse
    )

    const actual = flow(3)

    expect(actual).toEqual(expected)
  })

  test("returns false if all functions return false for given argument", () => {
    const expected = false
    const flow = some(
      returnFalse,
      returnFalse,
      returnFalse,
      returnFalse
    )

    const actual = flow(3)

    expect(actual).toEqual(expected)
  })
})