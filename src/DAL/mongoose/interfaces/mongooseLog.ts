import { IBaseDocument } from './baseDocument';

export interface IMongooseLog extends IBaseDocument {
  message: string;
  created: Date;
  action: string;
  logType: number;
  data?: string;
}
