export interface IMongooseLog {
  message: string;
  created: Date;
  action: string;
  logType: number;
  data?: string;
}
