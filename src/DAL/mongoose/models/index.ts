import mongoose, { Document } from 'mongoose';

export const generateModel = <T extends Document>(modelName: string, schema: mongoose.Schema<T>) => mongoose.model<T>(modelName, schema);
