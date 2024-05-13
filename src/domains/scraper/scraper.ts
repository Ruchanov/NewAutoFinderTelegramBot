import cheerio from 'cheerio';
import axios from 'axios';

export interface Car  {
  id: number;
  city: string;
  drive: string;
  mileage?: number;
  clearanceKZ: boolean;
  body: string;
  volume: number;
  price: number;
  name: string;
  percentDifference: number;
}

export class Scraper {
  async scrape(html: string, url: string): Promise<Car> {
    const $ = cheerio.load(html);

    const id = Number(url.split('/').pop());
    const city = $(' dt:contains("Город") + dd.value').text().trim();
    const drive = $('dt:contains("Привод") + dd.value').text().trim();
    const mileageString = $('dt:contains("Пробег") + dd.value').text().trim();
    const mileage = mileageString ? parseFloat(mileageString.replace(/\D/g, '')) : undefined;
    const clearanceKZ = Boolean($(' dt:contains("Растаможен в Казахстане") + dd.value').text().trim().includes('Да'));
    const body = $(' dt:contains("Кузов") + dd.value').text().trim();
    const volume = parseFloat($('dt:contains("Объем двигателя, л") + dd.value').text().trim());
    const price = parseFloat($('div.offer__price').text().trim().replace(/\D/g, ''));
    const name = $('span[itemprop="brand"]').text().trim();
    let percentDifference = 0;
    try {
      const response = await axios.get(`https://kolesa.kz/a/average-price/${id}`);
      const responseData = response.data.data;
      const percentDifference = responseData.diffInPercents;
      return { id, city, drive, mileage, clearanceKZ, body, volume, price, name, percentDifference};  
    } catch (error) {
      console.error('No average price:'); 
    }
    return { id, city, drive, mileage, clearanceKZ, body, volume, price, name, percentDifference};
  }
}
