import { IActionResult } from './actionResult';

export interface IServiceResult<T = any> extends IActionResult {
  body?: T;
  isError: boolean;
}
