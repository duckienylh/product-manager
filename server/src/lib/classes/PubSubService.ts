import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis } from 'ioredis';
import { userId } from '../../db_models/mysql/user';
import { pmDb } from '../../loader/mysql';

// eslint-disable-next-line no-shadow
export enum NotificationEvent {
    Common = 'Common',
    NewMessage = 'NewMessage',
    NewOrder = 'NewOrder',
    UpdateOrder = 'UpdateOrder',
    NewDeliverOrder = 'NewDeliverOrder',
    UpdatedDeliverOrder = 'UpdatedDeliverOrder',
}

export interface IPubSubConfig {
    host: string;
    port: number;
}

export type PublishMessage = {
    message: string;
    notification?: pmDb.notifications;
    order?: pmDb.orders;
};

export default class PubSubService {
    private pubsub!: RedisPubSub;

    publisher!: Redis;

    subscriber!: Redis;

    constructor(publisher: Redis, subscriber: Redis) {
        this.publisher = publisher;
        this.subscriber = subscriber;
        this.pubsub = new RedisPubSub({
            publisher: this.publisher,
            subscriber: this.subscriber,
        });
    }

    private publish(triggerName: string, message: any) {
        // message is any type because it can be a string, object, or array. whatever we want to send.
        this.pubsub
            .publish(triggerName, message)
            .then(() => console.log(`Published: ${triggerName}`))
            .catch((err) => console.error(err));
    }

    publishToUser(id: userId, key: NotificationEvent, message: PublishMessage) {
        const triggerName = `${key}-${id}`;
        this.publish(triggerName, message);
    }

    publishToUsers(userIds: userId[], key: NotificationEvent, message: PublishMessage) {
        userIds.forEach((id) => {
            this.publishToUser(id, key, message);
        });
    }

    asyncIteratorByUser = (id: userId, keys = [NotificationEvent.Common, NotificationEvent.NewMessage]) => {
        // const triggerName = `${key}-${id}`;
        const triggerName = keys.map((key) => `${key}-${id}`);
        // triggerName là chuỗi các EVENT mà user đó đăng ký nhận thông báo.
        // Khi publishToUser thì sẽ publish tới triggerName của user đó.
        // It should return 'AsyncIterable<any> | Promise<AsyncIterable<any>>' but RedisPubSub does not export it
        return this.pubsub.asyncIterator(triggerName) as any;
    };

    asyncIteratorByUserTest = (id: userId, key: NotificationEvent) => {
        const triggerName = `${key}-${id}`;
        return this.pubsub.asyncIterator(triggerName) as any;
    };
}
