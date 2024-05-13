import { CarModel, ICar } from '../../db/car';
import { Car } from '../../domains/scraper/scraper';

export class CarService {
    public static async saveCar(data: Car): Promise<void> {
        try {
            const isExists = await CarService.isDataExists(data.id);
            if (isExists) {
                console.log('Data with id', data.id, 'already exists.');
                return;
            }

            const carDocument = new CarModel(data);
            const result = await carDocument.save();
            console.log('Data inserted:', result._id);
        } catch (error) {
            console.error('Error saving data to MongoDB:', error);
            throw new Error('Failed to save data to MongoDB');
        }
    }
    public static async getCar(id: number): Promise<Car | null> {
      try {
          const result = await CarModel.findOne({ id: id });
          return result ? result.toObject() : null;
      } catch (error) {
          console.error('Error retrieving data from MongoDB:', error);
          throw new Error('Failed to retrieve data from MongoDB');
      }
  }
    public static async isDataExists(id: number): Promise<boolean> {
        try {
            const result = await CarModel.findOne({ id: id });
            return !!result;
        } catch (error) {
            console.error('Error checking data existence in MongoDB:', error);
            throw new Error('Failed to check data existence in MongoDB');
        }
    }
}