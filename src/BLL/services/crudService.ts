import { Document, Model } from 'mongoose';
import {
  IBaseEntity, IServiceResult, IServiceError, ICrudFilterUnit, IPagination
} from '../interfaces/models';
import { ICrudService } from '../interfaces/services';
import { Repository } from '../../DAL/repositories';
import { MongooseMapper, pickSchema } from '../utils';
import { ServiceResult, ServiceError } from '../models';
import { HttpStatuses } from '../enums';

export class CrudService<
    TViewModel extends IBaseEntity,
    TEntityModel extends Document
  > implements ICrudService<TViewModel, TEntityModel> {
  private _repository: Repository<TEntityModel, TViewModel>;

  private model: Model<TEntityModel, {}>;

  constructor(model: Model<TEntityModel, {}>, repository?: Repository<TEntityModel, TViewModel>) {
    this._repository = repository || new Repository(model);
    this.model = model;
  }

  public async add(data: TViewModel): Promise<IServiceResult<TViewModel> | IServiceError> {
    try {
      const entity = MongooseMapper.mapViewEntity<TViewModel, TEntityModel>(data, this.model);
      const result = await this._repository.addAsync(entity);
      return new ServiceResult(HttpStatuses.OK, result.toObject() as TViewModel);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async addList(dataList: TViewModel[]): Promise<IServiceResult<TViewModel[]> | IServiceError> {
    try {
      const entityList = dataList.map((data) => MongooseMapper.mapViewEntity<TViewModel, TEntityModel>(data, this.model));
      const result = await this._repository.addListAsync(entityList);
      const returnList = result.map((item) => item.toObject() as TViewModel);
      return new ServiceResult(HttpStatuses.OK, returnList);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async update(data: Partial<TViewModel>): Promise<IServiceResult<TViewModel> | IServiceError> {
    try {
      if (!data.id) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Id not specified');
      }
      const result = await this._repository.updateAsync(data.id as string, data);
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
      if (!id) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Id not specified');
      }
      await this._repository.removeAsync(id);
      return new ServiceResult(HttpStatuses.OK);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async get(id: string): Promise<IServiceResult<TViewModel> | IServiceError> {
    try {
      if (!id) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Id not specified');
      }
      const result = await this._repository.getAsync(id);
      if (!result) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Not found');
      }
      return new ServiceResult(HttpStatuses.OK, result.toObject() as TViewModel);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async getAll(pagination: IPagination = {}): Promise<IServiceResult<TViewModel[]> | IServiceError> {
    try {
      const result = await this._repository.getAllAsync(pagination);
      const returnList = result.map((item) => item.toObject() as TViewModel);
      return new ServiceResult(HttpStatuses.OK, returnList);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async find(conditions: Partial<TViewModel>): Promise<IServiceResult<TViewModel> | IServiceError> {
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

  public async findMany(conditions: Partial<TViewModel>, pagination: IPagination = {}): Promise<IServiceResult<TViewModel[]> | IServiceError> {
    try {
      const result = await this._repository.findManyAsync(conditions, pagination);
      const returnList = result.map((item) => item.toObject() as TViewModel);
      return new ServiceResult(HttpStatuses.OK, returnList);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public getFilterModel(): IServiceResult<ICrudFilterUnit[]> {
    const filterModel = pickSchema(this.model);
    return new ServiceResult(HttpStatuses.OK, filterModel);
  }
}
