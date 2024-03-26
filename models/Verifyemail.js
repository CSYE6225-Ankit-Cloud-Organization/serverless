const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnection');
const Email = sequelize.define('Verifyemail', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        readOnly: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
    },
    token: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    link_created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        readOnly: true
    },
    email_link: {
        type: DataTypes.STRING,
        allowNull: true
    },
    link_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        readyOnly: true
    }
}, {

    timestamps: false, //to disable createaAt and updatedAt column creation
    freezeTableName: true // to make the model and database table name similar
});
module.exports = Email;