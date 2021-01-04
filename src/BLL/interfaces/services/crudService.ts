import {
  IServiceResult, IServiceError, ICrudFilterUnit, IPagination
} from '../models';

export interface ICrudService<TViewModel extends { id?: string }> {
  add(data: TViewModel): Promise<IServiceResult<TViewModel> | IServiceError>;
  update(data: TViewModel): Promise<IServiceResult<TViewModel> | IServiceError>;
  delete(id: string): Promise<IServiceResult<void> | IServiceError>;
  getById(id: string): Promise<IServiceResult<TViewModel> | IServiceError>;
  find(conditions: Partial<TViewModel>): Promise<IServiceResult<TViewModel> | IServiceError>;
  findMany(conditions: Partial<TViewModel>, pagination: IPagination): Promise<IServiceResult<TViewModel[]> | IServiceError>;
  getFilterModel(): IServiceResult<ICrudFilterUnit[]>;
}
