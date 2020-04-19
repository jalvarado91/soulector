import create, { UseStore, StoreApi } from "zustand";
import produce from "immer";

export interface IEntity {
  id: string;
}

export interface CollectionNormalized<T extends IEntity> {
  [key: string]: T;
}

export function normalize<T extends IEntity>(
  items: T[],
  getId: (item: T) => string
): CollectionNormalized<T> {
  const normed = {} as CollectionNormalized<T>;
  for (var i of items) {
    normed[getId(i)] = i;
  }
  return normed;
}

export function flatten<T extends IEntity>(
  collection: CollectionNormalized<T>
): T[] {
  return Object.values(collection);
}

/**
 * Collection
 */

interface IStore<T> {
  ids: string[];
  items: T[];
  actions: {
    findById: (id: string) => T | undefined;
    add: (models: T | T[]) => T[];
  };
}

export function createCollection<T extends IEntity>(): [
  UseStore<IStore<T>>,
  StoreApi<IStore<T>>
] {
  const [useStore, store] = create<IStore<T>>((set, get) => {
    return {
      ids: [],
      items: [],
      actions: {
        findById(id: string) {
          return get().items.find(it => it.id === id);
        },
        add(models: T | T[]) {
          return get().items;
        }
      }
    };
  });

  return [useStore, store];
}
