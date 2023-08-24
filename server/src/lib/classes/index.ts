import { storageConfig } from '../../constant/appConfiguration';
import MinIOServices from './MinIOServices';

export const minIOServices = new MinIOServices({
    bucketName: storageConfig.minIO.bucket,
    domainName: storageConfig.minIO.domain,
    region: storageConfig.minIO.region,
    useSSL: storageConfig.minIO.useSSL,
    endPoint: storageConfig.minIO.endPoint,
    port: storageConfig.minIO.port,
    accessKey: storageConfig.minIO.accessKey,
    secretKey: storageConfig.minIO.secretKey,
});
