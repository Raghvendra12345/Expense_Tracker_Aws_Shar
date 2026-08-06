

const sequelize=require("../utils/db")

const {Sequelize,DataTypes}=require("sequelize")


const user=sequelize.define("user",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
        
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isPremiumUser:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
})

module.exports=user