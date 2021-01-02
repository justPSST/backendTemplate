/* eslint-disable no-unused-vars */
import { LogType } from '../../enums/logType';

export interface ILogService {
  addLog(message: string, action: string, logType: LogType, data?: any): void;
}
