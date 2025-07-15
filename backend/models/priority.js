module.exports = (sequelize, DataTypes) => {
  const Priority = sequelize.define('Priority', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    level: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, {});
  return Priority;
};