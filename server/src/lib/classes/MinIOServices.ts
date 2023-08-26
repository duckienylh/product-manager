import { Client } from 'minio';

export interface IConfig {
    bucketName: string;
    domainName: string;
    region: string;
    endPoint: string;
    port: number;
    useSSL: boolean;
    accessKey: string;
    secretKey: string;
}

export default class MinIOServices {
    private minioClient!: Client;

    private readonly bucketName!: string;

    private readonly domainName!: string;

    private readonly region!: string;

    constructor(config: IConfig) {
        const { bucketName, domainName, region, endPoint, port, useSSL, accessKey, secretKey } = config;

        this.minioClient = new Client({
            endPoint,
            port,
            useSSL,
            accessKey,
            secretKey,
        });
        this.bucketName = bucketName;
        this.domainName = domainName;
        this.region = region;
    }

    async createBucket(bucketName: string) {
        return new Promise<string>((resolve, reject) => {
            this.minioClient.makeBucket(bucketName, this.region, (err) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve('success');
            });
        });
    }

    async checkBucketExist(bucketName: string) {
        return new Promise<string>((resolve, reject) => {
            this.minioClient.bucketExists(bucketName, (err, exist) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(String(exist));
            });
        });
    }

    async upload(bucketName: string | null | undefined, objectName: string, stream: any, mimetype: any) {
        const bucket = bucketName ?? this.bucketName;
        const metaData = {
            'Content-Type': mimetype,
            // 'x-amz-content-sha256': 'STREAMING-AWS4-HMAC-SHA256-PAYLOAD',
            // 'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
        };
        return new Promise<string>((resolve, reject) => {
            this.minioClient.putObject(bucket, objectName, stream, (err: any) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve('success');
            });
        });
    }

    async generateDownloadURL(fileName: string) {
        const signedUrlExpireMilliSeconds = 24 * 60 * 60;
        return new Promise<string>((resolve, reject) => {
            this.minioClient.presignedGetObject(this.bucketName, fileName, signedUrlExpireMilliSeconds, (err, url) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(url);
            });
        });
    }

    async deleteObjects(objectsList: string[], bucketName: string | null | undefined) {
        const bucket = bucketName ?? this.bucketName;
        return new Promise<string>((resolve, reject) => {
            this.minioClient.removeObjects(bucket, objectsList, (err) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve('success');
            });
        });
    }
}
