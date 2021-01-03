import { LogType } from '../enums/logType';
import { ILogService } from '../interfaces/services/logService';
import { ILog } from '../interfaces/models/entity/log';
import { LogModel } from '../../DAL/mongoose/models/mongooseLog';
import { IMongooseLog } from '../../DAL/mongoose/interfaces/mongooseLog';

export class LogService implements ILogService {
  model = LogModel;

  public addLog(message: string, action: string, logType: LogType, data = {}): Promise<IMongooseLog> {
    const log: ILog = {
      message,
      created: new Date(),
      action,
      logType,
      data: JSON.stringify(data)
    };
    return this.model.create(log);
  }
}
