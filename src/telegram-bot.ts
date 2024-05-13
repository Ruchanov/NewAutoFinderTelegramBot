import { Telegraf, Context, Markup } from 'telegraf';
import { PageScraperService } from './domains/scraper/pageScraper';
import { CarService } from './data/car';
import { config } from './domains/config';
import { MongoDataBase } from './db';
import { User, UserService } from './data/user';
import { Scraper } from './domains/scraper/scraper';
import { stringifyCar } from './domains/message_format';
import axios, { AxiosRequestConfig } from 'axios';
import { getProxyConfig } from './domains/config/proxyConfig';
import { initRedis } from './redis/init-redis';
import { CarDataModel, ICarData } from './db/carData';
import { CronJob } from 'cron';
import { CarDataService } from './data/carData';
const bot = new Telegraf(config.telegramApiToken);
MongoDataBase.initMainDataBaseConnection();
initRedis();

bot.start(async (ctx) => {
    const chatId = ctx.chat?.id.toString();
    const firstName = ctx.from?.first_name || '';
    const lastName = ctx.from?.last_name || '';
    const username = ctx.from?.username || '';
    const data = {
        chatId: chatId,
        firstName: firstName,
        lastName: lastName,
        username: username,
        subscribedCities: []
    };
    await UserService.saveUser(data);
    selectCity(ctx);
});

function selectCity(ctx: Context) {
    const cities = ['almaty', 'astana', 'shymkent','karaganda'];
    const keyboard = Markup.inlineKeyboard(
        cities.map(city => Markup.button.callback(city, `subscribe_${city}`)), { columns: 2 }
    );
    ctx.reply('Привет! Я бот для поиска информации о машинах. Выберите город для поиска новых машин:', keyboard);
}

bot.command('addcity', (ctx) => selectCity(ctx));

bot.command('removecity', async (ctx) => {
    const user = await UserService.getUser(ctx.from!.id.toString());
    if (user && user.subscribedCities.length > 0) {
        const keyboard = Markup.inlineKeyboard(
            user.subscribedCities.map(city => Markup.button.callback(city, `unsubscribe_${city}`)), { columns: 2 }
        );
        ctx.reply('Выберите города для удаления из подписки:', keyboard);
    } else {
        ctx.reply('У вас нет подписок на города.');
    }
});
bot.command('mycities', async (ctx) => {
    const user = await UserService.getUser(ctx.from!.id.toString());
    if (user && user.subscribedCities.length > 0) {
        ctx.reply(`Вы подписаны на следующие города: ${user.subscribedCities.join(', ')}`);
    } else {
        ctx.reply('Вы не подписаны ни на один город.');
    }
});


bot.action(/subscribe_(.+)/, async (ctx) => {
    const city = ctx.match[1];
    console.log(city);
    await UserService.addCityToUser(ctx.from!.id.toString(), city);
    ctx.answerCbQuery(`Вы подписаны на ${city}`);
    ctx.editMessageText(`Вы подписаны на: ${city}`);
});

bot.action(/unsubscribe_(.+)/, async (ctx) => {
    const city = ctx.match[1];
    console.log(city);
    await UserService.removeCityFromUser(ctx.from!.id.toString(), city);
    ctx.answerCbQuery(`Вы отписаны от ${city}`);
    
    const user = await UserService.getUser(ctx.from!.id.toString());
    if (user && user.subscribedCities.length > 0) {
        ctx.editMessageText(`Вы подписаны на: ${user.subscribedCities.join(', ')}`);
    } else {
        ctx.editMessageText('У вас больше нет подписок на города.');
    }
});


const job = new CronJob('0 */2 * * * *', async () => {
    try {
        const users = await UserService.getAllUsers();
        const citiesToScrape = new Set<string>();

        users.forEach(user => {
            user.subscribedCities.forEach(city => citiesToScrape.add(city));
        });

        if (citiesToScrape.size > 0) {
            await PageScraperService.startScraping(Array.from(citiesToScrape));
        }

        const unsentData: ICarData[] = await CarDataModel.find({ sentToUsers: false }).exec();

        for (const carData of unsentData) {
            if (!citiesToScrape.has(carData.city)) continue; 

            let messageText = `Новые объявления в городе ${carData.city}:\n`;
            let hasNewCars = false;

            for (const carId of carData.cars) {
                const carUrl = `https://kolesa.kz/a/show/${carId}`;
                const proxyConfig = await getProxyConfig();
                const response = await axios.get(carUrl, proxyConfig);
                const scraper = new Scraper();
                const car = await scraper.scrape(response.data, carUrl);
                
                if (!(await CarService.isDataExists(+carId))) {
                    await CarService.saveCar(car);
                    messageText += `${stringifyCar(car)}\n`;
                    hasNewCars = true;
                }
            }

            if (hasNewCars) {
                const interestedUsers = users.filter(user => user.subscribedCities.includes(carData.city));
                for (const user of interestedUsers) {
                    await bot.telegram.sendMessage(user.chatId, messageText);
                }
                await CarDataModel.updateOne({ _id: carData._id }, { sentToUsers: true });
            }
        }
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});

bot.on('text', async (ctx: Context) => {
    if (ctx.message && 'text' in ctx.message) {
        ctx.reply('Вы можете пользоваться только командами. Новые объявления будут вам отправляться каждые 2 минуты, если они есть')
    }
});

const cleanupJob = new CronJob('0 */30 * * * *', async () => {
    await CarDataService.cleanUpSentCarData();
});

cleanupJob.start();
job.start();
bot.launch();
