import { Document, Model, QueryFindOneAndUpdateOptions } from 'mongoose';
import {
  IBaseEntity, IServiceResult, IServiceError, ICrudFilterUnit, IPagination
} from '../interfaces/models';
import { ICrudService } from '../interfaces/services';
import { pickSchema } from '../utils';
import { ServiceResult, ServiceError } from '../models';
import { HttpStatuses } from '../enums';

export class CrudService<
    TViewModel extends IBaseEntity,
    TEntityModel extends Document
  > implements ICrudService<TViewModel, TEntityModel> {
  private model: Model<TEntityModel, {}>;

  constructor(model: Model<TEntityModel, {}>) {
    this.model = model;
  }

  public async add(data: TViewModel): Promise<IServiceResult<TViewModel> | IServiceError> {
    try {
      const result = await this.model.create(data);
      return new ServiceResult(HttpStatuses.OK, result.toObject());
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async addList(dataList: TViewModel[]): Promise<IServiceResult<TViewModel[]> | IServiceError> {
    try {
      const result = await this.model.insertMany(dataList);
      const returnList = result.map((item) => item.toObject());
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
      const options: QueryFindOneAndUpdateOptions = { new: true, runValidators: true };
      const result = await this.model.findByIdAndUpdate(data.id, data, options);
      if (!result) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Not found');
      }
      return new ServiceResult(HttpStatuses.OK, result.toObject());
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async delete(id: string): Promise<IServiceResult<void> | IServiceError> {
    try {
      if (!id) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Id not specified');
      }
      await this.model.findByIdAndDelete(id);
      return new ServiceResult(HttpStatuses.OK);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async getById(id: string): Promise<IServiceResult<TViewModel> | IServiceError> {
    try {
      if (!id) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Id not specified');
      }
      const result = await this.model.findById(id);
      if (!result) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Not found');
      }
      return new ServiceResult(HttpStatuses.OK, result.toObject());
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async findMany(conditions: Partial<TViewModel>, pagination: IPagination = {}): Promise<IServiceResult<TViewModel[]> | IServiceError> {
    try {
      let query = this.model.find(conditions as any);
      if (pagination.page) {
        query = query.skip(pagination.page);
      }
      if (pagination.limit) {
        query = query.limit(pagination.limit);
      }
      const result = await query;
      const returnList = result.map((item) => item.toObject());
      return new ServiceResult(HttpStatuses.OK, returnList);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async find(conditions: Partial<TViewModel>): Promise<IServiceResult<TViewModel> | IServiceError> {
    try {
      const result = await this.model.findOne(conditions as any);
      if (!result) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Not found');
      }
      return new ServiceResult(HttpStatuses.OK, result.toObject() as TViewModel);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public getFilterModel(): IServiceResult<ICrudFilterUnit[]> {
    const filterModel = pickSchema(this.model);
    return new ServiceResult(HttpStatuses.OK, filterModel);
  }
}
