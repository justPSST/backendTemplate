import { Document, Model } from 'mongoose';
import { IBaseEntity, IBaseEntityFilter, IServiceResult, IServiceError, ICrudFilterUnit } from '../interfaces/models';
import { ICrudService } from '../interfaces/services';
import { Repository } from '../../DAL/repositories';
import { MongooseMapper, pickSchema } from '../utils';
import { ServiceResult, ServiceError } from '../models';
import { HttpStatuses } from '../enums';

export class CrudService<
    TViewModel extends IBaseEntity,
    TEntityModel extends Document,
    TFilterModel extends IBaseEntityFilter
  > implements ICrudService<TViewModel, TEntityModel, TFilterModel> {
  private _repository: Repository<TEntityModel, TFilterModel>;

  private _model: Model<TEntityModel, {}>;

  constructor(model: Model<TEntityModel, {}>, repository?: Repository<TEntityModel, TFilterModel>) {
    this._repository = repository || new Repository(model);
    this._model = model;
  }

  public async add(data: TViewModel): Promise<IServiceResult<TViewModel> | IServiceError> {
    try {
      const entity = MongooseMapper.mapViewEntity<TViewModel, TEntityModel>(data, this._model);
      const result = await this._repository.addAsync(entity);
      return new ServiceResult(HttpStatuses.OK, result.toObject() as TViewModel);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async addList(dataList: TViewModel[]): Promise<IServiceResult<TViewModel[]> | IServiceError> {
    try {
      const entityList = dataList.map((data) => MongooseMapper.mapViewEntity<TViewModel, TEntityModel>(data, this._model));
      const result = await this._repository.addListAsync(entityList);
      const returnList = result.map((item) => item.toObject() as TViewModel);
      return new ServiceResult(HttpStatuses.OK, returnList);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async update(data: TViewModel): Promise<IServiceResult<TViewModel> | IServiceError> {
    try {
      const entity = MongooseMapper.mapViewEntity<TViewModel, TEntityModel>(data, this._model);
      const update = MongooseMapper.mapViewFilter<TViewModel, TFilterModel>(data);
      const result = await this._repository.updateAsync(entity.id, update);
      if (!result) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Not found');
      }
      return new ServiceResult(HttpStatuses.OK, result.toObject() as TViewModel);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async delete(id: string): Promise<IServiceResult<void> | IServiceError> {
    try {
      await this._repository.removeAsync(id);
      return new ServiceResult(HttpStatuses.OK);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async get(id: string): Promise<IServiceResult<TViewModel> | IServiceError> {
    try {
      const result = await this._repository.getAsync(id);
      if (!result) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Not found');
      }
      return new ServiceResult(HttpStatuses.OK, result.toObject() as TViewModel);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async getAll(): Promise<IServiceResult<TViewModel[]> | IServiceError> {
    try {
      const result = await this._repository.getAllAsync();
      const returnList = result.map((item) => item.toObject() as TViewModel);
      return new ServiceResult(HttpStatuses.OK, returnList);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async find(conditions: TFilterModel): Promise<IServiceResult<TViewModel> | IServiceError> {
    try {
      const result = await this._repository.findAsync(conditions);
      if (!result) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Not found');
      }
      return new ServiceResult(HttpStatuses.OK, result.toObject() as TViewModel);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async findMany(conditions: TFilterModel): Promise<IServiceResult<TViewModel[]> | IServiceError> {
    try {
      const result = await this._repository.findManyAsync(conditions);
      const returnList = result.map((item) => item.toObject() as TViewModel);
      return new ServiceResult(HttpStatuses.OK, returnList);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public getFilterModel(): IServiceResult<ICrudFilterUnit[]> {
    const filterModel = pickSchema(this._model);
    return new ServiceResult(HttpStatuses.OK, filterModel);
  }
}
