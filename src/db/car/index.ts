import { Document, model, Schema } from 'mongoose'
import { MongoDataBase } from '..'

const COLLECTION_NAME = 'Car'

export interface ICar extends Document {
  id: number;
  city: string;
  drive: string;
  mileage: number;
  clearanceKZ: boolean;
  body: string;
  volume: number;
  price: number;
  name: string;
  percentDifference: number;
}

const CarSchema = new Schema<ICar>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      default: '',
    },
    drive: {
      type: String,
      default: '',
    },
    mileage: {
      type: Number,
      default: null,
    },
    clearanceKZ: {
      type: Boolean,
      default: true,
    },
    body: {
      type: String,
      default: '',
    },
    volume: {
      type: Number,
      default: null,
    },
    price: {
      type: Number,
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    percentDifference: { 
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)

CarSchema.index({ id: 1 })

export const CarModel = MongoDataBase.mainDataBaseConnection.model<ICar>(COLLECTION_NAME, CarSchema, COLLECTION_NAME)
