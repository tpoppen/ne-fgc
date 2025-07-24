import { Sequelize  } from "sequelize";

const initializeDatabase = () => {
  const config = {
    username: process.env['DB_USERNAME'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_DATABASE'],
    host: process.env['DB_HOST'],
    port: process.env['DB_PORT'] || 3306,
    dialect: 'mysql',
  }

  return new Sequelize(config);
};

export default initializeDatabase;
