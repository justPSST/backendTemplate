import { generateModel } from '.';
import { IMongooseLog } from '../interfaces/mongooseLog';
import { logSchema } from '../schemas/log';

export const LogModel = generateModel<IMongooseLog>('Log', logSchema);