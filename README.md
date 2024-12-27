## mf-ts 
### (More Functional Typescript) 

After reading the book ["Domain Modeling Made Functional"](https://www.oreilly.com/library/view/domain-modeling-made/9781680505481/) by Scott Wlaschin
I wanted to mimic the coding style from the book, but there was a lot of functionality that was lacking in typescript.
There's definitely a lot of libraries to fill the gap, but I wanted to "reinvent the wheel" so that I could
build a deeper understanding, so I created this set of utility functions.

I have abandoned this project a bit messy and halfway there, so there's some unresolved issues with the code (but all unit tests pass!)
as well as missing functionality.

In some other project that I've since lost access to, 
I implemented an extension to the `pipe` function to handle promises and the `result` monad.

`some` and `all` are really just syntax sugar, it makes the code a bit more pretty but there's no complicated implementation behind them


## Docs
#### See [examples.ts](src/examples.ts)

### `pipe`

Pipe is a HOC that composes multiple functions into a single function.
It runs each function in sequence, the output of the preceding function becomes the input of the next.
every "step" of the pipe is typesafe due to the inference of `pipe`

```typescript
// convertToUSD infers the types based on the type and order of passed functions
const convertToUSD = pipe(
    convertCentsToDollars,  // (bigint) -> bigint
    toString,               // (bigint) -> string
    postfix(" USD"),        // (string) -> string
    prefix("$"),            // (string) -> string
)

const cents = 103_938n
console.log(convertToUSD(cents)) // Output: "$1039.38 USD"
```

### `all`
`all` is a HOC that combines multiple functions of the type `(a: T) => boolean`
into a single function with the same type.
The combined function will return `true` if all the passed functions returns `true` for the supplied argument.

```typescript
const validateEmail = all(
    isNotEmpty,
    containsAnAt,
    isMinimum3Chars,
    isMaximum50Chars,
)

validateEmail("ccyrillus@protonmail.com") // Output: true
validateEmail("") // Output: false
validateEmail("no-at-in-sight") // Output: false
```

### `some`
Same as `all`, but only a single function needs to return `true` for the combined function to return `true`
```typescript
const isUnsafePassword = some(
    passwordIsReused(["pass-123", "P@szW0rd!"]),
    passwordIsWeak
)

console.log(isUnsafePassword("pass-123")) // Output: true
console.log(isUnsafePassword("123")) // Output: true
console.log(isUnsafePassword("Battery Horse Staple")) // Output: false
```


### `result`

**I made a better implementation in a separate project ([nano-work-pool](https://github.com/CeasarCyrillus/nano-work-pool/blob/main/api/src/mf-ts/core/resultPipe.ts)), that deals with async code and couples it more tightly with the `Result` type**


This is my attempt to implement a Result monad (or more accurately, an Either monad).
The error handling is not functional, but the rest shows some promise
I like that side effects are handled separately and explicitly (onSuccess, onFailure).
The Type safety is great as well, using catch removes the error from the type(!), map also changes the resulting type.
I also like the way the code reads, no big try-catch or mutations. In these toy examples it's a bit too convoluted, but still was fun to implement.

```typescript
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
// I don't think this actually handles the error though in the implementation, the result is still a failure
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
```
