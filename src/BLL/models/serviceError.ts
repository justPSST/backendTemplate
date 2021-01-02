import { HttpStatuses } from '../enums';
import { IServiceError } from '../interfaces/models';
import { ActionResult } from './actionResult';

export class ServiceError extends ActionResult implements IServiceError {
  public message: string;

  public isError: boolean = true;

  constructor(status: HttpStatuses | number, message: string) {
    super(status);
    this.message = message;
  }
}
