import { ObjectId } from 'mongoose';

export interface IBaseEntity {
  id?: string;
  _id?: ObjectId;
}
