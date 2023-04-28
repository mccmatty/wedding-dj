import redis from 'redis';
import {promisify} from 'util'

let instance = null;

class RedisClient {
    static getInstance = () => {
        if (!instance) {
            instance = new RedisClient();
        }

        return instance;
    }

    ready = false;
    client = null;
    queue = [];


    constructor() {
        this.client = redis.createClient(process.env.REDIS_CONNECTION);

        this.client.on('ready', () => {
            this.ready = true;
            this.processQueue();
        })

        this._set = promisify(this.client.set).bind(this.client);
        this._get = promisify(this.client.get).bind(this.client);
    }

    processQueue() {
        this.queue.forEach((fn) => {
            fn();
        })
    }

    set(...args) {
        if (!this.ready) {
            return new Promise((resolve) => {
                this.queue.push(async () => {
                    const response = await this._set(...args);
                    resolve(response);
                })
            });
        }

        return this._set(...args)
    }

    get(...args) {
        if (!this.ready) {
            return new Promise((resolve) => {
                this.queue.push(async () => {
                    const response = await this._get(...args);
                    resolve(response);
                })
            });
        }

        return this._get(...args)
    }
}


export default RedisClient;