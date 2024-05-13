import axios, { Axios, AxiosRequestConfig } from 'axios';
import { Scraper } from './scraper';
import { getProxyConfig } from '../config/proxyConfig';


export class ScraperService {
  async parseCar(url: string): Promise<any> {
    try {
      const proxyConfig: AxiosRequestConfig = await getProxyConfig();
      const response = await axios.get(url, proxyConfig);
      const scraper = new Scraper();
      const htmlData: string = response.data;
      return scraper.scrape(htmlData, url);
    } catch (error) {
      console.error('Error scraping data:', error);
      throw new Error('Failed to scrape data');
    }
  }
  
}
