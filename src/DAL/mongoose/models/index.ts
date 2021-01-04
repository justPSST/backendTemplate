import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const generateModel = <T extends Document>(modelName: string, schema: mongoose.Schema<Document<T>>) => mongoose.model<T>(modelName, schema);
