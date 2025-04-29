import { DataTypes, Sequelize } from "sequelize"; 

export default function defineModel(sequelize: Sequelize){ 
const schema = sequelize.define('menuConfig', { 
    name: {
            type: DataTypes.STRING, 
            field: 'name', 
        },
    type: {
            type: DataTypes.STRING, 
            field: 'type', 
        },
    modified: {
            type: DataTypes.DATE,
            field: 'modified',
        },  
    defaultMenu: {
            type: DataTypes.BOOLEAN, 
            field: 'defaultMenu', 
        },
}); 

  schema.prototype.toJSON = function() { 
    const values = Object.assign({}, this.get()); 

    values.id = values.id; 
    delete values._id; 
    delete values.__v; 
    return values; 
  }; 

  return schema; 
};
