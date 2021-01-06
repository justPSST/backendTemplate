import { Model, Document } from 'mongoose';

export const getRandomCode = () => Math.floor(Math.random() * (9999 - 1000)) + 1000;

export const defaultTransform = (doc: Model<Document>, ret: Document) => {
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
