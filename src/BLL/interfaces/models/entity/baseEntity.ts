import { ObjectID } from 'mongodb';

export interface IBaseEntity {
  id?: string;
  _id?: ObjectID;
}
