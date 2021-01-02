/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';
import {
  IBaseEntity, IServiceResult, IServiceError, ICrudFilterUnit, IPagination
} from '../models';

export interface ICrudService<
    TViewModel extends IBaseEntity,
    TEntityModel extends Document
  > {
  add(data: TViewModel): Promise<IServiceResult<TViewModel> | IServiceError>;
  update(data: TViewModel): Promise<IServiceResult<TViewModel> | IServiceError>;
  delete(id: string): Promise<IServiceResult<void> | IServiceError>;
  get(id: string): Promise<IServiceResult<TViewModel> | IServiceError>;
  getAll(pagination: IPagination): Promise<IServiceResult<TViewModel[]> | IServiceError>;
  find(conditions: Partial<TViewModel>): Promise<IServiceResult<TViewModel> | IServiceError>;
  findMany(conditions: Partial<TViewModel>, pagination: IPagination): Promise<IServiceResult<TViewModel[]> | IServiceError>;
  getFilterModel(): IServiceResult<ICrudFilterUnit[]>;
}
