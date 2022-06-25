import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  constructor(name: string, option?: any) {
    super(name + 'が見つかりません。', option);
  }
}
