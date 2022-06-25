export class CustomError extends Error {
  readonly option = undefined;

  constructor(message: string, option?: any) {
    super(message);
    this.name = new.target.name;
    this.option = option;
  }
}
