import { CarService } from "./data/car";
import { ScraperService } from "./domains/scraper";

export async function main(url: string): Promise<any> {
  const scraperService = new ScraperService();
  
  try {
    const data = await scraperService.parseCar(url);
    await CarService.saveCar(data);
    return data; 
  } catch (error) {
    console.error('Error in main:', error);
    throw error; 
  }
}

