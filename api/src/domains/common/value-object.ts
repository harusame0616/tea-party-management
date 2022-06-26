export abstract class ValueObject<T extends { [key: string]: any }> {
  protected constructor(protected readonly _value: T) {}

  equals(value: ValueObject<T>) {
    return Object.entries(value._value).every(([k, v]) => this._value[k] === v);
  }

  get value(): T {
    return this._value;
  }
}
