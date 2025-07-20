import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';

const dbConfig = {
  username: process.env['DB_USERNAME'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_DATABASE'],
  host: process.env['DB_HOST'],
  dialect: 'mysql',
}
console.log(dbConfig);

const sequelize = new Sequelize(dbConfig);

const umzug = new Umzug({
  migrations: { glob: path.join('db', 'migrations', '*.js') },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

if (param_up) {
  umzug.up();
} else if (param_down) {
  umzug.down();
}

// TODO: parse up and down from command line args
// TODO: terminate migration