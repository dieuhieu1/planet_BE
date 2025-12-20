'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Read all files in models folder
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    // Import all models
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    // Add model to db Object
    db[model.name] = model;
  });

// Associate all models - Ket noi cac model voi nhau
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add sequelize and Sequelize to db Object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export db Object
module.exports = db;
