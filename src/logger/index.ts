import { LogService } from '../BLL/services/logService';
import { LogType } from '../BLL/enums/logType';

export class Logger {
  public static addLog(message: string, action: string, logType: LogType, data?: any) {
    const logger = new LogService();
    logger.addLog(message, action, logType, data);
  }
}