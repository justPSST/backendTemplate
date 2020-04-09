
import { HttpStatuses } from '../enums';
import { IActionResult } from '../interfaces/models';

export class ActionResult implements IActionResult {
  public status: HttpStatuses;

  constructor(status: HttpStatuses | number) {
    this.status = status;
  }
}
