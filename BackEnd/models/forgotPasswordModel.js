

const sequelize=require("../utils/db")

const {Sequelize,DataTypes}=require('sequelize')

const forgotPassword=sequelize.define("forgotPassword",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,    
        autoIncrement:true,
        allowNull:false

    },
    uuid:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:true,
        allowNull:false
    }
})
module.exports=forgotPassword