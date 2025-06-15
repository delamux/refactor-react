export type EntityData = {
  id: number;
}

const isEntity = (value: unknown): value is Entity => {
  return value instanceof Entity;
}

export abstract class Entity implements EntityData {
  protected constructor(public readonly id: number) {}

  equals(object: Entity): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (!isEntity(object)) {
      return false;
    }

    if (this === object) {
      return true;
    }

    return this.id === object.id;
  }
}
