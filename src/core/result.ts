import {discriminator} from "./discriminator.ts";
export type Success<T> = {kind: "Success", value: T}
export type Failure<T> = {kind: "Failure", error: T}

export type Result<TSuccess, TFailure>  = Success<TSuccess> | Failure<TFailure>

export const isSuccess = discriminator<Success<unknown>>("Success")
export const isFailure = discriminator<Failure<unknown>>("Failure")

export const failure = <T>(failureValue: T): Failure<T> => ({
  kind: "Failure",
  error: failureValue
})

export const success = <T>(value: T): Success<T> => ({
  kind: "Success",
  value
})

type ResultMethods<TSuccess, TFailure> = {
  map: <TValue>(mapFn: (value: TSuccess) => TValue) => ResultMonad<TValue, TFailure>
  flatMap: <TValue, TFailure2>(mapFn: (value: TSuccess) => Result<TValue, TFailure2>) => ResultMonad<TValue, TFailure | TFailure2>
  onSuccess: (effect: (value: TSuccess) => void) => ResultMonad<TSuccess, TFailure>
  mapFailure: <TError>(mapFn: (error: TFailure) => TError) => ResultMonad<TSuccess, TError>
  onFailure: (effect: (value: TFailure) => void) => ResultMonad<TSuccess, TFailure>
  catch: <TCaughtError extends TFailure>(handler: (error: TCaughtError) => void) => ResultMonad<TSuccess, Exclude<TFailure, TCaughtError>>
  catchAll: (handler: (error: TFailure) => void) => ResultMonad<TSuccess, never>
  toValue: () => TSuccess
}

export type ResultMonad<TSuccess, TFailure> = Result<TSuccess, TFailure> & ResultMethods<TSuccess, TFailure>
export const result = <TSuccess, TFailure>(currentResult: Result<TSuccess, TFailure>): ResultMonad<TSuccess, TFailure> => ({
  ...currentResult,
  map: <TValue>(mapFn: (value: TSuccess) => TValue) =>
    isSuccess(currentResult) ?
      result(success(mapFn(currentResult.value))) :
      result(currentResult),
  flatMap: <TValue, TFailure2>(mapFn: (value: TSuccess) => Result<TValue, TFailure2>) =>
    isSuccess(currentResult) ?
      result(mapFn(currentResult.value)) :
      result(currentResult),
  onSuccess: (effect: (value: TSuccess) => void) => {
    if(isSuccess(currentResult)) {
      effect(currentResult.value)
    }

    return result(currentResult)
  },
  onFailure: (effect: (value: TFailure) => void) => {
    if(isFailure(currentResult)) {
      effect(currentResult.error)
    }

    return result(currentResult)
  },
  mapFailure: <TError>(mapFn: (error: TFailure) => TError) =>
    isFailure(currentResult) ?
      result(failure(mapFn(currentResult.error))) :
      result(currentResult),
  catch: <TCaughtError extends TFailure>(handler: (error: TCaughtError) => void) => {
    if(isFailure(currentResult)) {
      handler(currentResult.error)
    }

    return result(currentResult) as ResultMonad<TSuccess, Exclude<TFailure, TCaughtError>>
  },
  catchAll: (handler: (error: TFailure) => void) => {
    if(isFailure(currentResult)) {
      handler(currentResult.error)
    }

    return result(currentResult)
  },
  toValue: () => {
    if (isSuccess(currentResult)) {
      return currentResult.value
    } else {
      throw new Error(currentResult.error)
    }
  }
})