import { LogType } from '../../../enums/logType';
import { IBaseEntity } from './baseEntity';

export interface ILog extends IBaseEntity {
  message: string;
  action: string;
  created: Date;
  logType: LogType;
  data?: string;
}

export type ILogFilter = Partial<ILog>;
