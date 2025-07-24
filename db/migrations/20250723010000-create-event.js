export const up = async ({ context: { queryInterface, DataTypes } }) => {
  await queryInterface.createTable('Events', {
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
  });
};

export const down = async ({ context: { queryInterface } }) => {
  await queryInterface.dropTable('Events');
}
