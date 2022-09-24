const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Income = sequelize.define('income',{
    
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      description:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      price:Sequelize.INTEGER,  
});

module.exports=Income;