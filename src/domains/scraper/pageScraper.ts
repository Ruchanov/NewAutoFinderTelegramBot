import axios, { AxiosRequestConfig, all } from "axios";
import { getProxyConfig } from "../config/proxyConfig";
import cheerio from 'cheerio';
import { ParseCarsqueue } from "../queue";

export class PageScraperService {

    static async getCarIds(url: string): Promise<string[]> {
        try {
            const proxyConfig: AxiosRequestConfig = await getProxyConfig();
            const response = await axios.get(url, proxyConfig);
            const $ = cheerio.load(response.data);
            const carIds: string[] = [];

            $('.js__a-card').each((index, element) => {
                const carId = $(element).attr('data-id');
                if (carId) {
                    carIds.push(carId);
                }
            });

            return carIds;
        } catch (error) {
            console.error('Ошибка при получении айдишников машин:', error);
            return [];
        }
    }

    static async fetchViews(carIds: string[]): Promise<String[]> {
        const cars: string[] = [];
        const idsString = carIds.join(',');
        const url = `https://kolesa.kz/ms/views/kolesa/live/${idsString}/`;

        try {
            const proxyConfig: AxiosRequestConfig = await getProxyConfig();
            const response = await axios.get(url, proxyConfig);
            const responseData = response.data;

            for (const carId of carIds) {
                if (responseData && responseData.data && responseData.data[carId] && responseData.data[carId].nb_views !== undefined) {
                    if (responseData.data[carId].nb_views < 10) {
                        console.log(`https://kolesa.kz/a/show/${carId}`);
                        const url2 = `https://kolesa.kz/a/show/${carId}`;
                        cars.push(carId);
                        console.log(`Car ID: ${carId}, Views: ${responseData.data[carId].nb_views}`);
                    }
                } else {
                    console.log(`Car ID: ${carId}, Views data not provided.`);
                }
            }

            return cars;
        } catch (error) {
            console.error('Error fetching views for car IDs', carIds, ':', error);
            throw error;
        }
    }
    static async startScraping(citiesToScrape: string[]): Promise<void> {
        console.log("Started scraping for specified cities.");
        for (let city of citiesToScrape) {
            for (let i = 1; i <= 5; i++) {
                console.log(`Adding scraping task to queue for city: ${city}, page: ${i}`);
                const jobData = { city: city, pageNumber: i };
                ParseCarsqueue.add(jobData);
            }
        }
    }
}