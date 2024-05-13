import { CarDataModel, ICarData } from "../../db/carData";

export class CarDataService {
    static async getUnsentCarData(): Promise<ICarData[]> {
        try {
            return await CarDataModel.find({ sentToUsers: false }).exec();
        } catch (error) {
            console.error('Error while getting unsent car data:', error);
            throw error;
        }
    }
    
    static async markAsSent(carDataId: string): Promise<void> {
        try {
            await CarDataModel.findByIdAndUpdate(carDataId, { sentToUsers: true }).exec();
        } catch (error) {
            console.error('Error while marking car data as sent:', error);
            throw error;
        }
    }
    static async cleanUpSentCarData(){
        try {
            const result = await CarDataModel.deleteMany({ sentToUsers: true });
            console.log(`Удалено ${result.deletedCount} записей из CarData.`);
        } catch (error) {
            console.error('Ошибка при очистке CarData:', error);
        }
    };
}
