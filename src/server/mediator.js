export const KEYS = {
  SEQUELIZE: 'sequelize',
}

const registrations = { }

export const provide = (name, entity) => {
  registrations[name] = entity;
}

export const retrieve = (name) => {
  registrations[name];
}
