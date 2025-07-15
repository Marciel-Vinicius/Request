const { Sequelize } = require('sequelize');
const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const sequelize = new Sequelize(config);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Category = require('./category')(sequelize, Sequelize);
db.Priority = require('./priority')(sequelize, Sequelize);
db.Ticket = require('./ticket')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);

// Associations
db.User.hasMany(db.Ticket, { foreignKey: 'requesterId' });
db.User.hasMany(db.Ticket, { foreignKey: 'assigneeId' });
db.Category.hasMany(db.Ticket);
db.Priority.hasMany(db.Ticket);
db.Ticket.belongsTo(db.User, { as: 'requester', foreignKey: 'requesterId' });
db.Ticket.belongsTo(db.User, { as: 'assignee', foreignKey: 'assigneeId' });
db.Ticket.belongsTo(db.Category);
db.Ticket.belongsTo(db.Priority);
db.Ticket.hasMany(db.Comment);
db.Comment.belongsTo(db.Ticket);
db.Comment.belongsTo(db.User);

module.exports = db;