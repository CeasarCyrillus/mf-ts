import {test, expect, describe} from "vitest"
import {returnFalse, returnTrue} from "./testHarness.ts";
import {all} from "./all.ts";

describe("all", () => {
  test("returns true if all functions return true for given argument", () => {
    const expected = true
    const flow = all(
      returnTrue,
      returnTrue,
      returnTrue,
    )

    const actual = flow(3)

    expect(actual).toEqual(expected)
  })

  test("returns false if any functions return false for given argument", () => {
    const expected = false
    const flow = all(
      returnTrue,
      returnFalse,
      returnTrue,
    )

    const actual = flow(3)

    expect(actual).toEqual(expected)
  })
})