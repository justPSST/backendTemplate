import { Document, Model, QueryFindOneAndUpdateOptions } from 'mongoose';
import { IRepository } from '../interfaces/repositories';
import { IBaseEntity, IPagination } from '../../BLL/interfaces/models';

export class Repository<
    TEntityModel extends Document,
    TViewModel extends IBaseEntity
  > implements IRepository<TEntityModel, TViewModel> {
  protected model: Model<TEntityModel>;

  constructor(model: Model<TEntityModel>) {
    this.model = model;
  }

  public async addAsync(entity: TEntityModel): Promise<TEntityModel> {
    const result = await this.model.create(entity);
    return result;
  }

  public async addListAsync(entityArray: TEntityModel[]): Promise<TEntityModel[]> {
    const result = await this.model.insertMany(entityArray);
    return result;
  }

  public async updateAsync(id: string, update: Partial<TViewModel>): Promise<TEntityModel | null> {
    const options: QueryFindOneAndUpdateOptions = { new: true, runValidators: true };
    const result = await this.model.findByIdAndUpdate(id, update, options);
    return result;
  }

  public async removeAsync(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }

  public async removeListAsync(ids: string[]): Promise<void> {
    await this.model.deleteMany({ id: { $in: ids } as any });
  }

  public async countAsync(): Promise<number> {
    const count = await this.model.count({});
    return count;
  }

  public async countFilteredAsync(conditions: Partial<TViewModel>): Promise<number> {
    const count = await this.model.count(conditions as any);
    return count;
  }

  public async getAsync(id: string): Promise<TEntityModel | null> {
    const result = await this.model.findById(id);
    return result;
  }

  public async getAllAsync(pagination: IPagination = {}): Promise<TEntityModel[]> {
    let query = this.model.find();
    if (pagination.page) {
      query = query.skip(pagination.page);
    }
    if (pagination.limit) {
      query = query.limit(pagination.limit);
    }
    const result = await query;
    return result;
  }

  public async findAsync(conditions: Partial<TViewModel>): Promise<TEntityModel | null> {
    const result = await this.model.findOne(conditions as any);
    return result;
  }

  public async findManyAsync(conditions: Partial<TViewModel>, pagination: IPagination = {}): Promise<TEntityModel[]> {
    let query = this.model.find(conditions as any);
    if (pagination.page) {
      query = query.skip(pagination.page);
    }
    if (pagination.limit) {
      query = query.limit(pagination.limit);
    }
    const result = await query;
    return result;
  }
}
