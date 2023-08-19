import * as dotenv from 'dotenv';
import { Options } from 'sequelize';

dotenv.config();

export const appConfig = {
    host: process.env.PM_SERVER_HOST,
    port: process.env.PM_SERVER_PORT,
    secretSign: process.env.PM_SECRET || 'super-secret-12345678900',
};

const mysql_option: Options = {
    host: process.env.MYSQL_HOST || 'pm-mysql-db',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    dialect: 'mysql',
    define: {
        freezeTableName: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true,
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};

export const database = {
    db_name: process.env.MYSQL_NAME || 'pm-db',
    db_user: process.env.MYSQL_USER || 'admin',
    db_password: process.env.MYSQL_PASSWORD || 'pm12345678900',
    option: mysql_option,
};
