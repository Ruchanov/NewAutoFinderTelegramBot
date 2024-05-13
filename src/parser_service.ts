import { MongoDataBase } from './db';
import { CarDataModel } from './db/carData';
import { ParseCarsqueue } from './domains/queue';
import { PageScraperService } from './domains/scraper/pageScraper';
import { initRedis } from './redis/init-redis';


const start = () => {
    ParseCarsqueue.process(15, async (job) => {
        try {
            console.log("Process started");
            
            const { city, pageNumber } = job.data;
            let url: string = '';
            
            if (pageNumber === 1) {
                url = `https://kolesa.kz/cars/${city}/`;
            } else {
                url = `https://kolesa.kz/cars/${city}/?page=${pageNumber}`;
            }
            
            let carIds: string[] = await PageScraperService.getCarIds(url);
            
            const newCars = await PageScraperService.fetchViews(carIds);
            
            const carData = new CarDataModel({
                city,
                pageNumber,
                cars: newCars,
                sentToUsers: false 
            });
            
            await carData.save();
            
            console.log(`Processed task for city ${city}, page ${pageNumber}`);
        } catch (error) {
            console.error('Error during processing:');
        }
    });
};

initRedis();
MongoDataBase.initMainDataBaseConnection().then(() => {
    start(); 
}).catch((error) => {
    console.error('Error during initialization:', error);
});
