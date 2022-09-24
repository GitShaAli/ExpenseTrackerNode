const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ForgotPasswordRequest= sequelize.define('ForgotPasswordRequest', {
    id: {
        // type: Sequelize.UUIDV4,
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    isactive: Sequelize.BOOLEAN
})

module.exports = ForgotPasswordRequest;