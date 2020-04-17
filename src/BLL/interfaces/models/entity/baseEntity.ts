import { ObjectID } from 'mongodb';

export interface IBaseEntity {
  id?: string;
  _id?: ObjectID;
  [key: string]: any;
}

export type IBaseEntityFilter = Partial<IBaseEntity>;
