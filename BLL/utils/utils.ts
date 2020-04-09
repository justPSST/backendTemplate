import { Model, Document } from 'mongoose';
import { ICrudFilterUnit } from '../interfaces/models/crudFilter';
import { IExtendedSchemaType } from '../interfaces/models/extendedSchemaType';

export const getRandomCode = () => {
  return Math.floor(Math.random() * (9999 - 1000)) + 1000;
};

export const defaultTransform = (doc: Model<Document>, ret: Document, options: object) => {
  ret.id = ret._id.toString();
  delete ret._id;
  return ret;
};

export const formatString = (str: string, params: any = {}): string => {
  let resultStr = str;
  Object.keys(params).forEach((key) => {
    resultStr = resultStr.replace(`\${${key}}`, params[key]);
  });
  return resultStr;
};

export const pickSchema = <T extends Document>(model: Model<T, {}>): ICrudFilterUnit[] => {
  const excluded: string[] = ['_id', '__v'];
  const fields: ICrudFilterUnit[] = [];
  model.schema.eachPath((fieldName) => {
    if (excluded.indexOf(fieldName) < 0) {
      const schemaType = model.schema.path(fieldName) as IExtendedSchemaType;
      const type = schemaType.instance;
      fields.push({ fieldName, type });
    }
  });
  return fields;
};
