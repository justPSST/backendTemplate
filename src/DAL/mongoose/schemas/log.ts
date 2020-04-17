import * as mongoose from 'mongoose';
import { defaultTransform } from '../../../BLL/utils';

const { Schema } = mongoose;

export const logSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  logType: {
    type: Number,
    required: true
  },
  data: {
    type: String,
    required: false
  }
}, { collection: 'logs' })
  .set('toObject', { transform: defaultTransform, versionKey: false });
