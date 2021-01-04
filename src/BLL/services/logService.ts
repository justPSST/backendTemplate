import { LogType } from '../enums/logType';
import { LogModel } from '../../DAL/mongoose/models/mongooseLog';
import { ILog } from '../interfaces/models/entity/log';

export class LogService {
  public addLog(message: string, action: string, logType: LogType, data = {}) {
    const log: ILog = {
      message,
      created: new Date(),
      action,
      logType,
      data: JSON.stringify(data)
    };
    return new LogModel(log).save();
  }
}
