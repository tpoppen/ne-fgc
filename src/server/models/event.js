import { DataTypes, Model } from "sequelize";

import { KEYS, retrieve } from './mediator.js';

class Event extends Model {

}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: { type: DataTypes.DATE },
    startTime: { type: DataTypes.DATE },
    endTime: { type: DataTypes.DATE },
    name: { type: DataTypes.STRING },
    details: { type: DataTypes.STRING },
    link: { type: DataTypes.STRING },
    imageLink: { type: DataTypes.STRING }
  }, { sequelize: retrieve(KEYS.SEQUELIZE) }
);

export default Event;
