import Redis from 'ioredis';
import { redis as config } from '../../constant/appConfiguration';

export const kvs = new Redis(config);

export const publisher = new Redis(config);

export const subscriber = new Redis(config);
