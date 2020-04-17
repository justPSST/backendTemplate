import { Document, Model, QueryFindOneAndUpdateOptions } from 'mongoose';
import { IRepository } from '../interfaces/repositories';
import { IBaseEntityFilter } from '../../BLL/interfaces/models';
import { IPagination } from '../../BLL/interfaces/models';

export class Repository<
    TEntityModel extends Document,
    TFilterModel extends IBaseEntityFilter
  > implements IRepository<TEntityModel, TFilterModel> {
  protected _model: Model<TEntityModel>;

  constructor(model: Model<TEntityModel>) {
    this._model = model;
  }

  public async addAsync(entity: TEntityModel): Promise<TEntityModel> {
    const result = await this._model.create(entity);
    return result;
  }

  public async addListAsync(entityArray: TEntityModel[]): Promise<TEntityModel[]> {
    const result = await this._model.insertMany(entityArray);
    return result;
  }

  public async updateAsync(id: string, update: TFilterModel): Promise<TEntityModel | null> {
    const options: QueryFindOneAndUpdateOptions = { new: true, runValidators: true };
    const result = await this._model.findByIdAndUpdate(id, update, options);
    return result;
  }

  public async removeAsync(id: string): Promise<void> {
    await this._model.findByIdAndDelete(id);
  }

  public async removeListAsync(ids: string[]): Promise<void> {
    await this._model.deleteMany({ id: { $in: ids } as any});
  }

  public async countAsync(): Promise<number> {
    const count = await this._model.count({});
    return count;
  }

  public async countFilteredAsync(conditions: TFilterModel): Promise<number> {
    const count = await this._model.count(conditions as any);
    return count;
  }

  public async getAsync(id: string): Promise<TEntityModel | null> {
    const result = await this._model.findById(id);
    return result;
  }

  public async getAllAsync(pagination: IPagination = {}): Promise<TEntityModel[]> {
    let query = this._model.find();
    if (pagination.page) {
      query = query.skip(pagination.page);
    }
    if (pagination.limit) {
      query = query.limit(pagination.limit);
    }
    const result = await query;
    return result;
  }

  public async findAsync(conditions: TFilterModel): Promise<TEntityModel | null> {
    const result = await this._model.findOne(conditions as any);
    return result;
  }

  public async findManyAsync(conditions: TFilterModel, pagination: IPagination = {}): Promise<TEntityModel[]> {
    let query = this._model.find(conditions as any);
    if (pagination.page) {
      query = query.skip(pagination.page);
    }
    if (pagination.limit) {
      query = query.limit(pagination.limit);
    }
    const result = await query;
    return result;
  }

  public async markAsDeletedAsync(id: string): Promise<void> {
    const update = { deleted: true };
    await this._model.findByIdAndUpdate(id, update);
  }

  public async markAsUndeletedAsync(id: string): Promise<void> {
    const update = { deleted: false };
    await this._model.findByIdAndUpdate(id, update);
  }
}
