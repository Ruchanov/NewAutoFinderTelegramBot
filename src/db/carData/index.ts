import { Document, Schema } from 'mongoose';
import { MongoDataBase } from '..';

const COLLECTION_NAME = 'CarData';

export interface ICarData extends Document {
    city: string;
    pageNumber: number;
    cars: string[]; 
    sentToUsers: boolean; 
}

const CarDataSchema = new Schema<ICarData>(
    {
        city: {
            type: String,
            required: true,
        },
        pageNumber: {
            type: Number,
            required: true,
        },
        cars: {
            type: [String],
            required: true,
        },
        sentToUsers: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);


CarDataSchema.index({ city: 1, pageNumber: 1 });

export const CarDataModel = MongoDataBase.mainDataBaseConnection.model<ICarData>(
    COLLECTION_NAME,
    CarDataSchema,
    COLLECTION_NAME,
);
