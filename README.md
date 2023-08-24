# PM API
#### API project _Building a Node.js/TypeScript Graphql/Apollo API_ :
* * *
## Prerequisites
* Install Docker.
* Install Docker Compose.
* Install Nodejs (This project is built at node version: **18.16.0**).

## Running Project
1. Create file .env with following content then copy to root folder **_`project-manager`_**
```shell
NODE_ENV=development

# Redis configuration
REDIS_HOST=pm-redis
REDIS_PORT=6379

# Admin server configuration
PM_SERVER_HOST=localhost
PM_SERVER_PORT=4000
PM_SECRET=super-secret-12345678900

# Database configuration
MYSQL_USER=admin
MYSQL_PASSWORD=pm12345678900
MYSQL_NAME=pm-db
MYSQL_PORT=3306
MYSQL_HOST=pm-mysql-db

# Minio configuration
MINIO_DOMAIN=http://116.103.228.13/
MINIO_BUCKET=dev-app
#MINIO_BUCKET_ORIGINAL_FILES=original
#MINIO_BUCKET_FINISHED_FILES=finished
#MINIO_BUCKET_AVATAR_FILES=avatars
MINIO_REGION=ap-northeast-1
MINIO_ENDPOINT=116.103.228.13
MINIO_PORT=9001
MINIO_SSL=false
MINIO_ACCESS=ii7N4rM0pT1jo20wtGGy
MINIO_SECRET=6o2eyFLOQv2Qwhix5g1DtEJTVcVmYVH9hDBgfQJs
```
2. Từ folder `project-manager/server` mở command cài đặt các packages bằng lênh:
> npm install --legacy-peer-deps
3. From project folder run command (For sync database):
```shell
SYNC_DATA=true docker-compose up -d --build
```
4. From project folder run command :
```shell
docker-compose up -d --build
```
