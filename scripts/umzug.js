import { Sequelize, DataTypes } from "sequelize";
import { Umzug, SequelizeStorage } from 'umzug';
import mri from 'mri';

import initializeDatabase from "../src/server/initializeDatabase.js";

const argv = process.argv.slice(2);
const args = mri(argv, { boolean: ['up', 'down']});

const sequelize =initializeDatabase();
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
