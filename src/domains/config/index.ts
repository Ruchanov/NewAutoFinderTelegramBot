type ConfigType = {
    mainMongoConnectionUrl: string,
    telegramApiToken: string,
    redisUrl: string
}

export const config: ConfigType = {
    mainMongoConnectionUrl: 'mongodb://127.0.0.1:27017/kolesa',
    telegramApiToken: '6470836290:AAEixH0xQpnt6-4I1riYjGdyNIUIteCYYr8',
    redisUrl: 'redis://localhost:6379/0'
}

