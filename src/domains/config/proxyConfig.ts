import { AxiosRequestConfig } from 'axios';
import { ProxyService } from '../../data/proxy';
import { HttpsProxyAgent } from 'https-proxy-agent';

export async function getProxyConfig(): Promise<AxiosRequestConfig> {
    const randomProxy = await ProxyService.getRandomProxy();
    if (!randomProxy) {
        console.error('No available proxies.');
        throw new Error('No available proxies.');
    }

    return {
        proxy: false,
        httpsAgent: new HttpsProxyAgent(`http://${randomProxy?.username}:${randomProxy?.password}@${randomProxy?.ip}:${randomProxy?.port}`)
    };
}
