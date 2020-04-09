import { IActionResult } from './actionResult';

export interface IServiceError extends IActionResult {
  message: string;
}
