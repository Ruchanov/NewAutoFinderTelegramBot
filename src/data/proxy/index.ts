import { ProxyModel } from "../../db/proxy";

export class ProxyService{
    public static async getRandomProxy() {
        const count = await ProxyModel.countDocuments();
        const random = Math.floor(Math.random() * count);
        return ProxyModel.findOne().skip(random);
    }
}
