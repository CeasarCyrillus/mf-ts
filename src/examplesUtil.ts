import {failure, Result, success} from "./core/result.ts";

export const postfix =
    (postfixStr: string) =>
        (str: string)=>
            str + postfixStr

export const prefix =
    (prefixStr: string) =>
        (str: string)=>
            prefixStr + str

export const toString = <T extends {toString: () => string}>(obj: T) =>
    obj.toString()

export const convertCentsToDollars = (cents: bigint) =>
    cents / 100n

export const containsAnAt = (email: string) => email.includes("@")
export const isMinimum3Chars = (email: string) => email.length >= 3
export const isMaximum50Chars = (email: string) => email.length <= 50
export const isNotEmpty = (email: string) => email.trim() !== ""

export const isLessThan = (lessThan: number) =>
    (value: number) =>
        value < lessThan

export const isMoreThan = (moreThan: number) =>
    (value: number) =>
        value > moreThan

export const readRow = (_: number) => "88,000,000;James;+34 8383-0192-331"
export const parseSalary = (csvRow: string) =>
        csvRow.split(";")[0]
export const toNumber = (value: string) => Number(value)
export const deductTaxes = (grossSalary: number) => grossSalary * 0.3

export const passwordIsReused = (usedPassword: string[]) =>
    (password: string) =>
        usedPassword.includes(password)
export const passwordIsWeak = (password: string) => password.length < 12

export const parseNumbers = (numbersStr: string): Result<number[], "Could not parse numbers!"> => {
    const numbers = numbersStr
        .split(",")
        .map(Number);

    if(numbers.some(isNaN)) {
        return failure("Could not parse numbers!")
    }

    return success(numbers)
}

export const sum = (numbers: number[]) =>
    numbers.reduce((total, curr) => total + curr, 0)


export const checkIfOver9000 = (sum: number): Result<number, "Is over 9,000!"> =>
    sum > 9_000 ? failure("Is over 9,000!") : success(sum)
