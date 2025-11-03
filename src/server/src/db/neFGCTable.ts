
// Primary Key
const TABLE_NAME = 'NE-FGC-DB';
const PRIMARY_KEY = {
  PK: 'PK',
  SK: 'SK'
};

// Secondary Keys: (None Yet)

const getTableName = () => `${TABLE_NAME}-${process.env.ENV}`;

export {
  getTableName,
  PRIMARY_KEY,
}
