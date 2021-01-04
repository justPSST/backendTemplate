import { Document } from 'mongoose';
import { generateModel } from '.';
import { IMongooseLog } from '../interfaces/mongooseLog';
import { logSchema } from '../schemas/log';

export const LogModel = generateModel<IMongooseLog & Document>('Log', logSchema);
