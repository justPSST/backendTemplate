import { ObjectID } from 'mongodb';
import { Document } from 'mongoose';

export interface IBaseDocument extends Document {
  _id: ObjectID;
  id: string;
}
