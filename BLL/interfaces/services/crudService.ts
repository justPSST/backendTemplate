import { Document } from 'mongoose';
import { IBaseEntity, IBaseEntityFilter, IServiceResult, IServiceError, ICrudFilterUnit } from '../models';

export interface ICrudService<
    TViewModel extends IBaseEntity,
    TEntityModel extends Document,
    TFilterModel extends IBaseEntityFilter
  > {
  add(data: TViewModel): Promise<IServiceResult<TViewModel> | IServiceError>;
  update(data: TViewModel): Promise<IServiceResult<TViewModel> | IServiceError>;
  delete(id: string): Promise<IServiceResult<void> | IServiceError>;
  get(id: string): Promise<IServiceResult<TViewModel> | IServiceError>;
  getAll(): Promise<IServiceResult<TViewModel[]> | IServiceError>;
  find(conditions: TFilterModel): Promise<IServiceResult<TViewModel> | IServiceError>;
  findMany(conditions: TFilterModel): Promise<IServiceResult<TViewModel[]> | IServiceError>;
  getFilterModel(): IServiceResult<ICrudFilterUnit[]>;
}
