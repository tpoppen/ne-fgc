
// Primary Key
const TABLE_NAME = 'NE-FGC-DB';
const PRIMARY_KEY = {
  PK: 'PK',
  SK: 'SK'
};

// Secondary Keys: (None Yet)
const GS1 = {
  INDEX_NAME: 'GS1',
  PK: 'GS1PK',
  SK: 'GS1SK',
};

const getTableName = () => `${TABLE_NAME}-${process.env.NODE_ENV}`;

export {
  getTableName,
  PRIMARY_KEY,
  GS1,
}
