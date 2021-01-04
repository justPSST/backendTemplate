import { LogType } from '../../../enums/logType';

export interface ILog {
  message: string;
  action: string;
  created: Date;
  logType: LogType;
  data?: string | Object;
}
