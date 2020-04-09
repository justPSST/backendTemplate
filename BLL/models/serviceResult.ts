import { IServiceResult } from '../interfaces/models';
import { ActionResult } from './actionResult';
import { HttpStatuses } from '../enums';

export class ServiceResult<T> extends ActionResult implements IServiceResult<T> {
  public body?: T;

  constructor(status: HttpStatuses | number, body?: T) {
    super(status);
    this.body = body;
  }
}
