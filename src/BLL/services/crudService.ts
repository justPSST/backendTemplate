import { Document, Model } from 'mongoose';
import {
  IBaseEntity, IServiceResult, IServiceError, ICrudFilterUnit, IPagination
} from '../interfaces/models';
import { ICrudService } from '../interfaces/services';
import { pickSchema } from '../utils';
import { ServiceResult, ServiceError } from '../models';
import { HttpStatuses } from '../enums';

export class CrudService<
    TViewModel extends IBaseEntity
  > implements ICrudService<TViewModel> {
  private Model: Model<Document<TViewModel>>;

  constructor(model: Model<Document<TViewModel>>) {
    this.Model = model;
  }

  public async add(data: TViewModel): Promise<IServiceResult | IServiceError> {
    try {
      const result = await new this.Model(data).save();
      return new ServiceResult(HttpStatuses.OK, result.toObject());
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async addList(dataList: TViewModel[]): Promise<IServiceResult | IServiceError> {
    try {
      const models = dataList.map((data) => new this.Model(data));
      const result = await this.Model.insertMany(models);
      const returnList = result.map((item) => item.toObject());
      return new ServiceResult(HttpStatuses.OK, returnList);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async update(data: Partial<TViewModel>): Promise<IServiceResult | IServiceError> {
    try {
      if (!data.id) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Id not specified');
      }
      const options = { new: true, runValidators: true };
      const result = await this.Model.findByIdAndUpdate(data.id, data as any, options);
      if (!result) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Not found');
      }
      return new ServiceResult(HttpStatuses.OK, result.toObject());
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async delete(id: string): Promise<IServiceResult | IServiceError> {
    try {
      if (!id) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Id not specified');
      }
      await this.Model.findByIdAndDelete(id);
      return new ServiceResult(HttpStatuses.OK);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async getById(id: string): Promise<IServiceResult | IServiceError> {
    try {
      if (!id) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Id not specified');
      }
      const result = await this.Model.findById(id);
      if (!result) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Not found');
      }
      return new ServiceResult(HttpStatuses.OK, result.toObject());
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public async findMany(conditions: Partial<TViewModel>, pagination: IPagination = {}): Promise<IServiceResult | IServiceError> {
    try {
      let query = this.Model.find(conditions as any);
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

  public async find(conditions: Partial<TViewModel>): Promise<IServiceResult | IServiceError> {
    try {
      const result = await this.Model.findOne(conditions as any);
      if (!result) {
        return new ServiceError(HttpStatuses.BAD_REQUEST, 'Not found');
      }
      return new ServiceResult(HttpStatuses.OK, result.toObject() as TViewModel);
    } catch (error) {
      return new ServiceError(HttpStatuses.SERVER_ERROR, error.message);
    }
  }

  public getFilterModel(): IServiceResult<ICrudFilterUnit[]> {
    const filterModel = pickSchema(this.Model);
    return new ServiceResult(HttpStatuses.OK, filterModel);
  }
}
