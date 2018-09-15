/*** taxes ***/

module.exports = function (sequelize, DataTypes) {
    var taxes = sequelize.define('tax', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        value: {
           type: "DOUBLE",
            allowNull: true,
            defaultValue: '0'
        },
        countries_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
        },
        clients_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
        },
        is_global: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        parent_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'tax',
        paranoid: true,
    });
    taxes.hasMany(taxes, {
        as: 'taxes',
        foreignKey: 'parent_id'
    })
    return taxes;
};