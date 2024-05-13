import Queue from "bull";
import { config } from "../config";

type JobType = {
    city: string
    pageNumber: number
}

export const ParseCarsqueue = new Queue<JobType>('QueueScraper', config.redisUrl);