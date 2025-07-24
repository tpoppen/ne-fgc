import { Sequelize, DataTypes } from "sequelize";
import { Umzug, SequelizeStorage } from 'umzug';
import mri from 'mri';

const __dirname = import.meta.dirname; 

const argv = process.argv.slice(2);
const args = mri(argv, { boolean: ['up', 'down']});

const dbConfig = {
  username: process.env['DB_USERNAME'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_DATABASE'],
  host: process.env['DB_HOST'],
  dialect: 'mysql',
}

const sequelize = new Sequelize(dbConfig);
const umzug = new Umzug({
  migrations: { glob: 'db/migrations/*.js' },
  context: { queryInterface : sequelize.getQueryInterface(), DataTypes },
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

umzug.on('migrating', ev => console.log({ name: ev.name, path: ev.path }));

if (args.up) {
  await umzug.up();
} else if (args.down) {
  await umzug.down();
}
