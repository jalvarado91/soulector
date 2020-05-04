import create, { UseStore, StoreApi } from "zustand";
import produce from "immer";
import { TrackModel } from "../TracksScreen/TracksStore";
import { Collection } from "react-virtualized";

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

export type EntityId = number | string;
export type IdSelector<T> = (model: T) => EntityId;
export interface DictionaryNum<T> {
  [id: number]: T | undefined;
}
export interface Dictionary<T> extends DictionaryNum<T> {
  [id: string]: T | undefined;
}

export interface EntityStore<T> {
  ids: EntityId[];
  entities: Dictionary<T>;
}

export interface EntityDefinition<T> {
  selectId: IdSelector<T>;
}

export interface StoreActions<T> {
  addOne(entity: T): void;
  addMany(entities: T[]): void;
}

interface Store<T> extends EntityStore<T> {
  actions: StoreActions<T>;
}

export function createEntityStore<T extends IEntity>(): [
  UseStore<Store<T>>,
  StoreApi<Store<T>>
] {
  const [useStore, store] = create<Store<T>>((set, get) => {
    return {
      ids: [],
      entities: {},
      actions: {
        addOne(entity: T) {
          set({
            ids: get().ids.concat(entity.id),
            entities: {
              [entity.id]: entity,
              ...get().entities,
            },
          });
        },
        addMany(entities: T[]) {
          let aggregates = {};
          for (var en of entities) {
            aggregates = {
              [en.id]: en,
              ...aggregates,
            };
          }

          set({
            ids: get().ids.concat(entities.map((e) => e.id)),
            entities: {
              ...aggregates,
              ...get().entities,
            },
          });
        },
      },
    };
  });

  return [useStore, store];
}

interface IStore<T> {
  ids: string[];
  items: T[];
  actions: {
    findById: (id: string) => T | undefined;
    add: (models: T | T[]) => void;
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
          return get().items.find((it) => it.id === id);
        },
        add(models: T | T[]) {
          if (Array.isArray(models)) {
            set({
              ids: get().ids.concat(models.map((i) => i.id)),
              items: get().items.concat(models),
            });
          } else {
            set({
              items: get().items.concat([models]),
            });
          }
        },
      },
    };
  });

  return [useStore, store];
}
