import { IActionResult } from './actionResult';

export interface IServiceResult<T> extends IActionResult {
  body?: T;
}
