import {pipe} from "./iterators/pipe.ts";
import {
    checkIfOver9000,
    containsAnAt,
    convertCentsToDollars,
    deductTaxes,
    isLessThan,
    isMaximum50Chars,
    isMinimum3Chars,
    isMoreThan,
    isNotEmpty, parseNumbers,
    parseSalary, passwordIsReused, passwordIsWeak,
    postfix,
    prefix,
    readRow, sum,
    toNumber,
    toString
} from "./examplesUtil.ts";
import {all} from "./iterators/all.ts";
import {some} from "./iterators/some.ts";
import {failure, isFailure, isSuccess, Result, result, success} from "./core/result.ts";

// Pipe is a HOC that composes multiple functions into a single function
// It runs each function in sequence, the output of the preceding function becomes the input of the next
// every "step" of the pipe is typesafe due to the inference of pipe

// convertToUSD infers the types based on the type and order of passed functions
const convertToUSD = pipe(
    convertCentsToDollars,  // (bigint) -> bigint
    toString,               // (bigint) -> string
    postfix(" USD"),        // (string) -> string
    prefix("$"),            // (string) -> string
)

const cents = 103_938n
console.log(convertToUSD(cents)) // Output: "$1039.38 USD"


// All is a HOC that combines multiple functions of the type (a: T) => boolean
// into a single function with the type (a: T) => boolean
// the combined function will return true if all the passed functions returns true for the supplied argument

const validateEmail = all(
    isNotEmpty,
    containsAnAt,
    isMinimum3Chars,
    isMaximum50Chars,
)

validateEmail("ccyrillus@protonmail.com") // Output: true
validateEmail("") // Output: false
validateEmail("no-at-in-sight") // Output: false


// Pipe can be combined with other iterators, like all/some, and promotes using small functions that are
// easily tested, readable and more "flat"

// read salary from a csv row as a string, and output if the net income falls in the bracket
// of an average income
const isAverageIncome = pipe(
    readRow,
    parseSalary,
    toNumber,
    deductTaxes,
    all(
        isMoreThan(30_000),
        isLessThan(45_000)
    )
)

// row 0: "28,000; FooBar;"
// row 1: "36,000; FooBar;"
// row 3: "68,000; FooBar;"
console.log(isAverageIncome(0)) // Output: false
console.log(isAverageIncome(1)) // Output: true
console.log(isAverageIncome(2)) // Output: false


// Some
// Same as `all`, but only a single function needs to return true for the combined function to return true
const isUnsafePassword = some(
    passwordIsReused(["pass-123", "P@szW0rd!"]),
    passwordIsWeak
)

console.log(isUnsafePassword("pass-123")) // Output: true
console.log(isUnsafePassword("123")) // Output: true
console.log(isUnsafePassword("Battery Horse Staple")) // Output: false


// Result
// Result is my attempt to implement a Result monad (or more accurately, an Either monad)
// The error handling is not functional, but the rest shows some promise
// I like that side effects are handled separately and explicitly (onSuccess, onFailure)
// The Type safety is great as well, using catch removes the error from the type(!), map also changes the resulting type
// I also like the way the code reads, no big try-catch or mutations. In these toy examples it's a bit too convoluted, but still was fun to implement

const calculatePowerRating = (numbersStr: string) =>
    result(parseNumbers(numbersStr))
        .map(sum)
        .flatMap(checkIfOver9000)
        .catch((e: "Is over 9,000!") => console.error(e))
        .map(
            pipe(
                toString,
                prefix("Power rating is: "),
                postfix("!")
            )
        )

const low = calculatePowerRating("10;14;2")
console.log(low.toValue()) // Output: Power rating is: 26!
console.log(isSuccess(low)) // Output: true

// We catch the error "Is over 9,000!", so it is removed from the final type
// I don't think this actually handles the error though, the result is still a failure
// I haven't gotten around to implement the logic for this apart from the type signature
const high = calculatePowerRating("9000;2000")
console.log(high.toValue()) // Output: 11,000
console.log(isSuccess(high)) // Output: true
console.log(isFailure(high)) // Output: false

const malformed = calculatePowerRating("no-power")
console.log(malformed.toValue()) // throws "Could not parse numbers!"
console.log(isSuccess(malformed)) // Output: false
console.log(isFailure(malformed)) // Output: true

// Type narrowing makes sure we can only access fields of either success/failure
// of the monad after we check if it is a success or a failure
console.log(low.value) // Compile error
console.log(low.error) // Compile error
if(isSuccess(low)) {
    console.log(low.value) // This is fine
    console.log(low.error) // Compile error
} else {
    console.log(low.value) // Compile error
    console.log(low.error) // This is fine
}
