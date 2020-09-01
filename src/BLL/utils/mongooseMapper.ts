import { Document, Model } from 'mongoose';
import { ObjectID } from 'mongodb';
import { IBaseEntity } from '../interfaces/models';

export class MongooseMapper {
  public static mapViewEntity<
  TViewModel extends {[ key: string ]: any; } & IBaseEntity,
  TEntityModel extends Document
  >(viewModel: TViewModel, MongooseModel: Model<TEntityModel>): TEntityModel {
    viewModel._id = new ObjectID(viewModel.id);
    const entityModel = new MongooseModel() as any;
    Object.keys(viewModel).forEach((key) => {
      entityModel[key] = viewModel[key];
    });
    return entityModel;
  }
}
