/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';
import { IBaseEntity, IPagination } from '../../../BLL/interfaces/models';

export interface IRepository<TEntityModel extends Document, TViewModel extends IBaseEntity> {
  addAsync(entity: TEntityModel): Promise<TEntityModel>;
  addListAsync(entityArray: TEntityModel[]): Promise<TEntityModel[]>;
  updateAsync(id: string, update: Partial<TViewModel>): Promise<TEntityModel | null>;
  removeAsync(id: string): Promise<void>;
  removeListAsync(ids: string[]): Promise<void>;
  countAsync(): Promise<number>;
  countFilteredAsync(conditions: Partial<TViewModel>): Promise<number>
  getAsync(id: string): Promise<TEntityModel | null>;
  getAllAsync(pagination: IPagination): Promise<TEntityModel[]>;
  findAsync(conditions: Partial<TViewModel>): Promise<TEntityModel | null>;
  findManyAsync(conditions: Partial<TViewModel>, pagination: IPagination): Promise<TEntityModel[]>;
}
