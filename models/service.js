// models/Service.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
    // FRONTEND: service title (Web Development, App Development, etc.)
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false
    // FRONTEND: detailed description
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false
    // FRONTEND: base price shown to user
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
    // ADMIN: disable service without deleting
  }

}, {
  timestamps: true
});

module.exports = Service;
