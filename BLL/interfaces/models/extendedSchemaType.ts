import { SchemaType } from 'mongoose';

export interface IExtendedSchemaType extends SchemaType {
  instance: string;
  isRequired: boolean;
}
