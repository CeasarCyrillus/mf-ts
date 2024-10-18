import {describe, expect, test, vi} from "vitest";
import {failure, isFailure, isSuccess, Result, result, ResultMonad, success} from "./result.ts";


describe("result", () => {
  test("isFailure / isSuccess should work as expected", () => {
    const isBiggerThan5 = isAtLeast(5)

    const succeeded = isBiggerThan5(10)
    const failed = isBiggerThan5(3)

    expect(isFailure(succeeded)).toEqual(false)
    expect(isSuccess(succeeded)).toEqual(true)

    expect(isFailure(failed)).toEqual(true)
    expect(isSuccess(failed)).toEqual(false)
  })

  test("should call map and not mapFailure on success", () => {
    const isPositiveNumber = isAtLeast(0)
    const map = vi.fn()
    const mapFailure = vi.fn()
    const positiveNumber = 3;

    const succeeded = isPositiveNumber(positiveNumber)

    succeeded
      .map(map)
      .mapFailure(mapFailure)

    expect(map).toHaveBeenCalledWith(positiveNumber)
    expect(mapFailure).not.toHaveBeenCalled()
  })

  test("should call mapFailure and not map on failure", () => {
    const isPositiveNumber = isAtLeast(0)
    const map = vi.fn()
    const mapFailure = vi.fn()
    const negativeNumber = -3;

    const failed = isPositiveNumber(negativeNumber)

    failed
      .map(map)
      .mapFailure(mapFailure)

    expect(mapFailure).toHaveBeenCalledWith("Value is too small")
    expect(map).not.toHaveBeenCalled()
  })

  test("should call onSuccess and not onFailure on success", () => {
    const isPositiveNumber = isAtLeast(0)
    const map = vi.fn()
    const mapFailure = vi.fn()
    const positiveNumber = 3;

    const succeeded = isPositiveNumber(positiveNumber)

    succeeded
      .map(map)
      .mapFailure(mapFailure)

    expect(map).toHaveBeenCalledWith(positiveNumber)
    expect(mapFailure).not.toHaveBeenCalled()
  })

  test("should call mapFailure and not map on failure", () => {
    const isPositiveNumber = isAtLeast(0)
    const map = vi.fn()
    const mapFailure = vi.fn()
    const negativeNumber = -3;

    const failed = isPositiveNumber(negativeNumber)

    failed
      .map(map)
      .mapFailure(mapFailure)

    expect(mapFailure).toHaveBeenCalledWith("Value is too small")
    expect(map).not.toHaveBeenCalled()
  })

  test("map should return a monad of type success with the value it returns", () => {
    const person: TestPerson = {
      name: "John Wick",
      age: 50
    }
    const expectBirthYearToBe1974 = expectSuccess(1974)
    const currentYear = 2024
    const birthYear = result(success(person))
      .map(person => person.age)
      .map(age => currentYear - age)


    expectBirthYearToBe1974(birthYear)
  })

  test("mapError should return a monad of type failure with the error it returns", () => {
    const expectedFailure = "Person does not exist";
    const expected = {errorMessage: "Person does not exist!"}
    const expectPersonDoesNotExist = expectFailure(expected)

    const actual = result<TestPerson, typeof expectedFailure>(failure(expectedFailure))
      .mapFailure(error => ({errorMessage: error + "!"}))

    expectPersonDoesNotExist(actual)
  })

  test("toValue should return inner value on success", () => {
    const innerValue = "Hello";
    const succeed = result(success(innerValue))

    expect(succeed.toValue()).toEqual(innerValue)
  })

  test("toValue should throw error on failure", () => {
    const failureValue = "there was an error";
    const succeed = result(failure(failureValue))

    expect(() => {
      succeed.toValue()
    }).toThrow(failureValue)
  })
})

const expectFailure = <T>(expectedError: T) => (result: Result<unknown, T>) => {
  expect(isFailure(result)).toEqual(true)
  if(isFailure(result)) {
    expect(result.error).toEqual(expectedError)
  }
}

const expectSuccess = <T>(expectedValue: T) => (result: Result<T, unknown>) => {
  expect(isSuccess(result)).toEqual(true)
  if(isSuccess(result)) {
    expect(result.value).toEqual(expectedValue)
  }
}
export const isAtLeast = (min: number) => {
  type FailureMsg = "Value is too small"
  const failureMsg: FailureMsg = "Value is too small"
  return (value: number): ResultMonad<number, FailureMsg> =>
    result(value >= min ? success(value) : failure(failureMsg));
}

export type TestPerson = {
  name: string
  age: number
}