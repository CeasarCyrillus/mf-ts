export const discriminator = <
  TTarget extends {kind: string}
>(targetType: TTarget["kind"]) =>
  (candidate: {kind: string}): candidate is TTarget =>
    candidate.kind === targetType