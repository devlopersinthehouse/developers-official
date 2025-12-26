// models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Service = require('./service');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  status: {
    type: DataTypes.ENUM('pending', 'paid', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
    // SYSTEM: updated automatically via payment / admin
  },

  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  }

}, {
  timestamps: true
});

// Relations
User.hasMany(Order);
Order.belongsTo(User);

Service.hasMany(Order);
Order.belongsTo(Service);

module.exports = Order;
