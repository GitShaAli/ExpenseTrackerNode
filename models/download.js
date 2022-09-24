const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const Downloads = sequelize.define('filedownload', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    url:Sequelize.STRING,
})

module.exports = Downloads;