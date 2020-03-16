export type CollectionNormalized<T> = {
  [key: string]: T;
};

export function normalize<T>(
  items: T[],
  getId: (item: T) => string
): CollectionNormalized<T> {
  const normed = {} as CollectionNormalized<T>;
  for (var i of items) {
    normed[getId(i)] = i;
  }
  return normed;
}
