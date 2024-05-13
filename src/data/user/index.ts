import { UserModel } from "../../db/user";
export interface User{
    chatId: string
    firstName: string
    lastName: string
    username: string
    subscribedCities: string[]
}
export class UserService {
    public static async saveUser(data: User): Promise<void> {
        try {
            const isExists = await UserService.isDataExists(data.chatId);
            if (isExists) {
                console.log('Data with id', data.chatId, 'already exists.');
                return;
            }

            const carDocument = new UserModel(data);
            const result = await carDocument.save();
        } catch (error) {
            console.error('Error saving data to MongoDB:', error);
            throw new Error('Failed to save data to MongoDB');
        }
    }
    public static async getAllUsers(): Promise<User[]> {
        try {
            const users = await UserModel.find();
            return users.map(user => ({
                chatId: user.chatId,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                subscribedCities: user.subscribedCities
            }));
        } catch (error) {
            console.error('Error retrieving users from MongoDB:', error);
            throw new Error('Failed to retrieve users from MongoDB');
        }
    }
    private static async isDataExists(chatId: string): Promise<boolean> {
        try {
            const result = await UserModel.findOne({ chatId: chatId });
            return !!result;
        } catch (error) {
            throw new Error('Failed to check data existence in MongoDB');
        }
    }
    public static async addCityToUser(chatId: string, city: string): Promise<void> {
        await UserModel.updateOne({ chatId }, { $addToSet: { subscribedCities: city } });
    }
    
    public static async removeCityFromUser(chatId: string, city: string): Promise<void> {
        await UserModel.updateOne({ chatId }, { $pull: { subscribedCities: city } });
    }    
    public static async getUser(chatId: string): Promise<User | null> {
        try {
            return await UserModel.findOne({ chatId: chatId });
        } catch (error) {
            console.error('Error retrieving user:', error);
            throw new Error('Failed to retrieve user');
        }
    }    
}