import fs from 'fs';
import path from 'path';
import { TableStatus } from '@aws-sdk/client-dynamodb';
import dotenv from 'dotenv';
import mri from 'mri';

import clientBuilder from './clientBuilder.js';
import { addMigrationRecord, ensureVersionsTable, getMigrationRecords, removeMigrationRecord } from './versionsTable.js';
import { Migration } from './migrationTypes.js';

type ModuleImport = { default: Migration };

dotenv.config();
const argv = process.argv.slice(2);
const args = mri(argv, { boolean: ['down'] });

const __dirname = import.meta.dirname;
const migrationsPath = path.join(__dirname, 'migrations');

console.log("Starting Migrator");
console.log("Initializing Dynamo Client");
clientBuilder.init();
const client = clientBuilder.getClient();

const versionsTableInfo = await ensureVersionsTable(client);
if (versionsTableInfo.status !== TableStatus.ACTIVE) {
  console.log("VERSIONS TABLE DOES NOT EXIST AND COULD NOT BE CREATED");
  process.exit(1);
}

// load migrations that have already ran
const ranMigrations = await getMigrationRecords(client);
const migrationFiles = fs.readdirSync(migrationsPath);

const MigrateUp = () => {
  // iterate over migration files executing only those that have not ran yet
  console.log("Migration Starting: Up commands");
  migrationFiles.forEach(async (fileName) => {
    // don't run migrations that have already been ran
    if (ranMigrations.includes(fileName)) {
      console.log(`Skipping ${fileName}: already migrated`);
      return;
    }

    try {
      console.log(`Importing ${fileName}`);
      const migrationImport = await import(`./migrations/${fileName}`) as ModuleImport;
      const migration = migrationImport.default;
      console.log({ migration });

      console.log(`Running ${fileName} UP`);
      const result = await migration.up(client);
      if (!result.success) {
        console.log(`Migration ${fileName} FAILED`);
        console.log('Exiting migration script');
        process.exit(1);
      }

      await addMigrationRecord(client, fileName);
    } catch (error) {
      console.log({ error });
      process.exit(1);
    }

    console.log(`Migration ${fileName} UP SUCCEEDED`);
  });
}

const MigrateDown = async () => {
  console.log("Migration Starting: DOWN command");
  let undoneMigration = '';
  let undoIndex = migrationFiles.length - 1;

  // while we have not undone a migration, and while there are still files left to be undone
  while(undoneMigration === '' && undoIndex >= 0) {
    const undoMigration = migrationFiles.at(undoIndex);
    if (undoMigration && ranMigrations.includes(undoMigration)) {
      try {
        console.log(`Importing ${undoMigration}`);
        const migrationImport = await import(`./migrations/${undoMigration}`) as ModuleImport;
        const migration = migrationImport.default;
        console.log({ migration });

        console.log(`Running ${undoMigration} DOWN`);
        const result = await migration.down(client);
        if (!result.success) {
          console.log(`Migration ${undoMigration} FAILED`);
          console.log('Exiting migration script');
          process.exit(1);
        }

        await removeMigrationRecord(client, undoMigration);
      } catch (error) {
        console.log({ error });
        process.exit(1);
      }

      undoneMigration = undoMigration;
    } else {
      undoIndex--;
    }
  }

  if (undoneMigration) {
    console.log(`Migration ${undoneMigration} DOWN SUCCEEDED`);
  } else {
    console.log(`No Migrations to undo`);
  }
}

if (args.down) {
  MigrateDown();
} else {
  MigrateUp();
}
