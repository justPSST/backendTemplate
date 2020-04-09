import * as mongoose from 'mongoose';
import { IBaseDocument} from '../interfaces';

export const generateModel = <T extends IBaseDocument>(modelName: string, schema: mongoose.Schema<T>) => mongoose.model<T>(modelName, schema);