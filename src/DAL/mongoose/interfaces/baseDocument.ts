import { Document, ObjectId } from 'mongoose';

export interface IBaseDocument extends Document {
  _id: ObjectId;
  id: string;
}
