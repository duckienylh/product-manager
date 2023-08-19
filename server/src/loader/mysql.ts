import { Sequelize } from 'sequelize';
import { database } from '../constant/appConfiguration';
import { initModels } from '../db_models/mysql/init-models';
// eslint-disable-next-line import/extensions
import user from '../dev_data/user.json';

export const sequelize = new Sequelize(database.db_name, database.db_user, database.db_password, {
    ...database.option,
});

const models = initModels(sequelize);

console.log('sequelize', sequelize);

export const syncDatabase = async () => {
    if (process.env.NODE_ENV === 'development' && process.env.SYNC_DATA === 'true') {
        const isForceSync = process.env.SYNC_DATA === 'true';
        await sequelize
            .sync({ force: isForceSync, alter: true })
            .then(() => {
                console.log('Database sync is done!');
            })
            .then(async () => {
                console.log('im here!');
                if (isForceSync) {
                    await models.user.bulkCreate(user as any);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }
};

export * as ssmDb from '../db_models/mysql/init-models';
