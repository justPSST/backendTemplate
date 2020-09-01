import { LogType } from '../enums/logType';
import { ILogService } from '../interfaces/services/logService';
import { CrudService } from './crudService';
import { IMongooseLog } from '../../DAL/mongoose/interfaces/mongooseLog';
import { ILog } from '../interfaces/models/entity/log';
import { LogModel } from '../../DAL/mongoose/models/mongooseLog';

export class LogService extends CrudService<ILog, IMongooseLog> implements ILogService {
  constructor() {
    super(LogModel);
  }

  public addLog(message: string, action: string, logType: LogType, data?: any): void {
    const log: ILog = {
      message,
      created: new Date(),
      action,
      logType,
      data: JSON.stringify(data)
    };
    this.add(log);
  }
}
