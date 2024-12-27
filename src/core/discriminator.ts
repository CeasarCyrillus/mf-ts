// Typescript is using a structural typesystem, so the differentiate between objects of different type
// but same structure (fields, methods etc), the use of "kind:" is common
export const discriminator = <
  TTarget extends {kind: string}
>(targetType: TTarget["kind"]) =>
  (candidate: {kind: string}): candidate is TTarget =>
    candidate.kind === targetType