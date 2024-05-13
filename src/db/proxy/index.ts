    import { Document, model, Schema } from 'mongoose'
    import { MongoDataBase } from '..'

    const COLLECTION_NAME = 'Proxy'

    export interface IProxy extends Document {
    ip: string;
    port: number;
    username?: string;
    password?: string;
    }

    const ProxySchema = new Schema<IProxy>(
    {
        ip: {
        type: String,
        required: true,
        },
        port: {
        type: Number,
        required: true,
        },
        username: String,
        password: String,
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
    )

    export const ProxyModel = MongoDataBase.mainDataBaseConnection.model<IProxy>(COLLECTION_NAME, ProxySchema, COLLECTION_NAME)
