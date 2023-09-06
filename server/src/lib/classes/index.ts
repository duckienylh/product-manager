import { storageConfig } from '../../constant/appConfiguration';
import MinIOServices from './MinIOServices';
import PubSubService from './PubSubService';
import { publisher, subscriber } from './redis';

export const minIOServices = new MinIOServices({
    bucketName: storageConfig.minIO.bucket,
    domainName: storageConfig.minIO.domain,
    useSSL: storageConfig.minIO.useSSL,
    endPoint: storageConfig.minIO.endPoint,
    port: storageConfig.minIO.port,
    accessKey: storageConfig.minIO.accessKey,
    secretKey: storageConfig.minIO.secretKey,
});

export const pubsubService = new PubSubService(publisher, subscriber);
