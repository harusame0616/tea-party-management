export abstract class ValueObject<T extends { [key: string]: any }> {
  protected constructor(protected readonly _value: T) {}

  equals(value: ValueObject<T>) {
    Object.entries(value).every(([key, value]) => this._value[key] === value);

    return;
  }

  get value(): T {
    return this._value;
  }
}
