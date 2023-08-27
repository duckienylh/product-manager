/* eslint-disable no-plusplus */
// noinspection ExceptionCaughtLocallyJS

import { BucketItem, BucketItemStat, Client, CopyConditions } from 'minio';

export type FileObject = {
    fileName: string;
    folderName: string;
    url: string;
};

export interface IConfig {
    bucketName: string;
    domainName: string;
    endPoint: string;
    port: number;
    useSSL: boolean;
    accessKey: string;
    secretKey: string;
}

export default class MinIOServices {
    private minioClient!: Client;

    private readonly bucketName!: string;

    private readonly originalFilesBucketName!: string;

    private readonly finishedFilesBucketName!: string;

    private readonly avatarFilesBucketName!: string;

    private readonly domainName!: string;

    private readonly region!: string;

    constructor(config: IConfig) {
        const { bucketName, domainName, endPoint, port, useSSL, accessKey, secretKey } = config;

        this.minioClient = new Client({
            endPoint,
            port,
            useSSL,
            accessKey,
            secretKey,
        });
        // this.minioClient.setRequestOptions({
        //     rejectUnauthorized: false,
        // });
        this.bucketName = bucketName;
        // this.originalFilesBucketName = originalFilesBucketName;
        // this.finishedFilesBucketName = finishedFilesBucketName;
        // this.avatarFilesBucketName = avatarFilesBucketName;
        this.domainName = domainName;
        // this.region = region;
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

    async generateUploadURL(fileName: string, bucketName: string | null | undefined) {
        const signedUrlExpireMilliSeconds = 24 * 60 * 60;
        const bucket = bucketName ?? this.bucketName;
        return new Promise<string>((resolve, reject) => {
            this.minioClient.presignedPutObject(bucket, fileName, signedUrlExpireMilliSeconds, (err, url) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(url);
            });
        });
    }

    async generateDownloadURL(fileName: string, bucketName: string | null | undefined) {
        const signedUrlExpireMilliSeconds = 24 * 60 * 60 * 5;
        const bucket = bucketName ?? this.bucketName;
        return new Promise<string>((resolve, reject) => {
            this.minioClient.presignedGetObject(bucket, fileName, signedUrlExpireMilliSeconds, (err, url) => {
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

    async checkObject(object: string, bucketName: string | null | undefined) {
        const bucket = bucketName ?? this.bucketName;
        return new Promise<BucketItemStat>((resolve, reject) => {
            this.minioClient.statObject(bucket, object, (err, stat) => {
                if (err) {
                    reject(err);
                }
                resolve(stat);
            });
        });
    }

    async listObjects(bucketName: string, prefix?: string) {
        return new Promise<BucketItem[]>((resolve, reject) => {
            const stream = this.minioClient.listObjectsV2(bucketName, prefix, true);
            const objects: BucketItem[] = [];
            stream.on('data', (obj) => {
                objects.push(obj);
            });
            stream.on('error', (err) => {
                reject(err);
            });
            stream.on('end', () => {
                resolve(objects);
            });
        });
    }

    async listFolders(bucketName: string, prefix?: string) {
        return new Promise<string[]>((resolve, reject) => {
            const stream = this.minioClient.listObjects(bucketName, prefix, true);
            const directories: string[] = [];
            stream.on('data', (obj) => {
                const splitName = obj.name.split('/');
                if (splitName.length > 0) {
                    const directoryName = splitName[0];
                    directories.push(directoryName);
                }
            });
            stream.on('error', (err) => {
                reject(err);
            });
            stream.on('end', () => {
                // const folderLst = objects.filter((obj) => obj.prefix);
                resolve([...new Set(directories)]);
            });
        });
    }

    async moveFolder(sourceBucket: string, sourceFolder: string, destinationBucket: string, destinationFolder: string) {
        // Copy all objects from the source folder to the destination folder
        const objectsStream = await this.listObjects(sourceBucket, sourceFolder);
        if (objectsStream.length < 1) {
            return [];
        }
        const fileList: FileObject[] = [];
        const conditions = new CopyConditions();

        // eslint-disable-next-line no-restricted-syntax
        for await (const obj of objectsStream) {
            conditions.setMatchETag(obj.etag);
            const objectName = obj.name;
            const fileName = objectName.split('/').pop() || '';
            const destObjectName = objectName.replace(sourceFolder, destinationFolder);
            const fileObj = {
                fileName,
                folderName: sourceFolder,
                url: `${destinationFolder}/${fileName}`,
            };
            this.minioClient.copyObject(destinationBucket, destObjectName, `${sourceBucket}/${objectName}`, conditions, (e) => {
                if (e) {
                    console.log(e);
                    throw e;
                }
            });
            fileList.push(fileObj);
        }

        // Remove all objects from the source folder after copying
        const sourceObjectsStream = this.minioClient.listObjectsV2(sourceBucket, sourceFolder, true);
        // eslint-disable-next-line no-restricted-syntax
        for await (const obj of sourceObjectsStream) {
            await this.minioClient.removeObject(sourceBucket, obj.name);
        }
        return fileList;
    }
}
