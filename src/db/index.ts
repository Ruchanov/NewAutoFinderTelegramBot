import { Mongoose } from 'mongoose'
import { config } from '../domains/config'

export class MongoDataBase {
    public static mainDataBaseConnection: Mongoose = new Mongoose()
    public static async initMainDataBaseConnection(): Promise<void> {
        console.log(`Trying to connect to ${config.mainMongoConnectionUrl}`)

        return MongoDataBase.mainDataBaseConnection
            .connect(config.mainMongoConnectionUrl)
            .then(() => console.log(`Connected to ${config.mainMongoConnectionUrl}`))
            .catch((error) => {
                console.log(`Couldn't connect to ${config.mainMongoConnectionUrl}`)
                throw error
            })
    }
}
